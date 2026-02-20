import { NextRequest, NextResponse } from 'next/server';
import {
    findStudentById,
    updateStudentById,
    deleteStudentById,
    findStudentByEmail,
    addFingerprintToStudent,
    findFingerprintByStudentId,
    deleteFingerprintByStudentId,
} from '@/services/student-service';
import { base64ToUint8Array, validateObject } from '@/utils';
import { formatErrorMessage } from '@/utils/error-to-string';
import { createLog } from '@/utils/log';
import { Prisma } from '@/utils/lib/prisma';
import { IdentificationType } from '@prisma/client';

// Obtener estudiante por ID
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;

        const student = await findStudentById(id);

        if (!student) {
            return NextResponse.json({ code: 'E_STUDENT_NOT_FOUND' }, { status: 404 });
        }

        return NextResponse.json(student, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: formatErrorMessage(error) }, { status: 500 });
    }
}

// Actualizar estudiante por ID
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    try {
        const body = await request.json();

        // Validar el cuerpo de la solicitud (usando la validación existente)
        const { isValid, message } = validateObject(body, ['firstName', 'lastName']);
        if (!isValid) {
            return NextResponse.json({ code: 'E_MISSING_FIELDS', message }, { status: 400 });
        }

        // Verificar si el estudiante existe
        const student = await findStudentById(id);
        if (!student) {
            return NextResponse.json({ code: 'E_STUDENT_NOT_FOUND' }, { status: 404 });
        }

        if (body.email && body.email !== student.email) {
            // Validar que no se repita el email
            const existingStudent = await findStudentByEmail(body.email);
            if (existingStudent) {
                return NextResponse.json({ code: 'E_EMAIL_EXISTS', error: 'El email ya está en uso por otro estudiante.' }, { status: 400 });
            }
        }

        const updatedStudent = await Prisma.$transaction(async (prisma) => {
            // Actualizar el estudiante
            const updatedStudent = await updateStudentById(
                id,
                {
                    firstName: body.firstName.trim(),
                    lastName: body.lastName.trim(),
                    email: body.email.trim(),
                    identification: body.identification.trim(),
                    address: body.address.trim(),
                    phone: body.phone.trim(),
                    hasTakenCourses: body.hasTakenCourses,
                    branch: { connect: { id: body.branchId } },
                    identificationType: body.identificationType || IdentificationType.CEDULA,
                },
                prisma
            );
            if (body.fingerprint) {
                // Eliminar huella dactilar existente si existe
                const existingFingerprint = await findFingerprintByStudentId(id);
                if (existingFingerprint) {
                    await deleteFingerprintByStudentId(id);
                }
                // Actualizar la huella dactilar si se proporciona
                await addFingerprintToStudent(
                    id,
                    {
                        template: base64ToUint8Array(body.fingerprint),
                        sensorType: body.sensorType,
                    },
                    prisma
                );
            }

            return updatedStudent;
        });

        // Enviar log de auditoría

        await createLog({
            action: 'PUT',
            description: `Se actualizó un estudiante. Información anterior: ${JSON.stringify(student, null, 2)}. Información actualizada: ${JSON.stringify(updatedStudent, null, 2)}`,
            origin: 'students/[id]',
            elementId: id,
            success: true,
        });

        return NextResponse.json(updatedStudent, { status: 200 });
    } catch (error) {
        // Enviar log de auditoría

        await createLog({
            action: 'PUT',
            description: `Error actualizando un estudiante. ${formatErrorMessage(error)}`,
            origin: 'students/[id]',
            elementId: id,
            success: false,
        });

        return NextResponse.json({ error: formatErrorMessage(error) }, { status: 500 });
    }
}

// Eliminar teacher por ID (soft delete)
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    try {

        // Verificar si el teacher existe
        const student = await findStudentById(id);
        if (!student) {
            return NextResponse.json({ code: 'E_STUDENT_NOT_FOUND' }, { status: 404 });
        }

        // Eliminar el estudiante
        await deleteStudentById(id);

        // Enviar log de auditoría

        await createLog({
            action: 'DELETE',
            description: `Se eliminó un estudiante. Información: ${JSON.stringify(student, null, 2)}`,
            origin: 'students/[id]',
            elementId: id,
            success: true,
        });

        return NextResponse.json({ message: 'Estudiante eliminado correctamente' });
    } catch (error) {
        // Enviar log de auditoría

        await createLog({
            action: 'DELETE',
            description: `Error al eliminar un estudiante. ${formatErrorMessage(error)}`,
            origin: 'students/[id]',
            elementId: id,
            success: false,
        });

        return NextResponse.json({ error: formatErrorMessage(error) }, { status: 500 });
    }
}
