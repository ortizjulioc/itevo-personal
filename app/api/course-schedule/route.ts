import { NextResponse, NextRequest } from 'next/server';
import { validateObject } from '@/utils';
import { getCourseSchedules, createCourseSchedule } from '@/services/course-schedule-service';
import { formatErrorMessage } from '@/utils/error-to-string';
import { createLog } from '@/utils/log';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);

        // Filtros de búsqueda

        const filters = {
            page: parseInt(searchParams.get('page') || '1', 10),
            top: parseInt(searchParams.get('top') || '10', 10),
            courseId: searchParams.get('courseId') || undefined,

        }

        const { courseSchedules, totalCourseSchedules } = await getCourseSchedules(filters);

        return NextResponse.json(
            {
                courseSchedules,
                totalCourseSchedules,
            },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json({ error: formatErrorMessage(error) }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        console.log('BODY QUE SE ENVIÓ PARA CREAR: ', body);

        // Validate the request body
        const { isValid, message } = validateObject(body, ['courseId', 'scheduleId']);
        if (!isValid) {
            return NextResponse.json({ code: 'E_MISSING_FIELDS', error: message }, { status: 400 });
        }

        console.log('HASTA AQUÍ TODO BIEN');

        const courseSchedule = await createCourseSchedule(body);
        await createLog({
            action: 'POST',
            description: `Se una nueva relacion de curso con horario con los siguientes datos: ${JSON.stringify(body, null, 2)}`,
            origin: 'course-schedules',
            elementId: `${courseSchedule.courseId}-${courseSchedule.scheduleId}`,
            success: true,
        });

        return NextResponse.json(courseSchedule, { status: 201 });
    } catch (error) {
        await createLog({
            action: 'POST',
            description: `Error al crear una nueva relacion de curso con horario: ${formatErrorMessage(error)}`,
            origin: 'course-schedules',
            elementId: 'unknown',
            success: false,
        });

        return NextResponse.json({ error: formatErrorMessage(error) }, { status: 500 });
    }
}
