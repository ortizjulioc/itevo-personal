import { NextResponse, NextRequest } from "next/server";
import { addPrerequisite, findPrerequisiteById, findCourseById } from "@/services/course-service";
import { formatErrorMessage } from "@/utils/error-to-string";
import { createLog } from "@/utils/log";


export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const { id } = params;
        const body = await request.json();

        const course = await findCourseById(id);
        if (!course) {
            return NextResponse.json({ error: 'Curso no encontrado' }, { status: 404 });
        }
        const prerequisiteCourse = await findCourseById(body.prerequisites);
        if (!prerequisiteCourse) {
            return NextResponse.json({ error: 'Prerequisito no encontrado' }, { status: 404 });
        }

        // Buscar prerequisito por id

        const prerequisiteRelationship = await findPrerequisiteById(id, body.prerequisites);
        // Agregar prerequisitos al curso enviado por id
        console.log('prerequisito para evaular', prerequisiteRelationship);
        if (prerequisiteRelationship) {
            return NextResponse.json({ error: 'El curso ya tiene este prerequisito asignado' }, { status: 400 });
        }
        await addPrerequisite(id, body.prerequisites);

        // Enviar log de auditoría

        await createLog({
            action: "POST",
            description: `Se agregó un prerequisito al curso con id: ${id}. Prerequisito: ${body.prerequisites}`,
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

        return NextResponse.json({ error: formatErrorMessage(error)},{ status: 500});
    }
}
