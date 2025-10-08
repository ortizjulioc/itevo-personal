import 'server-only';
import { Prisma } from '@/utils/lib/prisma';
import { AccountReceivable, PaymentStatus, PrismaClient, Prisma as PrismaTypes } from '@prisma/client';

type processReceivablePaymentProps = {
  unitPrice: number;
  accountReceivableId: string;
  invoiceId: string;
  prisma: PrismaTypes.TransactionClient;
};

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
    const dueDate: Record<string, Date> = {};
    if (filters.dueDateStart) {
      dueDate.gte = filters.dueDateStart;
    }
    if (filters.dueDateEnd) {
      dueDate.lte = filters.dueDateEnd;
    }

    if (Object.keys(dueDate).length > 0) {
      whereClause.dueDate = dueDate;
    }
  }

  // Add courseId filter via courseBranch relation
  if (filters.courseId) {
    whereClause.courseBranch = {
      courseId: filters.courseId,
    };
  }

  const [accountsReceivable, totalAccountsReceivable] = await Promise.all([
    Prisma.accountReceivable.findMany({
      orderBy: [
        { dueDate: 'asc' },
        { createdAt: 'desc' },
      ],
      select: {
        id: true,
        studentId: true,
        courseBranchId: true,
        amount: true,
        dueDate: true,
        status: true,
        amountPaid: true,
        enrollmentId: true,
        enrollment: true,
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

export const findAccountReceivableById = async (
  id: string,
  prisma: PrismaClient | PrismaTypes.TransactionClient = Prisma
) => {
  const accountReceivable = await prisma.accountReceivable.findUnique({
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
      enrollmentId: true,
      enrollment: true,
    },
  });

  return accountReceivable;
};

export const updateAccountReceivableById = async (
  id: string,
  data: PrismaTypes.AccountReceivableUpdateInput,
  prisma: PrismaClient | PrismaTypes.TransactionClient = Prisma
): Promise<AccountReceivable> => {
  return prisma.accountReceivable.update({
    where: { id },
    data: {
      dueDate: data.dueDate,
      status: data.status,
      amount: data.amount,
      amountPaid: data.amountPaid,
    },
  });
};

export const createAccountReceivable = async (data: {
  studentId: string;
  courseBranchId: string;
  amount: number;
  dueDate: Date;
  status?: PaymentStatus;
  amountPaid?: number;
  enrollmentId: string;
}) => {
  const accountReceivable = await Prisma.accountReceivable.create({
    data: {
      studentId: data.studentId,
      courseBranchId: data.courseBranchId,
      amount: data.amount,
      dueDate: data.dueDate,
      status: data.status || PaymentStatus.PENDING,
      amountPaid: data.amountPaid || 0,
      enrollment: { connect: { id: data.enrollmentId } },
    },
  });
  return accountReceivable;
};

export const createManyAccountsReceivable = async (
  data: {
    studentId: string;
    courseBranchId: string;
    amount: number;
    dueDate: Date;
    status?: PaymentStatus;
    amountPaid?: number;
    enrollmentId: string;
  }[],
  prisma: PrismaClient | PrismaTypes.TransactionClient = Prisma
) => {
  const formattedData = data.map(item => ({
    studentId: item.studentId,
    courseBranchId: item.courseBranchId,
    amount: item.amount,
    dueDate: item.dueDate,
    status: item.status || PaymentStatus.PENDING,
    amountPaid: item.amountPaid || 0,
    enrollmentId: item.enrollmentId,
  }));

  const result = await prisma.accountReceivable.createMany({
    data: formattedData,
  });

  return { count: result.count };
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

export const processReceivablePayment = async ({
  unitPrice,
  accountReceivableId,
  invoiceId,
  prisma,
}: processReceivablePaymentProps) => {
  const receivable = await findAccountReceivableById(accountReceivableId, prisma);

  if (!receivable) {
    throw new Error(`Cuenta por cobrar ${accountReceivableId} no encontrada`);
  }
  if (receivable.status !== PaymentStatus.PENDING) {
    throw new Error(`La cuenta por cobrar ${accountReceivableId} ya no está pendiente`);
  }

  const amountPending = receivable.amount - receivable.amountPaid;
  if (amountPending < unitPrice) {
    throw new Error(`No puede agregar más cantidad que el monto pendiente de la cuenta por cobrar ${accountReceivableId} (pendiente: ${amountPending})`);
  }

  const newAmountPending = amountPending - unitPrice;
  const amountPaid = receivable.amount - newAmountPending;

  // Actualizamos cuenta por cobrar
  const accountReceivableUpdated = await updateAccountReceivableById(accountReceivableId, {
    amountPaid,
    status: amountPaid >= receivable.amount ? PaymentStatus.PAID : PaymentStatus.PENDING,
  }, prisma);

  // Crear pago de cuenta por cobrar
  const receivablePayment = await prisma.receivablePayment.create({
    data: {
      accountReceivableId,
      amount: unitPrice,
      paymentDate: new Date(),
      invoiceId, // Asociar el pago a la factura
    },
  });

  return {
    receivablePayment,
    accountReceivable: accountReceivableUpdated,
  };
}

export const annularReceivablePayment = async ({
  unitPrice,
  accountReceivableId,
  invoiceId,
  prisma,
}: processReceivablePaymentProps) => {
  const receivable = await findAccountReceivableById(accountReceivableId, prisma);

  if (!receivable) {
    throw new Error(`Cuenta por cobrar ${accountReceivableId} no encontrada`);
  }

  const amountPaid = receivable.amountPaid - unitPrice;
  if (amountPaid < 0) {
    throw new Error(`No puede anular más cantidad que el monto pagado de la cuenta por cobrar ${accountReceivableId} (pagado: ${receivable.amountPaid})`);
  }

  const newStatus = amountPaid >= receivable.amount ? PaymentStatus.PAID : PaymentStatus.PENDING;

  // Actualizamos cuenta por cobrar
  const accountReceivableUpdated = await updateAccountReceivableById(accountReceivableId, {
    amountPaid,
    status: newStatus,
  }, prisma);

  // Anular pago de cuenta por cobrar
  const receivablePayment = await prisma.receivablePayment.update({
    where: {
      accountReceivableId_invoiceId:
        { accountReceivableId: accountReceivableId, invoiceId: invoiceId }
    },
    data: { deleted: true, },
  });

  return { accountReceivable: accountReceivableUpdated, receivablePayment };
}

export const changeAccountReceivableStatus = async (
  id: string,
  status: PaymentStatus,
  prisma: PrismaClient | PrismaTypes.TransactionClient = Prisma
) => {
  return prisma.accountReceivable.update({
    where: { id },
    data: { status },
  });
};
