import { NextRequest, NextResponse } from 'next/server';
import {
  findNcfRangeById,
  updateNcfRangeById,
  deleteNcfRangeById,
} from '@/services/ncf-range-service';
import { validateObject } from '@/utils';
import { createLog } from '@/utils/log';
import { formatErrorMessage } from '@/utils/error-to-string';

// Obtener un rango de NCF por ID
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;

    const ncfRange = await findNcfRangeById(id);

    if (!ncfRange) {
      return NextResponse.json({ code: 'E_NCF_RANGE_NOT_FOUND' }, { status: 404 });
    }

    return NextResponse.json(ncfRange, { status: 200 });
  } catch (error) {
    await createLog({
      action: 'GET',
      description: formatErrorMessage(error),
      origin: 'ncf-ranges/[id]',
      success: false,
    });
    return NextResponse.json({ error: formatErrorMessage(error) }, { status: 500 });
  }
}

// Actualizar un rango de NCF por ID
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const body = await request.json();

    const { isValid, message } = validateObject(body, [
      'prefix',
      'type',
      'startSequence',
      'endSequence',
      'currentSequence',
      'dueDate',
      'authorizationNumber',
    ]);

    if (!isValid) {
      return NextResponse.json({ code: 'E_MISSING_FIELDS', message }, { status: 400 });
    }

    const existing = await findNcfRangeById(id);
    if (!existing) {
      return NextResponse.json({ code: 'E_NCF_RANGE_NOT_FOUND' }, { status: 404 });
    }

    const updated = await updateNcfRangeById(id, body);

    await createLog({
      action: 'PUT',
      description: `Se actualizó el rango NCF.\nAnterior: ${JSON.stringify(existing, null, 2)}\nActualizado: ${JSON.stringify(updated, null, 2)}`,
      origin: 'ncf-ranges/[id]',
      elementId: id,
      success: true,
    });

    return NextResponse.json(updated, { status: 200 });
  } catch (error) {
    await createLog({
      action: 'PUT',
      description: formatErrorMessage(error),
      origin: 'ncf-ranges/[id]',
      success: false,
    });
    return NextResponse.json({ error: formatErrorMessage(error) }, { status: 500 });
  }
}

// Eliminar (soft delete) un rango de NCF por ID
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;

    const existing = await findNcfRangeById(id);
    if (!existing) {
      return NextResponse.json({ code: 'E_NCF_RANGE_NOT_FOUND' }, { status: 404 });
    }

    await deleteNcfRangeById(id);

    await createLog({
      action: 'DELETE',
      description: `Se eliminó (inactivó) el rango NCF con la siguiente información:\n${JSON.stringify(existing, null, 2)}`,
      origin: 'ncf-ranges/[id]',
      elementId: id,
      success: true,
    });

    return NextResponse.json({ message: 'Rango NCF eliminado correctamente' }, { status: 200 });
  } catch (error) {
    await createLog({
      action: 'DELETE',
      description: formatErrorMessage(error),
      origin: 'ncf-ranges/[id]',
      success: false,
    });
    return NextResponse.json({ error: formatErrorMessage(error) }, { status: 500 });
  }
}
