import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth-options';
import { getGeneralSalesReport } from '@/services/report-service';
import { createLog } from '@/utils/log';
import { formatErrorMessage } from '@/utils/error-to-string';
import { startOfDay, endOfDay, format } from 'date-fns';
import ExcelJS from 'exceljs';
import { INVOICE_STATUS_OPTIONS, PAYMENT_METHODS_OPTIONS } from '@/constants/invoice.constant';

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const branchId = session.user?.mainBranch?.id || session.user?.branches?.[0]?.id;

    const fromParam = searchParams.get('from');
    const toParam = searchParams.get('to');
    const statusParam = searchParams.get('status');
    const ncfTypeParam = searchParams.get('ncfType');
    const paymentMethod = searchParams.get('paymentMethod') || undefined;
    const studentId = searchParams.get('studentId') || undefined;
    const userId = searchParams.get('userId') || undefined;
    const minAmountParam = searchParams.get('minAmount');
    const maxAmountParam = searchParams.get('maxAmount');

    const from = fromParam ? startOfDay(new Date(fromParam)) : startOfDay(new Date());
    const to = toParam ? endOfDay(new Date(toParam)) : endOfDay(new Date());

    const status = statusParam ? statusParam.split(',') : undefined;
    const ncfType = ncfTypeParam ? ncfTypeParam.split(',') : undefined;
    const minAmount = minAmountParam ? parseFloat(minAmountParam) : undefined;
    const maxAmount = maxAmountParam ? parseFloat(maxAmountParam) : undefined;

    const report = await getGeneralSalesReport(branchId, from, to, {
      status,
      ncfType,
      paymentMethod,
      studentId,
      userId,
      minAmount,
      maxAmount,
    });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Reporte General de Ventas');

    worksheet.columns = [
      { header: 'No. Factura', key: 'invoiceNumber', width: 15 },
      { header: 'Fecha', key: 'date', width: 15 },
      { header: 'Estudiante', key: 'studentName', width: 30 },
      { header: 'Código', key: 'studentCode', width: 15 },
      { header: 'Estado', key: 'statusLabel', width: 15 },
      { header: 'Método Pago', key: 'paymentMethod', width: 15 },
      { header: 'Creado Por', key: 'createdBy', width: 25 },
      { header: 'Subtotal', key: 'subtotal', width: 15 },
      { header: 'ITBIS', key: 'itbis', width: 15 },
      { header: 'Total', key: 'total', width: 15 },
    ];

    report.forEach((item) => {
      worksheet.addRow({
        ...item,
        date: format(new Date(item.date), 'dd/MM/yyyy'),
        paymentMethod: item.isCredit ? 'Crédito' : PAYMENT_METHODS_OPTIONS[item.paymentMethod as keyof typeof PAYMENT_METHODS_OPTIONS] || item.paymentMethod,
        statusLabel: INVOICE_STATUS_OPTIONS[item.status as keyof typeof INVOICE_STATUS_OPTIONS],
      });
    });

    // Style header
    worksheet.getRow(1).font = { bold: true };

    const buffer = await workbook.xlsx.writeBuffer();

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="reporte_ventas_general_${format(new Date(), 'yyyyMMdd')}.xlsx"`,
      },
    });

  } catch (error) {
    await createLog({
      action: 'GET',
      description: formatErrorMessage(error),
      origin: 'reports/general/download',
      success: false,
    });
    return NextResponse.json({ error: formatErrorMessage(error) }, { status: 500 });
  }
}
