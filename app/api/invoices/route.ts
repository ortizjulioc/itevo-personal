import { getLastInvoice, createInvoice, InvoiceCreateDataType, findInvoices } from '@/services/invoice-service';
import { formatErrorMessage } from '@/utils/error-to-string';
import { createLog } from '@/utils/log';
import { InvoiceStatus, NcfType } from '@prisma/client';
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

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = req.nextUrl;

        const filters = {
            search: searchParams.get('search') || undefined,
            type: searchParams.get('type') as NcfType | undefined,
            status: searchParams.get('status') as InvoiceStatus | undefined,
            fromDate: searchParams.get('fromDate') ? new Date(searchParams.get('fromDate')!) : undefined,
            toDate: searchParams.get('toDate') ? new Date(searchParams.get('toDate')!) : undefined,
            studentId: searchParams.get('studentId') || undefined,
            createdBy: searchParams.get('createdBy') || undefined,
            page: Number(searchParams.get('page') || '1'),
            pageSize: Number(searchParams.get('pageSize') || '10'),
        };

        const result = await findInvoices(filters);
        return NextResponse.json(result, { status: 200 });
    } catch (error) {
        await createLog({
            action: "GET",
            description: `Error al obtener las facturas: ${formatErrorMessage(error)}`,
            origin: "invoices",
            success: false,
        });
        return NextResponse.json({ message: 'Error al obtener las facturas', error: formatErrorMessage(error) }, { status: 500 });
    }
}
