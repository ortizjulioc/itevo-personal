import { NextResponse, NextRequest } from "next/server";
import { validateObject } from "@/utils";
import { getEnrollments, createEnrollment } from "@/services/enrollment-service";
import { formatErrorMessage } from "@/utils/error-to-string";
import { createLog } from "@/utils/log";
import { findCourseBranchById } from "@/services/course-branch-service";
import { findStudentById } from "@/services/student-service";
import { createAccountReceivable, createManyAccountsReceivable } from "@/services/account-receivable";
import { Attendance } from "@prisma/client";
import { Prisma } from "@/utils/lib/prisma";

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);

        const filters = {
            studentId: searchParams.get('studentId') || undefined,
            courseBranchId: searchParams.get('courseBranchId') || undefined,
            status: searchParams.get('status') || '',
            enrollmentDate: searchParams.get('enrollmentDate') || '',
            page: parseInt(searchParams.get('page') || '1', 10),
            top: parseInt(searchParams.get('top') || '10', 10),
        }

        const { enrollments, totalEnrollments } = await getEnrollments(filters);

        return NextResponse.json({
            enrollments,
            totalEnrollments,
        }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: formatErrorMessage(error) }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        console.log('BODY: ', body);

        // Validate the request body
        const { isValid, message } = validateObject(body, ['studentId', 'courseBranchId', 'enrollmentDate', 'status']);
        if (!isValid) {
            return NextResponse.json({ code: 'E_MISSING_FIELDS', error: message }, { status: 400 });
        }

        const courseBranch = await findCourseBranchById(body.courseBranchId);
        if (!courseBranch) {
            return NextResponse.json({ code: 'E_COURSE_BRANCH_NOT_FOUND', error: 'Course branch not found' }, { status: 404 });
        }

        if (courseBranch.endDate && new Date(courseBranch.endDate) < new Date()) {
            return NextResponse.json({
                code: 'E_COURSE_BRANCH_EXPIRED',
                error: 'Course branch has expired',
                message: 'El curso ha expirado',
            }, { status: 400 });
        }

        const student = await findStudentById(body.studentId);
        if (!student) {
            return NextResponse.json({ code: 'E_STUDENT_NOT_FOUND', error: 'Student not found' }, { status: 404 });
        }
        console.log('STUDENT: ', student);
        console.log('COURSE BRANCH sessionCount:', courseBranch.sessionCount);
        console.log('COURSE BRANCH amount:', courseBranch.amount);

        if (courseBranch.id && courseBranch.amount && courseBranch.endDate && courseBranch.sessionCount  && courseBranch.sessionCount > 0) {
            const accountReceivable = {
                studentId: student.id,
                courseBranchId: courseBranch.id,
                amount: courseBranch.amount,
                dueDate: courseBranch.endDate,
            };
            const accountReceivableToCreate = Array.from({ length: courseBranch.sessionCount }).map(() => (accountReceivable));
            console.log('Account Receivable to create: ', accountReceivableToCreate);
            const [enrollment, accountReceivableCreatedCount] = await Prisma.$transaction(async (tx) => [
                await createEnrollment(body, tx),
                await createManyAccountsReceivable(accountReceivableToCreate, tx),
            ]);
            await createLog({
                action: "POST",
                description: `Se creó una inscripcion con los siguientes datos: ${JSON.stringify(enrollment, null, 2)}`,
                origin: "enrollments",
                elementId: enrollment.id,
                success: true,
            });

            await createLog({
                action: "POST",
                description: `Se crearon ${accountReceivableCreatedCount} cuentas por cobrar para la inscripcion: ${JSON.stringify(enrollment, null, 2)}`,
                origin: "enrollments",
                elementId: enrollment.id,
                success: true,
            });

            return NextResponse.json({
                enrollment,
                accountReceivableCreatedCount,
            }, { status: 201 });
        } else {
            return NextResponse.json({
                code: 'E_COURSE_BRANCH_INVALID',
                error: 'Course branch is invalid or missing required fields',
                message: 'El curso no es válido o falta información requerida',
            }, { status: 400 });
        }
    } catch (error) {
        await createLog({
            action: "POST",
            description: `Error al crear un enrollment: ${formatErrorMessage(error)}`,
            origin: "enrollments",
            elementId: request.headers.get("origin") || "",
            success: false,
        });

        return NextResponse.json({ error: formatErrorMessage(error) }, { status: 500 });
    }
}
