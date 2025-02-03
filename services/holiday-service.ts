import 'server-only';
import { PrismaClient } from "@prisma/client";
const Prisma = new PrismaClient();

export const getHolidays = async (page: number, top: number, search: string) => {
    const skip = (page - 1) * top;
    const holidays = await Prisma.holiday.findMany({
        orderBy: [
            { id: 'asc' },
        ],
        where: {
            name: {
                contains: search,
            }
        },
        skip: skip,
        take: top,
    });

    const totalHolidays = await Prisma.holiday.count({
        where: {
            name: {
                contains: search,
            }
        }
    });

    return { holidays, totalHolidays };
};

export const createHoliday = async (data: any) => {
    const { name, date } = data;

    const holiday = await Prisma.holiday.create({
        data: {
            name,
            date
        }
    });
    return holiday;
};

export const findHolidayById = async (id: string) => {
    return Prisma.holiday.findUnique({
        where: { id },
    });
};

export const updateHolidayById = async (id: string, data: any) => {
    const { name, date } = data;

    return Prisma.holiday.update({
        where: { id },
        data: {
            name,
            date
        }
    });
};

export const deleteHolidayById = async (id: string) => {
    return Prisma.holiday.delete({
        where: { id },
    });
};
