import { NextRequest, NextResponse } from 'next/server';
import { findProductByCode } from '@/services/product-service';
import { createLog } from '@/utils/log';
import { formatErrorMessage } from '@/utils/error-to-string';

export async function GET(request: NextRequest, { params }: { params: Promise<{ code: string }> }) {
  try {
    const { code: codeFromParams } = await params;
    if (!codeFromParams || isNaN(Number(codeFromParams))) {
      return NextResponse.json({ code: 'E_INVALID_CODE', message: 'Código de producto inválido' }, { status: 400 });
    }
    const code = parseInt(codeFromParams, 10);

    const product = await findProductByCode(code);

    if (!product) {
      return NextResponse.json({ code: 'E_PRODUCT_NOT_FOUND' }, { status: 404 });
    }

    return NextResponse.json(product, { status: 200 });
  } catch (error) {
    await createLog({
      action: 'GET',
      description: formatErrorMessage(error),
      origin: 'products/code/[code]',
      success: false,
    });
    return NextResponse.json({ error: formatErrorMessage(error) }, { status: 500 });
  }
}
