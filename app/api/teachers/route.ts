import { NextResponse, NextRequest } from "next/server";
import { validateObject } from "@/utils";
import { getTeachers, createTeacher, findTeacherByCode } from '@/services/teacher-service';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const search = searchParams.get('search') || '';
        const page = parseInt(searchParams.get('page') || '1', 10);
        const top = parseInt(searchParams.get('top') || '10', 10);

        const { teachers, totalTeachers } = await getTeachers(search, page, top);

        return NextResponse.json({
            teachers,
            totalTeachers,
        }, { status: 200 });
    } catch (error) {
        if (error instanceof Error) {
            return NextResponse.json({ error: 'Error obteniendo los maestros', details: error.message }, { status: 500 });
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


        const teacherCodeExists = await findTeacherByCode(body);
        if (teacherCodeExists) {
            return NextResponse.json({ error: 'Este maestro ya está registrado' }, { status: 400 });
        }
        const teacher = await createTeacher(body);
        return NextResponse.json(teacher, { status: 201 });
    } catch (error) {
        if (error instanceof Error) {
            console.log('ERROR: ',error);
            return NextResponse.json({ error: 'Error creando maestro', details: error.message }, { status: 500 });
        } else {
            return NextResponse.json(error, { status: 500 });
        }
    }
}
