import { NextResponse, NextRequest } from "next/server";
import { getUserRolesInBranch } from "@/services/authorization-service";
import { formatErrorMessage } from "@/utils/error-to-string";

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');
        const branchId = searchParams.get('branchId');

        if (!userId || !branchId) {
            return NextResponse.json({ code: 'E_MISSING_FIELDS' ,message:'Los campos userId y branchId son obligatorios.' }, { status: 400 });
        }

        const roles = await getUserRolesInBranch(userId, branchId);

        return NextResponse.json({ roles }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: formatErrorMessage(error)},{ status: 500});
    }
}
