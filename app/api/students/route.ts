import { NextResponse, NextRequest } from "next/server";
import { base64ToUint8Array, validateObject } from "@/utils";
import { getStudents, createStudent, createStudentCode, findStudentByEmail, findStudentByIdentification, addFingerprintToStudent } from '@/services/student-service';
import { formatErrorMessage } from "@/utils/error-to-string";
import { createLog } from "@/utils/log";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/auth-options";
import { Prisma } from "@/utils/lib/prisma";
import { IdentificationType } from "@prisma/client";

const mapIdentificationType: Record<string, IdentificationType> = {
    cedula: IdentificationType.CEDULA,
    pasaporte: IdentificationType.PASAPORTE,
    otro: IdentificationType.OTRO,
};

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
        const {isValid, message} = validateObject(body, ["firstName", "lastName"]);
        if (!isValid) {
            return NextResponse.json({ code: 'E_MISSING_FIELDS', error: message }, { status: 400 });
        }

        if (body.email) {
            // Validar que no se repita el email
            const existingStudent = await findStudentByEmail(body.email);
            if (existingStudent) {
                return NextResponse.json({ code: 'E_EMAIL_EXISTS', error: 'El email ya está en uso por otro estudiante.' }, { status: 400 });
            }
        }

        if (body.identification) {
            // Validar que no se repita la identificación
            const existingStudent = await findStudentByIdentification(body.identification);
            if (existingStudent) {
                return NextResponse.json({ code: 'E_IDENTIFICATION_EXISTS', error: 'La identificación ya está en uso por otro estudiante.' }, { status: 400 });
            }
        }

        body.code = await createStudentCode();
        body.branchId = body.branchId || session?.user?.mainBranch?.id || session?.user?.branches?.[0]?.id || null;

        const student = await Prisma.$transaction(async (prisma) => {
            // Crear el estudiante
            const student = await createStudent({
                code: body.code,
                firstName: body.firstName,
                lastName: body.lastName,
                email: body.email,
                identification: body.identification,
                address: body.address,
                phone: body.phone,
                hasTakenCourses: body.hasTakenCourses,
                identificationType: body.identificationType ? mapIdentificationType[body.identificationType] : IdentificationType.CEDULA,
                branch: { connect: { id: body.branchId } },
            }, prisma);

            if (body.fingerprint) {
                // Crear el registro de huella dactilar si se proporciona
                await addFingerprintToStudent(student.id, {
                    template: base64ToUint8Array(body.fingerprint),
                    sensorType: body.sensorType,
                }, prisma);
            }

            return student;
        });
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
