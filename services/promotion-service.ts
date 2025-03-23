import 'server-only';
import { PrismaClient } from "@prisma/client";

const Prisma = new PrismaClient();

// Obtener promociones con paginación y búsqueda
export const getPromotions = async (search: string, page: number, top: number) => {
    const skip = (page - 1) * top;
    const promotions = await Prisma.promotion.findMany({
        orderBy: [
            { startDate: 'asc' },
        ],
        select: {
            id: true,
            description: true,
            startDate: true,
            endDate: true,
        },
        where: {
            description: { contains: search },
        },
        skip: skip,
        take: top,
    });

    const totalPromotions = await Prisma.promotion.count({
        where: {
            description: { contains: search },
        },
    });

    return { promotions, totalPromotions };
};

// Crear una promoción
export const createPromotion = async (data: any) => {
    const promotion = await Prisma.promotion.create({ data });
    return promotion;
};

// Obtener promoción por ID
export const findPromotionById = async (id: string) => {
    return Prisma.promotion.findUnique({
        select: {
            id: true,
            description: true,
            startDate: true,
            endDate: true,
        },
        where: { id },
    });
};

// Actualizar promoción por ID
export const updatePromotionById = async (id: string, data: any) => {
    return Prisma.promotion.update({
        where: { id },
        data,
    });
};

// Eliminar promoción por ID (soft delete no especificado, eliminación directa)
export const deletePromotionById = async (id: string) => {
    return Prisma.promotion.delete({
        where: { id },
    });
};
