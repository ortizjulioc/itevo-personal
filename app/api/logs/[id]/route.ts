import { getLogById } from '@/services/log-service';
import { formatErrorMessage } from '@/utils/error-to-string';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const { id } = params;

        const log = await getLogById(id);

        if (!log) {
            return NextResponse.json({ code: 'E_LOG_NOT_FOUND', message: 'Log no encontrado' }, { status: 404 });
        }

        return NextResponse.json(log, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: formatErrorMessage(error)},{ status: 500});
    }
}
