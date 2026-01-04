import 'server-only';
import { Prisma } from '@/utils/lib/prisma';

export interface SoldInventoryReportItem {
  productId: string;
  productName: string;
  productCode: number;
  quantitySold: number;
  totalAmount: number;
}

export async function getSoldInventoryReport(
  branchId: string,
  from: Date,
  to: Date,
  productIds?: string[]
): Promise<SoldInventoryReportItem[]> {
  const invoiceItems = await Prisma.invoiceItem.findMany({
    where: {
      type: 'PRODUCT',
      invoice: {
        status: { in: ['PAID', 'COMPLETED'] },
        date: {
          gte: from,
          lte: to,
        },
        cashRegister: {
          cashBox: {
            branchId: branchId,
          },
        },
      },
      ...(productIds && productIds.length > 0 ? { productId: { in: productIds } } : {}),
    },
    include: {
      product: true,
    },
  });

  // Aggregate results
  const salesByProduct: Record<string, SoldInventoryReportItem> = {};

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

  return Object.values(salesByProduct);
}
