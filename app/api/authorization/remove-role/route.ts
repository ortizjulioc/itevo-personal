import { NextResponse, NextRequest } from "next/server";
import { removeRoleFromUserInBranch } from "@/services/authorization-service";
import { formatErrorMessage } from "@/utils/error-to-string";

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
        return NextResponse.json({ error: formatErrorMessage(error)},{ status: 500});
    }
}
