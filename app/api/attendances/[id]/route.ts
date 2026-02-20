import { NextRequest, NextResponse } from 'next/server';
import { validateObject } from '@/utils';
import { formatErrorMessage } from '@/utils/error-to-string';
import { createLog } from '@/utils/log';
import { Attendance } from '@prisma/client';
import { getAttendanceRecords, createAttendanceRecord, findAttendanceRecordById, updateAttendanceRecordById, deleteAttendanceRecordById } from '@/services/attendance-service';
import { findEnrollmentById } from '@/services/enrollment-service';
import { findCourseBranchById } from '@/services/course-branch-service';


// obtener una asistencia por id
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

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
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    try {
        const body = await request.json();
        console.log('PUT /attendances/[id] body:', body);
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

        // Verificar si la oferta academica existe
        const courseBranch = await findCourseBranchById(body.courseBranchId);
        if (!courseBranch) {
            return NextResponse.json({ code: 'E_COURSE_BRANCH_NOT_FOUND', error: 'Course branch not found' }, { status: 404 });
        }

        const attendanceRecord = await updateAttendanceRecordById(id, {
            courseBranch: { connect: { id: body.courseBranchId } },
            student: { connect: { id: body.studentId } },
            date: new Date(body.date),
            status: body.status,
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
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

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
