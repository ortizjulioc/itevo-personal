import { NextRequest, NextResponse } from 'next/server';
import { getCashRegisterClosureById, createCashRegisterClosure } from '@/services/cash-register-closure-service';
import { createLog } from '@/utils/log';
import { formatErrorMessage } from '@/utils/error-to-string';
import { findCashRegisterById, getCashRegisterMovementSummary } from '@/services/cash-register-service';
import { z } from 'zod';

const CreateClosureSchema = z.object({
  cashBreakdown: z.object({
    one: z.number().min(0),
    five: z.number().min(0),
    ten: z.number().min(0),
    twentyfive: z.number().min(0),
    fifty: z.number().min(0),
    hundred: z.number().min(0),
    twoHundred: z.number().min(0),
    fiveHundred: z.number().min(0),
    thousand: z.number().min(0),
    twoThousand: z.number().min(0),
  }),
  userId: z.string().uuid(),
  totalCash: z.number().min(0),
  totalCard: z.number().min(0),
  totalCheck: z.number().min(0),
  totalTransfer: z.number().min(0),
});

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

    const validatedData = CreateClosureSchema.parse(body);
    // Validate the request body
    if (!validatedData) {
      return NextResponse.json({ code: 'E_INVALID_REQUEST', message: 'Datos de cierre de caja inválidos' }, { status: 400 });
    }

    const cashRegister = await findCashRegisterById(id);
    if (!cashRegister) {
      return NextResponse.json({ code: 'E_CASH_REGISTER_NOT_FOUND', message: 'Caja registradora no encontrada' }, { status: 404 });
    }

    const { initialBalance, totalIncome, totalExpense, expectedTotal } = await getCashRegisterMovementSummary(id);
    const difference = (validatedData.totalCash + validatedData.totalCard + validatedData.totalCheck + validatedData.totalTransfer) - expectedTotal;
    const closureData = {
      closureDate: new Date(),
      cashBreakdown: validatedData.cashBreakdown,
      totalCash: validatedData.totalCash,
      totalCard: validatedData.totalCard,
      totalCheck: validatedData.totalCheck,
      totalTransfer: validatedData.totalTransfer,
      totalExpected: expectedTotal,
      initialBalance,
      difference,
      totalIncome,
      totalExpense,
      cashRegister: { connect: { id: id } },
      user: { connect: { id: validatedData.userId } },
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
