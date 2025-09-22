import { NextRequest, NextResponse } from 'next/server';
import { findCourseBranchById, updateCourseBranchById, deleteCourseBranchById } from '@/services/course-branch-service';
import { validateObject } from '@/utils';
import { formatErrorMessage } from '@/utils/error-to-string';
import { createLog } from '@/utils/log';
import { CourseBranchStatus, Modality } from '@prisma/client';
import { COURSE_BRANCH_STATUS } from '@/constants/status.constant';

// Obtener courseBranch por ID
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const { id } = params;

        const courseBranch = await findCourseBranchById(id);

        if (!courseBranch) {
            return NextResponse.json({ code: 'E_COURSE_BRANCH_NOT_FOUND' }, { status: 404 });
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

        if (body.status === COURSE_BRANCH_STATUS.DRAFT) {
            body.status = CourseBranchStatus.WAITING;
        }

        // Validar el cuerpo de la solicitud (usando la validación existente)
        const { isValid, message } = validateObject(body, ['promotionId', 'branchId', 'teacherId', 'courseId']);
        if (!isValid) {
            return NextResponse.json({ code: 'E_MISSING_FIELDS', message }, { status: 400 });
        }

        if (body.startDate && body.endDate && body.startDate > body.endDate) {
            return NextResponse.json({ code: 'E_INVALID_DATE_RANGE'}, { status: 400 });
        }

        // Traer los horarios de los cursos para calcular las sesiones
        // const courseSchedules = await getCourseSchedulesByCourseId(id);
        // if (body.startDate && body.endDate && courseSchedules) {
        //     const holidays = await getAllHolidays();
        //     const { count } = getClassSessions(body.startDate, body.endDate, courseSchedules, holidays);
        //     body.sessionCount = count;
        // }

        // Verificar si el course existe
        const courseBranch = await findCourseBranchById(id);
        if (!courseBranch) {
            return NextResponse.json({ code: 'E_COURSE_NOT_FOUND' }, { status: 404 });
        }

        console.log('CourseBranch body:', body);
        // Actualizar el course
        const updatedCourseBranch = await updateCourseBranchById(id, {
            promotion: { connect: { id: body.promotionId } },
            branch: { connect: { id: body.branchId } },
            teacher: { connect: { id: body.teacherId } },
            course: { connect: { id: body.courseId } },
            amount: body.amount || 0,
            modality: body.modality || Modality.PRESENTIAL,
            startDate: body.startDate ? new Date(body.startDate) : null,
            endDate: body.endDate ? new Date(body.endDate) : null,
            commissionRate: body.commissionRate || 0,
            commissionAmount: body.commissionAmount || 0,
            sessionCount: body.sessionCount || 0,
            capacity: body.capacity || 0,
            status: body.status || CourseBranchStatus.DRAFT,
            enrollmentAmount: body.enrollmentAmount || 0,
        });

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
