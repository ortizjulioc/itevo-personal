import { NextResponse, NextRequest } from "next/server";
import { validateObject } from "@/utils";
import { getEnrollments, createEnrollment } from "@/services/enrollment-service";
import { formatErrorMessage } from "@/utils/error-to-string";
import { createLog } from "@/utils/log";

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);

        const filters = {
            studentId: searchParams.get('studentId') || undefined,
            courseBranchId: searchParams.get('courseBranchId') || undefined,
            status: searchParams.get('status') || '',
            enrollmentDate: searchParams.get('enrollmentDate') || '',
            page: parseInt(searchParams.get('page') || '1', 10),
            top: parseInt(searchParams.get('top') || '10', 10),
        }

        const { enrollments, totalEnrollments } = await getEnrollments(filters);

        return NextResponse.json({
            enrollments,
            totalEnrollments,
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
        const {isValid, message} = validateObject(body, ['studentId', 'courseBranchId', 'enrollmentDate', 'status']);
        if (!isValid) {
            return NextResponse.json({ code: 'E_MISSING_FIELDS', error: message }, { status: 400 });
        }


        // const courseCodeExists = await findCourseByCode(body);
        // if (courseCodeExists) {
        //     return NextResponse.json({ error: 'Este curso ya está registrado' }, { status: 400 });
        // }
        const enrollment = await createEnrollment(body);

        // Enviar log de auditoría

        await createLog({
            action: "POST",
            description: `Se creó un enrollment con los siguientes datos: ${JSON.stringify(enrollment, null, 2)}`,
            origin: "enrollments",
            elementId: enrollment.id,
            success: true,
        });


        return NextResponse.json(enrollment, { status: 201 });
    } catch (error) {

        // Enviar log de auditoría

        await createLog({
            action: "POST",
            description: `Error al crear un enrollment: ${formatErrorMessage(error)}`,
            origin: "enrollments",
            elementId: request.headers.get("origin") || "",
            success: false,
        });

        return NextResponse.json({ error: formatErrorMessage(error)},{ status: 500});
    }
}
