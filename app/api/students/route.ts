import { NextResponse, NextRequest } from "next/server";
import { validateObject } from "@/utils";
import { getStudents, createStudent, findStudentByCode } from '@/services/student-service';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const search = searchParams.get('search') || '';
        const page = parseInt(searchParams.get('page') || '1', 10);
        const top = parseInt(searchParams.get('top') || '10', 10);

        const { students, totalStudents } = await getStudents(search, page, top);

        return NextResponse.json({
            students,
            totalStudents,
        }, { status: 200 });
    } catch (error) {
        if (error instanceof Error) {
            return NextResponse.json({ error: 'Error obteniendo los estudiantes', details: error.message }, { status: 500 });
        } else {
            return NextResponse.json(error, { status: 500 });
        }
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        console.log('BODY: ',body);

        // Validate the request body
        const {isValid, message} = validateObject(body, ["code", "firstName", "lastName", "identification"]);
        if (!isValid) {
            return NextResponse.json({ code: 'E_MISSING_FIELDS', error: message }, { status: 400 });
        }


        const studentCodeExists = await findStudentByCode(body);
        if (studentCodeExists) {
            return NextResponse.json({ error: 'Este estudiante ya está registrado' }, { status: 400 });
        }
        const student = await createStudent(body);
        return NextResponse.json(student, { status: 201 });
    } catch (error) {
        if (error instanceof Error) {
            console.log('ERROR: ',error);
            return NextResponse.json({ error: 'Error creando estudiante', details: error.message }, { status: 500 });
        } else {
            return NextResponse.json(error, { status: 500 });
        }
    }
}
