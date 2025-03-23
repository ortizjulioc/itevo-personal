import { NextResponse, NextRequest } from "next/server";
import { validateObject } from "@/utils";
import { getCourses, createCourse, findCourseByCode } from "@/services/course-service";
import { formatErrorMessage } from "@/utils/error-to-string";
import { createLog } from "@/utils/log";

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
        return NextResponse.json({ error: formatErrorMessage(error)},{ status: 500});
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

        // Enviar log de auditoría

        await createLog({
            action: "POST",
            description: `Se creó un curso con los siguientes datos: ${JSON.stringify(body, null, 2)}`,
            origin: "courses",
            elementId: course.id,
            success: true,
        });

        return NextResponse.json(course, { status: 201 });
    } catch (error) {
        // Enviar log de auditoría

        await createLog({
            action: "POST",
            description: `Error al crear un curso: ${formatErrorMessage(error)}`,
            origin: "courses",
            elementId: request.headers.get("origin") || "",
            success: false,
        });

        return NextResponse.json({ error: formatErrorMessage(error)},{ status: 500});
    }
}
