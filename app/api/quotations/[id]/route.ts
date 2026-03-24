import { findQuotationById, updateQuotation } from '@/services/quotation-service';
import { formatErrorMessage } from '@/utils/error-to-string';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
    req: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const id = (await context.params).id;
        const quotation = await findQuotationById(id);
        if (!quotation) {
            return NextResponse.json({ message: 'Cotización no encontrada' }, { status: 404 });
        }
        return NextResponse.json(quotation, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'Error al obtener cotización', error: formatErrorMessage(error) }, { status: 500 });
    }
}

export async function PUT(
    req: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const id = (await context.params).id;
        const body = await req.json();

        const quotation = await updateQuotation(id, body);
        return NextResponse.json(quotation, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'Error al actualizar cotización', error: formatErrorMessage(error) }, { status: 500 });
    }
}
