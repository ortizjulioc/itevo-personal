import 'server-only';
import { PrismaClient } from "@prisma/client";
import { getClassSessions } from '@/utils/date';
const Prisma = new PrismaClient();

export const getCourseSchedules = async (filters: any) => {

    const { page, top, courseId, scheduleId } = filters;
    const skip = (page - 1) * top;
    const courseSchedules = await Prisma.courseSchedule.findMany({
        orderBy: [
            { courseId: 'asc' },
        ],
        select: {
            courseId: true,
            scheduleId: true,
        },
        where: {
            courseId,
            scheduleId
        },
        skip: skip,
        take: top,
    });

    const totalCourseSchedules = await Prisma.courseSchedule.count({
        where: {
            courseId,
            scheduleId
        },
    });

    return { courseSchedules, totalCourseSchedules };
};

export const createCourseSchedule = async (data: any) => {
    const courseSchedule = await Prisma.courseSchedule.create({ data: data });
    return courseSchedule;
};

export const getCourseSchedulesByCourseId = async (courseId: any) => {

    console.log("Este es el courseId que llego a la funcion SchedulesByCourseId: ", courseId);
    const courseSchedules = await Prisma.courseSchedule.findMany({
        where: {
            courseId: courseId.courseId
        },
        select: {
            schedule: true
        }
    });

    return {courseSchedules};
};
