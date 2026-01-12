import 'server-only';
import { StudentScholarship as PrismaStudentScholarship } from '@prisma/client';
import { Prisma } from '@/utils/lib/prisma';

interface StudentScholarship extends Omit<PrismaStudentScholarship, 'id' | 'updatedAt' | 'createAt' | 'deleted'> {}

export const getStudentsScholarships = async (search: string, page: number, top: number, studentId: string) => {
    const skip = (page - 1) * top;
    const studentsScholarships = await Prisma.studentScholarship.findMany({
        orderBy: [{ createdAt: 'desc' }],
        select: {
            id: true,
            scholarshipId: true,
            studentId: true,
            assignedAt: true,
            assignedBy: true,
            scholarship: {
                select: {
                    id: true,
                    name: true,
                    description: true,
                    type: true,
                    value: true,
                },
            },
        },
        where: {
            deleted: false,
            studentId: studentId,
        },
        skip: skip,
        take: top,
    });

    const totalStudentsScholarships = await Prisma.studentScholarship.count({
        where: {
            deleted: false,
            studentId: studentId,
        },
    });

    return { studentsScholarships, totalStudentsScholarships };
};

//----------------------------------------------------------------------------------
// Crear una nueva beca asignada a un estudiante
export const createStudentScholarship = async (data: StudentScholarship) => {
    const studentScholarship = await Prisma.studentScholarship.create({ data });
    return studentScholarship;
};

//--------------------------------------------------------------------------------
// Obtener beca asignada a un estudiante por ID
export const findStudentScholarshipById = async (id: string) => {
    return Prisma.studentScholarship.findUnique({
        select: {
            id: true,
            scholarshipId: true,
            studentId: true,
            assignedAt: true,
            assignedBy: true,
            scholarship: {
                select: {
                    id: true,
                    name: true,
                    description: true,
                    type: true,
                    value: true,
                },
            },
        },
        where: {
            id: id,
            deleted: false,
        },
    });
}

//--------------------------------------------------------------------------------
// Actualizar beca asignada a un estudiante por ID
export const updateStudentScholarshipById = async (id: string, data: StudentScholarship) => {
    return Prisma.studentScholarship.update({
        data,
        where: {
            id: id,
            deleted: false,
        },
    });
};

//--------------------------------------------------------------------------------
// Eliminar beca asignada a un estudiante por ID (borrado lógico)
export const deleteStudentScholarship = async (id: string) => {
    return Prisma.studentScholarship.update({
        where: { id },
        data: { deleted: true },
    });
};
