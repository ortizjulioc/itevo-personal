import { NextRequest, NextResponse } from 'next/server';
import { findBranchById, updateBranchById, deleteBranchById } from '@/services/branch-service';
import { validateObject } from '@/utils';

// Obtener sucursal por ID
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        console.log('GET BRANCH BY ID: ', request);
        const { id } = params;

        const branch = await findBranchById(id);

        if (!branch) {
            return NextResponse.json({ code: 'E_BRANCH_NOT_FOUND', message: 'Sucural no encontrada' }, { status: 404 });
        }

        return NextResponse.json(branch, { status: 200 });
    } catch (error) {
        if (error instanceof Error) {
            return NextResponse.json({ code: 'E_SERVER_ERROR', message: 'Error buscando la sucursal', details: error.message }, { status: 500 });
        } else {
            return NextResponse.json(error, { status: 500 });
        }
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

        return NextResponse.json(updatedBranch, { status: 200 });
    } catch (error) {
        if (error instanceof Error) {
            return NextResponse.json({ code: 'E_SERVER_ERROR', message: 'Error actualizando la sucursal', details: error.message }, { status: 500 });
        } else {
            return NextResponse.json(error, { status: 500 });
        }
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

        return NextResponse.json({ message: 'Sucursal eliminada correctamente' });
    } catch (error) {
        if (error instanceof Error) {
            return NextResponse.json({ code: 'E_SERVER_ERROR', message: 'Error eliminando la sucursal', details: error.message }, { status: 500 });
        } else {
            return NextResponse.json(error, { status: 500 });
        }
    }
}
