import { NextRequest, NextResponse } from 'next/server';
import { validateObject } from '@/utils';
import { getNcfRanges, createNcfRange } from '@/services/ncf-range-service';
import { formatErrorMessage } from '@/utils/error-to-string';
import { createLog } from '@/utils/log';
import { NcfType } from '@prisma/client';

// Obtener todos los rangos de NCF con búsqueda y paginación
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const page = parseInt(searchParams.get('page') || '1', 10);
    const top = parseInt(searchParams.get('top') || '10', 10);

    const { ncfRanges, totalNcfRanges } = await getNcfRanges(search, page, top);

    return NextResponse.json({
      ncfRanges,
      totalNcfRanges,
    }, { status: 200 });
  } catch (error) {
    await createLog({
      action: 'GET',
      description: formatErrorMessage(error),
      origin: 'ncf-ranges',
      success: false,
    });
    return NextResponse.json({ error: formatErrorMessage(error) }, { status: 500 });
  }
}

// Crear un nuevo rango de NCF
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validación de campos requeridos
    const { isValid, message } = validateObject(body, [
      'prefix',
      'type',
      'startSequence',
      'endSequence',
      'currentSequence',
      'dueDate',
      'authorizationNumber',
    ]);

    if (!Object.values(NcfType).includes(body.type)) {
        return NextResponse.json({
          code: 'E_INVALID_TYPE_NCF',
          message: `El tipo de NCF debe ser uno de los siguientes: ${Object.values(NcfType).join(', ')}`,
        }, { status: 400 });
      }

    if (!isValid) {
      return NextResponse.json({ code: 'E_MISSING_FIELDS', error: message }, { status: 400 });
    }

    const ncfRange = await createNcfRange(body);

    await createLog({
      action: 'POST',
      description: `Se creó el rango NCF con la siguiente información: \n${JSON.stringify(ncfRange, null, 2)}`,
      origin: 'ncf-ranges',
      elementId: ncfRange.id,
      success: true,
    });

    return NextResponse.json(ncfRange, { status: 201 });
  } catch (error) {
    await createLog({
      action: 'POST',
      description: formatErrorMessage(error),
      origin: 'ncf-ranges',
      success: false,
    });
    return NextResponse.json({ error: formatErrorMessage(error) }, { status: 500 });
  }
}
