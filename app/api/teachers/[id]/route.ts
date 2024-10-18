import { NextRequest, NextResponse } from 'next/server';
import { findTeacherById, updateTeacherById, deleteTeacherById } from '@/services/teacher-service';
import { validateObject } from '@/utils';

// Obtener teacher por ID
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const { id } = params;

        const teacher = await findTeacherById(id);

        if (!teacher) {
            return NextResponse.json({ code: 'E_TEACHER_NOT_FOUND', message: 'Maestro no encontrado' }, { status: 404 });
        }

        return NextResponse.json(teacher);
    } catch (error) {
        if (error instanceof Error) {
            return NextResponse.json({ code: 'E_SERVER_ERROR', message: 'Error buscando el maestro', details: error.message }, { status: 500 });
        } else {
            return NextResponse.json(error, { status: 500 });
        }
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

        return NextResponse.json(updatedTeacher);
    } catch (error) {
        if (error instanceof Error) {
            return NextResponse.json({ code: 'E_SERVER_ERROR', message: 'Error actualizando el curso', details: error.message }, { status: 500 });
        } else {
            return NextResponse.json(error, { status: 500 });
        }
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
        if (error instanceof Error) {
            return NextResponse.json({ code: 'E_SERVER_ERROR', message: 'Error eliminando el maestro', details: error.message }, { status: 500 });
        } else {
            return NextResponse.json(error, { status: 500 });
        }
    }
}
