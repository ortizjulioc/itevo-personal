import { NextRequest, NextResponse } from 'next/server';
import { validateObject } from '@/utils';
import { getCashRegisters, createCashRegister } from '@/services/cash-register-service';
import { formatErrorMessage } from '@/utils/error-to-string';
import { createLog } from '@/utils/log';

// Obtener todas las cajas registradoras (GET)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const page = parseInt(searchParams.get('page') || '1', 10);
    const top = parseInt(searchParams.get('top') || '10', 10);

    const { cashRegisters, total } = await getCashRegisters(search, page, top);

    return NextResponse.json({ cashRegisters, total }, { status: 200 });
  } catch (error) {
    await createLog({
      action: 'GET',
      description: formatErrorMessage(error),
      origin: 'cash-register',
      success: false,
    });
    return NextResponse.json({ error: formatErrorMessage(error) }, { status: 500 });
  }
}

// Crear una nueva caja registradora (POST)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validar campos obligatorios
    const { isValid, message } = validateObject(body, [
      'branchId',
      'userId',
      'initialBalance',
      'openingDate',
    ]);
    if (!isValid) {
      return NextResponse.json({ code: 'E_MISSING_FIELDS', error: message }, { status: 400 });
    }

    const cashRegister = await createCashRegister(body);

    await createLog({
      action: 'POST',
      description: `Se creó la caja registradora con la siguiente información: \n${JSON.stringify(cashRegister, null, 2)}`,
      origin: 'cash_register',
      elementId: cashRegister.id,
      success: true,
    });

    return NextResponse.json(cashRegister, { status: 201 });
  } catch (error) {
    await createLog({
      action: 'POST',
      description: formatErrorMessage(error),
      origin: 'cash-register',
      success: false,
    });
    return NextResponse.json({ error: formatErrorMessage(error) }, { status: 500 });
  }
}
