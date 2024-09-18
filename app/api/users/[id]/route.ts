import { validateObject } from '@/utils';
import { normalizeString } from '@/utils/normalize-string';
import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';
const Prisma = new PrismaClient();
const bcrypt = require('bcrypt');

// Obtener usuario por ID
export async function GET(request: Request, { params }: { params: { id: string } }) {
    try {
        const { id } = params;

        const user = await Prisma.user.findUnique({
            select: {
                id: true,
                username: true,
                email: true,
                name: true,
                lastName: true,
                phone: true,
                password: false,
            },
            where: {
                id: id,
                deleted: false,
            },
        });

        if (!user) {
            return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
        }

        return NextResponse.json(user);
    } catch (error) {
        if (error instanceof Error) {
            return NextResponse.json({ error: 'Error creando el usuario', details: error.message }, { status: 500 });
        } else {
            return NextResponse.json(error, { status: 500 });
        }    }
}

// Actualizar usuario por ID
export async function PUT(request: Request, { params }: { params: { id: string } }) {
    try {
        const { id } = params;
        const body = await request.json();

        // Validar el cuerpo de la solicitud
        const { isValid, message } = validateObject({
            object: body,
            keysRequired: ['name', 'lastName', 'username', 'email'],
        });
        if (!isValid) {
            return NextResponse.json({ error: message }, { status: 400 });
        }

        // Verificar si el usuario existe
        const user = await Prisma.user.findUnique({
            where: { id },
        });
        if (!user || user.deleted) {
            return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
        }

        // Actualizar el campo password si está presente
        if (body.password) {
            const saltRounds = 10;
            body.password = bcrypt.hashSync(body.password, saltRounds);
        } else {
            delete body.password;
        }

        body.search = normalizeString(`${body.name} ${body.lastName} ${body.username} ${body.email}`);

        const updatedUser = await Prisma.user.update({
            where: { id },
            data: body,
        });

        return NextResponse.json(updatedUser);
    } catch (error) {
        if (error instanceof Error) {
            return NextResponse.json({ error: 'Error creando el usuario', details: error.message }, { status: 500 });
        } else {
            return NextResponse.json(error, { status: 500 });
        }
    }
}

// Eliminar usuario por ID
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    try {
        const { id } = params;

        // Verificar si el usuario existe
        const user = await Prisma.user.findUnique({
            where: { id },
        });
        if (!user || user.deleted) {
            return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
        }

        // Marcar el usuario como eliminado
        await Prisma.user.update({
            where: { id },
            data: { deleted: true },
        });

        return NextResponse.json({ message: 'Usuario eliminado correctamente' });
    } catch (error) {
        if (error instanceof Error) {
            return NextResponse.json({ error: 'Error creando el usuario', details: error.message }, { status: 500 });
        } else {
            return NextResponse.json(error, { status: 500 });
        }
    }
}
