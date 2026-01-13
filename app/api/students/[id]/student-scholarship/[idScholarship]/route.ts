import { NextRequest, NextResponse } from 'next/server';
import { validateObject } from '@/utils';

import { formatErrorMessage } from '@/utils/error-to-string';
import { createLog } from '@/utils/log';

import { findStudentScholarshipById, updateStudentScholarshipById, deleteStudentScholarshipById } from '@/services/studentScholarship-service';

export async function DELETE(request: NextRequest, { params }: { params: { id: string; idScholarship: string } }) {
    try {
        const { idScholarship } = params;

        const deletedStudentScholarship = await deleteStudentScholarshipById(idScholarship);
        console.log(idScholarship);
        await createLog({
            action: 'DELETE',
            description: `Se eliminó la beca asignada al estudiante con la siguiente información: \n${JSON.stringify(deletedStudentScholarship, null, 2)}`,
            origin: 'student-scholarships',
            elementId: deletedStudentScholarship.id,
            success: true,
        });
        return NextResponse.json(deletedStudentScholarship, { status: 200 });
    } catch (error) {
        console.log(error);
        await createLog({
            action: 'DELETE',
            description: formatErrorMessage(error),
            origin: 'student-scholarships',
            success: false,
        });
        return NextResponse.json({ error: formatErrorMessage(error) }, { status: 500 });
    }
}

//--------------------------------------------------------------------------------
// Actualizar una beca asignada a un estudiante por ID
export async function PUT(request: NextRequest, { params }: { params: { id: string; idScholarship: string } }) {
    try {
        const { idScholarship } = params;
        const body = await request.json();

        // Validar el cuerpo de la solicitud
        validateObject(body, ['scholarshipId']);

        const updatedStudentScholarship = await updateStudentScholarshipById(idScholarship, body);
        await createLog({
            action: 'PUT',
            description: `Se actualizó la beca asignada al estudiante con la siguiente información: \n${JSON.stringify(updatedStudentScholarship, null, 2)}`,
            origin: 'student-scholarships',
            elementId: updatedStudentScholarship.id,
            success: true,
        });
        return NextResponse.json(updatedStudentScholarship, { status: 200 });
    } catch (error) {
        console.log(error);
        await createLog({
            action: 'PUT',
            description: formatErrorMessage(error),
            origin: 'student-scholarships',
            success: false,
        });
        return NextResponse.json({ error: formatErrorMessage(error) }, { status: 500 });
    }
}

//--------------------------------------------------------------------------------
// Obtener una beca asignada a un estudiante por ID
export async function GET(request: NextRequest, { params }: { params: { id: string; idScholarship: string } }) {
    try {
        const { idScholarship } = params;

        const studentScholarship = await findStudentScholarshipById(idScholarship);
        return NextResponse.json(studentScholarship, { status: 200 });
    } catch (error) {
        console.log(error);
        await createLog({
            action: 'GET',
            description: formatErrorMessage(error),
            origin: 'student-scholarships',
        });
        return NextResponse.json({ error: formatErrorMessage(error) }, { status: 500 });
    }
}
