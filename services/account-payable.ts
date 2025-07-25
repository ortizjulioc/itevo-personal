import 'server-only';
import { Prisma } from '@/utils/lib/prisma';
import { PaymentStatus, PrismaClient, Prisma as PrismaTypes } from '@prisma/client';

type AccountPayableByCourseBranchIdParams = {
  courseBranchId: string;
  prisma?: PrismaClient | PrismaTypes.TransactionClient;
};

export const getAccountPayableByCourseBranchId = async ({
  courseBranchId,
  prisma = Prisma,
}: AccountPayableByCourseBranchIdParams) => {
  const accountPayable = await prisma.accountPayable.findFirst({
    where: {
      courseBranchId,
    },
  });

  if (!accountPayable) {
    // Encontrar el teacherId asociado al courseBranchId
    const courseBranch = await prisma.courseBranch.findUnique({
      where: { id: courseBranchId },
      select: { teacherId: true },
    });
    // Si no se encuentra una cuenta por pagar, se crea una nueva
    return await prisma.accountPayable.create({
      data: {
        teacherId: courseBranch?.teacherId || '',
        courseBranchId,
        amount: 0, // Inicialmente 0, se actualizará al agregar pagos
        status: PaymentStatus.PENDING,
      },
    });
  }
  return accountPayable;
}

export const getAccountsPayable = async (
  filters: Record<string, any>,
  page: number,
  top: number,
  prisma: PrismaTypes.TransactionClient = Prisma
) => {
  const where: Record<string, any> = {};

  if (filters.courseBranchId) {
    where.courseBranchId = filters.courseBranchId;
  }
  if (filters.teacherId) {
    where.teacherId = filters.teacherId;
  }

  const [accountsPayable, totalAccountsPayable] = await Promise.all([
    prisma.accountPayable.findMany({
      where,
      skip: (page - 1) * top,
      take: top,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.accountPayable.count({ where }),
  ]);

  return { accountsPayable, totalAccountsPayable };
}

export const addNewEarningToAccountsPayable = async (
  accountPayableId: string,
  amount: number,
  receivablePaymentId: string,
  prisma: PrismaTypes.TransactionClient
) => {
  // Verificar que la cuenta por pagar existe
  const accountPayable = await prisma.accountPayable.findUnique({
    where: { id: accountPayableId },
  });

  if (!accountPayable) {
    throw new Error(`Cuenta por pagar con ID ${accountPayableId} no encontrada`);
  }

  // Crear ganancia por pagar (PayableEarning)
  const payableEarning = await prisma.payableEarning.create({
    data: {
      accountPayableId,
      receivablePaymentId,
      amount,
      date: new Date(),
    },
  });

  // Actualizar el monto de la cuenta por pagar
  const accountPayableUpdated = await prisma.accountPayable.update({
    where: { id: accountPayableId },
    data: {
      amount: accountPayable.amount + amount,
      status: PaymentStatus.PENDING,
    },
  });

  return {
    payableEarning,
    accountPayable: accountPayableUpdated,
  };
}

export const deleteEarningFromAccountsPayable = async (
  accountPayableId: string,
  receivablePaymentId: string,
  prisma: PrismaTypes.TransactionClient
) => {
  // Verificar que la cuenta por pagar existe
  const accountPayable = await prisma.accountPayable.findUnique({
    where: { id: accountPayableId },
  });

  if (!accountPayable) {
    throw new Error(`Cuenta por pagar con ID ${accountPayableId} no encontrada`);
  }

  // Anular la ganancia por pagar (PayableEarning)
  const payableEarning = await prisma.payableEarning.update({
    where: {
      accountPayableId,
      receivablePaymentId,
    },
    data: {
      deleted: true, // Marcar como eliminado
    },
  });

  // Actualizar el monto de la cuenta por pagar
  const accountPayableUpdated = await prisma.accountPayable.update({
    where: { id: accountPayableId },
    data: {
      amount: accountPayable.amount - payableEarning.amount,
    },
  });

  return {
    payableEarning,
    accountPayable: accountPayableUpdated,
  };
}

export const newPayablePayment = async (
  accountPayableId: string,
  amount: number,
  cashMovementId: string,
  prisma: PrismaTypes.TransactionClient
) => {
  // Verificar que la cuenta por pagar existe
  const accountPayable = await prisma.accountPayable.findUnique({
    where: { id: accountPayableId },
  });

  if (!accountPayable) {
    throw new Error(`Cuenta por pagar con ID ${accountPayableId} no encontrada`);
  }

  // Crear el pago de la cuenta por pagar
  const payablePayment = await prisma.payablePayment.create({
    data: {
      amount,
      cashMovement: { connect: { id: cashMovementId } },
      accountPayable: { connect: { id: accountPayableId } },
      paymentDate: new Date(),
    },
  });

  // Actualizar el monto de la cuenta por pagar
  const newAmountDisbursed = accountPayable.amountDisbursed + amount;
  const newStatus = newAmountDisbursed >= accountPayable.amount ? PaymentStatus.PAID : PaymentStatus.PENDING;
  await prisma.accountPayable.update({
    where: { id: accountPayableId },
    data: {
      amountDisbursed: newAmountDisbursed,
      status: newStatus, // Mantener el estado como pendiente
    },
  });

  return payablePayment;
}

export const deletePayablePayment = async (
  accountPayableId: string,
  payablePaymentId: string,
  prisma: PrismaTypes.TransactionClient
) => {
  // Verificar que la cuenta por pagar existe
  const accountPayable = await prisma.accountPayable.findUnique({
    where: { id: accountPayableId },
  });

  if (!accountPayable) {
    throw new Error(`Cuenta por pagar con ID ${accountPayableId} no encontrada`);
  }

  // Anular el pago de la cuenta por pagar
  const payablePayment = await prisma.payablePayment.update({
    where: { id: payablePaymentId },
    data: { deleted: true }, // Marcar como eliminado
  });

  // Actualizar el monto de la cuenta por pagar
  const newDisbursedAmount = accountPayable.amountDisbursed - payablePayment.amount;
  const newStatus = newDisbursedAmount < accountPayable.amount ? PaymentStatus.PENDING : accountPayable.status;
  await prisma.accountPayable.update({
    where: { id: accountPayableId },
    data: {
      amountDisbursed: { decrement: payablePayment.amount }, // Decrementar el monto desembolsado
      status: newStatus, // Mantener el estado como pendiente
    },
  });

  return payablePayment;
}

export const getPayablePaymentsByAccountPayableId = async (
  accountPayableId: string,
  prisma: PrismaTypes.TransactionClient = Prisma
) => {
  return prisma.payablePayment.findMany({
    where: {
      accountPayableId: accountPayableId,
      deleted: false,
    },
  });
};

export const getPayableEarningsByAccountPayableId = async (
  accountPayableId: string,
  prisma: PrismaTypes.TransactionClient = Prisma
) => {
  return prisma.payableEarning.findMany({
    where: {
      accountPayableId: accountPayableId,
      deleted: false,
    },
  });
};
