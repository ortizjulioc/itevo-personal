import 'server-only';
import { Prisma } from '@/utils/lib/prisma';
import { PaymentStatus, Prisma as PrismaTypes } from '@prisma/client';

export const getAccountsReceivable = async (
  filters: {
    status?: string;
    minAmount?: number;
    maxAmount?: number;
    dueDateStart?: Date;
    dueDateEnd?: Date;
    courseId?: string;
    studentId?: string;
  } = {},
  page: number = 1,
  top: number = 10,
) => {
  const skip = (page - 1) * top;

  const whereClause: any = {
  };

  // Add studentId filter
  if (filters.studentId) {
    whereClause.studentId = filters.studentId;
  }

  // Add status filter
  if (filters.status) {
    whereClause.status = filters.status;
  }

  // Add amount range filter
  if (filters.minAmount !== undefined || filters.maxAmount !== undefined) {
    whereClause.amount = {};
    if (filters.minAmount !== undefined) {
      whereClause.amount.gte = filters.minAmount;
    }
    if (filters.maxAmount !== undefined) {
      whereClause.amount.lte = filters.maxAmount;
    }
  }

  // Add due date range filter
  if (filters.dueDateStart || filters.dueDateEnd) {
    whereClause.dueDate = {};
    if (filters.dueDateStart) {
      whereClause.dueDate.gte = filters.dueDateStart;
    }
    if (filters.dueDateEnd) {
      whereClause.dueDate.lte = filters.dueDateEnd;
    }
  }

  // Add courseId filter via courseBranch relation
  if (filters.courseId) {
    whereClause.courseBranch = {
      courseId: filters.courseId,
    };
  }
  
  const [ accountsReceivable, totalAccountsReceivable ] = await Promise.all([
    Prisma.accountReceivable.findMany({
      orderBy: [
        { createdAt: 'asc' },
      ],
      select: {
        id: true,
        studentId: true,
        courseBranchId: true,
        amount: true,
        dueDate: true,
        status: true,
        amountPaid: true,
        student: {
          select: {
            id: true,
            code: true,
            firstName: true,
            lastName: true,
          },
        },
        courseBranch: {
          select: {
            id: true,
            course: {
              select: {
                id: true,
                code: true,
                name: true,
              },
            },
          },
        },
      },
      where: whereClause,
      skip: skip,
      take: top,
    }),
    Prisma.accountReceivable.count({
      where: whereClause,
    }),
  ]);

  return { accountsReceivable, totalAccountsReceivable };
};

export const findAccountReceivableById = async (id: string) => {
  const accountReceivable = await Prisma.accountReceivable.findUnique({
    where: {
      id: id,
    },
    select: {
      id: true,
      studentId: true,
      courseBranchId: true,
      amount: true,
      dueDate: true,
      status: true,
      amountPaid: true,
      student: {
        select: {
          id: true,
          code: true,
          firstName: true,
          lastName: true,
        },
      },
      courseBranch: {
        select: {
          id: true,
          course: {
            select: {
              id: true,
              code: true,
              name: true,
            },
          },
        },
      },
    },
  });

  return accountReceivable;
};

export const updateAccountReceivableById = async (id: string, data: PrismaTypes.AccountReceivableUpdateInput) => {
  return Prisma.accountReceivable.update({
    where: { id },
    data: {
      dueDate: data.dueDate,
      status: data.status,
      amount: data.amount,
      amountPaid: data.amountPaid,
    },
  });
};

export const createAccountReceivable = async (data: PrismaTypes.AccountReceivableCreateInput) => {
  const accountReceivable = await Prisma.accountReceivable.create({
    data: data,
  });
  return accountReceivable;
};

export const cancelAccountReceivableById = async (id: string) => {
  return Prisma.accountReceivable.update({
    where: { id },
    data: {
      status: PaymentStatus.CANCELED,
      amountPaid: 0,
    },
  });
}
