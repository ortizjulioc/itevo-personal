import { NextResponse, NextRequest } from "next/server";
import { validateObject } from "@/utils";
import { getCourses, createCourse, findCourseByCode } from "@/services/course-service";

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const search = searchParams.get('search') || '';
        const page = parseInt(searchParams.get('page') || '1', 10);
        const top = parseInt(searchParams.get('top') || '10', 10);

        const { courses, totalCourses } = await getCourses(search, page, top);

        return NextResponse.json({
            courses,
            totalCourses,
        }, { status: 200 });
    } catch (error) {
        if (error instanceof Error) {
            return NextResponse.json({ error: 'Error obteniendo los courses', details: error.message }, { status: 500 });
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
        const {isValid, message} = validateObject(body, ['name', 'code']);
        if (!isValid) {
            return NextResponse.json({ code: 'E_MISSING_FIELDS', error: message }, { status: 400 });
        }


        const courseCodeExists = await findCourseByCode(body);
        if (courseCodeExists) {
            return NextResponse.json({ error: 'Este curso ya está registrado' }, { status: 400 });
        }
        const course = await createCourse(body);
        return NextResponse.json(course, { status: 201 });
    } catch (error) {
        if (error instanceof Error) {
            console.log('ERROR: ',error);
            return NextResponse.json({ error: 'Error creando curso', details: error.message }, { status: 500 });
        } else {
            return NextResponse.json(error, { status: 500 });
        }
    }
}
