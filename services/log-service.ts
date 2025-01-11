import 'server-only';
import { Branch as PrismaBranch, PrismaClient } from "@prisma/client";
const Prisma = new PrismaClient();


export const getLogs = async (
    filters: {
        date?: Date;
        action?: ('POST' | 'PUT' | 'DELETE' | 'GET' | 'PATCH')[];
        description?: string;
        origin?: string;
        elementId?: string;
        success?: boolean;
        authorId?: string;
    },
    page: number,
    top: number
) => {
    const skip = (page - 1) * top;

    const whereClouse = {
        date: filters.date ? { equals: filters.date } : undefined,
        action: filters.action && filters.action.length > 0 ? { in: filters.action } : undefined,
        description: filters.description ? { contains: filters.description } : undefined,
        origin: filters.origin ? { contains: filters.origin } : undefined,
        elementId: filters.elementId ? { equals: filters.elementId } : undefined,
        success: filters.success !== undefined ? { equals: filters.success } : undefined,
        authorId: filters.authorId ? { equals: filters.authorId } : undefined,
    };

    const logs = await Prisma.log.findMany({
        orderBy: [{ date: 'desc' }],
        select: {
            id: true,
            date: true,
            action: true,
            description: true,
            origin: true,
            elementId: true,
            success: true,
            authorId: true,
            createdAt: true,
            updatedAt: true,
        },
        where: whereClouse,
        skip: skip,
        take: top,
    });

    const totalLogs = await Prisma.log.count({
        where: whereClouse,
    });

    return { logs, totalLogs };
};

export const createLog = async (
    data: {
        action: 'POST' | 'PUT' | 'DELETE' | 'GET' | 'PATCH';
        description: string;
        origin: string;
        elementId?: string;
        success: boolean;
        authorId?: string;
    }
) => {
    const log = await Prisma.log.create({
        data: {
            action: data.action,
            description: data.description,
            origin: data.origin,
            elementId: data.elementId,
            success: data.success,
            authorId: data.authorId,
        },
    });

    return log;
};

export const getLogById = async (id: string) => {
    const log = await Prisma.log.findUnique({
        where: { id },
        select: {
            id: true,
            date: true,
            action: true,
            description: true,
            origin: true,
            elementId: true,
            success: true,
            authorId: true,
            createdAt: true,
            updatedAt: true,
        },
    });

    return log;
};

