import { NextRequest, NextResponse } from 'next/server';
import { findStudentById, updateStudentById, deleteStudentById } from '@/services/student-service';
import { validateObject } from '@/utils';
import { formatErrorMessage } from '@/utils/error-to-string';

// Obtener estudiante por ID
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const { id } = params;

        const student = await findStudentById(id);

        if (!student) {
            return NextResponse.json({ code: 'E_STUDENT_NOT_FOUND', message: 'Estudiante no encontrado' }, { status: 404 });
        }

        return NextResponse.json(student, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: formatErrorMessage(error)},{ status: 500});
    }
}

// Actualizar estudiante por ID
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const { id } = params;
        const body = await request.json();

        // Validar el cuerpo de la solicitud (usando la validación existente)
        const { isValid, message } = validateObject(body, ['firstName', 'lastName', 'identification']);
        if (!isValid) {
            return NextResponse.json({ code: 'E_MISSING_FIELDS', message }, { status: 400 });
        }

        // Verificar si el estudiante existe
        const student = await findStudentById(id);
        if (!student) {
            return NextResponse.json({ code: 'E_STUDENT_NOT_FOUND', message: 'Estudiante no encontrado' }, { status: 404 });
        }

        // Actualizar el estudiante
        const updatedStudent = await updateStudentById(id, body);

        return NextResponse.json(updatedStudent, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: formatErrorMessage(error)},{ status: 500});
    }
}

// Eliminar teacher por ID (soft delete)
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const { id } = params;

        // Verificar si el teacher existe
        const student = await findStudentById(id);
        if (!student) {
            return NextResponse.json({ code: 'E_STUDENT_NOT_FOUND', message: 'Estudiante no encontrado' }, { status: 404 });
        }

        // Eliminar el estudiante
        await deleteStudentById(id);

        return NextResponse.json({ message: 'Estudiante eliminado correctamente' });
    } catch (error) {
        return NextResponse.json({ error: formatErrorMessage(error)},{ status: 500});
    }
}
