import { NextRequest, NextResponse } from 'next/server';
import { validateObject } from "@/utils";
import { createLog, getLogs } from '@/services/log-service';

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
        if (error instanceof Error) {
            return NextResponse.json({ error: 'Error obteniendo los logs', details: error.message }, { status: 500 });
        } else {
            return NextResponse.json(error, { status: 500 });
        }
    }
}

// Crear un nuevo log
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // Validar los campos requeridos
        const { isValid, message } = validateObject(body, ['action', 'description', 'origin', 'success']);
        if (!isValid) {
            return NextResponse.json({ code: 'E_MISSING_FIELDS', error: message }, { status: 400 });
        }

        const log = await createLog(body);

        return NextResponse.json(log, { status: 201 });
    } catch (error) {
        if (error instanceof Error) {
            return NextResponse.json({ error: 'Error creando el log', details: error.message }, { status: 500 });
        } else {
            return NextResponse.json(error, { status: 500 });
        }
    }
}
