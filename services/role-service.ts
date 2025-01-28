import 'server-only';
import { PrismaClient } from "@prisma/client";
import { normalizeString } from "@/utils/normalize-string";
const Prisma = new PrismaClient();

export const getRoles = async (search: string, page: number, top: number) => {
    const skip = (page - 1) * top;
    const roles = await Prisma.role.findMany({
        orderBy: [
            { name: 'asc' },
        ],
        select: {
            id: true,
            name: true,
            normalizedName: true,
        },
        where: {
            deleted: false,
            name: { contains: search },
        },
        skip: skip,
        take: top,
    });

    const totalRoles = await Prisma.role.count({
        where: {
            deleted: false,
            name: { contains: search },
        },
    });

    return { roles, totalRoles };
};

export const createrRole = async (data: any) => {
    // Normalizar el nombre del rol
    data.normalizedName = normalizeString(data.normalizedName, { replacement: '-' });
    const role = await Prisma.role.create({ data: data });
    return role;
};

export const findRoleByNormalizedName = async (data: any) => {
    console.log("Este es el normalizedName sin normalizar: ", data.normalizedName);
    data.normalizedName = normalizeString(data.normalizedName, { replacement: '-' });

    console.log("Este es el normalizedName normalizado: ", data.normalizedName);
    const roleNormalizedNameExists = await Prisma.role.findUnique({
        where: { normalizedName: data.normalizedName },
    });

    console.log("Este es el roleNormalizedNameExists: ", roleNormalizedNameExists);
    return roleNormalizedNameExists
};

// Obtener Rol por ID
export const findRoleById = async (id: string) => {
    return Prisma.role.findUnique({
        select: {
            id: true,
            name: true,
            normalizedName: true,
        },
        where: {
            id: id,
            deleted: false,
        },
    });
};

// Actualizar role por ID
export const updateRoleById = async (id: string, data: any) => {
    return Prisma.role.update({
        where: { id },
        data: { name: data.name },
    });
};

// Eliminar usuario por ID (soft delete)
export const deleteRoleById = async (id: string) => {
    return Prisma.role.update({
        where: { id },
        data: { deleted: true },
    });
};
