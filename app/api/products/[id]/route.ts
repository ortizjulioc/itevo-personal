import { NextRequest, NextResponse } from 'next/server';
import {
  findProductById,
  updateProductById,
  deleteProductById,
} from '@/services/product-service';
import { createLog } from '@/utils/log';
import { formatErrorMessage } from '@/utils/error-to-string';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/auth-options';
import Prisma from '@/utils/lib/prisma';
import { recordInventoryMovement } from '@/services/inventory-service';
import { MovementType } from '@/generated/prisma/client';

// Obtener producto por ID
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    const { id } = await params;

    const includeMovements = request.nextUrl.searchParams.get('includeMovements') === 'true';
    const product = await findProductById(id, false, Prisma, includeMovements);

    if (!product) {
      return NextResponse.json({ code: 'E_PRODUCT_NOT_FOUND'}, { status: 404 });
    }

    return NextResponse.json(product, { status: 200 });
  } catch (error) {
    await createLog({
      action: 'GET',
      description: formatErrorMessage(error),
      origin: 'products/[id]',
      success: false,
    });
    return NextResponse.json({ error: formatErrorMessage(error) }, { status: 500 });
  }
}

// Actualizar producto por ID
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    const { id } = await params;
    const body = await request.json();

    const existingProduct = await findProductById(id);

    if (!existingProduct) {
      return NextResponse.json({ code: 'E_PRODUCT_NOT_FOUND'}, { status: 404 });
    }

    const updatedProduct = await Prisma.$transaction(async (tx) => {
        const updated = await updateProductById(id, {
          ...body,
          branchId: body.branchId || session?.user?.mainBranch?.id || session?.user?.branches?.[0]?.id || null,
        }, tx);

        if (body.stock !== undefined && existingProduct.stock !== updated.stock) {
            const difference = updated.stock - existingProduct.stock;
            await recordInventoryMovement({
                productId: updated.id,
                quantity: Math.abs(difference),
                previousStock: existingProduct.stock,
                newStock: updated.stock,
                type: MovementType.ADJUST,
                reference: 'Edición',
                note: 'Ajuste manual de inventario',
                branchId: updated.branchId,
                createdBy: session?.user?.id as string || '',
                tx
            });
        }
        return updated;
    });

    await createLog({
      action: 'PUT',
      description: `Se actualizó el producto.\nAntes: ${JSON.stringify(existingProduct, null, 2)}\nDespués: ${JSON.stringify(updatedProduct, null, 2)}`,
      origin: 'products/[id]',
      elementId: updatedProduct.id,
      success: true,
    });

    return NextResponse.json(updatedProduct, { status: 200 });
  } catch (error) {
    await createLog({
      action: 'PUT',
      description: formatErrorMessage(error),
      origin: 'products/[id]',
      success: false,
    });
    return NextResponse.json({ error: formatErrorMessage(error) }, { status: 500 });
  }
}

// Eliminar producto por ID (soft delete)
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    const product = await findProductById(id);
    if (!product) {
      return NextResponse.json({ code: 'E_PRODUCT_NOT_FOUND'}, { status: 404 });
    }

    await deleteProductById(id);

    await createLog({
      action: 'DELETE',
      description: `Se eliminó el producto:\n${JSON.stringify(product, null, 2)}`,
      origin: 'products/[id]',
      elementId: id,
      success: true,
    });

    return NextResponse.json({ message: 'Producto eliminado correctamente' }, { status: 200 });
  } catch (error) {
    await createLog({
      action: 'DELETE',
      description: formatErrorMessage(error),
      origin: 'products/[id]',
      success: false,
    });
    return NextResponse.json({ error: formatErrorMessage(error) }, { status: 500 });
  }
}
