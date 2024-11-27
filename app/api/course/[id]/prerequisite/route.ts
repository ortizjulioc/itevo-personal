import { NextResponse, NextRequest } from "next/server";
import { validateObject } from "@/utils";
import { getCourses, createCourse, findCourseByCode, addPrerequisite, findPrerequisiteById, findCourseById } from "@/services/course-service";

export async function GET(request: NextRequest) {
    try {
        // const { searchParams } = new URL(request.url);
        // const search = searchParams.get('search') || '';
        // const page = parseInt(searchParams.get('page') || '1', 10);
        // const top = parseInt(searchParams.get('top') || '10', 10);

        // const { courses, totalCourses } = await getCourses(search, page, top);

        return NextResponse.json({
        }, { status: 200 });
    } catch (error) {
        // if (error instanceof Error) {
        //     return NextResponse.json({ error: 'Error obteniendo los usuarios', details: error.message }, { status: 500 });
        // } else {
        //     return NextResponse.json(error, { status: 500 });
        // }
    }
}

export async function POST(request: Request, { params }: { params: { id: string } }) {
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
        return NextResponse.json({ message: 'Prerequisito agregado correctamente' }, { status: 201 });


    } catch (error) {
        if (error instanceof Error) {
            console.log('ERROR: ',error);
            return NextResponse.json({ error: 'Error agregando prerequisito', details: error.message }, { status: 500 });
        } else {
            return NextResponse.json(error, { status: 500 });
        }
    }
}
