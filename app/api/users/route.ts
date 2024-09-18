import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { validateObject } from "@/utils/lib/validate-object";
const bcrypt = require('bcrypt');
const Prisma = new PrismaClient();

export async function GET(request: Request) {
    try {
        // Use Prisma to fetch all users from the database and return them as JSON
        // Select only the id, username, email, and username fields

        const users = await Prisma.user.findMany({
            select: {
                id: true,
                username: true,
                email: true,
                name: true,
                lastName: true,
                phone: true,
                password: false,
            },
        });

        return NextResponse.json(users);
    } catch (error) {
        return NextResponse.error();
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        console.log('BODY: ',body);

        // Validate the request body
        const {isValid, message} = validateObject({
            object: body,
            keysRequired: ['name', 'lastName', 'username', 'email', 'password']
        });
        if (!isValid) {
            return NextResponse.json({ error: message }, { status: 400 });
        }

        // verify if the user already exists
        const userEmailExists = await Prisma.user.findUnique({
            where: { email: body.email },
        });
        if (userEmailExists) {
            return NextResponse.json({ error: 'El email ya está registrado' }, { status: 400 });
        }

        const userUsernameExists = await Prisma.user.findUnique({
            where: { username: body.username },
        });
        if (userUsernameExists) {
            return NextResponse.json({ error: 'El nombre de usuario ya está registrado' }, { status: 400 });
        }

        const saltRounds = 10;
        const hash = bcrypt.hashSync(body.password, saltRounds);
        body.password = hash;

        const user = await Prisma.user.create({ data: body });
        return NextResponse.json(user, { status: 201 });
    } catch (error) {
        if (error instanceof Error) {
            return NextResponse.json({ error: 'Error creando el usuario', details: error.message }, { status: 500 });
        } else {
            return NextResponse.json({ error: 'Error desconocido' }, { status: 500 });
        }
    }
}
