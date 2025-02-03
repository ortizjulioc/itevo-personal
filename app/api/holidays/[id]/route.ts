import { NextRequest, NextResponse } from "next/server";
import { validateObject } from "@/utils";
import { getHolidays, createHoliday, findHolidayById, updateHolidayById, deleteHolidayById} from "@/services/holiday-service";
import { formatErrorMessage } from "@/utils/error-to-string";
import { createLog } from "@/utils/log";

// Obtener holidays por ID

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const { id } = params;

        const holiday = await findHolidayById(id);

        if (!holiday) {
            return NextResponse.json({ code: 'E_HOLIDAY_NOT_FOUND', message: 'Holiday no encontrado' }, { status: 404 });
        }

        return NextResponse.json(holiday, { status: 200 });
    } catch (error) {
        if (error instanceof Error) {
            return NextResponse.json({ code: 'E_SERVER_ERROR', message: 'Error buscando el holiday', details: error.message }, { status: 500 });
        } else {
            return NextResponse.json(error, { status: 500 });
        }
    }
}


// Actuzalizar holiday por ID


export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const { id } = params;
        const body = await request.json();

        // Validar el cuerpo de la solicitud (usando la validación existente)
        const { isValid, message } = validateObject(body, ['name', 'date']);
        if (!isValid) {
            return NextResponse.json({ code: 'E_MISSING_FIELDS', message }, { status: 400 });
        }

        // Verificar si el holiday existe
        const holiday = await findHolidayById(id);
        if (!holiday) {
            return NextResponse.json({ code: 'E_HOLIDAY_NOT_FOUND', message: 'Holiday no encontrado' }, { status: 404 });
        }

        // Actualizar el holiday
        const updatedHoliday = await updateHolidayById(id, body);

        // Enviar log de auditoría

        await createLog({
            action: "PUT",
            description: `Se actualizó un holiday. Información anterior: ${JSON.stringify(holiday, null, 2)}. Información actualizada: ${JSON.stringify(updatedHoliday, null, 2)}`,
            origin: "holidays/[id]",
            elementId: id,
            success: true,
        });

        return NextResponse.json(updatedHoliday, { status: 200 });
    } catch (error) {
        if (error instanceof Error) {
            return NextResponse.json({ code: 'E_SERVER_ERROR', message: 'Error actualizando el holiday', details: error.message }, { status: 500 });
        } else {
            return NextResponse.json(error, { status: 500 });
        }
    }
}

// Eliminar holiday por ID (soft delete)

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const { id } = params;

        // Verificar si el holiday existe
        const holiday = await findHolidayById(id);
        if (!holiday) {
            return NextResponse.json({ code: 'E_HOLIDAY_NOT_FOUND', message: 'Holiday no encontrado' }, { status: 404 });
        }

        // Eliminar el holiday
        await deleteHolidayById(id);

        // Enviar log de auditoría

        await createLog({
            action: "DELETE",
            description: `Se eliminó un holiday con la siguiente información: ${JSON.stringify(holiday, null, 2)}`,
            origin: "holidays/[id]",
            elementId: id,
            success: true,
        });

        return NextResponse.json({ message: 'Holiday eliminado' }, { status: 200 });
    } catch (error) {
        if (error instanceof Error) {
            return NextResponse.json({ code: 'E_SERVER_ERROR', message: 'Error eliminando el holiday', details: error.message }, { status: 500 });
        } else {
            return NextResponse.json(error, { status: 500 });
        }
    }
}


