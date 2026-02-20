import { NextRequest, NextResponse } from 'next/server';
import { findCourseById, updateCourseById, deleteCourseById } from '@/services/course-service';
import { validateObject } from '@/utils';
import { formatErrorMessage } from '@/utils/error-to-string';
import { createLog } from '@/utils/log';

// Obtener role por ID
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;

        const course = await findCourseById(id);

        if (!course) {
            return NextResponse.json({ code: 'E_COURSE_NOT_FOUND', message: 'Curso no encontrado' }, { status: 404 });
        }

        return NextResponse.json(course, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: formatErrorMessage(error)},{ status: 500});
    }
}

// Actualizar course por ID
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const body = await request.json();

        // Validar el cuerpo de la solicitud (usando la validación existente)
        const { isValid, message } = validateObject(body, ['name', 'code']);
        if (!isValid) {
            return NextResponse.json({ code: 'E_MISSING_FIELDS', message }, { status: 400 });
        }

        // Verificar si el course existe
        const course = await findCourseById(id);
        if (!course) {
            return NextResponse.json({ code: 'E_COURSE_NOT_FOUND', message: 'Course no encontrado' }, { status: 404 });
        }

        // Actualizar el course
        const updatedCourse = await updateCourseById(id, body);

        // Enviar log de auditoría

        await createLog({
            action: "PUT",
            description: `Se actualizó un course. Información anterior: ${JSON.stringify(course, null, 2)}. Información actualizada: ${JSON.stringify(updatedCourse, null, 2)}`,
            origin: "courses/[id]",
            elementId: id,
            success: true,
        });

        return NextResponse.json(updatedCourse, { status: 200 });
    } catch (error) {
        // Enviar log de auditoría

        await createLog({
            action: "PUT",
            description: `Error al actualizar un course: ${formatErrorMessage(error)}`,
            origin: "courses/[id]",
            elementId: request.headers.get("origin") || "",
            success: false,
        });
        return NextResponse.json({ error: formatErrorMessage(error)},{ status: 500});
    }
}

// Eliminar course por ID (soft delete)
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;

        // Verificar si el rol existe
        const course = await findCourseById(id);
        if (!course) {
            return NextResponse.json({ code: 'E_COURSE_NOT_FOUND', message: 'Course no encontrado' }, { status: 404 });
        }

        // Eliminar el rol
        await deleteCourseById(id);

        // Enviar log de auditoría

        await createLog({
            action: "DELETE",
            description: `Se eliminó un course con los siguientes datos: ${JSON.stringify(course, null, 2)}`,
            origin: "courses/[id]",
            elementId: id,
            success: true,
        });

        return NextResponse.json({ message: 'course eliminado correctamente' });
    } catch (error) {

        // Enviar log de auditoría

        await createLog({
            action: "DELETE",
            description: `Error al eliminar un course: ${formatErrorMessage(error)}`,
            origin: "courses/[id]",
            elementId: request.headers.get("origin") || "",
            success: false,
        });

        return NextResponse.json({ error: formatErrorMessage(error)},{ status: 500});
    }
}
