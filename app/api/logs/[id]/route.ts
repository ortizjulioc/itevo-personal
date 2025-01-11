import { getLogById } from '@/services/log-service';
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
        if (error instanceof Error) {
            return NextResponse.json({ code: 'E_SERVER_ERROR', message: 'Error buscando el log', details: error.message }, { status: 500 });
        } else {
            return NextResponse.json(error, { status: 500 });
        }
    }
}
