import { NextResponse, NextRequest } from 'next/server';
import { validateObject } from '@/utils';
import { getCourseBranch, createCourseBranch } from '@/services/course-branch-service';
import { formatErrorMessage } from '@/utils/error-to-string';
import { createLog } from '@/utils/log';
import { CourseBranchStatus, Modality } from '@prisma/client';

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
            Modality: searchParams.get('modality') as Modality,
            startDate: searchParams.get('startDate') || undefined,
            endDate: searchParams.get('endDate') || undefined,
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

        // Validate the request body
        const { isValid, message } = validateObject(body, ['promotionId', 'branchId', 'teacherId', 'courseId']);
        if (!isValid) {
            return NextResponse.json({ code: 'E_MISSING_FIELDS', error: message }, { status: 400 });
        }

        console.log('post course-branch', body);
        const courseBranch = await createCourseBranch(body);
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
