import { NextRequest, NextResponse } from 'next/server';
import { findScheduleById, updateScheduleById, deleteScheduleById } from '@/services/schedule-service';
import { validateObject } from '@/utils';
import { formatErrorMessage } from '@/utils/error-to-string';
import { createLog } from '@/utils/log';

// Obtener schedule por ID
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const { id } = params;

        const schedule = await findScheduleById(id);

        if (!schedule) {
            return NextResponse.json({ code: 'E_SCHEDULE_NOT_FOUND' }, { status: 404 });
        }

        return NextResponse.json(schedule, { status: 200 });
    } catch (error) {
        if (error instanceof Error) {
            return NextResponse.json({ code: 'E_SERVER_ERROR_SHEDULE', message: 'Error buscando el schedule', details: error.message }, { status: 500 });
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
            return NextResponse.json({ code: 'E_SCHEDULE_NOT_FOUND' }, { status: 404 });
        }

        // Actualizar el schedule
        const updatedSchedule = await updateScheduleById(id, body);

        // Enviar log de auditoría

        await createLog({
            action: "PUT",
            description: `Se actualizó un schedule. Información anterior: ${JSON.stringify(schedule, null, 2)}. Información actualizada: ${JSON.stringify(updatedSchedule, null, 2)}`,
            origin: "schedules/[id]",
            elementId: id,
            success: true,
        });

        return NextResponse.json(updatedSchedule, { status: 200 });
    } catch (error) {

        // Enviar log de auditoría

        await createLog({
            action: "PUT",
            description: `Error al actualizar un schedule: ${formatErrorMessage(error)}`,
            origin: "schedules/[id]",
            elementId: request.headers.get("origin") || "",
            success: false,
        });

        return NextResponse.json({ error: formatErrorMessage(error)},{ status: 500});
    }
}

// Eliminar schedule por ID (soft delete)
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const { id } = params;

        // Verificar si el rol existe
        const schedule = await findScheduleById(id);
        if (!schedule) {
            return NextResponse.json({ code: 'E_SCHEDULE_NOT_FOUND'}, { status: 404 });
        }

        // Eliminar el rol
        await deleteScheduleById(id);

        // Enviar log de auditoría

        await createLog({
            action: "DELETE",
            description: `Se eliminó un schedule. Información: ${JSON.stringify(schedule, null, 2)}`,
            origin: "schedules/[id]",
            elementId: id,
            success: true,
        });

        return NextResponse.json({ message: 'schedule eliminado correctamente' });
    } catch (error) {
        return NextResponse.json({ error: formatErrorMessage(error)},{ status: 500});
    }
}
