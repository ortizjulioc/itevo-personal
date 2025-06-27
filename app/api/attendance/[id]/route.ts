import { NextRequest, NextResponse } from 'next/server';
import { validateObject } from '@/utils';
import { formatErrorMessage } from '@/utils/error-to-string';
import { createLog } from '@/utils/log';
import { Attendance } from '@prisma/client';
import { getAttendanceRecords, createAttendanceRecord, findAttendanceRecordById, updateAttendanceRecordById, deleteAttendanceRecordById } from '@/services/attendance-service';
import { findEnrollmentById } from '@/services/enrollment-service';


// obtener una asistencia por id
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    const { id } = params;

    try {
        const attendanceRecord = await findAttendanceRecordById(id);

        if (!attendanceRecord) {
            return NextResponse.json({ code: 'E_ATTENDANCE_NOT_FOUND' }, { status: 404 });
        }

        return NextResponse.json(attendanceRecord, { status: 200 });
    } catch (error) {
        await createLog({
            action: 'GET',
            description: formatErrorMessage(error),
            origin: 'attendance/[id]',
            success: false,
        });
        return NextResponse.json({ error: formatErrorMessage(error) }, { status: 500 });
    }
}

// Actualizar un registro de asistencia por ID
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
    const { id } = params;

    try {
        const body = await request.json();

        // Validación de campos requeridos
        const { isValid, message } = validateObject(body, [
            'enrollmentId',
            'date',
            'status',
            'scheduleId',
        ]);

        if (!isValid) {
            return NextResponse.json({ code: 'E_MISSING_FIELDS', error: message }, { status: 400 });
        }

        // Verificar si el curso existe
        const enrollment = await findEnrollmentById(body.enrollmentId);
        if (!enrollment) {
            return NextResponse.json({ code: 'E_COURSE_ENROLLMENT_NOT_FOUND', error: 'Enrollment not found' }, { status: 404 });
        }

        const attendanceRecord = await updateAttendanceRecordById(id, {
            enrollment: { connect: { id: body.enrollmentId } },
            date: new Date(body.date),
            status: body.status,
            schedule: { connect: { id: body.scheduleId } },
        });

        return NextResponse.json(attendanceRecord, { status: 200 });
    } catch (error) {
        await createLog({
            action: 'PUT',
            description: formatErrorMessage(error),
            origin: 'attendance/[id]',
            success: false,
        });
        return NextResponse.json({ error: formatErrorMessage(error) }, { status: 500 });
    }
}

// Eliminar un registro de asistencia por ID
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
    const { id } = params;

    try {
        const attendanceRecord = await findAttendanceRecordById(id);
        if (!attendanceRecord) {
            return NextResponse.json({ code: 'E_ATTENDANCE_NOT_FOUND' }, { status: 404 });
        }

        await deleteAttendanceRecordById(id);

        return NextResponse.json({ message: 'Attendance record deleted successfully' }, { status: 200 });
    } catch (error) {
        await createLog({
            action: 'DELETE',
            description: formatErrorMessage(error),
            origin: 'attendance/[id]',
            success: false,
        });
        return NextResponse.json({ error: formatErrorMessage(error) }, { status: 500 });
    }
}