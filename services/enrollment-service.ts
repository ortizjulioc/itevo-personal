import 'server-only';
import { PrismaClient } from "@prisma/client";
import { equal } from 'assert';
const Prisma = new PrismaClient();

export const getEnrollments = async (search: string, page: number, top: number, studentId?: string, courseBranchId?: string, enrollmentDate?: string) => {
    const skip = (page - 1) * top;


    const where: any = {};

    if(search){
        where.OR = [
            { studentId: { contains: search } },
            { courseBranchId: { contains: search } },
        ];
    }

    if(studentId){
        where.studentId = { equals: studentId };
    }
    if(courseBranchId){
        where.courseBranchId = { equals: courseBranchId };
    }

    // Filtrar por enrollmentDate
    if (enrollmentDate) {
        const date = new Date(enrollmentDate);
        if (!isNaN(date.getTime())) {
            where.enrollmentDate = {
                gte: new Date(date.setHours(0, 0, 0, 0)), // Desde las 00:00
                lte: new Date(date.setHours(23, 59, 59, 999)) // Hasta las 23:59
            };
        }
    }



    const enrollments = await Prisma.enrollment.findMany({
        orderBy: [
            { enrollmentDate: 'asc' },
        ],
        select: {
            id: true,
            studentId: true,
            courseBranchId: true,
            enrollmentDate: true,
            status: true,
        },
        where,
        skip: skip,
        take: top,
    });

    const totalEnrollments = await Prisma.enrollment.count({
        where
    });

    return { enrollments, totalEnrollments };
};

export const createEnrollment = async (data: any) => {
    const enrollment = await Prisma.enrollment.create({ data: data });
    return enrollment;
};

// export const findCourseByCode= async (data: any) => {
//     const courseCodeExists = await Prisma.course.findUnique({
//         where: { code: data.code },
//     });
//     return courseCodeExists
// };

// Obtener enrollment por ID
export const findEnrollmentById = async (id: string) => {

    const enrollment = await Prisma.enrollment.findUnique({
        where: {
            id: id,
            // deleted: false,
        },
        // include: {
        //     prerequisites: {
        //         select: {
        //             prerequisite: {
        //                 select: {
        //                     id: true,
        //                 },
        //             },
        //         },
        //     },
        // },
    });

    // Devolviendo prerequisites como un arreglo de IDs

    // if (course) {
    //     course.prerequisites = course.prerequisites.map((prerequisite: any) => prerequisite.prerequisite.id);
    // }

    return enrollment;

};

// Actualizar enrollment por ID
export const updateEnrollmentById = async (id: string, data: any) => {

    return Prisma.enrollment.update({
        where: { id },
        data: {
            studentId: data.studentId,
            courseBranchId: data.courseBranchId,
            enrollmentDate: data.enrollmentDate,
            status: data.status,
        },
    });
};

// Eliminar enrollment por ID (soft delete)
export const deleteEnrollmentById = async (id: string) => {
    return Prisma.enrollment.delete({
        where: { id },
    });
};
