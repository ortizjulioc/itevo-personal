import { getCashRegisterClosureById } from "@/services/cash-register-closure-service";
import { getCashRegisterInvoicesSummary } from "@/services/cash-register-service";
import { formatErrorMessage } from "@/utils/error-to-string";
import { Prisma } from "@/utils/lib/prisma";
import { createLog } from "@/utils/log";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string, closureId: string }> }) {
    try {
        const { id, closureId } = await params;
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

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string, closureId: string }> }) {
    try {
        const { id, closureId } = await params;

        const closure = await Prisma.cashRegisterClosure.findUnique({
            where: { id: closureId },
        });

        if (!closure) {
            return NextResponse.json({ code: "E_NOT_FOUND", message: "Cierre no encontrado" }, { status: 404 });
        }

        // Recalcular con los datos existentes
        const {
            totalCash: expectedTotalCash,
            totalBankTransfer: expectedTotalTransfer,
            totalCreditCard: expectedTotalCard,
            totalCheck: expectedTotalCheck,
        } = await getCashRegisterInvoicesSummary(id);

        const updated = await Prisma.cashRegisterClosure.update({
            where: { id: closureId, cashRegisterId: id },
            data: {
                expectedTotalCash: closure.initialBalance + expectedTotalCash - closure.totalExpense,
                expectedTotalCard,
                expectedTotalCheck,
                expectedTotalTransfer
            }
        });

        return NextResponse.json(updated, { status: 200 });

    } catch (error) {
        return NextResponse.json({ error: formatErrorMessage(error) }, { status: 500 });
    }
}
