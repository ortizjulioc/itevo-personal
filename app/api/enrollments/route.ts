import { NextResponse, NextRequest } from "next/server";
import { validateObject } from "@/utils";
import { getEnrollments, createEnrollment } from "@/services/enrollment-service";
import { formatErrorMessage } from "@/utils/error-to-string";

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const search = searchParams.get('search') || '';
        const page = parseInt(searchParams.get('page') || '1', 10);
        const top = parseInt(searchParams.get('top') || '10', 10);

        const { enrollments, totalEnrollments } = await getEnrollments(search, page, top);

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
        return NextResponse.json(enrollment, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: formatErrorMessage(error)},{ status: 500});
    }
}
