import { NextResponse } from 'next/server';
import { Prisma as prisma } from '@/utils/lib/prisma';
import { getServerSession } from "next-auth/next";
import { authOptions } from '../auth/[...nextauth]/auth-options';

export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);
        const thirtyDaysAgo = new Date(new Date().setDate(now.getDate() - 30));
        const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);

        // --- 1. Revenue Comparatives ---
        const [currentMonthRevenue, lastMonthRevenue] = await Promise.all([
            prisma.cashMovement.aggregate({
                _sum: { amount: true },
                where: { type: 'INCOME', deleted: false, createdAt: { gte: startOfMonth } },
            }),
            prisma.cashMovement.aggregate({
                _sum: { amount: true },
                where: { type: 'INCOME', deleted: false, createdAt: { gte: startOfLastMonth, lte: endOfLastMonth } },
            }),
        ]);
        const totalRevenue = currentMonthRevenue._sum.amount || 0;
        const previousMonthRevenue = lastMonthRevenue._sum.amount || 0;
        const revenueChange = previousMonthRevenue === 0 ? 100 : ((totalRevenue - previousMonthRevenue) / previousMonthRevenue) * 100;

        // --- 2. Students Comparatives ---
        const [currentActiveStudents, lastMonthNewStudents] = await Promise.all([
            prisma.student.count({
                where: { deleted: false },
            }),
            prisma.student.count({
                where: { deleted: false, createdAt: { gte: startOfLastMonth, lte: endOfLastMonth } },
            }),
        ]);
        const activeStudentsCount = currentActiveStudents;
        const currentMonthNewStudentsCount = await prisma.student.count({
            where: { deleted: false, createdAt: { gte: startOfMonth } },
        });
        const studentsChange = lastMonthNewStudents === 0 ? (currentMonthNewStudentsCount > 0 ? 100 : 0) : ((currentMonthNewStudentsCount - lastMonthNewStudents) / lastMonthNewStudents) * 100;

        // --- 3. Courses Comparatives ---
        const activeCoursesCount = await prisma.courseBranch.count({
            where: { status: 'IN_PROGRESS', deleted: false },
        });
        const completedCoursesCount = await prisma.courseBranch.count({
            where: { status: 'COMPLETED', deleted: false, updatedAt: { gte: startOfMonth } },
        });
        
        // --- 4. Income vs Expenses Chart (Last 6 Months) ---
        const sixMonthsMovements = await prisma.cashMovement.findMany({
            where: {
                deleted: false,
                createdAt: { gte: sixMonthsAgo },
            },
            select: { amount: true, type: true, createdAt: true },
            orderBy: { createdAt: 'asc' },
        });

        const incomeExpenseMap = new Map<string, { income: number; expense: number }>();
        sixMonthsMovements.forEach((movement: { amount: number; type: string; createdAt: Date }) => {
            const key = `${movement.createdAt.getFullYear()}-${String(movement.createdAt.getMonth() + 1).padStart(2, '0')}`;
            if (!incomeExpenseMap.has(key)) {
                incomeExpenseMap.set(key, { income: 0, expense: 0 });
            }
            const current = incomeExpenseMap.get(key)!;
            if (movement.type === 'INCOME') {
                current.income += movement.amount;
            } else if (movement.type === 'EXPENSE') {
                current.expense += movement.amount;
            }
        });

        // Ensure all last 6 months have an entry even if 0
        const incomeExpenseChartData = [];
        for (let i = 5; i >= 0; i--) {
            const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
            incomeExpenseChartData.push({
                month: key, // Will be formatted on client
                income: incomeExpenseMap.get(key)?.income || 0,
                expense: incomeExpenseMap.get(key)?.expense || 0,
            });
        }

        // --- 5. Top 5 Courses by Enrollment ---
        const topCourses = await prisma.courseBranch.findMany({
            where: { status: 'IN_PROGRESS', deleted: false },
            select: {
                id: true,
                course: { select: { name: true } },
                _count: { select: { enrollment: { where: { deleted: false } } } },
                capacity: true,
            },
            orderBy: {
                enrollment: { _count: 'desc' }
            },
            take: 5,
        });

        const topCoursesData = topCourses.map((c: any) => ({
            id: c.id,
            name: c.course.name,
            enrollments: c._count.enrollment,
            capacity: c.capacity,
            occupancyRate: c.capacity > 0 ? (c._count.enrollment / c.capacity) * 100 : 0,
        }));

        // --- 6. Recent Transactions ---
        const recentTransactions = await prisma.cashMovement.findMany({
            where: { deleted: false }, // Removed type income filter to show both
            orderBy: { createdAt: 'desc' },
            take: 5,
            select: {
                id: true,
                amount: true,
                type: true,
                description: true,
                createdAt: true,
                referenceType: true,
                user: { select: { name: true, lastName: true } }
            },
        });

        // --- 7. Sales data for chart (Income over the last 30 days grouped by date) ---
        const recentIncomeMovements = await prisma.cashMovement.findMany({
            where: {
                type: 'INCOME',
                deleted: false,
                createdAt: {
                    gte: thirtyDaysAgo,
                },
            },
            select: {
                amount: true,
                createdAt: true,
            },
            orderBy: {
                createdAt: 'asc',
            },
        });

        const salesDataMap = new Map<string, number>();
        recentIncomeMovements.forEach((movement: { amount: number; createdAt: Date }) => {
            const dateStr = movement.createdAt.toISOString().split('T')[0];
            salesDataMap.set(dateStr, (salesDataMap.get(dateStr) || 0) + movement.amount);
        });

        const salesChartData = Array.from(salesDataMap, ([date, amount]) => ({
            date,
            amount,
        }));

        return NextResponse.json({
            // KPIs
            totalRevenue,
            revenueChange,
            activeStudentsCount,
            studentsChange,
            activeCoursesCount,
            completedCoursesCount, // using this as the comparative proxy for courses
            // Charts & Lists
            salesChartData,
            incomeExpenseChartData,
            topCoursesData,
            recentTransactions,
        });

    } catch (error) {
        console.error('Error fetching dashboard data:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
