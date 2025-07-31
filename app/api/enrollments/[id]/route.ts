import { NextRequest, NextResponse } from 'next/server';
import { findEnrollmentById, updateEnrollmentById, deleteEnrollmentById } from '@/services/enrollment-service';
import { validateObject } from '@/utils';
import { formatErrorMessage } from '@/utils/error-to-string';
import { createLog } from '@/utils/log';
import { getCourseBranch } from '@/services/course-branch-service';

// Obtener enrollment por ID
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const { id } = params;

        const enrollment = await findEnrollmentById(id);

        if (!enrollment) {
            return NextResponse.json({ code: 'E_COURSE_ENROLLMENT_NOT_FOUND'}, { status: 404 });
        }

        return NextResponse.json(enrollment, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: formatErrorMessage(error)},{ status: 500});
    }
}

// Actualizar enrollment por ID
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const { id } = params;
        const body = await request.json();

        // Validar el cuerpo de la solicitud (usando la validación existente)
        const { isValid, message } = validateObject(body, ['studentId', 'courseBranchId', 'enrollmentDate', 'status']);
        if (!isValid) {
            return NextResponse.json({ code: 'E_COURSE_ENROLLMENT_NOT_FOUND', message }, { status: 400 });
        }

        // Verificar si el enrollment existe
        const enrollment = await findEnrollmentById(id);
        if (!enrollment) {
            return NextResponse.json({ code: 'E_COURSE_ENROLLMENT_NOT_FOUND'}, { status: 404 });
        }

        const updatedEnrollment = await updateEnrollmentById(id, body);
        await createLog({
            action: "PUT",
            description: `Se actualizó un enrollment. Información anterior: ${JSON.stringify(enrollment, null, 2)}. Información actualizada: ${JSON.stringify(updatedEnrollment, null, 2)}`,
            origin: "enrollments/[id]",
            elementId: id,
            success: true,
        });

        return NextResponse.json(updatedEnrollment, { status: 200 });
    } catch (error) {

        // Enviar log de auditoría

        await createLog({
            action: "PUT",
            description: `Error al actualizar un enrollment: ${formatErrorMessage(error)}`,
            origin: "enrollments/[id]",
            elementId: request.headers.get("origin") || "",
            success: false,
        });

        return NextResponse.json({ error: formatErrorMessage(error)},{ status: 500});
    }
}

// Eliminar enrollment por ID (soft delete)
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const { id } = params;

        // Verificar si el rol existe
        const enrollment = await findEnrollmentById(id);
        if (!enrollment) {
            return NextResponse.json({ code: 'E_COURSE_ENROLLMENT_NOT_FOUND' }, { status: 404 });
        }

        // Eliminar el enrollment
        await deleteEnrollmentById(id);

        // Enviar log de auditoría

        await createLog({
            action: "DELETE",
            description: `Se eliminó un enrollment con los siguientes datos: ${JSON.stringify(enrollment, null, 2)}`,
            origin: "enrollments/[id]",
            elementId: id,
            success: true,
        });

        return NextResponse.json({ message: 'Enrollment eliminado correctamente' });
    } catch (error) {

        // Enviar log de auditoría

        await createLog({
            action: "DELETE",
            description: `Error al eliminar un enrollment: ${formatErrorMessage(error)}`,
            origin: "enrollments/[id]",
            elementId: request.headers.get("origin") || "",
            success: false,
        });

        return NextResponse.json({ error: formatErrorMessage(error)},{ status: 500});
    }
}
