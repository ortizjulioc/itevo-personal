import 'server-only';
import { CashBox as PrismaCashBox } from "@prisma/client";
import { Prisma } from '@/utils/lib/prisma';

// Definimos una interfaz similar a Branch pero omitiendo campos controlados por Prisma
interface CashBox extends Omit<PrismaCashBox, 'id' | 'updatedAt' | 'createdAt' | 'deleted'> { }

// 🔹 Obtener lista de cajas
export const getCashBoxes = async (branchId: string, search: string, page: number, top: number) => {
    const skip = (page - 1) * top;
    const whereClause: any = { deleted: false };
    if (branchId) { whereClause.branchId = branchId; }
    if (search) {
        whereClause.OR = [
            { name: { contains: search } },
            { location: { contains: search } }
        ];
    }
    const cashBoxes = await Prisma.cashBox.findMany({
        orderBy: [
            { name: 'asc' },
        ],
        select: {
            id: true,
            name: true,
            location: true,
            branchId: true,
            branch: {
                select: { id: true, name: true }
            }
        },
        where: whereClause,
        skip: skip,
        take: top,
    });

    const totalCashBoxes = await Prisma.cashBox.count({
        where: {
            deleted: false,
            OR: [
                { name: { contains: search } },
                { location: { contains: search } }
            ]
        },
    });

    return { cashBoxes, totalCashBoxes };
};

// 🔹 Crear caja
export const createCashBox = async (data: CashBox) => {
    const cashBox = await Prisma.cashBox.create({ data });
    return cashBox;
};

// 🔹 Obtener caja por ID
export const findCashBoxById = async (id: string) => {
    return Prisma.cashBox.findUnique({
        select: {
            id: true,
            name: true,
            location: true,
            branchId: true,
            branch: {
                select: { id: true, name: true }
            }
        },
        where: {
            id: id,
            deleted: false,
        },
    });
};

// 🔹 Actualizar caja por ID
export const updateCashBoxById = async (id: string, data: CashBox) => {
    return Prisma.cashBox.update({
        where: { id },
        data: data,
    });
};

// 🔹 Eliminar caja por ID (soft delete)
export const deleteCashBoxById = async (id: string) => {
    return Prisma.cashBox.update({
        where: { id },
        data: { deleted: true },
    });
};
