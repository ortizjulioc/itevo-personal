import { NextRequest, NextResponse } from 'next/server';
import { findBranchById, updateBranchById, deleteBranchById } from '@/services/branch-service';
import { validateObject } from '@/utils';
import { createLog } from '@/utils/log';
import { formatErrorMessage } from '@/utils/error-to-string';

// Obtener sucursal por ID
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const { id } = params;

        const branch = await findBranchById(id);

        if (!branch) {
            return NextResponse.json({ code: 'E_BRANCH_NOT_FOUND', message: 'Sucural no encontrada' }, { status: 404 });
        }

        return NextResponse.json(branch, { status: 200 });
    } catch (error) {
            await createLog({
                action: 'GET',
                description: formatErrorMessage(error),
                origin: 'branches/[id]',
                success: false,
            });
            return NextResponse.json({ error: formatErrorMessage(error) }, { status: 500 });
    }
}

// Actualizar sucursal por ID
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const { id } = params;
        const body = await request.json();

        // Validar el cuerpo de la solicitud (usando la validación existente)
        const { isValid, message } = validateObject(body, ['name', 'address']);
        if (!isValid) {
            return NextResponse.json({ code: 'E_MISSING_FIELDS', message }, { status: 400 });
        }

        // Verificar si la sucursal existe
        const branch = await findBranchById(id);
        if (!branch) {
            return NextResponse.json({ code: 'E_BRANCH_NOT_FOUND', message: 'Sucursal no encontrada' }, { status: 404 });
        }

        // Actualizar la sucursal
        const updatedBranch = await updateBranchById(id, body);

        await createLog({
            action: 'PUT',
            description: `Se actualizó la sucursal.\nInformación anterior: ${JSON.stringify(branch, null, 2)}\nInformación actualizada: ${JSON.stringify(updatedBranch, null, 2)}`,
            origin: 'branches/[id]',
            elementId: updatedBranch.id,
            success: true,
        });

        return NextResponse.json(updatedBranch, { status: 200 });
    } catch (error) {
        await createLog({
            action: 'PUT',
            description: formatErrorMessage(error),
            origin: 'branches/[id]',
            success: false,
        });
        return NextResponse.json({ error: formatErrorMessage(error) }, { status: 500 });
    }
}

// Eliminar sucursal por ID (soft delete)
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const { id } = params;

        // Verificar si la sucursal existe
        const branch = await findBranchById(id);
        if (!branch) {
            return NextResponse.json({ code: 'E_BRANCH_NOT_FOUND', message: 'Sucursal no encontrada' }, { status: 404 });
        }

        // Eliminar la sucursal
        await deleteBranchById(id);
        await createLog({
            action: 'DELETE',
            description: `Se eliminó la sucursal con la siguiente información: \n${JSON.stringify(branch, null, 2)}`,
            origin: 'branches/[id]',
            elementId: id,
            success: true,
        });

        return NextResponse.json({ message: 'Sucursal eliminada correctamente' });
    } catch (error) {
        await createLog({
            action: 'DELETE',
            description: formatErrorMessage(error),
            origin: 'branches/[id]',
            success: false,
        });
        return NextResponse.json({ error: formatErrorMessage(error) }, { status: 500 });
    }
}
