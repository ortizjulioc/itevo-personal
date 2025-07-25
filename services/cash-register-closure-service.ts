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
    id: string,
    prisma: PrismaClient | PrismaTypes.TransactionClient = Prisma
) => {
  return await prisma.cashRegisterClosure.findUnique({
    where: { id },
  });
}

export const createCashRegisterClosure = async (
    data: PrismaTypes.CashRegisterClosureCreateInput,
    prisma: PrismaClient | PrismaTypes.TransactionClient = Prisma
) => {
  return await prisma.cashRegisterClosure.create({ data });
}
