import { NextRequest, NextResponse } from 'next/server';
import { findCourseBranchById, updateCourseBranchById, deleteCourseBranchById } from '@/services/course-branch-service';
import { validateObject } from '@/utils';
import { formatErrorMessage } from '@/utils/error-to-string';
import { createLog } from '@/utils/log';
import { getClassSessions } from '@/utils/date';
import { getHolidays } from '@/services/holiday-service';
import { getCourseSchedulesByCourseId } from '@/services/course-schedule-service';

// Obtener courseBranch por ID
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const { id } = params;

        const courseBranch = await findCourseBranchById(id);

        if (!courseBranch) {
            return NextResponse.json({ code: 'E_COURSE_BRANCH_NOT_FOUND', message: 'Course branch no encontrado' }, { status: 404 });
        }

        return NextResponse.json(courseBranch, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: formatErrorMessage(error)},{ status: 500});
    }
}

// Actualizar courseBranch por ID
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const { id } = params;
        const body = await request.json();
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1', 10);
        const top = parseInt(searchParams.get('top') || '10', 10);

        // Validar el cuerpo de la solicitud (usando la validación existente)
        const { isValid, message } = validateObject(body, ['promotionId', 'branchId', 'teacherId', 'courseId']);
        if (!isValid) {
            return NextResponse.json({ code: 'E_MISSING_FIELDS', message }, { status: 400 });
        }

        // Traer los horarios de los cursos para calcular las sesiones
        const { courseSchedules } = await getCourseSchedulesByCourseId({ courseId: id});

        // Traer holidays con el api de holidays
        const { holidays } = await getHolidays(page, top, '');

        // Calculando las fechas de las sesiones
        const { startDate, endDate } = body;
        const schedules = courseSchedules.map((schedule: any) => schedule.schedule);

        if (startDate && endDate && schedules && holidays) {
            const { count } = getClassSessions(startDate, endDate, schedules, holidays);

            body.sessionCount = count;
        }

        // Verificar si el course existe
        const courseBranch = await findCourseBranchById(id);
        if (!courseBranch) {
            return NextResponse.json({ code: 'E_COURSE_NOT_FOUND', message: 'Course branch no encontrado' }, { status: 404 });
        }

        // Actualizar el course
        const updatedCourseBranch = await updateCourseBranchById(id, body);

        // Enviar log de auditoría
        await createLog({
            action: "PUT",
            description: `Se actualizó un courseBranch. Información anterior: ${JSON.stringify(courseBranch, null, 2)}. Información actualizada: ${JSON.stringify(updatedCourseBranch, null, 2)}`,
            origin: "course-branch/[id]",
            elementId: id,
            success: true,
        });

        return NextResponse.json(updatedCourseBranch, { status: 200 });
    } catch (error) {
        // Enviar log de auditoría

        await createLog({
            action: "PUT",
            description: `Error al actualizar un courseBranch: ${formatErrorMessage(error)}`,
            origin: "course-branch/[id]",
            elementId: request.headers.get("origin") || "",
            success: false,
        });

        return NextResponse.json({ error: formatErrorMessage(error)},{ status: 500});
    }
}

// Eliminar course por ID (soft delete)
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const { id } = params;

        // Verificar si el rol existe
        const courseBranch = await findCourseBranchById(id);
        if (!courseBranch) {
            return NextResponse.json({ code: 'E_COURSE_NOT_FOUND', message: 'courseBranch no encontrado' }, { status: 404 });
        }

        // Eliminar el courseBranch
        await deleteCourseBranchById(id);

        // Enviar log de auditoría

        await createLog({
            action: "DELETE",
            description: `Se eliminó un courseBranch con los siguientes datos: ${JSON.stringify(courseBranch, null, 2)}`,
            origin: "course-branch/[id]",
            elementId: id,
            success: true,
        });

        return NextResponse.json({ message: 'courseBranch eliminado correctamente' });
    } catch (error) {

        // Enviar log de auditoría

        await createLog({
            action: "DELETE",
            description: `Error al eliminar un courseBranch: ${formatErrorMessage(error)}`,
            origin: "course-branch/[id]",
            elementId: request.headers.get("origin") || "",
            success: false,
        });

        return NextResponse.json({ error: formatErrorMessage(error)},{ status: 500});
    }
}
