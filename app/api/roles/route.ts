import { NextResponse, NextRequest } from "next/server";
import { validateObject } from "@/utils";
import { getRoles, createrRole, findRoleByNormalizedName } from "@/services/role-service";
import { formatErrorMessage } from "@/utils/error-to-string";
import { createLog } from "@/utils/log";

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

        // Validate the request body
        const {isValid, message} = validateObject(body, ['name', 'normalizedName']);
        if (!isValid) {
            return NextResponse.json({ code: 'E_MISSING_FIELDS', error: message }, { status: 400 });
        }

        // Normalizar el nombre del rol

        const roleNormalizedNameExists = await findRoleByNormalizedName(body);
        if (roleNormalizedNameExists) {
            return NextResponse.json({ code: 'E_ROLE_EXISTS' }, { status: 400 });
        }
        const role = await createrRole(body);
        // const role = await Prisma.role.create({ data: body });

        // Enviar log de auditoría

        await createLog({
            action: "POST",
            description: `Se creó un rol con los siguientes datos: ${JSON.stringify(role, null, 2)}`,
            origin: "roles",
            elementId: role.id,
            success: true,
        });

        return NextResponse.json(role, { status: 201 });
    } catch (error) {

        // Enviar log de auditoría

        await createLog({
            action: "POST",
            description: `Error al crear un rol: ${formatErrorMessage(error)}`,
            origin: "roles",
            success: false,
        });
        return NextResponse.json({ error: formatErrorMessage(error)},{ status: 500});
    }
}
