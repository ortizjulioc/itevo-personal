import { NextResponse, NextRequest } from "next/server";
import { validateObject } from "@/utils";
import { getRoles, createrRole, findRoleByNormalizedName } from "@/services/role-service";

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const search = searchParams.get('search') || '';
        const page = parseInt(searchParams.get('page') || '1', 10);
        const top = parseInt(searchParams.get('top') || '10', 10);

        const { roles, totalRoles } = await getRoles(search, page, top);

        return NextResponse.json({
            roles,
            totalRoles,
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
        const {isValid, message} = validateObject(body, ['name', 'normalizedName']);
        if (!isValid) {
            return NextResponse.json({ code: 'E_MISSING_FIELDS', error: message }, { status: 400 });
        }

        // Normalizar el nombre del rol

        const roleNormalizedNameExists = await findRoleByNormalizedName(body);
        if (roleNormalizedNameExists) {
            return NextResponse.json({ error: 'Este rol ya está registrado' }, { status: 400 });
        }
        const role = await createrRole(body);
        // const role = await Prisma.role.create({ data: body });
        return NextResponse.json(role, { status: 201 });
    } catch (error) {
        if (error instanceof Error) {
            return NextResponse.json({ error: 'Error creando el usuario', details: error.message }, { status: 500 });
        } else {
            return NextResponse.json(error, { status: 500 });
        }
    }
}
