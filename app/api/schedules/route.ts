import { NextResponse, NextRequest } from "next/server";
import { validateObject } from "@/utils";
import { getSchedules, createSchedule, findScheduleById } from "@/services/schedule-service";

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
        if (error instanceof Error) {
            return NextResponse.json({ error: 'Error obteniendo los schedules', details: error.message }, { status: 500 });
        } else {
            return NextResponse.json(error, { status: 500 });
        }
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();

        // Validate the request body
        const {isValid, message} = validateObject(body, ['courseBranchId']);
        if (!isValid) {
            return NextResponse.json({ code: 'E_MISSING_FIELDS', error: message }, { status: 400 });
        }
        const schedule = await createSchedule(body);
        return NextResponse.json(schedule, { status: 201 });
    } catch (error) {
        if (error instanceof Error) {
            console.log('ERROR: ',error);
            return NextResponse.json({ error: 'Error creando schedule', details: error.message }, { status: 500 });
        } else {
            return NextResponse.json(error, { status: 500 });
        }
    }
}
