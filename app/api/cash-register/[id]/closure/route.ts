import { NextRequest, NextResponse } from 'next/server';

import { getCashRegisterClosureById, createCashRegisterClosure } from '@/services/cash-register-closure-service';
import { validateObject } from '@/utils';
import { createLog } from '@/utils/log';
import { formatErrorMessage } from '@/utils/error-to-string';
import { findCashRegisterById } from '@/services/cash-register-service';
import { Prisma } from '@/utils/lib/prisma';
import { PrismaClient, Prisma as PrismaTypes } from '@prisma/client';

// Obtener cierre de caja por ID
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;

    const closure = await getCashRegisterClosureById(id);

    if (!closure) {
      return NextResponse.json({ code: 'E_CLOSURE_NOT_FOUND', message: 'Cierre de caja no encontrado' }, { status: 404 });
    }

    return NextResponse.json(closure, { status: 200 });
  } catch (error) {
    await createLog({
      action: 'GET',
      description: formatErrorMessage(error),
      origin: 'cash-register/[id]/closure',
      success: false,
    });
    return NextResponse.json({ error: formatErrorMessage(error) }, { status: 500 });
  }
}

// Crear cierre de caja
export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const body = await request.json();

    const { isValid, message } = validateObject(body, [
      'closingBalance',
      'cashBreakdown',
      'userId',
    ]);
    if (!isValid) {
      return NextResponse.json({ code: 'E_MISSING_FIELDS', message }, { status: 400 });
    }

    const cashRegister = await findCashRegisterById(id);
    if (!cashRegister) {
      return NextResponse.json({ code: 'E_CASH_REGISTER_NOT_FOUND', message: 'Caja registradora no encontrada' }, { status: 404 });
    }

    const closureData = {
      ...body,
      cashRegisterId: id,
      closingDate: new Date(),
    };

    const closure = await createCashRegisterClosure(closureData);

    await createLog({
      action: 'POST',
      description: `Se creó un nuevo cierre de caja.\nInformación del cierre: ${JSON.stringify(closure, null, 2)}`,
      origin: 'cash-register/[id]/closure',
      elementId: closure.id,
      success: true,
    });

    return NextResponse.json(closure, { status: 201 });
  } catch (error) {
    await createLog({
      action: 'POST',
      description: formatErrorMessage(error),
      origin: 'cash-register/[id]/closure',
      success: false,
    });
    return NextResponse.json({ error: formatErrorMessage(error) }, { status: 500 });
  }
}
