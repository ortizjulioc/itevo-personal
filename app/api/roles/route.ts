import { NextResponse, NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";
import { validateObject } from "@/utils";
import { normalizeString } from "@/utils/normalize-string";
import { getRoles } from "@/services/role-service";
const Prisma = new PrismaClient();

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
        // Normalizando normalizedName
        body.normalizedName = normalizeString(body.normalizedName, { replacement: '-' });
        const roleNormalizedNameExists = await Prisma.role.findUnique({
            where: { normalizedName: body.normalizedName },
        });
        if (roleNormalizedNameExists) {
            return NextResponse.json({ error: 'Este rol ya está registrado' }, { status: 400 });
        }

        const role = await Prisma.role.create({ data: body });
        return NextResponse.json(role, { status: 201 });
    } catch (error) {
        if (error instanceof Error) {
            return NextResponse.json({ error: 'Error creando el usuario', details: error.message }, { status: 500 });
        } else {
            return NextResponse.json(error, { status: 500 });
        }
    }
}
