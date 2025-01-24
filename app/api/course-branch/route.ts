import { NextResponse, NextRequest } from "next/server";
import { validateObject } from "@/utils";
import { getCourseBranch, createCourseBranch, findCourseBranchById } from "@/services/course-branch-service";
import { formatErrorMessage } from "@/utils/error-to-string";

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const search = searchParams.get('search') || '';
        const page = parseInt(searchParams.get('page') || '1', 10);
        const top = parseInt(searchParams.get('top') || '10', 10);

        const { courseBranches, totalCourseBranches } = await getCourseBranch(search, page, top);

        return NextResponse.json({
            courseBranches,
            totalCourseBranches,
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
        const {isValid, message} = validateObject(body, ['promotionId', 'branchId', 'teacherId', 'courseId']);
        if (!isValid) {
            return NextResponse.json({ code: 'E_MISSING_FIELDS', error: message }, { status: 400 });
        }


        // const courseCodeExists = await findCourseByCode(body);
        // if (courseCodeExists) {
        //     return NextResponse.json({ error: 'Este curso ya está registrado' }, { status: 400 });
        // }
        const courseBranch = await createCourseBranch(body);
        return NextResponse.json(courseBranch, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: formatErrorMessage(error)},{ status: 500});
    }
}
