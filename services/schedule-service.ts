import 'server-only';
import { PrismaClient } from "@prisma/client";
const Prisma = new PrismaClient();

export const getSchedules = async (search: string, page: number, top: number) => {
    const skip = (page - 1) * top;
    const schedules = await Prisma.schedule.findMany({
        orderBy: [
            { courseBranchId: 'asc' },
        ],
        // select: {
        //     id: true,
        //     code: true,
        //     name: true,
        //     description: true,
        //     duration: true,
        // },
        where: {
            // deleted: false,
            courseBranchId: { contains: search },
        },
        skip: skip,
        take: top,
    });

    const totalSchedules = await Prisma.schedule.count({
        where: {
            // deleted: false,
            courseBranchId: { contains: search },
        },
    });

    return { schedules, totalSchedules };
};

export const createSchedule = async (data: any) => {
    const schedule = await Prisma.schedule.create({ data: data });
    return schedule;
};

// export const findCourseByCode= async (data: any) => {
//     const courseCodeExists = await Prisma.course.findUnique({
//         where: { code: data.code },
//     });
//     return courseCodeExists
// };

// Obtener schedule por ID
export const findScheduleById = async (id: string) => {

    const schedule = await Prisma.schedule.findUnique({
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

    return schedule;

};

// Actualizar schedule por ID
export const updateScheduleById = async (id: string, data: any) => {

    return Prisma.schedule.update({
        where: { id },
        data: { courseBranchId: data.courseBranchId, startTime: data.startTime, endTime: data.endTime, weekday: data.weekday},
    });
};

// Eliminar schedule por ID (soft delete)
export const deleteScheduleById = async (id: string) => {
    return Prisma.schedule.delete({
        where: { id },
    });
};
