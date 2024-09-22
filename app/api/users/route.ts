import { NextResponse, NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";
import { validateObject } from "@/utils";
import { normalizeString } from "@/utils/normalize-string";
import { getUsers } from "@/services/user-service";
const bcrypt = require('bcrypt');
const Prisma = new PrismaClient();

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const search = searchParams.get('search') || '';
        const page = parseInt(searchParams.get('page') || '1', 10);
        const top = parseInt(searchParams.get('top') || '10', 10);

        const { users, totalUsers } = await getUsers(search, page, top);

        return NextResponse.json({
            users,
            totalUsers,
        }, { status: 200 });
    } catch (error) {
        if (error instanceof Error) {
            return NextResponse.json({ error: 'Error obteniendo los usuarios', details: error.message }, { status: 500 });
        } else {
            return NextResponse.json(error, { status: 500 });
        }
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        console.log('BODY: ',body);

        // Validate the request body
        const {isValid, message} = validateObject(body, ['name', 'lastName', 'username', 'email', 'password']);
        if (!isValid) {
            return NextResponse.json({ code: 'E_MISSING_FIELDS', error: message }, { status: 400 });
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
        body.search = normalizeString(`${body.name} ${body.lastName} ${body.username} ${body.email}`);

        const user = await Prisma.user.create({ data: body });
        return NextResponse.json(user, { status: 201 });
    } catch (error) {
        if (error instanceof Error) {
            return NextResponse.json({ error: 'Error creando el usuario', details: error.message }, { status: 500 });
        } else {
            return NextResponse.json(error, { status: 500 });
        }
    }
}
