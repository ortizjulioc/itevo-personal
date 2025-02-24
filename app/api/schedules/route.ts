import { NextResponse, NextRequest } from "next/server";
import { validateObject } from "@/utils";
import { getSchedules, createSchedule, findScheduleById } from "@/services/schedule-service";
import { formatErrorMessage } from "@/utils/error-to-string";
import { createLog } from "@/utils/log";

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1', 10);
        const top = parseInt(searchParams.get('top') || '10', 10);
        const weekday = searchParams.get('weekday') ? parseInt(searchParams.get('weekday') || '1', 10) : null;
        const startTime = searchParams.get('startTime') || null;
        const endTime = searchParams.get('endTime') || null;

        const { schedules, totalSchedules } = await getSchedules(page, top, weekday, startTime, endTime);

        return NextResponse.json({
            schedules,
            totalSchedules,
        }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: formatErrorMessage(error)},{ status: 500});
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        // Validate the request body
        const {isValid, message} = validateObject(body, ['startTime', 'endTime', 'weekday']);
        if (!isValid) {
            return NextResponse.json({ code: 'E_MISSING_FIELDS', error: message }, { status: 400 });
        }
        console.log(body);
        const schedule = await createSchedule(body);

        // Enviar log de auditoría

        await createLog({
            action: "POST",
            description: `Se creó un schedule con los siguientes datos: ${JSON.stringify(schedule, null, 2)}`,
            origin: "schedules",
            elementId: schedule.id,
            success: true,
        });

        return NextResponse.json(schedule, { status: 201 });
    } catch (error) {

        // Enviar log de auditoría

        await createLog({
            action: "POST",
            description: `Error al crear un schedule: ${formatErrorMessage(error)}`,
            origin: "schedules",
            success: false,
        });

        return NextResponse.json({ error: formatErrorMessage(error)},{ status: 500});
    }
}
