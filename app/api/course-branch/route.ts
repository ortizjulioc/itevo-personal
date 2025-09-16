import { NextResponse, NextRequest } from 'next/server';
import { validateObject } from '@/utils';
import { getCourseBranch, createCourseBranch } from '@/services/course-branch-service';
import { formatErrorMessage } from '@/utils/error-to-string';
import { createLog } from '@/utils/log';
import { CourseBranchStatus, Modality } from '@prisma/client';
import { findCourseById } from '@/services/course-service';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);

        // Filtros de búsqueda
        const filters = {
            page: parseInt(searchParams.get('page') || '1', 10),
            top: parseInt(searchParams.get('top') || '10', 10),
            promotionId: searchParams.get('promotionId') || undefined,
            branchId: searchParams.get('branchId') || undefined,
            teacherId: searchParams.get('teacherId') || undefined,
            courseId: searchParams.get('courseId') || undefined,
            modality: searchParams.get('modality') as Modality || undefined,
            startDate: searchParams.get('startDate') || undefined,
            endDate: searchParams.get('endDate') || undefined,
            search: searchParams.get('search') || undefined,
        }
        const { courseBranches, totalCourseBranches } = await getCourseBranch(filters);

        return NextResponse.json(
            {
                courseBranches,
                totalCourseBranches,
            },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json({ error: formatErrorMessage(error) }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        body.status = CourseBranchStatus.DRAFT;
        body.modality = Modality.PRESENTIAL;

        // Validate the request body
        const { isValid, message } = validateObject(body, ['promotionId', 'branchId', 'teacherId', 'courseId']);
        if (!isValid) {
            return NextResponse.json({ code: 'E_MISSING_FIELDS', error: message }, { status: 400 });
        }

        const course = await findCourseById(body.courseId);
        if (!course) {
            return NextResponse.json({ code: 'E_COURSE_NOT_FOUND', error: 'El curso especificado no existe.' }, { status: 404 });
        }

        const courseBranch = await createCourseBranch({
            promotion: { connect: { id: body.promotionId } },
            branch: { connect: { id: body.branchId } },
            teacher: { connect: { id: body.teacherId } },
            course: { connect: { id: body.courseId } },
            amount: body.amount || 0,
            modality: body.modality || Modality.PRESENTIAL,
            startDate: body.startDate ? new Date(body.startDate) : null,
            endDate: body.endDate ? new Date(body.endDate) : null,
            commissionRate: body.commissionRate || 0,
            sessionCount: body.sessionCount || 0,
            capacity: body.capacity || 0,
            status: body.status || CourseBranchStatus.DRAFT,
            enrollmentAmount: body.enrollmentAmount || 0,
        });
        await createLog({
            action: 'POST',
            description: `Se creó un curso con los siguientes datos: ${JSON.stringify(body, null, 2)}`,
            origin: 'course-branch',
            elementId: courseBranch.id,
            success: true,
        });

        return NextResponse.json(courseBranch, { status: 201 });
    } catch (error) {
        await createLog({
            action: 'POST',
            description: `Error al crear un curso: ${formatErrorMessage(error)}`,
            origin: 'course-branch',
            elementId: request.headers.get('origin') || '',
            success: false,
        });

        return NextResponse.json({ error: formatErrorMessage(error) }, { status: 500 });
    }
}
