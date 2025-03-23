import { NextResponse, NextRequest } from "next/server";
import { removeRoleFromUserInBranch } from "@/services/authorization-service";
import { formatErrorMessage } from "@/utils/error-to-string";
import { createLog } from "@/utils/log";

export async function DELETE(request: NextRequest) {
    try {
        const body = await request.json();
        const { userId, branchId, roleId } = body;

        if (!userId || !branchId || !roleId) {
            return NextResponse.json({ error: 'Faltan datos obligatorios' }, { status: 400 });
        }

        await removeRoleFromUserInBranch(userId, branchId, roleId);

        // Enviar log de auditoría

        await createLog({
            action: "DELETE",
            description: `Se desasignó un rol a un usuario con los siguientes datos: ${JSON.stringify(body, null, 2)}`,
            origin: "authorization/remove-role",
            elementId: userId,
            success: true,
        });

        return NextResponse.json({ message: 'Rol desasignado correctamente' }, { status: 200 });
    } catch (error) {

        // Enviar log de auditoría

        await createLog({
            action: "DELETE",
            description: `Error al desasignar un rol a un usuario: ${formatErrorMessage(error)}`,
            origin: "authorization/remove-role",
            elementId: request.headers.get("origin") || "",
            success: false,
        });

        return NextResponse.json({ error: formatErrorMessage(error)},{ status: 500});
    }
}
