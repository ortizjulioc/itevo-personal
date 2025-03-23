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
            OR: [
                { firstName: { contains: search } },
                { lastName: { contains: search } },
                { identification: { contains: search } },
                { address: { contains: search } },
                { phone: { contains: search } },
                { email: { contains: search } },
            ],
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

// Obtener student por ID
export const findStudentById = async (id: string) => {
    return Prisma.student.findUnique({
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

// Crear codigo de estudiante unico tomando como referencia el año actual, y calculando que el codigo sea autoincremental dependiendo del anterior

export const createStudentCode = async () => {
    const currentYear = new Date().getFullYear();
    const students = await Prisma.student.findMany({
        where: {
            code: {
                startsWith: currentYear.toString(),
            },
        },
        orderBy: {
            code: 'desc',
        },
    });

    if (students.length === 0) {
        return `${currentYear.toString()}-0001`;
    }

    const [year, code] = students[0].code.split('-');
    const lastStudentCode = parseInt(code, 10);
    const newStudentCode = lastStudentCode + 1;
    return `${year}-${newStudentCode.toString().padStart(4, '0')}`;
};
