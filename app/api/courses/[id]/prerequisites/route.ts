import { NextResponse, NextRequest } from "next/server";
import { addPrerequisite, findPrerequisiteById, findCourseById, findPrerequisitesByCourseId } from "@/services/course-service";
import { formatErrorMessage } from "@/utils/error-to-string";
import { createLog } from "@/utils/log";
import { validateObject } from "@/utils";


export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const { id } = params;
        const body = await request.json();

        const { isValid, message } = validateObject(body, ['prerequisiteId']);
        if (!isValid) {
            return NextResponse.json({ code: 'E_MISSING_FIELDS', message }, { status: 400 });
        }

        const course = await findCourseById(id);
        if (!course) {
            return NextResponse.json({ error: 'Curso no encontrado' }, { status: 404 });
        }
        const prerequisiteCourse = await findCourseById(body.prerequisiteId);
        if (!prerequisiteCourse) {
            return NextResponse.json({ error: 'Prerequisito no encontrado' }, { status: 404 });
        }

        // Buscar prerequisito por id

        const prerequisiteRelationship = await findPrerequisiteById(id, body.prerequisiteId);
        // Agregar prerequisitos al curso enviado por id
        if (prerequisiteRelationship) {
            return NextResponse.json({ error: 'El curso ya tiene este prerequisito asignado' }, { status: 400 });
        }
        await addPrerequisite(id, body.prerequisiteId);

        // Enviar log de auditoría

        await createLog({
            action: "POST",
            description: `Se agregó un prerequisito al curso con id: ${id}. Prerequisito: ${body.prerequisiteId}`,
            origin: "courses/[id]/prerequisite",
            elementId: id,
            success: true,
        });


        return NextResponse.json({ message: 'Prerequisito agregado correctamente' }, { status: 201 });


    } catch (error) {
        // Enviar log de auditoría
        await createLog({
            action: "POST",
            description: `Error al agregar un prerequisito a un curso: ${formatErrorMessage(error)}`,
            origin: "courses/[id]/prerequisite",
            elementId: request.headers.get("origin") || "",
            success: false,
        });

        return NextResponse.json({ error: formatErrorMessage(error) }, { status: 500 });
    }
}

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const { id } = params;
        const course = await findCourseById(id);
        if (!course) {
            return NextResponse.json({ error: 'Curso no encontrado' }, { status: 404 });
        }
        const prerequisites = await findPrerequisitesByCourseId(id);
        return NextResponse.json(prerequisites);
    } catch (error) {
        await createLog({
            action: "GET",
            description: `Error al obtener los prerequisitos de un curso: ${formatErrorMessage(error)}`,
            origin: "courses/[id]/prerequisite",
            elementId: request.headers.get("origin") || "",
            success: false,
        });
        return NextResponse.json({ error: formatErrorMessage(error) }, { status: 500 });
    }
}
