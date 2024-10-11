import { NextResponse, NextRequest } from "next/server";
import { getUserRolesInBranch } from "@/services/authorization-service";

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');
        const branchId = searchParams.get('branchId');

        if (!userId || !branchId) {
            return NextResponse.json({ error: 'Faltan datos obligatorios' }, { status: 400 });
        }

        const roles = await getUserRolesInBranch(userId, branchId);

        return NextResponse.json({ roles }, { status: 200 });
    } catch (error) {
        if (error instanceof Error) {
            return NextResponse.json({ error: 'Error obteniendo roles', details: error.message }, { status: 500 });
        } else {
            return NextResponse.json(error, { status: 500 });
        }
    }
}
