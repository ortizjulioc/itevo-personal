import 'server-only';
import { Prisma } from '@/utils/lib/prisma';
import { PrismaClient, Prisma as PrismaTypes } from "@prisma/client";

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

export const createStudent = async (
    data: PrismaTypes.StudentCreateInput,
    prisma: PrismaClient | PrismaTypes.TransactionClient = Prisma,
) => {
    const student = await prisma.student.create({ data: data });
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

export const findStudentByEmail = async (email: string) => {
    return Prisma.student.findFirst({
        where: {
            email: email,
            deleted: false,
        },
    });
}

export const findStudentByIdentification = async (identification: string) => {
    return Prisma.student.findFirst({
        where: {
            identification: identification,
            deleted: false,
        },
    });
};

// Actualizar student por ID
export const updateStudentById = async (
    id: string,
    data: any,
    prisma: PrismaClient | PrismaTypes.TransactionClient = Prisma,
) => {
    return prisma.student.update({
        where: { id },
        data: { code: data.code, firstName: data.firstName, lastName: data.lastName, identification: data.identification, address: data.address, phone: data.phone, email: data.email, hasTakenCourses: data.hasTakenCourses },
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

export const findAccountsReceivableByStudentId = async (studentId: string) => {
    return Prisma.accountReceivable.findMany({
        where: {
            studentId: studentId,
        },
        include: {
            courseBranch: {
                select: {
                    id: true,
                    course: {
                        select: {
                            id: true,
                            code: true,
                            name: true,
                        },
                    },
                },
            },
        },
        orderBy: [
            { createdAt: 'asc' },
        ],
    });
};

export const addFingerprintToStudent = async (
    studentId: string,
    fingerprintData: Omit<PrismaTypes.FingerprintCreateInput, 'studentId' | 'student'>,
    prisma: PrismaClient | PrismaTypes.TransactionClient = Prisma,
) => {
    return prisma.fingerprint.create({
        data: {
            ...fingerprintData,
            student: {
                connect: { id: studentId },
            },
        },
    });
};

export const findFingerprintByStudentId = async (studentId: string) => {
    return Prisma.fingerprint.findUnique({
        where: {
            studentId: studentId,
        },
    });
};

