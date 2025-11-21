import { deleteCashMovement, getCashMovementById } from "@/services/cash-movement";
import { formatErrorMessage } from "@/utils/error-to-string";
import { createLog } from "@/utils/log";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, { params }: { params: { id: string, movementId: string } }) {
    try {
        const { movementId } = params;

        const cashMovement = await getCashMovementById(movementId);
        if (!cashMovement) {
            return NextResponse.json(
                { code: 'E_CASH_MOVEMENT_NOT_FOUND', message: 'Movimiento de caja no encontrado' },
                { status: 404 }
            );
        }

        return NextResponse.json(cashMovement, { status: 200 });
    } catch (error) {
        await createLog({
            action: 'GET',
            description: formatErrorMessage(error),
            origin: 'cash-register/[id]/cash-movements/[movementId]',
            success: false,
        });
        return NextResponse.json({ error: formatErrorMessage(error) }, { status: 500 });
    }
}


// 🔴 Anular (eliminar lógicamente) un movimiento de caja
export async function DELETE(request: NextRequest, { params }: { params: { id: string, movementId: string } }) {
  try {
    const { id, movementId } = params;

    const existing = await getCashMovementById(movementId);
    if (!existing) {
      return NextResponse.json(
        { code: 'E_CASH_MOVEMENT_NOT_FOUND', message: 'Movimiento de caja no encontrado' },
        { status: 404 }
      );
    }

    await deleteCashMovement(movementId);

    await createLog({
      action: 'DELETE',
      description: `Se anuló el movimiento de caja con la siguiente información: \n${JSON.stringify(existing, null, 2)}`,
      origin: 'cash-movement/[id]',
      elementId: id,
      success: true,
    });

    return NextResponse.json({ message: 'Movimiento de caja anulado correctamente' });
  } catch (error) {
    await createLog({
      action: 'DELETE',
      description: formatErrorMessage(error),
      origin: 'cash-movement/[id]',
      success: false,
    });
    return NextResponse.json({ error: formatErrorMessage(error) }, { status: 500 });
  }
}
