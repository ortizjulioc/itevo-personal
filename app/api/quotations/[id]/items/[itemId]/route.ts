import { deleteQuotationItem } from '@/services/quotation-service';
import { formatErrorMessage } from '@/utils/error-to-string';
import { NextRequest, NextResponse } from 'next/server';

export async function DELETE(
    req: NextRequest,
    context: { params: Promise<{ id: string, itemId: string }> }
) {
    try {
        const itemId = (await context.params).itemId;
        
        await deleteQuotationItem(itemId);
        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'Error al eliminar item de cotización', error: formatErrorMessage(error) }, { status: 500 });
    }
}
