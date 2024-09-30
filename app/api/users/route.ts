import { NextResponse, NextRequest } from "next/server";
import { validateObject } from "@/utils";
import { getUsers, createUser, findUserByEmail, findUserByUsername } from "@/services/user-service";


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
        const userEmailExists = await findUserByEmail(body.email);

        if (userEmailExists) {
            return NextResponse.json({ error: 'El email ya está registrado' }, { status: 400 });
        }
        // verify if the user already exists
        const userUsernameExists = await findUserByUsername(body.username);
        if (userUsernameExists) {
            return NextResponse.json({ error: 'El nombre de usuario ya está registrado' }, { status: 400 });
        }

        const user = await createUser(body);
        return NextResponse.json(user, { status: 201 });
    } catch (error) {
        if (error instanceof Error) {
            return NextResponse.json({ error: 'Error creando el usuario', details: error.message }, { status: 500 });
        } else {
            return NextResponse.json(error, { status: 500 });
        }
    }
}
