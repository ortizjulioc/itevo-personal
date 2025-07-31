import 'server-only';
import { Prisma } from "@/utils/lib/prisma";

// Asignar rol a un usuario en una sucursal
export const assignRoleToUserInBranch = async (userId: string, branchId: string, roleId: string) => {
    const existingAssignment = await Prisma.userRoleBranch.findUnique({
        where: {
            userId_roleId_branchId: {
                userId,
                roleId,
                branchId
            }
        },
    });

    if (existingAssignment) {
        throw new Error('El usuario ya tiene este rol asignado en esta sucursal');
    }

    return Prisma.userRoleBranch.create({
        data: {
            userId,
            branchId,
            roleId
        }
    });
};

// Desasignar rol a un usuario en una sucursal
export const removeRoleFromUserInBranch = async (userId: string, branchId: string, roleId: string) => {
    const assignment = await Prisma.userRoleBranch.findUnique({
        where: {
            userId_roleId_branchId: { userId, branchId, roleId }
        },
    });

    if (!assignment) {
        throw new Error('El usuario no tiene este rol asignado en esta sucursal');
    }

    return Prisma.userRoleBranch.delete({
        where: {
            userId_roleId_branchId: { userId, branchId, roleId }
        }
    });
};

// Obtener todos los roles de un usuario en una sucursal
export const getUserRolesInBranch = async (userId: string, branchId: string) => {
    return Prisma.userRoleBranch.findMany({
        where: { userId, branchId },
        include: {
            role: true
        }
    });
};
