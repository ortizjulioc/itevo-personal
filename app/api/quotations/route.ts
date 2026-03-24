import { createQuotation, findQuotations, getLastQuotation } from '@/services/quotation-service';
import { formatErrorMessage } from '@/utils/error-to-string';
import { QuotationStatus } from '@/generated/prisma/client';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const date = new Date();
        
        const year = date.getFullYear().toString();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const prefix = `COT-${year}${month}`;

        const lastQuotation = await getLastQuotation(prefix);
        let count = "0001";
        if (lastQuotation) {
            const lastCount = parseInt(lastQuotation.quotationNumber.split('-')[2] || lastQuotation.quotationNumber.split('-')[1] || '0', 10);
            if (!isNaN(lastCount)) {
                count = (lastCount + 1).toString().padStart(4, '0');
            }
        }

        const quotationNumber = `${prefix}-${count}`;

        const quotationData = {
            quotationNumber,
            studentId: body.studentId || null,
            createdBy: body.createdBy,
            branchId: body.branchId || null,
            date,
        };

        const quotation = await createQuotation(quotationData);
        return NextResponse.json(quotation, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: formatErrorMessage(error) }, { status: 500 });
    }
}

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = req.nextUrl;
        const statusParam = searchParams.get('status');
        const statusArray = statusParam ? (statusParam.split(',').map(s => s.trim()) as QuotationStatus[]) : undefined;

        const filters = {
            search: searchParams.get('search') || undefined,
            status: statusArray,
            studentId: searchParams.get('studentId') || undefined,
            createdBy: searchParams.get('createdBy') || undefined,
            page: Number(searchParams.get('page') || '1'),
            pageSize: Number(searchParams.get('pageSize') || '10'),
        };

        const result = await findQuotations(filters);
        return NextResponse.json(result, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'Error al obtener cotizaciones', error: formatErrorMessage(error) }, { status: 500 });
    }
}
