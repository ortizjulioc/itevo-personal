import { NextRequest, NextResponse } from 'next/server';
import { validateObject } from '@/utils';
import { formatErrorMessage } from '@/utils/error-to-string';
import { createLog } from '@/utils/log';
import { Attendance } from '@prisma/client';
import { getAttendanceRecords, createAttendanceRecord, findAttendanceRecordById, updateAttendanceRecordById, deleteAttendanceRecordById } from '@/services/attendance-service';
import { findEnrollmentById } from '@/services/enrollment-service';

//obtener todos los registros de asistencia con búsqueda y paginación
export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const page = parseInt(searchParams.get('page') || '1', 10);
    const top = parseInt(searchParams.get('top') || '10', 10);
    
    try {
        const { attendanceRecords, totalAttendanceRecords } = await getAttendanceRecords(search, page, top);
        return NextResponse.json({
            attendanceRecords,
            totalAttendanceRecords,
        }, { status: 200 });
    } catch (error) {
        await createLog({
            action: 'GET',
            description: formatErrorMessage(error),
            origin: 'attendance',
            success: false,
        });
        return NextResponse.json({ error: formatErrorMessage(error) }, { status: 500 });
    }
    
}

// Crear un nuevo registro de asistencia
export async function POST(request: NextRequest) {
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
       const enrollment = await findEnrollmentById(body.enrollmentId)
       if (!enrollment) {
           return NextResponse.json({ code: 'E_COURSE_ENROLLMENT_NOT_FOUND', error: 'Enrollment not found' }, { status: 404 });
       }

        console.log('FECHA:',new Date(body.date));
        const attendanceRecord = await createAttendanceRecord({
            enrollment: body.enrollmentId,
            date: new Date(body.date),
            status: body.status,
            schedule: body.scheduleId,
        });
        console.log('FECHA:', attendanceRecord.date);               

        return NextResponse.json(attendanceRecord, { status: 201 });
    } catch (error) {
        await createLog({
            action: 'POST',
            description: formatErrorMessage(error),
            origin: 'attendance',
            success: false,
        });
        return NextResponse.json({ error: formatErrorMessage(error) }, { status: 500 });
    }
}