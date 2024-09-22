import 'server-only';
import { PrismaClient } from "@prisma/client";
import { normalizeString } from "@/utils/normalize-string";
const bcrypt = require('bcrypt');
const Prisma = new PrismaClient();

export const getUsers = async (search: string, page: number, top: number) => {
    const skip = (page - 1) * top;
    const users = await Prisma.user.findMany({
        orderBy: [
            { name: 'asc' },
            { lastName: 'asc' },
            { username: 'asc' },
        ],
        select: {
            id: true,
            username: true,
            email: true,
            name: true,
            lastName: true,
            phone: true,
            password: false,
        },
        where: {
            deleted: false,
            search: { contains: search },
        },
        skip: skip,
        take: top,
    });

    const totalUsers = await Prisma.user.count({
        where: {
            deleted: false,
            search: { contains: search },
        },
    });

    return { users, totalUsers };
};

export const createUser = async (data: any) => {
    const saltRounds = 10;
    const hash = bcrypt.hashSync(data.password, saltRounds);

    data.password = hash;
    data.search = normalizeString(`${data.name} ${data.lastName} ${data.username} ${data.email}`);

    const user = await Prisma.user.create({ data: data });
    return user;
};

export const findUserByEmail = async (email: string) => {
    return Prisma.user.findUnique({
        where: { email },
    });
};

export const findUserByUsername = async (username: string) => {
    return Prisma.user.findUnique({
        where: { username },
    });
};

// Obtener usuario por ID
export const findUserById = async (id: string) => {
    return Prisma.user.findUnique({
        select: {
            id: true,
            username: true,
            email: true,
            name: true,
            lastName: true,
            phone: true,
            password: false,
        },
        where: {
            id: id,
            deleted: false,
        },
    });
};

// Actualizar usuario por ID
export const updateUserById = async (id: string, data: any) => {
    // Actualizar el campo password si está presente
    if (data.password) {
        const saltRounds = 10;
        data.password = bcrypt.hashSync(data.password, saltRounds);
    } else {
        delete data.password;
    }

    data.search = normalizeString(`${data.name} ${data.lastName} ${data.username} ${data.email}`);

    return Prisma.user.update({
        where: { id },
        data: data,
    });
};

// Eliminar usuario por ID (soft delete)
export const deleteUserById = async (id: string) => {
    return Prisma.user.update({
        where: { id },
        data: { deleted: true },
    });
};
