import 'server-only';
import { Prisma } from '@/utils/lib/prisma';
import { AttendanceStatus, Prisma as PrismaTypes } from '@prisma/client';

// Obtener todos los registros de asistencia con búsqueda por enrollmentId, paginación y conteo total
export async function getAttendanceRecords(enrollmentId = '', page = 1, top = 10) {
    const skip = (page - 1) * top;

    const where: PrismaTypes.AttendanceWhereInput = {
        enrollmentId: enrollmentId || undefined, // se ignora si está vacío
    };

    const [attendanceRecords, totalAttendanceRecords] = await Promise.all([
        Prisma.attendance.findMany({
            where,
            skip,
            take: top,
            orderBy: { date: 'desc' },
        }),
        Prisma.attendance.count({ where }),
    ]);

    return { attendanceRecords, totalAttendanceRecords };
}

//verificar si existe el curso
export async function courseExists(courseId: string) {
    const course = await Prisma.course.findUnique({ where: { id: courseId } });
    return !!course;
}

// Crear un nuevo registro de asistencia
export async function createAttendanceRecord(data: {
    enrollment: string;
    date: Date;
    status: AttendanceStatus;
    schedule: string;
}) {
    return await Prisma.attendance.create({
        data: {
            enrollment: { connect: { id: data.enrollment } },
            date: data.date,
            status: data.status,
            schedule: { connect: { id: data.schedule } },
        },
    });
}

// Buscar un registro de asistencia por ID
export async function findAttendanceRecordById(id: string) {
    return await Prisma.attendance.findUnique({ where: { id } });
}

// Actualizar un registro de asistencia por ID
export async function updateAttendanceRecordById(id: string, data: PrismaTypes.AttendanceUpdateInput) {
    return await Prisma.attendance.update({ where: { id }, data });
}

// Eliminar un registro de asistencia por ID
export async function deleteAttendanceRecordById(id: string) {
    return await Prisma.attendance.delete({
        where: { id },
    });
}
