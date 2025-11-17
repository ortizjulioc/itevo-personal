import { NextRequest, NextResponse } from 'next/server';
import { validateObject } from '@/utils';
import { getCashRegisters, createCashRegister } from '@/services/cash-register-service';
import { formatErrorMessage } from '@/utils/error-to-string';
import { createLog } from '@/utils/log';
import { CashRegisterStatus } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/auth-options';

// Obtener todas las cajas registradoras (GET)
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const page = parseInt(searchParams.get('page') || '1', 10);
    const top = parseInt(searchParams.get('top') || '10', 10);
    const userId = searchParams.get('userId') || '';
    const rawStatus = searchParams.get('status');
    const status = rawStatus && Object.values(CashRegisterStatus).includes(rawStatus as CashRegisterStatus)
      ? (rawStatus as CashRegisterStatus)
      : undefined;

    const { cashRegisters, total } = await getCashRegisters({
      search,
      page,
      top,
      userId,
      status,
      branchId: session.user.activeBranchId,
    });

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
      'userId',
      'initialBalance',
      'openingDate',
      'cashBoxId',
    ]);
    if (!isValid) {
      return NextResponse.json({ code: 'E_MISSING_FIELDS', error: message }, { status: 400 });
    }

    const cashRegister = await createCashRegister({
      user: { connect: { id: body.userId } },
      initialBalance: body.initialBalance,
      openingDate: new Date(body.openingDate),
      cashBox: { connect: { id: body.cashBoxId } },
    });

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
