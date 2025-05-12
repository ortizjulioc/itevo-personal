import { addNewItemToInvoice, findInvoiceById } from '@/services/invoice-service';
import { formatErrorMessage } from '@/utils/error-to-string';
import { createLog } from '@/utils/log';
import { InvoiceItemType, PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';
const Prisma = new PrismaClient();


// Tipo para los datos de entrada del ítem
interface InvoiceItemInput {
    type: InvoiceItemType;
    productId: string | null;
    accountReceivableId: string | null;
    quantity: number;
    unitPrice: number;
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

        // Validar y calcular impuestos según el tipo de ítem
        if (body.type === InvoiceItemType.PRODUCT && body.productId) {
            // TODO: cambiar implementacion por la version con servicios, cuando este disponible
            const product = await Prisma.product.findUnique({
                where: { id: body.productId },
            });

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
        } else if (body.type === InvoiceItemType.RECEIVABLE && body.accountReceivableId) {
            // TODO: Cambiar implementacion por la version con servicios, cuando este disponible
            const receivable = await Prisma.accountReceivable.findUnique({
                where: { id: body.accountReceivableId },
                include: { courseBranch: true },
            });

            if (!receivable) {
                throw new Error(`Cuenta por cobrar ${body.accountReceivableId} no encontrada`);
            }
            if (receivable.status !== 'PENDING') {
                throw new Error(`La cuenta por cobrar ${body.accountReceivableId} ya no está pendiente`);
            }

            const taxRate = receivable.courseBranch.taxRate;
            const isTaxIncluded = receivable.courseBranch.isTaxIncluded;

            if (isTaxIncluded) {
                const total = subtotal;
                subtotal = total / (1 + taxRate);
                itbis = total - subtotal;
            } else {
                itbis = subtotal * taxRate;
            }
        } else if (body.type === InvoiceItemType.CUSTOM && (!body.unitPrice || body.quantity <= 0)) {
            throw new Error('Para ítems CUSTOM, unitPrice y quantity deben ser válidos');
        }

        // Crear el ítem y actualizar la factura en una transacción
        const { invoiceUpdated, itemCreated} = await addNewItemToInvoice(id, {
            type: body.type,
            productId: body.productId,
            accountReceivableId: body.accountReceivableId,
            quantity: body.quantity,
            unitPrice: body.unitPrice,
            subtotal,
            itbis,
        });

        // Registrar log de éxito
        await createLog({
            action: 'POST',
            description: `Ítem: \n${JSON.stringify(itemCreated, null, 2)} agregado a la factura ${invoice.invoiceNumber}`,
            origin: `invoices/${id}/items`,
            elementId: invoiceUpdated.id,
            success: true,
        });

        return NextResponse.json(invoiceUpdated, { status: 200 });
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
