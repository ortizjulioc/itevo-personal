import { NextResponse, NextRequest } from "next/server";
import { validateObject } from "@/utils";
import { getTeachers, createTeacher, findTeacherByIdentification } from '@/services/teacher-service';
import { formatErrorMessage } from "@/utils/error-to-string";
import { createLog } from "@/utils/log";

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const search = searchParams.get('search') || '';
        const page = parseInt(searchParams.get('page') || '1', 10);
        const top = parseInt(searchParams.get('top') || '10', 10);

        const { teachers, totalTeachers } = await getTeachers(search, page, top);

        return NextResponse.json({
            teachers,
            totalTeachers,
        }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: formatErrorMessage(error)},{ status: 500});
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        console.log('BODY: ',body);

        // Validate the request body
        const {isValid, message} = validateObject(body, ["firstName", "lastName", "identification"]);
        if (!isValid) {
            return NextResponse.json({ code: 'E_MISSING_FIELDS', error: message }, { status: 400 });
        }

        const teacherIdentificationExists = await findTeacherByIdentification(body);
        if (teacherIdentificationExists) {
            return NextResponse.json({ error: 'Esta identificacion de maestro ya existe' }, { status: 400 });
        }
        const teacher = await createTeacher(body);

        // Enviar log de auditoría

        await createLog({
            action: "POST",
            description: `Se creó un teacher con los siguientes datos: ${JSON.stringify(teacher, null, 2)}`,
            origin: "teachers",
            elementId: teacher.id,
            success: true,
        });
        return NextResponse.json(teacher, { status: 201 });
    } catch (error) {
        // Enviar log de auditoría

        await createLog({
            action: "POST",
            description: `Error al crear un teacher: ${formatErrorMessage(error)}`,
            origin: "teachers",
            success: false,
        });

        return NextResponse.json({ error: formatErrorMessage(error)},{ status: 500});
    }
}
