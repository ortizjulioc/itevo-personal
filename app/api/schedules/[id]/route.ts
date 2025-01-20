import { NextRequest, NextResponse } from 'next/server';
import { findScheduleById, updateScheduleById, deleteScheduleById } from '@/services/schedule-service';
import { validateObject } from '@/utils';

// Obtener schedule por ID
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const { id } = params;

        const schedule = await findScheduleById(id);

        if (!schedule) {
            return NextResponse.json({ code: 'E_SCHEDULE_NOT_FOUND', message: 'Schedule no encontrado' }, { status: 404 });
        }

        return NextResponse.json(schedule, { status: 200 });
    } catch (error) {
        if (error instanceof Error) {
            return NextResponse.json({ code: 'E_SERVER_ERROR', message: 'Error buscando el schedule', details: error.message }, { status: 500 });
        } else {
            return NextResponse.json(error, { status: 500 });
        }
    }
}

// Actualizar schedule por ID
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const { id } = params;
        const body = await request.json();

        // Validar el cuerpo de la solicitud (usando la validación existente)
        const { isValid, message } = validateObject(body, ['startTime', 'endTime', 'weekday']);
        if (!isValid) {
            return NextResponse.json({ code: 'E_MISSING_FIELDS', message }, { status: 400 });
        }

        // Verificar si el schedule existe
        const schedule = await findScheduleById(id);
        if (!schedule) {
            return NextResponse.json({ code: 'E_SCHEDULE_NOT_FOUND', message: 'schedule no encontrado' }, { status: 404 });
        }

        // Actualizar el schedule
        const updatedSchedule = await updateScheduleById(id, body);

        return NextResponse.json(updatedSchedule, { status: 200 });
    } catch (error) {
        if (error instanceof Error) {
            return NextResponse.json({ code: 'E_SERVER_ERROR', message: 'Error actualizando el schedule', details: error.message }, { status: 500 });
        } else {
            return NextResponse.json(error, { status: 500 });
        }
    }
}

// Eliminar schedule por ID (soft delete)
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const { id } = params;

        // Verificar si el rol existe
        const schedule = await findScheduleById(id);
        if (!schedule) {
            return NextResponse.json({ code: 'E_SCHEDULE_NOT_FOUND', message: 'schedule no encontrado' }, { status: 404 });
        }

        // Eliminar el rol
        await deleteScheduleById(id);

        return NextResponse.json({ message: 'schedule eliminado correctamente' });
    } catch (error) {
        if (error instanceof Error) {
            return NextResponse.json({ code: 'E_SERVER_ERROR', message: 'Error eliminando el schedule', details: error.message }, { status: 500 });
        } else {
            return NextResponse.json(error, { status: 500 });
        }
    }
}
