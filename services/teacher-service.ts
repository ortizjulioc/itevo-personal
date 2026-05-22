import 'server-only';
import { Prisma } from '@/utils/lib/prisma';

export const getTeachers = async (search: string, page: number, top: number, includeDeleted: boolean = false) => {
    const skip = (page - 1) * top;

    const where: any = {
        ...(includeDeleted ? {} : { deleted: false }),
        firstName: { contains: search },
    };

    const teachers = await Prisma.teacher.findMany({
        orderBy: [
            { createdAt: 'desc' },
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
            deleted: true,
        },
        where,
        skip: skip,
        take: top,
    });

    const totalTeachers = await Prisma.teacher.count({
        where,
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

export const findTeacherByIdentification= async (data: any) => {
    const teacherIdentificationExists = await Prisma.teacher.findUnique({
        where: { identification: data.identification },
    });
    return teacherIdentificationExists
};

// Obtener teacher por ID
export const findTeacherById = async (id: string, includeDeleted: boolean = false) => {
    return Prisma.teacher.findUnique({
        where: {
            id: id,
            ...(includeDeleted ? {} : { deleted: false }),
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

// Restaurar teacher por ID
export const restoreTeacherById = async (id: string) => {
    return Prisma.teacher.update({
        where: { id },
        data: { deleted: false },
    });
};
