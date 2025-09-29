import { NextRequest, NextResponse } from 'next/server';
import { findCashBoxById, updateCashBoxById, deleteCashBoxById } from '@/services/cash-box-service';
import { validateObject } from '@/utils';
import { createLog } from '@/utils/log';
import { formatErrorMessage } from '@/utils/error-to-string';

// Obtener caja física por ID
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;

    const cashBox = await findCashBoxById(id);

    if (!cashBox) {
      return NextResponse.json({ code: 'E_CASH_BOX_NOT_FOUND', message: 'Caja física no encontrada' }, { status: 404 });
    }

    return NextResponse.json(cashBox, { status: 200 });
  } catch (error) {
    await createLog({
      action: 'GET',
      description: formatErrorMessage(error),
      origin: 'cash-box/[id]',
      success: false,
    });
    return NextResponse.json({ error: formatErrorMessage(error) }, { status: 500 });
  }
}

// Actualizar caja física por ID
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const body = await request.json();

    // Validar campos obligatorios mínimos
    const { isValid, message } = validateObject(body, [
      'name',
      'branchId',
    ]);
    if (!isValid) {
      return NextResponse.json({ code: 'E_MISSING_FIELDS', message }, { status: 400 });
    }

    const existing = await findCashBoxById(id);
    if (!existing) {
      return NextResponse.json({ code: 'E_CASH_BOX_NOT_FOUND', message: 'Caja física no encontrada' }, { status: 404 });
    }

    const updated = await updateCashBoxById(id, body);

    await createLog({
      action: 'PUT',
      description: `Se actualizó la caja física.\nInformación anterior: ${JSON.stringify(existing, null, 2)}\nInformación actualizada: ${JSON.stringify(updated, null, 2)}`,
      origin: 'cash-box/[id]',
      elementId: updated.id,
      success: true,
    });

    return NextResponse.json(updated, { status: 200 });
  } catch (error) {
    await createLog({
      action: 'PUT',
      description: formatErrorMessage(error),
      origin: 'cash-box/[id]',
      success: false,
    });
    return NextResponse.json({ error: formatErrorMessage(error) }, { status: 500 });
  }
}

// Eliminar caja física por ID (soft delete)
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;

    const existing = await findCashBoxById(id);
    if (!existing) {
      return NextResponse.json({ code: 'E_CASH_BOX_NOT_FOUND', message: 'Caja física no encontrada' }, { status: 404 });
    }

    await deleteCashBoxById(id);

    await createLog({
      action: 'DELETE',
      description: `Se eliminó la caja física con la siguiente información: \n${JSON.stringify(existing, null, 2)}`,
      origin: 'cash-box/[id]',
      elementId: id,
      success: true,
    });

    return NextResponse.json({ message: 'Caja física eliminada correctamente' });
  } catch (error) {
    await createLog({
      action: 'DELETE',
      description: formatErrorMessage(error),
      origin: 'cash-box/[id]',
      success: false,
    });
    return NextResponse.json({ error: formatErrorMessage(error) }, { status: 500 });
  }
}
