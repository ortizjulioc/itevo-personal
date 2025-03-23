import 'server-only';
import { PrismaClient } from "@prisma/client";
const Prisma = new PrismaClient();

export const getCourses = async (search: string, page: number, top: number) => {
    const skip = (page - 1) * top;
    const courses = await Prisma.course.findMany({
        orderBy: [
            { name: 'asc' },
        ],
        select: {
            id: true,
            code: true,
            name: true,
            description: true,
            duration: true,
            requiresGraduation: true,
        },
        where: {
            deleted: false,
            name: { contains: search },
        },
        skip: skip,
        take: top,
    });

    const totalCourses = await Prisma.course.count({
        where: {
            deleted: false,
            name: { contains: search },
        },
    });

    return { courses, totalCourses };
};

export const createCourse = async (data: any) => {
    const course = await Prisma.course.create({ data: data });
    return course;
};

export const findCourseByCode= async (data: any) => {
    const courseCodeExists = await Prisma.course.findUnique({
        where: { code: data.code },
    });
    return courseCodeExists
};

// Obtener course por ID
export const findCourseById = async (id: string) => {

    const course = await Prisma.course.findUnique({
        where: {
            id: id,
            deleted: false,
        },
        include: {
            prerequisites: {
                select: {
                    prerequisite: {
                        select: {
                            id: true,
                        },
                    },
                },
            },
        },
    });

    // Devolviendo prerequisites como un arreglo de IDs

    if (course) {
        course.prerequisites = course.prerequisites.map((prerequisite: any) => prerequisite.prerequisite.id);
    }

    return course;

};

// Actualizar course por ID
export const updateCourseById = async (id: string, data: any) => {

    return Prisma.course.update({
        where: { id },
        data: { name: data.name, code: data.code, description: data.description, duration: data.duration, requiresGraduation: data.requiresGraduation },
    });
};

// Eliminar course por ID (soft delete)
export const deleteCourseById = async (id: string) => {
    return Prisma.course.update({
        where: { id },
        data: { deleted: true },
    });
};

// Agregar prerequisito a un curso


export const addPrerequisite = async (courseId: string, prerequisiteId: string) => {

    console.log("Entrando a addPrerequisite");
    return Prisma.course.update({
        where: { id: courseId },
        data: {
            prerequisites: {
                create: { prerequisiteId: prerequisiteId },
            },
        },
    });
};

export const updatePrerequisite = async (courseId: string, prerequisiteId: string) => {
    return Prisma.course.update({
        where: { id: courseId },
        data: {
            prerequisites: {
                create: { prerequisiteId: prerequisiteId },
            },
        },
    });
};
// findByPrequisiteId


export const findPrerequisiteById = async (courseId: string, prerequisiteId: string) => {
    console.log("Entrando a findPrerequisiteById");
    return Prisma.prerequisite.findUnique({
        where: {
            courseId_prerequisiteId: {
                courseId: courseId,
                prerequisiteId: prerequisiteId,
            },
        }
    });
};

// Buscar todos los prerequisitos de un curso

export const findPrerequisitesByCourseId = async (courseId: string) => {
    return Prisma.prerequisite.findMany({
        where: {
            courseId: courseId,
        },
        include: {
            prerequisite: {
                select: {
                    id: true,
                    name: true,
                    code: true,
                },
            },
        },
    });
};

// Eliminar prerequisito de un curso

export const deletePrerequisite = async (courseId: string, prerequisiteId: string) => {
    return Prisma.prerequisite.delete({
        where: {
            courseId_prerequisiteId: {
                courseId: courseId,
                prerequisiteId: prerequisiteId,
            },
        },
    });
};


