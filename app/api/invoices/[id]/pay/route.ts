import { NextRequest, NextResponse } from 'next/server';
import { payInvoice, findInvoiceById } from '@/services/invoice-service';
import { createLog } from '@/utils/log';
import { formatErrorMessage } from '@/utils/error-to-string';

// Tipo para los datos de entrada del pago
interface InvoicePaymentInput {
    paymentMethod: string;
    paymentDetails?: any; // JSON opcional con detalles adicionales
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
    const { id } = params; // ID de la factura
    try {
        const body: InvoicePaymentInput = await req.json();

        // Verificar que la factura existe
        const invoice = await findInvoiceById(id);
        if (!invoice) {
            throw new Error(`Factura con ID ${id} no encontrada`);
        }

        // Pagar la factura
        const invoiceUpdated = await payInvoice(id, {
            paymentMethod: body.paymentMethod,
            paymentDetails: body.paymentDetails,
        });

        // Registrar log de éxito
        await createLog({
            action: 'POST',
            description: `Factura ${invoice.invoiceNumber} pagada con método ${body.paymentMethod}`,
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

        console.error('Error pagando factura:', error);
        return NextResponse.json({ error: formatErrorMessage(error) }, { status: 500 });
    }
}
