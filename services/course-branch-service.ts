import 'server-only';
import { Prisma } from '@/utils/lib/prisma';
import { Prisma as PrismaTypes } from "@prisma/client";
export const getCourseBranch = async (filters: any) => {

    const { page, top, promotionId, branchId, teacherId, courseId, modality, search } = filters;
    const skip = (page - 1) * top;
    const whereClause: PrismaTypes.CourseBranchWhereInput = {
        deleted: false,
        ...(promotionId && { promotionId }),
        ...(branchId && { branchId }),
        ...(teacherId && { teacherId }),
        ...(courseId && { courseId }),
        ...(modality && { modality }),
        ...(search && {
            OR: [
                { course: { name: { contains: search } } },
                { teacher: { firstName: { contains: search } } },
                { teacher: { lastName: { contains: search } } },
            ],
        }),
    };

    const courseBranches = await Prisma.courseBranch.findMany({
        orderBy: [
            { courseId: 'asc' },
        ],
        where: whereClause,
        include: {
            branch: { select: { id: true, name: true } },
            teacher: { select: { id: true, firstName: true, lastName: true } },
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
        data: data,
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
            teacher: { select: { id: true, firstName: true, lastName: true } },
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
        data: data,
    });
};

// Eliminar courseBranch por ID (soft delete)
export const deleteCourseBranchById = async (id: string) => {
    return Prisma.courseBranch.update({
        where: { id },
        data: { deleted: true },
    });
};

export const addPaymentPlanToCourseBranch = async (
    paymentPlanData: PrismaTypes.CourseBranchPaymentPlanCreateInput,
    prisma: PrismaTypes.TransactionClient = Prisma
) => {
    return prisma.courseBranchPaymentPlan.create({
        data: paymentPlanData,
    });
};
