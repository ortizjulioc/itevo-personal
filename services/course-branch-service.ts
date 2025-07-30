import 'server-only';
import { Prisma } from '@/utils/lib/prisma';
import { Prisma as PrismaTypes } from "@prisma/client";

export const getCourseBranch = async (filters: any) => {

    const { page, top, promotionId, branchId, teacherId, courseId, modality } = filters;
    const skip = (page - 1) * top;
    const whereClause: PrismaTypes.CourseBranchWhereInput = {
        deleted: false,
        ...(promotionId && { promotionId }),
        ...(branchId && { branchId }),
        ...(teacherId && { teacherId }),
        ...(courseId && { courseId }),
        ...(modality && { modality }),
    };
    const courseBranches = await Prisma.courseBranch.findMany({
        orderBy: [
            { courseId: 'asc' },
        ],
        where: whereClause,
        include: {
            branch: { select: { id: true, name: true } },
            teacher: { select: { id: true, firstName: true, lastName: true  } },
            course: { select: { id: true, name: true } },
            schedules: { select: { schedule: true } },
        },
        skip: skip,
        take: top,
    });

    const totalCourseBranches = await Prisma.courseBranch.count({
        where: {
            promotionId,
            branchId,
            teacherId,
            courseId,
            modality,
        },
    });

    return {
        courseBranches: courseBranches.map((courseBranch) => ({ ...courseBranch, schedules: courseBranch.schedules.map((schedule) => schedule.schedule) })),
        totalCourseBranches
    };
};

export const createCourseBranch = async (data: PrismaTypes.CourseBranchCreateInput) => {
    const courseBranch = await Prisma.courseBranch.create({
        data: {
            promotion: data.promotion,
            branch: data.branch,
            teacher: data.teacher,
            course: data.course,
            amount: data.amount,
            modality: data.modality,
            startDate: data.startDate,
            endDate: data.endDate,
            commissionRate: data.commissionRate,
            sessionCount: data.sessionCount,
            capacity: data.capacity,
            status: data.status,
        },
    });
    return courseBranch;
};

export const findCourseBranchById = async (
    id: string,
    prisma: PrismaTypes.TransactionClient = Prisma
) => {
    const courseBranch = await prisma.courseBranch.findUnique({
        where: { id, deleted: false },
        include: {
            branch: { select: { id: true, name: true } },
            teacher: { select: { id: true, firstName: true, lastName: true  } },
            course: { select: { id: true, name: true } },
            schedules: { select: { schedule: true } },
        }
    });

    return { ...courseBranch, schedules: courseBranch?.schedules.map((schedule) => schedule.schedule) };
};

// Actualizar courseBranch por ID
export const updateCourseBranchById = async (id: string, data: PrismaTypes.CourseBranchUpdateInput) => {

    return Prisma.courseBranch.update({
        where: { id },
        data: {
            promotion: data.promotion,
            branch: data.branch,
            teacher: data.teacher,
            course: data.course,
            amount: data.amount,
            modality: data.modality,
            startDate: data.startDate,
            endDate: data.endDate,
            commissionRate: data.commissionRate,
            sessionCount: data.sessionCount,
            capacity: data.capacity,
            status: data.status,
        },
    });
};

// Eliminar courseBranch por ID (soft delete)
export const deleteCourseBranchById = async (id: string) => {
    return Prisma.courseBranch.update({
        where: { id },
        data: { deleted: true },
    });
};
