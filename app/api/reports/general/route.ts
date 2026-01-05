import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth-options';
import { getGeneralSalesReport } from '@/services/report-service';
import { createLog } from '@/utils/log';
import { formatErrorMessage } from '@/utils/error-to-string';
import { startOfDay, endOfDay } from 'date-fns';

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

    return NextResponse.json(report);

  } catch (error) {
    await createLog({
      action: 'GET',
      description: formatErrorMessage(error),
      origin: 'reports/general',
      success: false,
    });
    return NextResponse.json({ error: formatErrorMessage(error) }, { status: 500 });
  }
}
