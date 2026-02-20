import { NextRequest, NextResponse } from 'next/server';
import { addFingerprintToStudent, deleteFingerprintByStudentId, findFingerprintByStudentId } from '@/services/student-service';
import { formatErrorMessage } from '@/utils/error-to-string';
import { createLog } from '@/utils/log';
import { z } from 'zod';
import { base64ToUint8Array } from '@/utils';

const FingerprintSchema = z.object({
  fingerprint: z.string().min(1, "Fingerprint data is required"),
  studentId: z.string().uuid("Invalid student ID format"),
  sensorType: z.string().optional(), // Optional field for sensor type
});
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
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

        // Eliminar huella dactilar existente si existe
        const existingFingerprint = await findFingerprintByStudentId(id);
        if (existingFingerprint) {
            await deleteFingerprintByStudentId(id);
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

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    try {
        // Find the fingerprint by student ID
        const fingerprint = await findFingerprintByStudentId(id);
        if (!fingerprint) {
            return NextResponse.json({ error: "Fingerprint not found" }, { status: 404 });
        }

       await deleteFingerprintByStudentId(id);

        // Log the successful deletion of fingerprint
        await createLog({
            action: "DELETE",
            description: `Se eliminó la huella dactilar del estudiante con ID ${id}.`,
            origin: "students/[id]/fingerprint",
            elementId: id,
            success: true,
        });
        return NextResponse.json({ message: "Fingerprint deleted successfully" });
    } catch (error) {
        const errorMessage = formatErrorMessage(error);
        await createLog({
            action: "DELETE",
            description: `Error al eliminar huella dactilar del estudiante con ID ${id}: ${errorMessage}`,
            origin: "students/[id]/fingerprint",
            elementId: id,
            success: false,
        });
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

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
