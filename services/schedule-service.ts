import 'server-only';
import { PrismaClient } from "@prisma/client";
const Prisma = new PrismaClient();

export const getSchedules = async (weekday: number | null, startTime: string | null, endTime: string | null) => {
    const whereCondition: any = { deleted: false };

    if (weekday !== null) {
        whereCondition.weekday = weekday;
    }
    if (startTime !== null && endTime !== null) {
        whereCondition.startTime = { lte: endTime };
        whereCondition.endTime = { gte: startTime };
    }

    const schedules = await Prisma.schedule.findMany({
        orderBy: [
            { id: 'asc' },
        ],
        where: whereCondition,
    });

    const totalSchedules = await Prisma.schedule.count({
        where: whereCondition,
    });

    return { schedules, totalSchedules };
};

export const createSchedule = async (data: any) => {
    const { startTime, endTime, weekday } = data;

    const schedule = await Prisma.schedule.create({
        data: {
            startTime,
            endTime,
            weekday
        }
    });
    return schedule;
};

export const findScheduleById = async (id: string) => {
    const schedule = await Prisma.schedule.findUnique({
        where: { id, deleted: false },
    });
    return schedule;
};

export const updateScheduleById = async (id: string, data: any) => {
    const { startTime, endTime, weekday } = data;

    return Prisma.schedule.update({
        where: { id },
        data: {
            startTime,
            endTime,
            weekday
        },
    });
};

export const deleteScheduleById = async (id: string) => {
    return Prisma.schedule.update({
        where: { id },
        data: {
            deleted: true,
        },
    });
};
