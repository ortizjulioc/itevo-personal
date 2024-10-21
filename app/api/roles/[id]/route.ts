import { NextRequest, NextResponse } from 'next/server';
import { findRoleById, updateRoleById, deleteRoleById } from '@/services/role-service';
import { validateObject } from '@/utils';

// Obtener role por ID
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const { id } = params;

        const role = await findRoleById(id);

        if (!role) {
            return NextResponse.json({ code: 'E_ROLE_NOT_FOUND', message: 'Rol no encontrado' }, { status: 404 });
        }

        return NextResponse.json(role, { status: 200 });
    } catch (error) {
        if (error instanceof Error) {
            return NextResponse.json({ code: 'E_SERVER_ERROR', message: 'Error buscando el rol', details: error.message }, { status: 500 });
        } else {
            return NextResponse.json(error, { status: 500 });
        }
    }
}

// Actualizar role por ID
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const { id } = params;
        const body = await request.json();

        // Validar el cuerpo de la solicitud (usando la validación existente)
        const { isValid, message } = validateObject(body, ['name']);
        if (!isValid) {
            return NextResponse.json({ code: 'E_MISSING_FIELDS', message }, { status: 400 });
        }

        // Verificar si el rol existe
        const role = await findRoleById(id);
        if (!role) {
            return NextResponse.json({ code: 'E_ROLE_NOT_FOUND', message: 'Rol no encontrado' }, { status: 404 });
        }

        // Actualizar el rol
        const updatedRole = await updateRoleById(id, body);

        return NextResponse.json(updatedRole, { status: 200 });
    } catch (error) {
        if (error instanceof Error) {
            return NextResponse.json({ code: 'E_SERVER_ERROR', message: 'Error actualizando el rol', details: error.message }, { status: 500 });
        } else {
            return NextResponse.json(error, { status: 500 });
        }
    }
}

// Eliminar role por ID (soft delete)
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const { id } = params;

        // Verificar si el rol existe
        const role = await findRoleById(id);
        if (!role) {
            return NextResponse.json({ code: 'E_ROLE_NOT_FOUND', message: 'Rol no encontrado' }, { status: 404 });
        }

        // Eliminar el rol
        await deleteRoleById(id);

        return NextResponse.json({ message: 'role eliminado correctamente' });
    } catch (error) {
        if (error instanceof Error) {
            return NextResponse.json({ code: 'E_SERVER_ERROR', message: 'Error eliminando el rol', details: error.message }, { status: 500 });
        } else {
            return NextResponse.json(error, { status: 500 });
        }
    }
}
