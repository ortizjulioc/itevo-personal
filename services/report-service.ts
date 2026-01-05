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

import { PAYMENT_METHODS_OPTIONS } from '@/constants/invoice.constant';

// ... imports

export interface GeneralSalesReportItem {
  id: string;
  invoiceNumber: string;
  date: Date;
  status: string;
  paymentMethod: string;
  studentName: string;
  studentCode: string;
  subtotal: number;
  itbis: number;
  total: number;
  isCredit: boolean;
  createdBy: string;
}

export async function getGeneralSalesReport(
  branchId: string,
  from: Date,
  to: Date,
  filters: {
    status?: string[];
    ncfType?: string[];
    paymentMethod?: string;
    studentId?: string;
    userId?: string;
    minAmount?: number;
    maxAmount?: number;
  }
): Promise<GeneralSalesReportItem[]> {
  const where: any = {
    date: {
      gte: from,
      lte: to,
    },
    cashRegister: {
      cashBox: {
        branchId: branchId,
      },
    },
    status: { in: ['PAID', 'COMPLETED'] },
  };

  if (filters.status && filters.status.length > 0) {
    // Intersect user filters with allowed statuses
    const allowedStatus = filters.status.filter(s => ['PAID', 'COMPLETED'].includes(s));
    if (allowedStatus.length > 0) {
      where.status = { in: allowedStatus };
    } else {
      // If user selected only invalid statuses (e.g. DRAFT), return empty
      return [];
    }
  }

  if (filters.ncfType && filters.ncfType.length > 0) {
    where.type = { in: filters.ncfType };
  }

  if (filters.paymentMethod) {
    where.paymentMethod = filters.paymentMethod;
  }

  if (filters.studentId) {
    where.studentId = filters.studentId;
  }

  if (filters.userId) {
    where.createdBy = filters.userId;
  }

  const invoices = await Prisma.invoice.findMany({
    where,
    include: {
      student: true,
      user: true,
    },
    orderBy: {
      date: 'desc',
    },
  });

  const reportItems = invoices.map(invoice => {
    const total = invoice.subtotal + invoice.itbis;

    return {
      id: invoice.id,
      invoiceNumber: invoice.invoiceNumber,
      date: invoice.date,
      status: invoice.status,
      paymentMethod: invoice.paymentMethod || '',
      studentName: invoice.student ? `${invoice.student.firstName} ${invoice.student.lastName}` : 'N/A',
      studentCode: invoice.student ? invoice.student.code : '',
      subtotal: invoice.subtotal,
      itbis: invoice.itbis,
      total: total,
      createdBy: `${invoice.user.name} ${invoice.user.lastName}`,
      isCredit: invoice.isCredit,
    };
  });

  // Post-filter by amount if requested
  if (filters.minAmount !== undefined || filters.maxAmount !== undefined) {
    return reportItems.filter(item => {
      if (filters.minAmount !== undefined && item.total < filters.minAmount) return false;
      if (filters.maxAmount !== undefined && item.total > filters.maxAmount) return false;
      return true;
    });
  }

  return reportItems;
}
