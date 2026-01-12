import 'server-only';
import { Scholarship as PrismaScholasip } from '@prisma/client';
import { Prisma } from '@/utils/lib/prisma';
import { id } from 'date-fns/locale/id';

interface Scholarship extends Omit<PrismaScholasip, 'id' | 'updatedAt' | 'createAt' | 'deleted'> {}

// Obtener becas con paginación y búsqueda
export const getScholarships = async (search: string, page: number, top: number) => {
    const skip = (page - 1) * top;
    const scholarships = await Prisma.scholarship.findMany({
        orderBy: [{ name: 'asc' }],
        select: {
            id: true,
            name: true,
            description: true,
            type: true,
            value: true,
        },
        where: {
            deleted: false,
            name: { contains: search },
        },
        skip: skip,
        take: top,
    });

    const totalScholarships = await Prisma.scholarship.count({
        where: {
            deleted: false,
            name: { contains: search },
        },
    });

    return { scholarships, totalScholarships };
};

//----------------------------------------------------------------------------------
// Crear una nueva beca
export const createScholarship = async (data: Scholarship) => {
    const scholarship = await Prisma.scholarship.create({ data });
    return scholarship;
};

//--------------------------------------------------------------------------------
// Obtener beca por ID
export const findScholarshipById = async (id: string) => {
    return Prisma.scholarship.findUnique({
        select: {
            id: true,
            name: true,
            description: true,
            type: true,
            value: true,
        },
        where: {
            id: id,
            deleted: false,
        },
    });
};
//--------------------------------------------------------------------------------
// Actualizar beca por ID
export const updateScholarshipById = async (id: string, data: Scholarship) => {
    return Prisma.scholarship.update({
        where: { id },
        data: data,
    });
};
//--------------------------------------------------------------------------------
// Eliminar beca por ID (borrado lógico)
export const deleteScholarship = async (id: string) => {
    return Prisma.scholarship.update({
        where: { id },
        data: { deleted: true },
    });
}
