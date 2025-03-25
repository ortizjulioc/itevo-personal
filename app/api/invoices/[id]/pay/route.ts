import { NextRequest, NextResponse } from 'next/server';
import { payInvoice, findInvoiceById, InvoicePaymentData } from '@/services/invoice-service';
import { createLog } from '@/utils/log';
import { formatErrorMessage } from '@/utils/error-to-string';

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
    const { id } = params; // ID de la factura
    try {
        const body: InvoicePaymentData = await req.json();

        // Verificar que la factura existe
        const invoice = await findInvoiceById(id);
        if (!invoice) throw new Error(`Factura con ID ${id} no encontrada`);

        // Pagar la factura
        const invoiceUpdated = await payInvoice(id, {
            paymentMethod: body.paymentMethod,
            paymentDetails: body.paymentDetails,
            type: body.type,
        });

        // Registrar log de éxito
        await createLog({
            action: 'POST',
            description: `Factura ${invoice.invoiceNumber} pagada. \nInformación de la factura: ${JSON.stringify(invoiceUpdated, null, 2)}`,
            origin: `invoices/${id}/pay`,
            elementId: invoiceUpdated.id,
            success: true,
        });

        return NextResponse.json(invoiceUpdated, { status: 200 });
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
