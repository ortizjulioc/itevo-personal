import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth-options';
import { createLog } from '@/utils/log';
import { formatErrorMessage } from '@/utils/error-to-string';
import { getSoldCoursesReport } from '@/services/report-service';
import ExcelJS from 'exceljs';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const branchId = session?.user?.mainBranch?.id || session?.user?.branches?.[0]?.id;

    if (!branchId) {
      return NextResponse.json({ error: 'Branch not found in session' }, { status: 400 });
    }

    const { searchParams } = new URL(request.url);
    const from = searchParams.get('from');
    const to = searchParams.get('to');
    const courseIdsParam = searchParams.get('courseIds');

    if (!from || !to) {
      return NextResponse.json({ error: 'Missing required parameters: from, to' }, { status: 400 });
    }

    const fromDate = new Date(from);
    const toDate = new Date(to);

    if (to.length <= 10) {
      toDate.setHours(23, 59, 59, 999);
    }

    const courseIds = courseIdsParam ? courseIdsParam.split(',').map(id => id.trim()) : undefined;

    const report = await getSoldCoursesReport(branchId, fromDate, toDate, courseIds);

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Reporte de Ventas por Curso');

    worksheet.columns = [
      { header: 'Código', key: 'courseCode', width: 15 },
      { header: 'Curso', key: 'courseName', width: 40 },
      { header: 'Cantidad Vendida', key: 'quantitySold', width: 20 },
      { header: 'Monto Total', key: 'totalAmount', width: 20 },
    ];

    report.forEach(item => {
      worksheet.addRow(item);
    });

    // Format currency column
    worksheet.getColumn('totalAmount').numFmt = '"$"#,##0.00';

    const buffer = await workbook.xlsx.writeBuffer();

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="reporte_ventas_cursos_${from}_${to}.xlsx"`,
      },
    });

  } catch (error) {
    await createLog({
      action: 'GET',
      description: formatErrorMessage(error),
      origin: 'reports/courses/sold/download',
      success: false,
    });
    return NextResponse.json({ error: formatErrorMessage(error) }, { status: 500 });
  }
}
