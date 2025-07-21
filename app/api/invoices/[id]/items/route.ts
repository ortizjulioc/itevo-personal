import { addNewEarningToAccountsPayable, getAccountPayableByCourseBranchId } from '@/services/account-payable';
import { processReceivablePayment } from '@/services/account-receivable';
import { findCourseBranchById } from '@/services/course-branch-service';
import { addNewItemToInvoice, findInvoiceById } from '@/services/invoice-service';
import { findProductById, updateProductById } from '@/services/product-service';
import { formatErrorMessage } from '@/utils/error-to-string';
import { Prisma } from '@/utils/lib/prisma';
import { createLog } from '@/utils/log';
import { AccountReceivable, CourseBranch, InvoiceItemType, PaymentStatus } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';


// Tipo para los datos de entrada del ítem
interface InvoiceItemInput {
    type: InvoiceItemType;
    productId: string | null;
    accountReceivableId: string | null;
    quantity: number;
    unitPrice: number;
    concept: string;
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
    const { id } = params; // ID de la factura
    try {
        const body: InvoiceItemInput = await req.json();

        // Verificar que la factura existe y está en DRAFT
        const invoice = await findInvoiceById(id);
        if (!invoice) {
            throw new Error(`Factura con ID ${id} no encontrada`);
        }
        if (invoice.status !== 'DRAFT') {
            throw new Error(`Solo se pueden agregar ítems a facturas en estado DRAFT (actual: ${invoice.status})`);
        }

        // Calcular subtotal e itbis del ítem
        let subtotal = body.unitPrice * body.quantity;
        let itbis = 0;

        await Prisma.$transaction(async (prisma) => {
            // Validar y calcular impuestos según el tipo de ítem
            if (body.type === InvoiceItemType.PRODUCT && body.productId) {
                const product = await findProductById(body.productId);

                if (!product) {
                    throw new Error(`Producto ${body.productId} no encontrado`);
                }
                if (product.stock < body.quantity) {
                    throw new Error(`Stock insuficiente para el producto ${body.productId} (disponible: ${product.stock})`);
                }

                if (product.isTaxIncluded) {
                    const total = subtotal;
                    subtotal = total / (1 + product.taxRate);
                    itbis = total - subtotal;
                } else {
                    itbis = subtotal * product.taxRate;
                }

                body.concept = product.name;
                // Actualizar el stock del producto
                await updateProductById(body.productId, {
                    stock: product.stock - body.quantity,
                }, prisma);
            } else if (body.type === InvoiceItemType.RECEIVABLE && body.accountReceivableId) {
                const { accountReceivable, receivablePayment } = await processReceivablePayment({
                    unitPrice: body.unitPrice,
                    accountReceivableId: body.accountReceivableId,
                    invoiceId: id,
                    prisma,
                })

                const courseBranch = await findCourseBranchById(accountReceivable.courseBranchId, prisma);

                // Crear/actualizar cuenta por pagar
                const accountPayable = await getAccountPayableByCourseBranchId({
                    courseBranchId: accountReceivable.courseBranchId,
                    prisma,
                });

                // Agregar ganancia a la cuenta por pagar
                await addNewEarningToAccountsPayable(
                    accountPayable.id,
                    courseBranch.commissionAmount || ((courseBranch.amount || 0) * (courseBranch.commissionRate || 0)) || 0,
                    receivablePayment.id,
                    prisma
                );

                if (!accountPayable) {
                    throw new Error(`Cuenta por pagar no encontrada para la cuenta por cobrar ${body.accountReceivableId}`);
                }

            } else if (body.type === InvoiceItemType.CUSTOM && (!body.unitPrice || body.quantity <= 0)) {
                throw new Error('Para ítems CUSTOM, unitPrice y quantity deben ser válidos');
            }
            const { invoiceUpdated, itemCreated} = await addNewItemToInvoice(id, {
                type: body.type,
                productId: body.productId,
                accountReceivableId: body.accountReceivableId,
                quantity: body.quantity,
                unitPrice: body.unitPrice,
                concept: body.concept,
                subtotal,
                itbis,
            }, prisma);
            // Registrar log de éxito
            await createLog({
                action: 'POST',
                description: `Ítem: \n${JSON.stringify(itemCreated, null, 2)} agregado a la factura ${invoice.invoiceNumber}`,
                origin: `invoices/${id}/items`,
                elementId: invoiceUpdated.id,
                success: true,
            });
        });
        return NextResponse.json({ status: 200 });
    } catch (error) {
        // Registrar log de error
        await createLog({
            action: 'POST',
            description: `Error al agregar ítem a la factura ${id}: ${formatErrorMessage(error)}`,
            origin: `invoices/${id}/items`,
            success: false,
        });

        return NextResponse.json({ error: formatErrorMessage(error) }, { status: 500 });
    }
}
