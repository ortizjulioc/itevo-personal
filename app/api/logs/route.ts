import { getLogs } from '@/services/log-service';
import { formatErrorMessage } from '@/utils/error-to-string';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);

        const filters = {
            date: searchParams.get('date') ? new Date(searchParams.get('date')!) : undefined,
            action: searchParams.getAll('action').length > 0 ? searchParams.getAll('action') as ('POST' | 'PUT' | 'DELETE' | 'GET' | 'PATCH')[] : undefined,
            description: searchParams.get('description') || undefined,
            origin: searchParams.get('origin') || undefined,
            elementId: searchParams.get('elementId') || undefined,
            success: searchParams.get('success') ? searchParams.get('success') === 'true' : undefined,
            authorId: searchParams.get('authorId') || undefined,
        };

        const page = parseInt(searchParams.get('page') || '1', 10);
        const top = parseInt(searchParams.get('top') || '10', 10);

        const { logs, totalLogs } = await getLogs(filters, page, top);

        return NextResponse.json({
            logs,
            totalLogs,
        }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: formatErrorMessage(error)},{ status: 500});
    }
}
