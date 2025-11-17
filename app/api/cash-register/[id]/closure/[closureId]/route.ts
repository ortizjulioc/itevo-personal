import { getCashRegisterClosureById } from "@/services/cash-register-closure-service";
import { formatErrorMessage } from "@/utils/error-to-string";
import { createLog } from "@/utils/log";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, { params }: { params: { id: string, closureId: string } }) {
    try {
        const { id, closureId } = params;
        const closure = await getCashRegisterClosureById(id, closureId);

        if (!closure) {
            return NextResponse.json({ code: 'E_CLOSURE_NOT_FOUND', message: 'Cierre de caja no encontrado' }, { status: 404 });
        }
        return NextResponse.json(closure, { status: 200 });
    }
    catch (error) {
        await createLog({
            action: 'GET',
            description: formatErrorMessage(error),
            origin: 'cash-register/[id]/closure/[closureId]',
            success: false,
        });
        return NextResponse.json({ error: formatErrorMessage(error) }, { status: 500 });
    }
}
