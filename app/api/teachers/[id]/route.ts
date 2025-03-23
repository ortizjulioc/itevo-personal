import { NextRequest, NextResponse } from 'next/server';
import { findTeacherById, updateTeacherById, deleteTeacherById } from '@/services/teacher-service';
import { validateObject } from '@/utils';
import { formatErrorMessage } from '@/utils/error-to-string';
import { createLog } from '@/utils/log';

// Obtener teacher por ID
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const { id } = params;

        const teacher = await findTeacherById(id);

        if (!teacher) {
            return NextResponse.json({ code: 'E_TEACHER_NOT_FOUND', message: 'Maestro no encontrado' }, { status: 404 });
        }

        return NextResponse.json(teacher, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: formatErrorMessage(error)},{ status: 500});
    }
}

// Actualizar maestro por ID
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const { id } = params;
        const body = await request.json();

        // Validar el cuerpo de la solicitud (usando la validación existente)
        const { isValid, message } = validateObject(body, ['firstName', 'lastName', 'identification']);
        if (!isValid) {
            return NextResponse.json({ code: 'E_MISSING_FIELDS', message }, { status: 400 });
        }

        // Verificar si el maestro existe
        const teacher = await findTeacherById(id);
        if (!teacher) {
            return NextResponse.json({ code: 'E_TEACHER_NOT_FOUND', message: 'Maestro no encontrado' }, { status: 404 });
        }

        // Actualizar el TEACHER
        const updatedTeacher = await updateTeacherById(id, body);

        // Enviar log de auditoría

        await createLog({
            action: "PUT",
            description: `Se actualizó un maestro. Información anterior: ${JSON.stringify(teacher, null, 2)}. Información actualizada: ${JSON.stringify(updatedTeacher, null, 2)}`,
            origin: "teachers/[id]",
            elementId: id,
            success: true,
        });

        return NextResponse.json(updatedTeacher, { status: 200 });
    } catch (error) {

        // Enviar log de auditoría

        await createLog({
            action: "PUT",
            description: `Error al actualizar un maestro. ${formatErrorMessage(error)}`,
            origin: "teachers/[id]",
            elementId: params.id,
            success: false,
        });

        return NextResponse.json({ error: formatErrorMessage(error)},{ status: 500});
    }
}

// Eliminar teacher por ID (soft delete)
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const { id } = params;

        // Verificar si el teacher existe
        const teacher = await findTeacherById(id);
        if (!teacher) {
            return NextResponse.json({ code: 'E_TEACHER_NOT_FOUND', message: 'Maestro no encontrado' }, { status: 404 });
        }

        // Eliminar el teacher
        await deleteTeacherById(id);

        // Enviar log de auditoría

        await createLog({
            action: "DELETE",
            description: `Se eliminó un maestro. Información: ${JSON.stringify(teacher, null, 2)}`,
            origin: "teachers/[id]",
            elementId: id,
            success: true,
        });

        return NextResponse.json({ message: 'Maestro eliminado correctamente' });
    } catch (error) {

        // Enviar log de auditoría

        await createLog({
            action: "DELETE",
            description: `Error al eliminar un maestro: ${formatErrorMessage(error)}`,
            origin: "teachers/[id]",
            elementId: request.headers.get("origin") || "",
            success: false,
        });

        return NextResponse.json({ error: formatErrorMessage(error)},{ status: 500});
    }
}
