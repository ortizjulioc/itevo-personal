import { NextRequest, NextResponse } from 'next/server';
import { findEnrollmentById, updateEnrollmentById, deleteEnrollmentById } from '@/services/enrollment-service';
import { validateObject } from '@/utils';
import { formatErrorMessage } from '@/utils/error-to-string';
import { createLog } from '@/utils/log';
import { generateEnrollmentReceivables } from '@/services/account-receivable';
import { EnrollmentStatus } from '@/generated/prisma/client';
import { Prisma } from '@/utils/lib/prisma';
// Obtener enrollment por ID
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;

        const enrollment = await findEnrollmentById(id);

        if (!enrollment) {
            return NextResponse.json({ code: 'E_COURSE_ENROLLMENT_NOT_FOUND' }, { status: 404 });
        }

        return NextResponse.json(enrollment, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: formatErrorMessage(error) }, { status: 500 });
    }
}

// Actualizar enrollment por ID
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const body = await request.json();

        // Solo validar si los campos están presentes (permitir actualizaciones parciales)
        if (body.studentId === '' || body.courseBranchId === '' || body.status === '') {
            return NextResponse.json({ code: 'E_COURSE_ENROLLMENT_INVALID', message: 'Los campos proporcionados no pueden estar vacíos' }, { status: 400 });
        }

        // Verificar si el enrollment existe
        const enrollment = await findEnrollmentById(id);
        if (!enrollment) {
            return NextResponse.json({ code: 'E_COURSE_ENROLLMENT_NOT_FOUND' }, { status: 404 });
        }

        const previousStatus = enrollment.status;

        const updatedEnrollment = await updateEnrollmentById(id, body);

        // Generar cuentas por cobrar si el estado cambia a CONFIRMED o ENROLLED
        let receivables: any[] = [];
        if ((body.status === EnrollmentStatus.ENROLLED || body.status === EnrollmentStatus.CONFIRMED) && previousStatus !== body.status) {
            receivables = await generateEnrollmentReceivables(id, body.status, Prisma);
        }

        await createLog({
            action: 'PUT',
            description: `Actualización de inscripción.\nDatos anteriores: ${JSON.stringify(enrollment, null, 2)}\nDatos actualizados: ${JSON.stringify(updatedEnrollment, null, 2)}`,
            origin: 'enrollments/[id]',
            elementId: id,
            success: true,
        });

        if (receivables.length > 0) {
            await createLog({
                action: 'POST',
                description: `Generación automática de cuentas por cobrar por cambio de estado a ${body.status}.\nDetalle: ${JSON.stringify(receivables, null, 2)}`,
                origin: 'enrollments/[id]',
                elementId: id,
                success: true,
            });
        }

        return NextResponse.json({ ...updatedEnrollment, receivables }, { status: 200 });
    } catch (error) {
        // Enviar log de auditoría

        await createLog({
            action: 'PUT',
            description: `Error al actualizar un enrollment: ${formatErrorMessage(error)}`,
            origin: 'enrollments/[id]',
            elementId: request.headers.get('origin') || '',
            success: false,
        });

        return NextResponse.json({ error: formatErrorMessage(error) }, { status: 500 });
    }
}

// Eliminar enrollment por ID (soft delete)
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;

        // Verificar si el rol existe
        const enrollment = await findEnrollmentById(id);
        if (!enrollment) {
            return NextResponse.json({ code: 'E_COURSE_ENROLLMENT_NOT_FOUND' }, { status: 404 });
        }

        // Eliminar el enrollment
        await deleteEnrollmentById(id);

        // Enviar log de auditoría

        await createLog({
            action: 'DELETE',
            description: `Eliminación de inscripción.\nDatos eliminados: ${JSON.stringify(enrollment, null, 2)}`,
            origin: 'enrollments/[id]',
            elementId: id,
            success: true,
        });

        return NextResponse.json({ message: 'Enrollment eliminado correctamente' });
    } catch (error) {
        // Enviar log de auditoría

        await createLog({
            action: 'DELETE',
            description: `Error al eliminar un enrollment: ${formatErrorMessage(error)}`,
            origin: 'enrollments/[id]',
            elementId: request.headers.get('origin') || '',
            success: false,
        });

        return NextResponse.json({ error: formatErrorMessage(error) }, { status: 500 });
    }
}
