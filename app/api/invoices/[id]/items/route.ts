import { findAccountReceivableById, updateAccountReceivableById } from '@/services/account-receivable';
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

interface AccountReceivableWithCourseBranch extends AccountReceivable {
    courseBranch: CourseBranch;
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
                // TODO: cambiar implementacion por la version con servicios, cuando este disponible
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
                await updateProductById(body.productId, {
                    stock: product.stock - body.quantity,
                }, prisma);
            } else if (body.type === InvoiceItemType.RECEIVABLE && body.accountReceivableId) {
                const receivable = await findAccountReceivableById(body.accountReceivableId);

                if (!receivable) {
                    throw new Error(`Cuenta por cobrar ${body.accountReceivableId} no encontrada`);
                }
                if (receivable.status !== PaymentStatus.PENDING) {
                    throw new Error(`La cuenta por cobrar ${body.accountReceivableId} ya no está pendiente`);
                }

                const amountPending = receivable.amount - receivable.amountPaid;
                console.log(`Monto pendiente: ${amountPending}, Cantidad a agregar: ${body.unitPrice}`);
                if (amountPending < body.unitPrice) {
                    throw new Error(`No puede agregar más cantidad que el monto pendiente de la cuenta por cobrar ${body.accountReceivableId} (pendiente: ${amountPending})`);
                }

                const newAmountPending = amountPending - body.unitPrice;
                const amountPaid = receivable.amount - newAmountPending;
                await updateAccountReceivableById(body.accountReceivableId, {
                    amountPaid,
                    status: amountPaid >= receivable.amount ? PaymentStatus.PAID : PaymentStatus.PENDING,
                }, prisma);

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
