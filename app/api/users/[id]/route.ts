import { NextRequest, NextResponse } from 'next/server';
import { findUserById, updateUserById, deleteUserById } from '@/services/user-service';
import { validateObject } from '@/utils';
import { formatErrorMessage } from '@/utils/error-to-string';

// Obtener usuario por ID
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const { id } = params;

        const user = await findUserById(id);

        if (!user) {
            return NextResponse.json({ code: 'E_USER_NOT_FOUND', message: 'Usuario no encontrado' }, { status: 404 });
        }

        return NextResponse.json(user, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: formatErrorMessage(error)},{ status: 500});
    }
}

// Actualizar usuario por ID
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const { id } = params;
        const body = await request.json();

        // Validar el cuerpo de la solicitud (usando la validación existente)
        const { isValid, message } = validateObject(body, ['name', 'lastName', 'username', 'email']);
        if (!isValid) {
            return NextResponse.json({ code: 'E_MISSING_FIELDS', message }, { status: 400 });
        }

        // Verificar si el usuario existe
        const user = await findUserById(id);
        if (!user) {
            return NextResponse.json({ code: 'E_USER_NOT_FOUND', message: 'Usuario no encontrado' }, { status: 404 });
        }

        // Actualizar el usuario
        const updatedUser = await updateUserById(id, body);

        return NextResponse.json(updatedUser, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: formatErrorMessage(error)},{ status: 500});
    }
}

// Eliminar usuario por ID (soft delete)
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const { id } = params;

        // Verificar si el usuario existe
        const user = await findUserById(id);
        if (!user) {
            return NextResponse.json({ code: 'E_USER_NOT_FOUND', message: 'Usuario no encontrado' }, { status: 404 });
        }

        // Eliminar el usuario
        await deleteUserById(id);

        return NextResponse.json({ message: 'Usuario eliminado correctamente' });
    } catch (error) {
        return NextResponse.json({ error: formatErrorMessage(error)},{ status: 500});
    }
}
