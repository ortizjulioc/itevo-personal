import { NextResponse, NextRequest } from "next/server";
import { validateObject } from "@/utils";
import { getUsers, createUser, findUserByEmail, findUserByUsername } from "@/services/user-service";
import { formatErrorMessage } from "@/utils/error-to-string";
import { createLog } from "@/utils/log";


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
        return NextResponse.json({ error: formatErrorMessage(error)},{ status: 500});
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();

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

        // Enviar log de auditoría

        await createLog({
            action: "POST",
            description: `Se creó un usuario con los siguientes datos: ${JSON.stringify(user, null, 2)}`,
            origin: "users",
            elementId: user.id,
            success: true,
        });

        return NextResponse.json(user, { status: 201 });
    } catch (error) {


        // Enviar log de auditoría

        await createLog({
            action: "POST",
            description: `Error al crear un usuario: ${formatErrorMessage(error)}`,
            origin: "users",
            success: false,
        });

        return NextResponse.json({ error: formatErrorMessage(error)},{ status: 500});
    }
}
