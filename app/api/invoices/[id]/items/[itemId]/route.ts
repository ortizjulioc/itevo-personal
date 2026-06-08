import { NextRequest, NextResponse } from 'next/server';
import { deleteInvoiceItem, findInvoiceById, updateInvoice } from '@/services/invoice-service';
import { createLog } from '@/utils/log';
import { formatErrorMessage } from '@/utils/error-to-string';
import { InvoiceItemType, MovementType, PaymentStatus } from '@/generated/prisma/client';
import { findProductById, updateProductById } from '@/services/product-service';
import { recordInventoryMovement } from '@/services/inventory-service';
import { annularReceivablePayment, findAccountReceivableById, updateAccountReceivableById } from '@/services/account-receivable';
import { deleteEarningFromAccountsPayable, getAccountPayableByCourseBranchId } from '@/services/account-payable';
import Prisma from '@/utils/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth-options';

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string; itemId: string }> }) {
    const { id, itemId } = await params;
    try {
        const session = await getServerSession(authOptions);
        const { quantity } = await req.json();

        if (!quantity || quantity <= 0) {
            return NextResponse.json({ error: 'La cantidad debe ser mayor a 0' }, { status: 400 });
        }

        let invoiceUpdated;
        await Prisma.$transaction(async (prisma) => {
            const invoice = await findInvoiceById(id, prisma);
            if (!invoice) throw new Error(`Factura con ID ${id} no encontrada`);
            if (invoice.status !== 'DRAFT') throw new Error('Solo se pueden editar ítems de facturas en estado DRAFT');

            const item = invoice.items.find((i) => i.id === itemId);
            if (!item) throw new Error(`Ítem ${itemId} no encontrado`);

            const oldQty = item.quantity || 0;
            const diff = quantity - oldQty;

            if (item.type === InvoiceItemType.PRODUCT && item.productId) {
                const product = await findProductById(item.productId);
                if (!product) throw new Error('Producto no encontrado');

                if (!product.billingWithoutStock && diff > 0 && product.stock < diff) {
                    throw new Error(`Stock insuficiente. Disponible: ${product.stock}`);
                }

                const movType = diff > 0 ? MovementType.OUT : MovementType.IN;
                const absDiff = Math.abs(diff);
                if (absDiff > 0) {
                    await recordInventoryMovement({
                        productId: product.id,
                        quantity: absDiff,
                        previousStock: product.stock,
                        newStock: product.stock - diff,
                        type: movType,
                        reference: id,
                        note: 'Ajuste de cantidad en factura',
                        branchId: product.branchId || null,
                        createdBy: session?.user?.id as string || '',
                        tx: prisma,
                    });
                    await updateProductById(item.productId, { stock: product.stock - diff }, prisma);
                }
            }

            const newSubtotal = (item.unitPrice || 0) * quantity;
            const taxRate = item.itbis && oldQty > 0 ? item.itbis / item.subtotal : 0;
            const newItbis = newSubtotal * taxRate;

            await prisma.invoiceItem.update({
                where: { id: itemId },
                data: { quantity, subtotal: newSubtotal, itbis: newItbis },
            });

            const subtotalDiff = newSubtotal - item.subtotal;
            const itbisDiff = newItbis - (item.itbis || 0);
            invoiceUpdated = await updateInvoice(id, {
                subtotal: invoice.subtotal + subtotalDiff,
                itbis: invoice.itbis + itbisDiff,
            }, prisma);
        });

        return NextResponse.json(invoiceUpdated, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: formatErrorMessage(error) }, { status: 500 });
    }
}

// Handler DELETE para eliminar un ítem de la factura
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string; itemId: string }> }) {
    const { id, itemId } = await params; // ID de la factura y del ítem
    try {
        const session = await getServerSession(authOptions);
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
                const product = await findProductById(item.productId);
                if (!product) {
                    throw new Error(`Producto con ID ${item.productId} no encontrado`);
                }
                // Registrar movimiento de inventario IN
                await recordInventoryMovement({
                    productId: product.id,
                    quantity: item.quantity || 0,
                    previousStock: product.stock,
                    newStock: product.stock + (item.quantity || 0),
                    type: MovementType.IN,
                    reference: id,
                    note: `Ítem eliminado de la factura`,
                    branchId: product.branchId || null,
                    createdBy: session?.user?.id as string || '',
                    tx: prisma,
                });

                // Actualizar stock del producto
                await updateProductById(
                    item.productId,
                    {
                        stock: product.stock + (item.quantity || 0),
                    },
                    prisma
                );
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
            invoiceUpdated = await updateInvoice(
                id,
                {
                    subtotal: newSubtotal,
                    itbis: newItbis,
                },
                prisma
            );
        });

        await createLog({
            action: 'DELETE',
            description: `Se eliminó el ítem con ID: ${itemId} de la factura con ID: ${id}`,
            origin: `invoices/[id]/items/[itemId]`,
            elementId: itemId,
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
