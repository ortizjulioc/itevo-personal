import { NextRequest, NextResponse } from 'next/server';
import { validateObject } from '@/utils';
import { formatErrorMessage } from '@/utils/error-to-string';
import { createLog } from '@/utils/log';
import { getAttendanceRecords, createAttendanceRecord, findAttendanceRecordById, updateAttendanceRecordById, deleteAttendanceRecordById } from '@/services/attendance-service';
import { findEnrollmentById } from '@/services/enrollment-service';
import { findCourseBranchById } from '@/services/course-branch-service';
//obtener todos los registros de asistencia con búsqueda y paginación
export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const top = parseInt(searchParams.get('top') || '10', 10);
    const courseBranchId = searchParams.get('courseBranchId') || undefined;
    const studentId = searchParams.get('studentId') || undefined;
    const date = searchParams.get('date') || undefined;

    const filter = {
        courseBranchId,
        studentId,
        date: date ? new Date(date) : undefined,
    };

    try {
        const { attendanceRecords, totalAttendanceRecords } = await getAttendanceRecords(filter, page, top);
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
            'courseBranchId',
            'studentId',
            'status',
            'date',
        ]);



        if (!isValid) {
            return NextResponse.json({ code: 'E_MISSING_FIELDS', error: message }, { status: 400 });
        }

        // Verificar si el curso existe
       const courseBranch = await findCourseBranchById(body.courseBranchId);
       if (!courseBranch) {
         return NextResponse.json({ code: 'E_COURSE_BRANCH_NOT_FOUND', error: 'Course branch not found' }, { status: 404 });
       }

        const attendanceRecord = await createAttendanceRecord({
            courseBranch: body.courseBranchId,
            date: new Date(body.date),
            student: body.studentId,
            status: body.status,
        });

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
