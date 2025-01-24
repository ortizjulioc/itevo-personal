import { NextRequest, NextResponse } from 'next/server';
import { findEnrollmentById, updateEnrollmentById, deleteEnrollmentById } from '@/services/enrollment-service';
import { validateObject } from '@/utils';
import { formatErrorMessage } from '@/utils/error-to-string';

// Obtener enrollment por ID
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const { id } = params;

        const enrollment = await findEnrollmentById(id);

        if (!enrollment) {
            return NextResponse.json({ code: 'E_COURSE_ENROLLMENT_NOT_FOUND', message: 'enrollment no encontrado' }, { status: 404 });
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
            return NextResponse.json({ code: 'E_MISSING_FIELDS', message }, { status: 400 });
        }

        // Verificar si el enrollment existe
        const enrollment = await findEnrollmentById(id);
        if (!enrollment) {
            return NextResponse.json({ code: 'E_ENROLLMENT_NOT_FOUND', message: 'enrollment no encontrado' }, { status: 404 });
        }

        // Actualizar el enrollment
        const updatedEnrollment = await updateEnrollmentById(id, body);

        return NextResponse.json(updatedEnrollment, { status: 200 });
    } catch (error) {
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
            return NextResponse.json({ code: 'E_ENROLLMENT_NOT_FOUND', message: 'Enrollment no encontrado' }, { status: 404 });
        }

        // Eliminar el enrollment
        await deleteEnrollmentById(id);

        return NextResponse.json({ message: 'Enrollment eliminado correctamente' });
    } catch (error) {
        return NextResponse.json({ error: formatErrorMessage(error)},{ status: 500});
    }
}
