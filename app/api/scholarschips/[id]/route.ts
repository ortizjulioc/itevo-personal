import { NextRequest, NextResponse } from 'next/server';
import { findScholarshipById, updateScholarshipById, deleteScholarship } from '@/services/scholarship-service';
import { createLog } from '@/utils/log';
import { formatErrorMessage } from '@/utils/error-to-string';

// Obtener beca por ID
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const { id } = params;

        const scholarship = await findScholarshipById(id);

        if (!scholarship) {
            return NextResponse.json({ code: 'E_SCHOLARSHIP_NOT_FOUND' }, { status: 404 });
        }

        return NextResponse.json(scholarship, { status: 200 });
    } catch (error) {
        await createLog({
            action: 'GET',
            description: formatErrorMessage(error),
            origin: 'scholarships/[id]',
            success: false,
        });
        return NextResponse.json({ error: formatErrorMessage(error) }, { status: 500 });
    }
}
//------------------------------------------------------------------------------------------------
// Actualizar beca por ID
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const { id } = params;
        const body = await request.json();

        // Verificar si la beca existe
        const scholarship = await findScholarshipById(id);
        if (!scholarship) {
            return NextResponse.json({ code: 'E_SCHOLARSHIP_NOT_FOUND', message: 'Beca no encontrada' }, { status: 404 });
        }

        // Actualizar la beca
        const updatedScholarship = await updateScholarshipById(id, body);

        await createLog({
            action: 'PUT',
            description: `Se actualizó la beca.\nInformación anterior: ${JSON.stringify(scholarship, null, 2)}\nInformación actualizada: ${JSON.stringify(updatedScholarship, null, 2)}`,
            origin: 'scholarships/[id]',
            elementId: updatedScholarship.id,
            success: true,
        });

        return NextResponse.json(updatedScholarship, { status: 200 });
    } catch (error) {
        await createLog({
            action: 'PUT',
            description: formatErrorMessage(error),
            origin: 'scholarships/[id]',
            success: false,
        });
        return NextResponse.json({ error: formatErrorMessage(error) }, { status: 500 });
    }
}

//------------------------------------------------------------------------------------------------
// Eliminar beca por ID (soft delete)
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const { id } = params;

        // Verificar si la beca existe
        const scholarship = await findScholarshipById(id);
        if (!scholarship) {
            return NextResponse.json({ code: 'E_SCHOLARSHIP_NOT_FOUND', message: 'Beca no encontrada' }, { status: 404 });
        }

        // Eliminar la beca
        await deleteScholarship(id);
        await createLog({
            action: 'DELETE',
            description: `Se eliminó la beca con la siguiente información: \n${JSON.stringify(scholarship, null, 2)}`,
            origin: 'scholarships/[id]',
            elementId: id,
            success: true,
        });

        return NextResponse.json({ message: 'Beca eliminada correctamente' });
    } catch (error) {
        await createLog({
            action: 'DELETE',
            description: formatErrorMessage(error),
            origin: 'scholarships/[id]',
            success: false,
        });
        return NextResponse.json({ error: formatErrorMessage(error) }, { status: 500 });
    }
}
