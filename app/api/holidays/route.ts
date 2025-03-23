import { NextResponse, NextRequest } from "next/server";
import { validateObject } from "@/utils";
import { getHolidays, createHoliday, findHolidayById} from "@/services/holiday-service";
import { formatErrorMessage } from "@/utils/error-to-string";
import { createLog } from "@/utils/log";

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1', 10);
        const top = parseInt(searchParams.get('top') || '10', 10);
        const search = searchParams.get('search') || '';

        const { holidays, totalHolidays } = await getHolidays(page, top, search);

        return NextResponse.json({
            holidays,
            totalHolidays,
        }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: formatErrorMessage(error) }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();

        // Validate the request body
        const { isValid, message } = validateObject(body, ['name', 'date']);
        if (!isValid) {
            return NextResponse.json({ code: 'E_MISSING_FIELDS', error: message }, { status: 400 });
        }
        const holiday = await createHoliday(body);

        // Enviar log de auditoría

        await createLog({
            action: "POST",
            description: `Se creó un holiday con los siguientes datos: ${JSON.stringify(holiday, null, 2)}`,
            origin: "holidays",
            elementId: holiday.id,
            success: true,
        });

        return NextResponse.json(holiday, { status: 201 });
    } catch (error) {

        // Enviar log de auditoría

        await createLog({
            action: "POST",
            description: `Error al crear un holiday: ${formatErrorMessage(error)}`,
            origin: "holidays",
            success: false,
        });

        return NextResponse.json({ error: formatErrorMessage(error)},{ status: 500});
    }
}
