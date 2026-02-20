import { NextRequest, NextResponse } from 'next/server';
import { validateObject } from '@/utils';
import { createLog } from '@/utils/log';
import { formatErrorMessage } from '@/utils/error-to-string';
import { PaymentStatus } from '@prisma/client';
import { cancelAccountReceivableById, findAccountReceivableById, updateAccountReceivableById } from '@/services/account-receivable';

// Obtener una cuenta por cobrar por ID
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    const accountReceivable = await findAccountReceivableById(id);

    if (!accountReceivable) {
      return NextResponse.json({ code: 'E_ACCOUNT_RECEIVABLE_NOT_FOUND' }, { status: 404 });
    }

    return NextResponse.json(accountReceivable, { status: 200 });
  } catch (error) {
    await createLog({
      action: 'GET',
      description: formatErrorMessage(error),
      origin: 'accounts-receivable/[id]',
      success: false,
    });
    return NextResponse.json({ error: formatErrorMessage(error) }, { status: 500 });
  }
}

// Actualizar una cuenta por cobrar por ID
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();

    // Validación de campos requeridos
    const { isValid, message } = validateObject(body, [
      'studentId',
      'courseBranchId',
      'amount',
      'dueDate',
    ]);

    if (!isValid) {
      return NextResponse.json({ code: 'E_MISSING_FIELDS', message }, { status: 400 });
    }

    // Validar el status si se proporciona
    if (body.status && !Object.values(PaymentStatus).includes(body.status)) {
      return NextResponse.json({
        code: 'E_INVALID_STATUS',
        message: `El estado debe ser uno de los siguientes: ${Object.values(PaymentStatus).join(', ')}`,
      }, { status: 400 });
    }

    const existing = await findAccountReceivableById(id);
    if (!existing) {
      return NextResponse.json({ code: 'E_ACCOUNT_RECEIVABLE_NOT_FOUND' }, { status: 404 });
    }

    const updated = await updateAccountReceivableById(id, {
      student: body.studentId,
      courseBranch: body.courseBranchId,
      amount: parseFloat(body.amount),
      dueDate: new Date(body.dueDate),
      status: body.status,
      amountPaid: body.amountPaid ? parseFloat(body.amountPaid) : undefined,
    });

    await createLog({
      action: 'PUT',
      description: `Se actualizó la cuenta por cobrar.\nAnterior: ${JSON.stringify(existing, null, 2)}\nActualizado: ${JSON.stringify(updated, null, 2)}`,
      origin: 'accounts-receivable/[id]',
      elementId: id,
      success: true,
    });

    return NextResponse.json(updated, { status: 200 });
  } catch (error) {
    await createLog({
      action: 'PUT',
      description: formatErrorMessage(error),
      origin: 'accounts-receivable/[id]',
      success: false,
    });
    return NextResponse.json({ error: formatErrorMessage(error) }, { status: 500 });
  }
}

// Cancelar (soft delete) una cuenta por cobrar por ID
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    const existing = await findAccountReceivableById(id);
    if (!existing) {
      return NextResponse.json({ code: 'E_ACCOUNT_RECEIVABLE_NOT_FOUND' }, { status: 404 });
    }

    await cancelAccountReceivableById(id);

    await createLog({
      action: 'DELETE',
      description: `Se canceló la cuenta por cobrar con la siguiente información:\n${JSON.stringify(existing, null, 2)}`,
      origin: 'accounts-receivable/[id]',
      elementId: id,
      success: true,
    });

    return NextResponse.json({ message: 'Cuenta por cobrar cancelada correctamente' }, { status: 200 });
  } catch (error) {
    await createLog({
      action: 'DELETE',
      description: formatErrorMessage(error),
      origin: 'accounts-receivable/[id]',
      success: false,
    });
    return NextResponse.json({ error: formatErrorMessage(error) }, { status: 500 });
  }
}