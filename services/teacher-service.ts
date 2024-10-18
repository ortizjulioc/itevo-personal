import 'server-only';
import { PrismaClient } from "@prisma/client";
const Prisma = new PrismaClient();

export const getTeachers = async (search: string, page: number, top: number) => {
    const skip = (page - 1) * top;
    const teachers = await Prisma.teacher.findMany({
        orderBy: [
            { firstName: 'asc' },
            { lastName: 'asc' },
        ],
        select: {
            id: true,
            code: true,
            firstName: true,
            lastName: true,
            identification: true,
            address: true,
            phone: true,
            email: true,
            commissionRate: true,
        },
        where: {
            deleted: false,
            firstName: { contains: search },
        },
        skip: skip,
        take: top,
    });

    const totalTeachers = await Prisma.teacher.count({
        where: {
            deleted: false,
            firstName: { contains: search },
        },
    });

    return { teachers, totalTeachers };
};

export const createTeacher = async (data: any) => {
    const teacher = await Prisma.teacher.create({ data: data });
    return teacher;
};

export const findTeacherByCode= async (data: any) => {
    const teacherCodeExists = await Prisma.teacher.findUnique({
        where: { code: data.code },
    });
    return teacherCodeExists
};

// Obtener teacher por ID
export const findTeacherById = async (id: string) => {
    return Prisma.teacher.findUnique({
        select: {
            id: true,
            code: true,
        },
        where: {
            id: id,
            deleted: false,
        },
    });
};

// Actualizar teacher por ID
export const updateTeacherById = async (id: string, data: any) => {
    return Prisma.teacher.update({
        where: { id },
        data: {code: data.code, firstName: data.firstName , lastName: data.lastName, identification: data.identification, address: data.address, phone: data.phone, email: data.email, commissionRate: data.commissionRate},
    });
};

// Eliminar teacher por ID (soft delete)
export const deleteTeacherById = async (id: string) => {
    return Prisma.teacher.update({
        where: { id },
        data: { deleted: true },
    });
};
