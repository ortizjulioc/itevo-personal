import { Scholarship } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';
import { validateObject } from '@/utils';

import { formatErrorMessage } from '@/utils/error-to-string';
import { createLog } from '@/utils/log';
import { createStudentScholarship, getStudentsScholarships, isScholarshipAssignedToStudent } from '@/services/studentScholarship-service';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { searchParams } = new URL(request.url);
        const search = searchParams.get('search') || '';
        const page = parseInt(searchParams.get('page') || '1', 10);
        const top = parseInt(searchParams.get('top') || '10', 10);
        const { id } = await params;

        const { studentsScholarships, totalStudentsScholarships } = await getStudentsScholarships(search, page, top, id);

        return NextResponse.json(
            {
                data: studentsScholarships,
                total: totalStudentsScholarships,
            },
            { status: 200 }
        );
    } catch (error) {
        await createLog({
            action: 'GET',
            description: formatErrorMessage(error),
            origin: 'scholarships',
        });
    }
}

//--------------------------------------------------------------------------------
// Crear una nueva beca asignada a un estudiante
export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id: studentId } = await params; // ID del estudiante desde la URL
        const body = await request.json();
        console.log('BODY_POST_SCHOLARSHIP:', body);
        // 1. Validar campos obligatorios
        const { isValid, message } = validateObject(body, ['scholarshipId', 'assignedBy']);
        if (!isValid) {
            return NextResponse.json({ code: 'E_MISSING_FIELDS', message }, { status: 400 });
        }

        // 2. Verificar si ya existe
        const isAssigned = await isScholarshipAssignedToStudent(studentId, body.scholarshipId, body.courseBranchId);
        if (isAssigned) {
            return NextResponse.json(
                {
                    code: 'E_SCHOLARSHIP_ALREADY_ASSIGNED',
                    message: 'El estudiante ya tiene asignada esta beca',
                },
                { status: 400 }
            );
        }

        // 3. Crear el registro usando IDs directos (Modo Unchecked)
        // Esto mapea scholarshipId, assignedBy y courseBranchId automáticamente
        const studentScholarship = await createStudentScholarship({
            ...body,
            studentId: studentId, // Inyectamos el ID de la URL
        });

        await createLog({
            action: 'POST',
            description: `Beca asignada con éxito al estudiante: ${studentId}`,
            origin: 'student-scholarships',
            elementId: studentScholarship.id,
            success: true,
        });


        return NextResponse.json(studentScholarship, { status: 201 });
    } catch (error) {
        console.error('ERROR_POST_SCHOLARSHIP:', error);
        return NextResponse.json({ error: formatErrorMessage(error) }, { status: 500 });
    }
}
//--------------------------------------------------------------------------------
