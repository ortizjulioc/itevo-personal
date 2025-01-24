import { NextRequest, NextResponse } from 'next/server';
import { findTeacherById, updateTeacherById, deleteTeacherById } from '@/services/teacher-service';
import { validateObject } from '@/utils';
import { formatErrorMessage } from '@/utils/error-to-string';

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

        return NextResponse.json(updatedTeacher, { status: 200 });
    } catch (error) {
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

        return NextResponse.json({ message: 'Maestro eliminado correctamente' });
    } catch (error) {
        return NextResponse.json({ error: formatErrorMessage(error)},{ status: 500});
    }
}
