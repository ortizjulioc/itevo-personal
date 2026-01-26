import 'server-only';
import { Prisma } from '@/utils/lib/prisma';

// Obtener becas con paginación y búsqueda
export const getScholarships = async (search: string, page: number, top: number) => {
    const skip = (page - 1) * top;
    // @ts-ignore: Scholarship might not be in Prisma Client yet
    const scholarships = await Prisma.scholarship.findMany({
        orderBy: [
            { createdAt: 'desc' },
        ],
        where: {
            name: { contains: search },
            deleted: false,
        },
        skip: skip,
        take: top,
    });

    // @ts-ignore
    const totalScholarships = await Prisma.scholarship.count({
        where: {
            name: { contains: search },
            deleted: false,
        },
    });

    return { scholarships, totalScholarships };
};

// Crear una beca
export const createScholarship = async (data: any) => {
    // @ts-ignore
    const scholarship = await Prisma.scholarship.create({ data });
    return scholarship;
};

// Obtener beca por ID
export const findScholarshipById = async (id: string) => {
    // @ts-ignore
    return Prisma.scholarship.findUnique({
        where: { id, deleted: false },
    });
};

// Actualizar beca por ID
export const updateScholarshipById = async (id: string, data: any) => {
    // @ts-ignore
    return Prisma.scholarship.update({
        where: { id },
        data,
    });
};

// Eliminar beca por ID
export const deleteScholarshipById = async (id: string) => {
    // @ts-ignore
    return Prisma.scholarship.update({
        where: { id },
        data: { deleted: true },
    });
};
