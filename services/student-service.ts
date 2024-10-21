import 'server-only';
import { PrismaClient } from "@prisma/client";
const Prisma = new PrismaClient();

export const getStudents = async (search: string, page: number, top: number) => {
    const skip = (page - 1) * top;
    const students = await Prisma.student.findMany({
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
            hasTakenCourses: true,
        },
        where: {
            deleted: false,
            firstName: { contains: search },
        },
        skip: skip,
        take: top,
    });

    const totalStudents = await Prisma.student.count({
        where: {
            deleted: false,
            firstName: { contains: search },
        },
    });

    return { students, totalStudents };
};

export const createStudent = async (data: any) => {
    const student = await Prisma.student.create({ data: data });
    return student;
};

export const findStudentByCode= async (data: any) => {
    const studentCodeExists = await Prisma.student.findUnique({
        where: { code: data.code },
    });
    return studentCodeExists
};

// Obtener student por ID
export const findStudentById = async (id: string) => {
    return Prisma.student.findUnique({
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

// Actualizar student por ID
export const updateStudentById = async (id: string, data: any) => {
    return Prisma.student.update({
        where: { id },
        data: {code: data.code, firstName: data.firstName , lastName: data.lastName, identification: data.identification, address: data.address, phone: data.phone, email: data.email, hasTakenCourses: data.hasTakenCourses},
    });
};

// Eliminar student por ID (soft delete)
export const deleteStudentById = async (id: string) => {
    return Prisma.student.update({
        where: { id },
        data: { deleted: true },
    });
};
