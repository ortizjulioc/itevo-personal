import { NextRequest, NextResponse } from 'next/server';
import { validateObject } from '@/utils';

import { formatErrorMessage } from '@/utils/error-to-string';
import { createLog } from '@/utils/log';
import { createStudentScholarship, getStudentsScholarships } from '@/services/studentScholarship-service';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const { searchParams } = new URL(request.url);
        const search = searchParams.get('search') || '';
        const page = parseInt(searchParams.get('page') || '1', 10);
        const top = parseInt(searchParams.get('top') || '10', 10);
        const { id } = params;

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
export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const { id } = params;
        const body = await request.json();

        // Validar el cuerpo de la solicitud
        const { isValid, message } = validateObject(body, ['scholarshipId']);
        if (!isValid) {
            return NextResponse.json({ code: 'E_MISSING_FIELDS', message }, { status: 400 });
        }

        // Agregar el studentId al cuerpo de la solicitud
        body.studentId = id;

        const studentScholarship = await createStudentScholarship(body);
        await createLog({
            action: 'POST',
            description: `Se creó la beca asignada al estudiante con la siguiente información: \n${JSON.stringify(studentScholarship, null, 2)}`,
            origin: 'student-scholarships',
            elementId: studentScholarship.id,
            success: true,
        });
        return NextResponse.json(studentScholarship, { status: 201 });
    } catch (error) {
        console.log(error);
        await createLog({
            action: 'POST',
            description: formatErrorMessage(error),
            origin: 'student-scholarships',
            success: false,
        });
        return NextResponse.json({ error: formatErrorMessage(error) }, { status: 500 });
    }
}
