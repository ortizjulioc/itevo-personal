import { addQuotationItem } from '@/services/quotation-service';
import { formatErrorMessage } from '@/utils/error-to-string';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(
    req: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const quotationId = (await context.params).id;
        const body = await req.json();

        const item = await addQuotationItem(quotationId, body);
        return NextResponse.json(item, { status: 201 });
    } catch (error) {
        return NextResponse.json({ message: 'Error al agregar item a cotización', error: formatErrorMessage(error) }, { status: 500 });
    }
}
