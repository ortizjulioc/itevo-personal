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
      status: PaymentStatus.PENDING,
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

export const addNewEarningToAccountsPayable = async (
    accountPayableId: string,
    amount: number,
    receivablePaymentId: string,
    prisma: PrismaTypes.TransactionClient
) => {
    // Verificar que la cuenta por pagar existe
    const accountPayable = await prisma.accountPayable.findUnique({
        where: { id: accountPayableId, status: PaymentStatus.PENDING },
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
    const accountPayableUpdated =  await prisma.accountPayable.update({
        where: { id: accountPayableId },
        data: {
        amount: accountPayable.amount + amount,
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
