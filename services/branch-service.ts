import 'server-only';
import { PrismaClient } from "@prisma/client";
const Prisma = new PrismaClient();

export const getBranches = async (search: string, page: number, top: number) => {
    const skip = (page - 1) * top;
    const branches = await Prisma.branch.findMany({
        orderBy: [
            { name: 'asc' },
        ],
        select: {
            id: true,
            name: true,
            address: true,
        },
        where: {
            deleted: false,
            name: { contains: search },
        },
        skip: skip,
        take: top,
    });

    const totalBranches = await Prisma.branch.count({
        where: {
            deleted: false,
            name: { contains: search },
        },
    });

    return { branches, totalBranches };
};
export const createBranch = async (data: any) => {
    const branch = await Prisma.branch.create({ data: data });
    return branch;
};

// Obtener sucursal por ID
export const findBranchById = async (id: string) => {
    return Prisma.branch.findUnique({
        select: {
            id: true,
            name: true,
            address: true,
        },
        where: {
            id: id,
            deleted: false,
        },
    });
};

// Actualizar sucursal por ID
export const updateBranchById = async (id: string, data: any) => {

    return Prisma.branch.update({
        where: { id },
        data: data,
    });
};

// Eliminar usuario por ID (soft delete)
export const deleteBranchById = async (id: string) => {
    return Prisma.branch.update({
        where: { id },
        data: { deleted: true },
    });
};
