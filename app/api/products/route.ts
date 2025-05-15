import { NextRequest, NextResponse } from 'next/server';
import { getProducts, createProduct } from '@/services/product-service';
import { createLog } from '@/utils/log';
import { formatErrorMessage } from '@/utils/error-to-string';

// Obtener todos los productos con búsqueda y paginación
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') ?? '';
    const page = parseInt(searchParams.get('page') ?? '1');
    const top = parseInt(searchParams.get('top') ?? '10');

    const { products, totalProducts } = await getProducts(search, page, top);
    return NextResponse.json({ products, totalProducts }, { status: 200 });
  } catch (error) {
    await createLog({
      action: 'GET',
      description: formatErrorMessage(error),
      origin: 'products',
      success: false,
    });
    return NextResponse.json({ error: formatErrorMessage(error) }, { status: 500 });
  }
}

// Crear un nuevo producto
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const newProduct = await createProduct(body);

    await createLog({
      action: 'POST',
      description: `Se creó un nuevo producto:\n${JSON.stringify(newProduct, null, 2)}`,
      origin: 'products',
      elementId: newProduct.id,
      success: true,
    });

    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    await createLog({
      action: 'POST',
      description: formatErrorMessage(error),
      origin: 'products',
      success: false,
    });
    return NextResponse.json({ error: formatErrorMessage(error) }, { status: 500 });
  }
}
