import { NextResponse, NextRequest } from "next/server";
import { removeRoleFromUserInBranch } from "@/services/authorization-service";

export async function DELETE(request: NextRequest) {
    try {
        const body = await request.json();
        const { userId, branchId, roleId } = body;

        if (!userId || !branchId || !roleId) {
            return NextResponse.json({ error: 'Faltan datos obligatorios' }, { status: 400 });
        }

        await removeRoleFromUserInBranch(userId, branchId, roleId);

        return NextResponse.json({ message: 'Rol desasignado correctamente' }, { status: 200 });
    } catch (error) {
        if (error instanceof Error) {
            return NextResponse.json({ error: 'Error desasingando role', details: error.message }, { status: 500 });
        } else {
            return NextResponse.json(error, { status: 500 });
        }
    }
}
