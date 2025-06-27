import { NextResponse, NextRequest } from "next/server";
import { validateObject } from "@/utils";
import { getStudents, createStudent, createStudentCode } from '@/services/student-service';
import { formatErrorMessage } from "@/utils/error-to-string";
import { createLog } from "@/utils/log";
import { getServerSession } from "next-auth";
import { get } from "lodash";
import { authOptions } from "../auth/[...nextauth]/auth-options";

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const search = searchParams.get('search') || '';
        const page = parseInt(searchParams.get('page') || '1', 10);
        const top = parseInt(searchParams.get('top') || '10', 10);

        const { students, totalStudents } = await getStudents(search, page, top);

        return NextResponse.json({
            students,
            totalStudents,
        }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: formatErrorMessage(error)},{ status: 500});
    }
}

export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        const body = await request.json();
        
        // Validate the request body
        const {isValid, message} = validateObject(body, ["firstName", "lastName", "identification"]);
        if (!isValid) {
            return NextResponse.json({ code: 'E_MISSING_FIELDS', error: message }, { status: 400 });
        }
        body.code = await createStudentCode();
        body.branchId = body.branchId || session?.user?.branches?.[0]?.id || null;
        const student = await createStudent(body);

        // Enviar log de auditoría

        await createLog({
            action: "POST",
            description: `Se creó un student con los siguientes datos: ${JSON.stringify(student, null, 2)}`,
            origin: "students",
            elementId: student.id,
            success: true,
        });

        return NextResponse.json(student, { status: 201 });
    } catch (error) {

        // Enviar log de auditoría

        await createLog({
            action: "POST",
            description: `Error al crear un student: ${formatErrorMessage(error)}`,
            origin: "students",
            success: false,
        });
        return NextResponse.json({ error: formatErrorMessage(error)},{ status: 500});
    }
}
