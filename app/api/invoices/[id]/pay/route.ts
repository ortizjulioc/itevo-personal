import { NextRequest, NextResponse } from 'next/server';
import { findInvoiceById, InvoicePaymentData, updateInvoice } from '@/services/invoice-service';
import { createLog } from '@/utils/log';
import { formatErrorMessage } from '@/utils/error-to-string';
import { Prisma } from '@/utils/lib/prisma';
import { CashMovementReferenceType, CashMovementType, CashRegisterStatus, Invoice, InvoiceItemType, InvoiceStatus, NcfType } from '@prisma/client';
import { getSettings } from '@/services/settings-service';
import { generateNcf } from '@/utils/ncf';
import { createCashMovement } from '@/services/cash-movement';

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
    const { id } = params; // ID de la factura
    try {
        const body: InvoicePaymentData = await req.json();
        console.log('Datos de pago recibidos:', body);

        let newInvoiceData: Invoice | null = null;
        // Verificar que la factura existe
        await Prisma.$transaction(async (tx) => {
            const invoice = await findInvoiceById(id, tx, { cashRegister: true });
            console.log('Factura encontrada:', invoice);
            if (!invoice) throw new Error(`Factura con ID ${id} no encontrada`);
            if (invoice.status !== InvoiceStatus.DRAFT) throw new Error(`Solo se pueden pagar facturas en estado DRAFT (actual: ${invoice.status})`);
            if (invoice.items.length === 0) throw new Error('No se puede pagar una factura sin ítems');
            if (invoice.subtotal + invoice.itbis <= 0) throw new Error('El monto total de la factura debe ser mayor a 0');
            if (invoice.cashRegister?.status !== CashRegisterStatus.OPEN) throw new Error(`La caja registradora ${invoice.cashRegisterId} está cerrada`);

            const finalType = (body.type || invoice.type) as NcfType;
            const settings = await getSettings(tx);
            const USE_NCF = settings?.billingWithoutNcf !== true;
            const ncf = USE_NCF ? await generateNcf(tx, finalType) : invoice.ncf;

            const updatedInvoice = await updateInvoice(id, {
                ncf,
                type: finalType,
                status: InvoiceStatus.PAID,
                studentId: body.studentId || invoice.studentId,
                paymentDate: new Date(),
                paymentMethod: body.paymentMethod,
                paymentDetails: body.paymentDetails || {},
            }, tx);
            newInvoiceData = updatedInvoice;

            await createCashMovement({
                cashRegister: { connect: { id: invoice.cashRegisterId }},
                type: CashMovementType.INCOME,
                amount: invoice.subtotal + invoice.itbis,
                description: `Pago de factura ${invoice.invoiceNumber} (${finalType})`,
                referenceType: CashMovementReferenceType.INVOICE,
                referenceId: updatedInvoice.id,
                user: { connect: { id: invoice.createdBy } },
            }, tx);

            await createLog({
                action: 'POST',
                description: `Factura ${updatedInvoice.invoiceNumber} pagada. \nInformación de la factura: ${JSON.stringify(updatedInvoice, null, 2)}`,
                origin: `invoices/${id}/pay`,
                elementId: updatedInvoice.id,
                success: true,
            });
        });

        return NextResponse.json(newInvoiceData, { status: 200 });
    } catch (error) {
        // Registrar log de error
        await createLog({
            action: 'POST',
            description: `Error al pagar factura ${id}: ${formatErrorMessage(error)}`,
            origin: `invoices/${id}/pay`,
            success: false,
        });

        return NextResponse.json({ error: formatErrorMessage(error) }, { status: 500 });
    }
}
