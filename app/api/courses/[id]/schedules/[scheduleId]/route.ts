import { deleteCourseSchedule, getCourseSchedules, getCourseSchedulesByIds } from "@/services/course-schedule-service";
import { formatErrorMessage } from "@/utils/error-to-string";
import { createLog } from "@/utils/log";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const filters = {
      courseId: searchParams.get('id') || undefined,
      scheduleId: searchParams.get('scheduleId') || undefined,
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
    await createLog({
      action: "GET",
      description: `Error al obtener horarios: ${formatErrorMessage(error)}`,
      origin: "courses/[id]/schedule/[scheduleId]",
      success: false,
    });
    return NextResponse.json({ error: formatErrorMessage(error) }, { status: 500 });
  }
}

export async function DELETE (request: NextRequest, { params }: { params: { id: string, scheduleId: string}}) {
  try {
    const { id, scheduleId } = params;
    if (!id || !scheduleId) {
      return NextResponse.json({
        message: "Missing id or scheduleId",
        code: "E_MISSING_FIELDS",
      }, { status: 400 });
    }

    const courseSchedule = await getCourseSchedulesByIds(id, scheduleId);

    if (!courseSchedule) {
      return NextResponse.json({ message: "Schedule not found" }, { status: 404 });
    }

    await deleteCourseSchedule(id, scheduleId);

    await createLog({
      action: "DELETE",
      description: `Se eliminó la relación de curso con horario con los siguientes datos: ${JSON.stringify(courseSchedule, null, 2)}`,
      origin: "course-schedules",
      elementId: `${id} & ${scheduleId}`,
      success: true,
    });
    return NextResponse.json({ message: "Schedule deleted" }, { status: 200 });
  } catch (error) {
    await createLog({
      action: "DELETE",
      description: `Error al eliminar la relación de curso con horario: ${formatErrorMessage(error)}`,
      origin: "course-schedules",
      elementId: "unknown",
      success: false,
    });
    return NextResponse.json({ error: formatErrorMessage(error) }, { status: 500 });
  }
}
