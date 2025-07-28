import { NextRequest, NextResponse } from 'next/server';
import { addFingerprintToStudent, findFingerprintByStudentId } from '@/services/student-service';
import { formatErrorMessage } from '@/utils/error-to-string';
import { createLog } from '@/utils/log';
import { z } from 'zod';
import { base64ToUint8Array } from '@/utils';

const FingerprintSchema = z.object({
  fingerprint: z.string().min(1, "Fingerprint data is required"),
  studentId: z.string().uuid("Invalid student ID format"),
  sensorType: z.string().optional(), // Optional field for sensor type
});
export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
    const { id } = params;
    const body = await req.json();

    try {
        // Validate the request body
        const validatedData = FingerprintSchema.parse({
            ...body,
            studentId: id, // Ensure the studentId matches the route parameter
        });
        
        if (!validatedData.fingerprint) {
            return NextResponse.json({ error: "Fingerprint data is required" }, { status: 400 });
        }

        const fingerprint = await addFingerprintToStudent(id, {
            template: base64ToUint8Array(validatedData.fingerprint),
            sensorType: validatedData.sensorType,
        });

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
