import 'server-only';
import { Prisma } from '@/utils/lib/prisma';
import { PrismaClient, Prisma as PrismaTypes } from '@prisma/client';

export const getCashRegisterClosureByCashRegisterId = async (
  cashRegisterId: string,
  prisma: PrismaClient | PrismaTypes.TransactionClient = Prisma
) => {
  return await prisma.cashRegisterClosure.findMany({
    where: {
      cashRegisterId,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
}

export const getCashRegisterClosureById = async (
  cashRegisterId: string,
  closureId: string,
  prisma: PrismaClient | PrismaTypes.TransactionClient = Prisma
) => {
  return await prisma.cashRegisterClosure.findFirst({
    where: {
      id: closureId,
      cashRegisterId: cashRegisterId, // <-- restricción adicional
    },
    select: {
      id: true,
      closureDate: true,
      initialBalance: true,
      totalIncome: true,
      totalExpense: true,
      cashBreakdown: true,
      totalCash: true,
      totalCheck: true,
      totalCard: true,
      totalTransfer: true,
      totalExpected: true,
      expectedTotalCash: true,
      expectedTotalCard: true,
      expectedTotalCheck: true,
      expectedTotalTransfer: true,
      difference: true,
      createdAt: true,
      updatedAt: true,

      user: {
        select: {
          id: true,
          name: true,
          lastName: true,
        },
      },

      cashRegister: {
        select: {
          id: true,
          openingDate: true,
          initialBalance: true,

          cashBox: {
            select: {
              id: true,
              name: true,

              branch: {
                select: {
                  id: true,
                  name: true,
                  address: true,
                  phone: true,
                  email: true,
                },
              },
            },
          },
        },
      },
    },
  });
};


export const createCashRegisterClosure = async (
  data: PrismaTypes.CashRegisterClosureCreateInput,
  prisma: PrismaClient | PrismaTypes.TransactionClient = Prisma
) => {
  return await prisma.cashRegisterClosure.create({ data });
}
