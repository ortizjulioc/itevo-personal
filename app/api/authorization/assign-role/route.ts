import { NextResponse, NextRequest } from "next/server";
import { assignRoleToUserInBranch } from "@/services/authorization-service";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { userId, branchId, roleId } = body;

        if (!userId || !branchId || !roleId) {
            return NextResponse.json({ error: 'Faltan datos obligatorios' }, { status: 400 });
        }

        const result = await assignRoleToUserInBranch(userId, branchId, roleId);

        return NextResponse.json(result, { status: 201 });
    } catch (error) {
        if (error instanceof Error) {
            return NextResponse.json({ error: 'Error asignando role', details: error.message }, { status: 500 });
        } else {
            return NextResponse.json(error, { status: 500 });
        }
    }
}
