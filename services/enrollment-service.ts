import 'server-only';
import { EnrollmentStatus, PrismaClient, Prisma as PrismaTypes } from "@prisma/client";
import { Prisma } from '@/utils/lib/prisma';

export const getEnrollments = async (filters: any) => {
    const {
        studentId,
        courseId,
        teacherId,
        branchId,
        promotionId,
        modality,
        status,
        enrollmentDate,
        page,
        top,
        courseBranchId
    } = filters;
    const skip = (page - 1) * top;


    const where: PrismaTypes.EnrollmentWhereInput = {
        deleted: false,
        ...(courseBranchId && { courseBranchId }),
        ...(studentId && { studentId }),
        ...(status && {
            status: (Object.values(EnrollmentStatus) as string[]).includes(status.toUpperCase())
                ? (status.toUpperCase() as EnrollmentStatus)
                : undefined,
        }),
        ...(enrollmentDate && {
            enrollmentDate: {
                gte: new Date(new Date(enrollmentDate).setHours(0, 0, 0, 0)),
                lte: new Date(new Date(enrollmentDate).setHours(23, 59, 59, 999)),
            },
        }),
        courseBranch: {
            deleted: false,
            ...(courseId && { courseId }),
            ...(teacherId && { teacherId }),
            ...(branchId && { branchId }),
            ...(promotionId && { promotionId }),
            ...(modality && { modality }),
        },
    };

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

     // Filtrar por `status` con valores de Prisma EnrollmentStatus
     if (status) {
        const normalizedStatus = status.toUpperCase(); // Convertimos a minúsculas
        const validStatuses = Object.values(EnrollmentStatus); // Obtenemos los valores del enum de Prisma

        if (validStatuses.includes(normalizedStatus as EnrollmentStatus)) {
            where.status = normalizedStatus as EnrollmentStatus;
        } else {
            throw new Error(`Estado inválido: ${status}. Los valores válidos son: ${validStatuses.join(", ")}`);
        }
    }



    const enrollments = await Prisma.enrollment.findMany({
        orderBy: [
            { enrollmentDate: 'asc' },
        ],
        include: {
            student: true,
            courseBranch: {
                select: {
                    id: true,
                    courseId: true,
                    branchId: true,
                    teacherId: true,
                    teacher: { select: { code: true, firstName: true, lastName: true } },
                    course: { select: { name: true, code: true } },
                    branch: { select: { name: true } },
                    schedules: { select: { schedule: true } },
                },
            },
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

export const createEnrollment = async (data: PrismaTypes.EnrollmentCreateInput, prisma: PrismaClient | PrismaTypes.TransactionClient = Prisma) => {
    const enrollment = await prisma.enrollment.create({ data: data });
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
            deleted: false,
        },
        include: {
            student: {
                select: {
                    id: true,
                    email: true,
                    firstName: true,
                    lastName: true,
                    phone: true,
                },
            },
            courseBranch: {
                select: {
                    id: true,
                    courseId: true,
                    branchId: true,
                    amount: true,
                    enrollmentAmount: true,
                    course: {
                        select: {
                            name: true,
                            code: true,
                        },
                    },
                    branch: {
                        select: {
                            name: true,
                        },
                    },
                    paymentPlan: true,
                    schedules: {
                        select: {
                            schedule: {
                                select: {
                                    startTime: true,
                                    endTime: true,
                                    weekday: true,
                                },
                            }
                        },
                    }
                },
            },
        },
    });

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
    return Prisma.enrollment.update({
        where: { id },
        data: { deleted: true },
    });
};
