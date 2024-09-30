import 'server-only';
import { PrismaClient } from "@prisma/client";
const bcrypt = require('bcrypt');
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

// export const createUser = async (data: any) => {
//     const saltRounds = 10;
//     const hash = bcrypt.hashSync(data.password, saltRounds);

//     data.password = hash;
//     data.search = normalizeString(`${data.name} ${data.lastName} ${data.username} ${data.email}`);

//     const user = await Prisma.user.create({ data: data });
//     return user;
// };

// export const findUserByEmail = async (email: string) => {
//     return Prisma.user.findUnique({
//         where: { email },
//     });
// };

// export const findUserByUsername = async (username: string) => {
//     return Prisma.user.findUnique({
//         where: { username },
//     });
// };

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
