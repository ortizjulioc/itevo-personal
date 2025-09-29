import { NextRequest, NextResponse } from 'next/server';
import { validateObject } from '@/utils';
import { getCashBoxes, createCashBox } from '@/services/cash-box-service';
import { formatErrorMessage } from '@/utils/error-to-string';
import { createLog } from '@/utils/log';

// Obtener todas las cajas físicas (GET)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const page = parseInt(searchParams.get('page') || '1', 10);
    const top = parseInt(searchParams.get('top') || '10', 10);

    const { cashBoxes, totalCashBoxes } = await getCashBoxes(search, page, top);

    return NextResponse.json({ cashBoxes, total: totalCashBoxes }, { status: 200 });
  } catch (error) {
    await createLog({
      action: 'GET',
      description: formatErrorMessage(error),
      origin: 'cash-box',
      success: false,
    });
    return NextResponse.json({ error: formatErrorMessage(error) }, { status: 500 });
  }
}

// Crear una nueva caja física (POST)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validar campos obligatorios
    const { isValid, message } = validateObject(body, [
      'name',
      'branchId',
    ]);
    if (!isValid) {
      return NextResponse.json({ code: 'E_MISSING_FIELDS', error: message }, { status: 400 });
    }

    const cashBox = await createCashBox(body);

    await createLog({
      action: 'POST',
      description: `Se creó la caja física con la siguiente información: \n${JSON.stringify(cashBox, null, 2)}`,
      origin: 'cash-box',
      elementId: cashBox.id,
      success: true,
    });

    return NextResponse.json(cashBox, { status: 201 });
  } catch (error) {
    await createLog({
      action: 'POST',
      description: formatErrorMessage(error),
      origin: 'cash-box',
      success: false,
    });
    return NextResponse.json({ error: formatErrorMessage(error) }, { status: 500 });
  }
}
