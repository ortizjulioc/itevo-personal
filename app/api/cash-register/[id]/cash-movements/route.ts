import { NextRequest, NextResponse } from 'next/server';
import { createCashMovement, getCashMovementsByCashRegisterId } from '@/services/cash-movement';
import { createLog } from '@/utils/log';
import { formatErrorMessage } from '@/utils/error-to-string';
import { validateObject } from '@/utils';

// Get cash movements by cash register ID
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    const cashMovements = await getCashMovementsByCashRegisterId(id);

    return NextResponse.json(cashMovements, { status: 200 });
  } catch (error) {
    await createLog({
      action: 'GET',
      description: formatErrorMessage(error),
      origin: 'cash-register/[id]/cash-movements',
      success: false,
    });
    return NextResponse.json({ error: formatErrorMessage(error) }, { status: 500 });
  }
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: cashRegisterId } = await params;
    const body = await request.json();

    // Validar campos obligatorios
    const { isValid, message } = validateObject(body, [
      'type',
      'amount',
      'createdBy',
    ]);
    if (!isValid) {
      return NextResponse.json({ code: 'E_MISSING_FIELDS', error: message }, { status: 400 });
    }

    const cashMovement = await createCashMovement({
      cashRegister: { connect: { id: cashRegisterId } },
      type: body.type,
      amount: body.amount,
      description: body.description || null,
      referenceType: body.referenceType || null,
      referenceId: body.referenceId || null,
      user: { connect: { id: body.createdBy } },
    });

    await createLog({
      action: 'POST',
      description: `Se creó un movimiento de caja con la siguiente información: \n${JSON.stringify(cashMovement, null, 2)}`,
      origin: 'cash-movement',
      elementId: cashMovement.id,
      success: true,
    });

    return NextResponse.json(cashMovement, { status: 201 });
  } catch (error) {
    await createLog({
      action: 'POST',
      description: formatErrorMessage(error),
      origin: 'cash-movement',
      success: false,
    });
    return NextResponse.json({ error: formatErrorMessage(error) }, { status: 500 });
  }
}
