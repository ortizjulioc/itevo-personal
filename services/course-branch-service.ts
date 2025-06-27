import 'server-only';
import { CourseBranch } from "@prisma/client";
import { Prisma } from '@/utils/lib/prisma';

export const getCourseBranch = async (filters: any) => {

    const { page, top, promotionId, branchId, teacherId, courseId, modality } = filters;
    const skip = (page - 1) * top;
    const courseBranches = await Prisma.courseBranch.findMany({
        orderBy: [
            { courseId: 'asc' },
        ],
        where: {
            promotionId,
            branchId,
            teacherId,
            courseId,
            modality,
        },
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

export const createCourseBranch = async (data: any) => {
    const dataToCreate = {
        promotion: {
            connect: {
                id: data.promotionId,
            },
        },
        branch: {
            connect: {
                id: data.branchId,
            },
        },
        teacher: {
            connect: {
                id: data.teacherId,
            },
        },
        course: {
            connect: {
                id: data.courseId,
            },
        }
    };
    delete data.promotionId;
    delete data.branchId;
    delete data.teacherId;
    delete data.courseId;

    const courseBranch = await Prisma.courseBranch.create({ data: {...dataToCreate, ...data} });
    return courseBranch;
};

export const findCourseBranchById = async (id: string) => {
    const courseBranch = await Prisma.courseBranch.findUnique({
        where: { id },
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
export const updateCourseBranchById = async (id: string, data: CourseBranch) => {

    return Prisma.courseBranch.update({
        where: { id },
        data: {
            promotionId: data.promotionId,
            branchId: data.branchId,
            teacherId: data.teacherId,
            courseId: data.courseId,
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
    return Prisma.courseBranch.delete({
        where: { id },
    });
};
