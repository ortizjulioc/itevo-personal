import { NextRequest, NextResponse } from 'next/server';
import { findCourseById, updateCourseById, deleteCourseById, addPrerequisite } from '@/services/course-service';
import { validateObject } from '@/utils';
import { formatErrorMessage } from '@/utils/error-to-string';

// Obtener role por ID
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const { id } = params;

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
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const { id } = params;
        const body = await request.json();

        // Validar el cuerpo de la solicitud (usando la validación existente)
        const { isValid, message } = validateObject(body, ['name', 'code', 'description']);
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

        return NextResponse.json(updatedCourse, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: formatErrorMessage(error)},{ status: 500});
    }
}

// Eliminar course por ID (soft delete)
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const { id } = params;

        // Verificar si el rol existe
        const course = await findCourseById(id);
        if (!course) {
            return NextResponse.json({ code: 'E_COURSE_NOT_FOUND', message: 'Course no encontrado' }, { status: 404 });
        }

        // Eliminar el rol
        await deleteCourseById(id);

        return NextResponse.json({ message: 'course eliminado correctamente' });
    } catch (error) {
        return NextResponse.json({ error: formatErrorMessage(error)},{ status: 500});
    }
}
