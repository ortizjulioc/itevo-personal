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

export interface SoldCourseReportItem {
  courseId: string;
  courseName: string;
  courseCode: number;
  quantitySold: number;
  totalAmount: number;
}

export async function getSoldCoursesReport(
  branchId: string,
  from: Date,
  to: Date,
  courseIds?: string[]
): Promise<SoldCourseReportItem[]> {
  const invoiceItems = await Prisma.invoiceItem.findMany({
    where: {
      type: 'RECEIVABLE',
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
      accountReceivable: {
        courseBranch: {
          courseId: courseIds && courseIds.length > 0 ? { in: courseIds } : undefined,
        },
      },
    },
    include: {
      accountReceivable: {
        include: {
          courseBranch: {
            include: {
              course: true,
            },
          },
        },
      },
    },
  });

  // Aggregate results
  const salesByCourse: Record<string, SoldCourseReportItem> = {};

  for (const item of invoiceItems) {
    if (!item.accountReceivable?.courseBranch?.course) continue;

    const course = item.accountReceivable.courseBranch.course;
    const courseId = course.id;

    if (!salesByCourse[courseId]) {
      salesByCourse[courseId] = {
        courseId: courseId,
        courseName: course.name,
        courseCode: course.code,
        quantitySold: 0,
        totalAmount: 0,
      };
    }

    salesByCourse[courseId].quantitySold += (item.quantity || 0);
    salesByCourse[courseId].totalAmount += (item.subtotal || 0);
  }

  return Object.values(salesByCourse);
}
