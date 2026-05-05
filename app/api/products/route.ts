import { NextRequest, NextResponse } from 'next/server';
import { getProducts, createProduct } from '@/services/product-service';
import { createLog } from '@/utils/log';
import { formatErrorMessage } from '@/utils/error-to-string';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/auth-options';
import Prisma from '@/utils/lib/prisma';
import { recordInventoryMovement } from '@/services/inventory-service';
import { MovementType } from '@/generated/prisma/client';

// Obtener todos los productos con búsqueda y paginación
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const isSuperAdmin = session?.user?.roles?.some((role: any) => role.normalizedName === 'super_admin');
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') ?? '';
    const page = parseInt(searchParams.get('page') ?? '1');
    const top = parseInt(searchParams.get('top') ?? '10');

    const { products, totalProducts } = await getProducts(search, page, top, isSuperAdmin);
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
    const session = await getServerSession(authOptions);
    const body = await request.json();

    const newProduct = await Prisma.$transaction(async (tx) => {
        const created = await createProduct({
          ...body,
          branchId: body.branchId || session?.user?.mainBranch?.id || session?.user?.branches?.[0]?.id || null,
        }, tx);

        if (created.stock && created.stock !== 0) {
            await recordInventoryMovement({
                productId: created.id,
                quantity: created.stock,
                previousStock: 0,
                newStock: created.stock,
                type: MovementType.ADJUST,
                reference: 'Creación',
                note: 'Inventario inicial',
                branchId: created.branchId,
                tx
            });
        }
        return created;
    });

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
