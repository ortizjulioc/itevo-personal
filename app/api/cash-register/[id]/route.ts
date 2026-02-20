import { NextRequest, NextResponse } from 'next/server';
import { findCashRegisterById, updateCashRegisterById, deleteCashRegisterById } from '@/services/cash-register-service';
import { validateObject } from '@/utils';
import { createLog } from '@/utils/log';
import { formatErrorMessage } from '@/utils/error-to-string';

// Obtener caja registradora por ID
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    const cashRegister = await findCashRegisterById(id);

    if (!cashRegister) {
      return NextResponse.json({ code: 'E_CASH_REGISTER_NOT_FOUND', message: 'Caja registradora no encontrada' }, { status: 404 });
    }

    return NextResponse.json(cashRegister, { status: 200 });
  } catch (error) {
    await createLog({
      action: 'GET',
      description: formatErrorMessage(error),
      origin: 'cash_register/[id]',
      success: false,
    });
    return NextResponse.json({ error: formatErrorMessage(error) }, { status: 500 });
  }
}

// Actualizar caja registradora por ID
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();

    const { isValid, message } = validateObject(body, [
      'userId',
      'initialBalance',
      'openingDate',
    ]);
    if (!isValid) {
      return NextResponse.json({ code: 'E_MISSING_FIELDS', message }, { status: 400 });
    }

    const existing = await findCashRegisterById(id);
    if (!existing) {
      return NextResponse.json({ code: 'E_CASH_REGISTER_NOT_FOUND', message: 'Caja registradora no encontrada' }, { status: 404 });
    }

    const updated = await updateCashRegisterById(id, body);

    await createLog({
      action: 'PUT',
      description: `Se actualizó la caja registradora.\nInformación anterior: ${JSON.stringify(existing, null, 2)}\nInformación actualizada: ${JSON.stringify(updated, null, 2)}`,
      origin: 'cash-register/[id]',
      elementId: updated.id,
      success: true,
    });

    return NextResponse.json(updated, { status: 200 });
  } catch (error) {
    await createLog({
      action: 'PUT',
      description: formatErrorMessage(error),
      origin: 'cash-register/[id]',
      success: false,
    });
    return NextResponse.json({ error: formatErrorMessage(error) }, { status: 500 });
  }
}

// Eliminar caja registradora por ID (soft delete)
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    const existing = await findCashRegisterById(id);
    if (!existing) {
      return NextResponse.json({ code: 'E_CASH_REGISTER_NOT_FOUND', message: 'Caja registradora no encontrada' }, { status: 404 });
    }

    await deleteCashRegisterById(id);

    await createLog({
      action: 'DELETE',
      description: `Se eliminó la caja registradora con la siguiente información: \n${JSON.stringify(existing, null, 2)}`,
      origin: 'cash-register/[id]',
      elementId: id,
      success: true,
    });

    return NextResponse.json({ message: 'Caja registradora eliminada correctamente' });
  } catch (error) {
    await createLog({
      action: 'DELETE',
      description: formatErrorMessage(error),
      origin: 'cash-register/[id]',
      success: false,
    });
    return NextResponse.json({ error: formatErrorMessage(error) }, { status: 500 });
  }
}
