import { createCourseSchedule, getCourseSchedules, getCourseSchedulesByCourseId, getCourseSchedulesByIds } from "@/services/course-schedule-service";
import { validateObject } from "@/utils";
import { formatErrorMessage } from "@/utils/error-to-string";
import { createLog } from "@/utils/log";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try { 
    const { id } = await params;

    const courseSchedules = await getCourseSchedulesByCourseId(id);

    return NextResponse.json(
      {
        schedules: courseSchedules,
      },
      { status: 200 }
    );
  } catch (error) {
    await createLog({
      action: 'GET',
      description: `Error al crear una nueva relacion de curso con horario: ${formatErrorMessage(error)}`,
      origin: 'course-schedules',
      elementId: 'unknown',
      success: false,
    });

    return NextResponse.json({ error: formatErrorMessage(error) }, { status: 500 });
  }
}

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    // Validate the request body
    const { isValid, message } = validateObject(body, ['scheduleId']);
    if (!isValid) {
      return NextResponse.json({ code: 'E_MISSING_FIELDS', error: message }, { status: 400 });
    }

    // Verificar si ya existe la relación
    const courseSchedules = await getCourseSchedulesByIds(id, body.scheduleId);
    if (courseSchedules) {
      return NextResponse.json({
        error: 'La relación ya existe',
        code: 'E_COURSE_SCHEDULE_ALREADY_EXISTS',
      }, { status: 400 });
    }

    const courseSchedule = await createCourseSchedule({
      courseId: id,
      scheduleId: body.scheduleId,
    });
    await createLog({
      action: 'POST',
      description: `Se una nueva relacion de curso con horario con los siguientes datos: ${JSON.stringify(body, null, 2)}`,
      origin: 'course-schedules',
      elementId: `${courseSchedule.courseId} & ${courseSchedule.scheduleId}`,
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
