import { NextRequest, NextResponse } from 'next/server';
import { deleteInvoiceItem, findInvoiceById } from '@/services/invoice-service';
import { createLog } from '@/utils/log';
import { formatErrorMessage } from '@/utils/error-to-string';
import { PrismaClient } from '@prisma/client';

const Prisma = new PrismaClient();

// Handler DELETE para eliminar un ítem de la factura
export async function DELETE(req: NextRequest, { params }: { params: { id: string; itemId: string } }) {
  const { id, itemId } = params; // ID de la factura y del ítem
  try {
    // Verificar que la factura existe y está en DRAFT
    const invoice = await findInvoiceById(id);
    if (!invoice) {
      throw new Error(`Factura con ID ${id} no encontrada`);
    }
    if (invoice.status !== 'DRAFT') {
      throw new Error(`Solo se pueden eliminar ítems de facturas en estado DRAFT (actual: ${invoice.status})`);
    }

    // Verificar que el ítem pertenece a la factura y eliminarlo
    const itemToDelete = await Prisma.invoiceItem.findUnique({
      where: { id: itemId },
    });
    if (!itemToDelete || itemToDelete.invoiceId !== id) {
      throw new Error(`El ítem ${itemId} no pertenece a la factura ${id}`);
    }

    const invoiceUpdated = await deleteInvoiceItem(id, itemId);
    if (!invoiceUpdated) {
      throw new Error(`Error al eliminar el ítem ${itemId} de la factura ${id}`);
    }

    // Registrar log de éxito
    await createLog({
      action: 'DELETE',
      description: `Ítem: \n${JSON.stringify(itemToDelete, null, 2)} eliminado de la factura ${invoice.invoiceNumber}`,
      origin: `invoices/${id}/items/${itemId}`,
      elementId: invoiceUpdated.id,
      success: true,
    });

    return NextResponse.json(invoiceUpdated, { status: 200 });
  } catch (error) {
    // Registrar log de error
    await createLog({
      action: 'DELETE',
      description: `Error al eliminar ítem ${itemId} de la factura ${id}: ${formatErrorMessage(error)}`,
      origin: `invoices/${id}/items/${itemId}`,
      success: false,
    });

    return NextResponse.json({ error: formatErrorMessage(error) }, { status: 500 });
  }
}