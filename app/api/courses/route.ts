import { NextResponse, NextRequest } from "next/server";
import { validateObject } from "@/utils";
import { getCourses, createCourse, findCourseByCode, addPrerequisite } from "@/services/course-service";
import { formatErrorMessage } from "@/utils/error-to-string";
import { createLog } from "@/utils/log";
import { Prisma } from "@/utils/lib/prisma";
import { Course } from "@prisma/client";

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
        // Validate the request body
        const {isValid, message} = validateObject(body, ['name']);
        if (!isValid) {
            return NextResponse.json({ code: 'E_MISSING_FIELDS', error: message }, { status: 400 });
        }

        const course = await Prisma.$transaction(async (prisma) => {
            const data = { ...body }
            data?.prerequisites && delete data.prerequisites;
            let course = await createCourse(data, prisma);

            if (body.prerequisites && body.prerequisites.length > 0) {
                await Promise.all(
                    body.prerequisites.map((prerequisite: Course) =>
                        addPrerequisite(course.id, prerequisite.id, prisma)
                    )
                );
            }

            return { ...course, prerequisites: body.prerequisites };
        });

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
