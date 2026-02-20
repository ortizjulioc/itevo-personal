import { NextRequest, NextResponse } from 'next/server';
import { deleteInvoiceItem, findInvoiceById, updateInvoice } from '@/services/invoice-service';
import { createLog } from '@/utils/log';
import { formatErrorMessage } from '@/utils/error-to-string';
import { InvoiceItemType, PaymentStatus, PrismaClient } from '@prisma/client';
import { findProductById, updateProductById } from '@/services/product-service';
import { annularReceivablePayment, findAccountReceivableById, updateAccountReceivableById } from '@/services/account-receivable';
import { deleteEarningFromAccountsPayable, getAccountPayableByCourseBranchId } from '@/services/account-payable';

const Prisma = new PrismaClient();

// Handler DELETE para eliminar un ítem de la factura
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string; itemId: string }> }) {
  const { id, itemId } = await params; // ID de la factura y del ítem
  try {
    let invoiceUpdated;
    // Iniciar transacción
    await Prisma.$transaction(async (prisma) => {
      // Verificar que la factura existe y está en DRAFT
      const invoice = await findInvoiceById(id, prisma);
      if (!invoice) {
        throw new Error(`Factura con ID ${id} no encontrada`);
      }
      if (invoice.status !== 'DRAFT') {
        throw new Error(`Solo se pueden eliminar ítems de facturas en estado DRAFT (actual: ${invoice.status})`);
      }

      // Verificar que el ítem existe
      const item = invoice.items.find((i) => i.id === itemId);
      if (!item) {
        throw new Error(`Ítem con ID ${itemId} no encontrado en la factura ${id}`);
      }

      // Si es un producto, actualizar el stock
      if (item.type === InvoiceItemType.PRODUCT && item.productId) {
        const product = await findProductById(item.productId, prisma);
        if (!product) {
          throw new Error(`Producto con ID ${item.productId} no encontrado`);
        }
        // Actualizar stock del producto
        await updateProductById(item.productId, {
          stock: product.stock + (item.quantity || 0),
        }, prisma);
      } else if (item.type === InvoiceItemType.RECEIVABLE && item.accountReceivableId) {
        const { accountReceivable, receivablePayment } = await annularReceivablePayment({
          unitPrice: item.unitPrice || 0,
          accountReceivableId: item.accountReceivableId,
          invoiceId: id,
          prisma,
        });

        // Eliminar cuenta por pagar asociada si existe
        if (accountReceivable.courseBranchId) {
          const accountPayable = await prisma.accountPayable.findFirst({
            where: { courseBranchId: accountReceivable.courseBranchId },
          });

          if (accountPayable) {
            // Eliminar la ganancia asociada a la cuenta por pagar
            await deleteEarningFromAccountsPayable(accountPayable.id, receivablePayment.id, prisma);
          }
        }
      }

      // Eliminar el ítem de la factura
      await deleteInvoiceItem(itemId, prisma);

      // Recalcular subtotal e itbis totales de la factura
      const newItbis = invoice.itbis - (item.itbis || 0);
      const newSubtotal = invoice.subtotal - (item.subtotal || 0);
      invoiceUpdated = await updateInvoice(id, {
        subtotal: newSubtotal,
        itbis: newItbis,
      }, prisma);
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
