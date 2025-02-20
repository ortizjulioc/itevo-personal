import 'server-only';
import { PrismaClient } from "@prisma/client";
const Prisma = new PrismaClient();

export const getCourseBranch = async (filters: any) => {

    const { search, page, top, promotionId, branchId, teacherId, courseId } = filters;
    const skip = (page - 1) * top;
    const courseBranches = await Prisma.courseBranch.findMany({
        orderBy: [
            { courseId: 'asc' },
        ],
        select: {
            id: true,
            promotionId: true,
            branchId: true,
            teacherId: true,
            courseId: true,
            amount: true,
            modality: true,
            startDate: true,
            endDate: true,
            commissionRate: true,
        },
        where: {
            promotionId,
            branchId,
            teacherId,
            courseId
        },
        skip: skip,
        take: top,
    });

    const totalCourseBranches = await Prisma.courseBranch.count({
        where: {
            // deleted: false,
            courseId: { contains: search },
        },
    });

    return { courseBranches, totalCourseBranches };
};

export const createCourseBranch = async (data: any) => {
    const courseBranch = await Prisma.courseBranch.create({ data: data });
    return courseBranch;
};

// export const findCourseByCode= async (data: any) => {
//     const courseCodeExists = await Prisma.course.findUnique({
//         where: { code: data.code },
//     });
//     return courseCodeExists
// };

// Obtener courseBranch por ID
export const findCourseBranchById = async (id: string) => {

    const courseBranch = await Prisma.courseBranch.findUnique({
        where: {
            id: id,
            // deleted: false,
        },
        // include: {
        //     prerequisites: {
        //         select: {
        //             prerequisite: {
        //                 select: {
        //                     id: true,
        //                 },
        //             },
        //         },
        //     },
        // },
    });

    // Devolviendo prerequisites como un arreglo de IDs

    // if (course) {
    //     course.prerequisites = course.prerequisites.map((prerequisite: any) => prerequisite.prerequisite.id);
    // }

    return courseBranch;

};

// Actualizar courseBranch por ID
export const updateCourseBranchById = async (id: string, data: any) => {

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
        },
    });
};

// Eliminar courseBranch por ID (soft delete)
export const deleteCourseBranchById = async (id: string) => {
    return Prisma.courseBranch.delete({
        where: { id },
    });
};
