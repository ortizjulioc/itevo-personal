import { NextRequest, NextResponse } from 'next/server';
import { addFingerprintToStudent, findFingerprintByStudentId } from '@/services/student-service';
import { formatErrorMessage } from '@/utils/error-to-string';
import { createLog } from '@/utils/log';

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
    const { id } = params;
    const body = await req.json();

    try {
        const fingerprint = await addFingerprintToStudent(id, body);

        // Log the successful addition of fingerprint
        await createLog({
            action: "POST",
            description: `Se agregó una huella dactilar al estudiante con ID ${id}. Datos de la huella: ${JSON.stringify(fingerprint, null, 2)}`,
            origin: "students/[id]/fingerprint",
            elementId: id,
            success: true,
        });
        return NextResponse.json(fingerprint);
    } catch (error) {
        const errorMessage = formatErrorMessage(error);
        await createLog({
            action: "POST",
            description: `Error al agregar huella dactilar al estudiante con ID ${id}: ${errorMessage}`,
            origin: "students/[id]/fingerprint",
            elementId: id,
            success: false,
        });
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    const { id } = params;

    try {
        const fingerprint = await findFingerprintByStudentId(id);

        if (!fingerprint) {
            return NextResponse.json({ error: "Fingerprint not found" }, { status: 404 });
        }

        return NextResponse.json(fingerprint);
    } catch (error) {
        const errorMessage = formatErrorMessage(error);
        await createLog({
            action: "GET",
            description: `Error al obtener huella dactilar del estudiante con ID ${id}: ${errorMessage}`,
            origin: "students/[id]/fingerprint",
            elementId: id,
            success: false,
        });
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}
