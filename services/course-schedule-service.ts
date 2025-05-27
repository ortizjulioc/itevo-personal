import 'server-only';
import { Prisma } from '@/utils/lib/prisma';

export const getCourseSchedules = async (filters: any) => {

    const {courseId, scheduleId } = filters;
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
    });

    const totalCourseSchedules = await Prisma.courseSchedule.count({
        where: {
            courseId,
            scheduleId
        },
    });

    return { courseSchedules, totalCourseSchedules };
};

export const getCourseSchedulesByIds = async (courseId: any, scheduleId: any) => {
    const courseSchedule = await Prisma.courseSchedule.findFirst({
        where: {
            courseId,
            scheduleId
        },
    });

    return courseSchedule;
}

export const createCourseSchedule = async (data: any) => {
    const courseSchedule = await Prisma.courseSchedule.create({ data: data });
    return courseSchedule;
};

export const getCourseSchedulesByCourseId = async (courseId: string) => {
    const courseSchedules = await Prisma.courseSchedule.findMany({
        where: { courseId },
        include: { schedule: true },
    });

    return courseSchedules.map(cs => cs.schedule);
};

export const deleteCourseSchedule = async (courseId: any, scheduleId: any) => {
    const courseSchedule = await Prisma.courseSchedule.delete({
        where: {
            courseId_scheduleId: {
                courseId,
                scheduleId
            }
        },
    });

    return courseSchedule;
}