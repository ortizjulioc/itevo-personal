import 'server-only';
import { PrismaClient, User as PrismaUser, Role, Branch as PrismaBranch } from "@prisma/client";
import { normalizeString } from "@/utils/normalize-string";
const bcrypt = require('bcrypt');
const Prisma = new PrismaClient();

// Definimos las interfaces necesarias para tipificar la respuesta de usuario por id
interface Branch extends Omit<PrismaBranch, 'roles'> {
    roles: Role[];
}

interface UserWithBranchesAndRoles extends Omit<PrismaUser, 'password'> {
    roleBranch: any | undefined;
    branches: Branch[];
}

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
    const user = await Prisma.user.findUnique({
        where: { id },
        include: {
            roleBranch: {
                include: {
                    branch: true,
                    role: true,
                },
            },
        },
    });

    if (!user) {
        return null;
    }

    // Estructura de salida para agrupar roles por sucursal
    const userWithBranchesAndRoles: UserWithBranchesAndRoles = {
        ...user,
        roleBranch: undefined,
        branches: user.roleBranch.reduce<Branch[]>((acc, current) => {
            const branchIndex = acc.findIndex(
                (branch) => branch.id === current.branch.id
            );

            const roleData: Role = {
                id: current.role.id,
                name: current.role.name,
                normalizedName: current.role.normalizedName,
                deleted: current.role.deleted,
                createdAt: current.role.createdAt,
                updatedAt: current.role.updatedAt,
            };

            if (branchIndex === -1) {
                // Si la sucursal no está en la lista, la agregamos con el primer rol
                acc.push({
                    id: current.branch.id,
                    name: current.branch.name,
                    address: current.branch.address,
                    phone: current.branch.phone ?? null,
                    deleted: current.branch.deleted,
                    createdAt: current.branch.createdAt,
                    updatedAt: current.branch.updatedAt,
                    roles: [roleData],
                });
            } else {
                // Si la sucursal ya está en la lista, solo agregamos el nuevo rol
                acc[branchIndex].roles.push(roleData);
            }

            return acc;
        }, []),
    };

    return userWithBranchesAndRoles;
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
