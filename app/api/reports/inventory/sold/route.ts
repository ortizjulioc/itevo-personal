import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth-options';
import { createLog } from '@/utils/log';
import { formatErrorMessage } from '@/utils/error-to-string';
import { getSoldInventoryReport } from '@/services/report-service';

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
    const productIdsParam = searchParams.get('productIds');

    if (!from || !to) {
      return NextResponse.json({ error: 'Missing required parameters: from, to' }, { status: 400 });
    }

    const fromDate = new Date(from);
    const toDate = new Date(to);

    if (to.length <= 10) {
      toDate.setHours(23, 59, 59, 999);
    }

    const productIds = productIdsParam ? productIdsParam.split(',').map(id => id.trim()) : undefined;

    const report = await getSoldInventoryReport(branchId, fromDate, toDate, productIds);

    return NextResponse.json(report, { status: 200 });

  } catch (error) {
    await createLog({
      action: 'GET',
      description: formatErrorMessage(error),
      origin: 'reports/inventory/sold',
      success: false,
    });
    return NextResponse.json({ error: formatErrorMessage(error) }, { status: 500 });
  }
}
