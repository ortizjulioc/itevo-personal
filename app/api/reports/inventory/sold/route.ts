import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth-options';
import { Prisma } from '@/utils/lib/prisma';
import { createLog } from '@/utils/log';
import { formatErrorMessage } from '@/utils/error-to-string';

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
    // Adjust toDate to include the entire day if it's just a date string, 
    // but if it's ISO string it might already have time. 
    // Assuming YYYY-MM-DD format as per request, setting to end of day is safer.
    if (to.length <= 10) {
      toDate.setHours(23, 59, 59, 999);
    }

    const productIds = productIdsParam ? productIdsParam.split(',').map(id => id.trim()) : undefined;

    const invoiceItems = await Prisma.invoiceItem.findMany({
      where: {
        type: 'PRODUCT',
        invoice: {
          status: { in: ['PAID', 'COMPLETED'] },
          date: {
            gte: fromDate,
            lte: toDate,
          },
          cashRegister: {
            cashBox: {
              branchId: branchId,
            },
          },
        },
        ...(productIds ? { productId: { in: productIds } } : {}),
      },
      include: {
        product: true,
      },
    });

    // Aggregate results
    const salesByProduct: Record<string, { productId: string; productName: string; productCode: number; quantitySold: number; totalAmount: number }> = {};

    for (const item of invoiceItems) {
      if (!item.productId || !item.product) continue;

      const productId = item.productId;
      if (!salesByProduct[productId]) {
        salesByProduct[productId] = {
          productId: productId,
          productName: item.product.name,
          productCode: item.product.code,
          quantitySold: 0,
          totalAmount: 0,
        };
      }

      salesByProduct[productId].quantitySold += (item.quantity || 0);
      salesByProduct[productId].totalAmount += (item.subtotal || 0);
    }

    const report = Object.values(salesByProduct);

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
