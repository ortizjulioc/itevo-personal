import { NextResponse, NextRequest } from 'next/server';
import { getEnrollments } from '@/services/enrollment-service';
import { formatErrorMessage } from '@/utils/error-to-string';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const { searchParams } = new URL(request.url);

        const filters = {
            page: parseInt(searchParams.get('page') || '1', 10),
            top: parseInt(searchParams.get('top') || '10', 10),
            studentId: searchParams.get('studentId') || undefined,
            courseId: searchParams.get('courseId') || undefined,
            teacherId: searchParams.get('teacherId') || undefined,
            branchId: searchParams.get('branchId') || undefined,
            promotionId: id,
            modality: searchParams.get('modality') || undefined,

            status: searchParams.get('status') || undefined,
            startDate: searchParams.get('startDate') || undefined,
            endDate: searchParams.get('endDate') || undefined,
            courseBranchId: searchParams.get('courseBranchId') || undefined,
        };

        const { enrollments, totalEnrollments, summary } = await getEnrollments(filters);

        return NextResponse.json(
            {
                enrollments,
                totalEnrollments,
                summary,
            },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json({ error: formatErrorMessage(error) }, { status: 500 });
    }
}
