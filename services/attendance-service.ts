import 'server-only';
import { Prisma } from '@/utils/lib/prisma';
import { AttendanceStatus, Prisma as PrismaTypes } from '@prisma/client';

// Obtener todos los registros de asistencia con búsqueda por courseBranchId, paginación y conteo total
export async function getAttendanceRecords(filter: {
    courseBranchId?: string;
    studentId?: string;
    date?: Date;
}, page = 1, top = 10) {
    const skip = (page - 1) * top;

    const where: PrismaTypes.AttendanceWhereInput = {
        courseBranchId: filter.courseBranchId  || undefined, // se ignora si está vacío
        date: filter.date || undefined,
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

// Crear un nuevo registro de asistencia
export async function createAttendanceRecord(data: PrismaTypes.AttendanceCreateInput) {
    return await Prisma.attendance.create({ data });
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
