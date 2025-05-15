import { NextRequest, NextResponse } from 'next/server';
import { findStudentById, updateStudentById, deleteStudentById } from '@/services/student-service';
import { validateObject } from '@/utils';
import { formatErrorMessage } from '@/utils/error-to-string';
import { createLog } from '@/utils/log';

// Obtener estudiante por ID
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const { id } = params;

        const student = await findStudentById(id);

        if (!student) {
            return NextResponse.json({ code: 'E_STUDENT_NOT_FOUND' }, { status: 404 });
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
            return NextResponse.json({ code: 'E_STUDENT_NOT_FOUND' }, { status: 404 });
        }

        // Actualizar el estudiante
        const updatedStudent = await updateStudentById(id, body);

        // Enviar log de auditoría

        await createLog({
            action: "PUT",
            description: `Se actualizó un estudiante. Información anterior: ${JSON.stringify(student, null, 2)}. Información actualizada: ${JSON.stringify(updatedStudent, null, 2)}`,
            origin: "students/[id]",
            elementId: id,
            success: true,
        });

        return NextResponse.json(updatedStudent, { status: 200 });
    } catch (error) {

        // Enviar log de auditoría

        await createLog({
            action: "PUT",
            description: `Error actualizando un estudiante. ${formatErrorMessage(error)}`,
            origin: "students/[id]",
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
        const student = await findStudentById(id);
        if (!student) {
            return NextResponse.json({ code: 'E_STUDENT_NOT_FOUND' }, { status: 404 });
        }

        // Eliminar el estudiante
        await deleteStudentById(id);

        // Enviar log de auditoría

        await createLog({
            action: "DELETE",
            description: `Se eliminó un estudiante. Información: ${JSON.stringify(student, null, 2)}`,
            origin: "students/[id]",
            elementId: id,
            success: true,
        });

        return NextResponse.json({ message: 'Estudiante eliminado correctamente' });
    } catch (error) {

        // Enviar log de auditoría

        await createLog({
            action: "DELETE",
            description: `Error al eliminar un estudiante. ${formatErrorMessage(error)}`,
            origin: "students/[id]",
            elementId: params.id,
            success: false,
        });

        return NextResponse.json({ error: formatErrorMessage(error)},{ status: 500});
    }
}
