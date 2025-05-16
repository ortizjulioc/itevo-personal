import { NextResponse, NextRequest } from "next/server";
import { assignRoleToUserInBranch } from "@/services/authorization-service";
import { formatErrorMessage } from "@/utils/error-to-string";
import { createLog } from "@/utils/log";
import { error } from "console";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { userId, branchId, roleId } = body;

        if (!userId || !branchId || !roleId) {
            return NextResponse.json({ code: 'E_MISSING_FIELDS' ,message:'Los campos userId, branchId y roleId son obligatorios.'}, { status: 400 });
        }

        const result = await assignRoleToUserInBranch(userId, branchId, roleId);


        // Enviar log de auditoría
        await createLog({
            action: "POST",
            description: `Se asignó un rol a un usuario con los siguientes datos: ${JSON.stringify(body, null, 2)}`,
            origin: "authorization/assign-role",
            elementId: userId,
            success: true,
        });
        return NextResponse.json(result, { status: 201 });
    } catch (error) {

        // Enviar log de auditoría

        await createLog({
            action: "POST",
            description: `Error al asignar un rol a un usuario: ${formatErrorMessage(error)}`,
            origin: "authorization/assign-role",
            elementId: request.headers.get("origin") || "",
            success: false,
        });
        return NextResponse.json({ error: formatErrorMessage(error)},{ status: 500});
    }
}
