import { getLastInvoice, createInvoice, InvoiceCreateDataType } from '@/services/invoice-service';
import { formatErrorMessage } from '@/utils/error-to-string';
import { createLog } from '@/utils/log';
import { NextRequest, NextResponse } from 'next/server';

// Tipo para los datos de entrada del endpoint
interface InvoiceInput {
    studentId?: string;
    paymentMethod?: string;
    createdBy: string;
    cashRegisterId: string;
}

async function generateInvoiceId(fecha: Date): Promise<string> {
    const year = fecha.getFullYear().toString().slice(-2);
    const mes = (fecha.getMonth() + 1).toString(16).toUpperCase();
    const dia = fecha.getDate().toString(36).toUpperCase();
    const XX = `${mes}${dia}`;
    const prefix = `${year}${XX}`;

    const lastInvoice = await getLastInvoice(prefix);
    let nuevoContador = "0001";
    if (lastInvoice) {
        const ultimoContador = parseInt(lastInvoice.invoiceNumber.split('-')[1], 10);
        nuevoContador = (ultimoContador + 1).toString().padStart(4, '0');
    }

    return `${prefix}-${nuevoContador}`;
}

// Handler POST para crear una factura en DRAFT
export async function POST(req: NextRequest) {
    try {
        const body: InvoiceInput = await req.json();
        const date = new Date();

        // Generar invoiceNumber
        const invoiceNumber = await generateInvoiceId(date);

        // Valor temporal para ncf
        const tempNcf = `TEMP-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;

        // Preparar los datos para createInvoice
        const invoiceData: InvoiceCreateDataType = {
            invoiceNumber,
            ncf: tempNcf,
            studentId: body.studentId || null,
            createdBy: body.createdBy,
            cashRegisterId: body.cashRegisterId,
        };

        // Crear la factura usando la función
        const invoice = await createInvoice(invoiceData);
        await createLog({
            action: 'POST',
            description: `Se creó la factura con la siguiente información: \n${JSON.stringify(invoice, null, 2)}`,
            origin: 'branches',
            elementId: invoice.id,
            success: true,
        });
        return NextResponse.json(invoice, { status: 201 });
    } catch (error) {
        await createLog({
            action: "POST",
            description: `Error al crear un factura: ${formatErrorMessage(error)}`,
            origin: "invoices",
            success: false,
        });

        return NextResponse.json({ error: formatErrorMessage(error) }, { status: 500 });
    }
}
