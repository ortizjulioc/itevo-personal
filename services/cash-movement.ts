import 'server-only';
import { Prisma } from '@/utils/lib/prisma';
import { CashMovementReferenceType, PrismaClient, Prisma as PrismaTypes } from '@prisma/client';

export const createCashMovement = async (
  data: PrismaTypes.CashMovementCreateInput,
  prisma: PrismaClient | PrismaTypes.TransactionClient = Prisma
) => {
    console.log('Creating cash movement with data:', data);
  return await prisma.cashMovement.create({
    data,
  });
}

export const getCashMovementById = async (
  id: string,
  prisma: PrismaClient | PrismaTypes.TransactionClient = Prisma
) => {
  return await prisma.cashMovement.findFirst({
    where: {
      id,
      deleted: false,
    },
  });
}

export const deleteCashMovement = async (
  id: string,
  prisma: PrismaClient | PrismaTypes.TransactionClient = Prisma
) => {
  return await prisma.cashMovement.update({
    where: { id },
    data: { deleted: true },
  });
}

export const deleteCashMovementsByInvoiceId = async (
  invoiceId: string,
  prisma: PrismaClient | PrismaTypes.TransactionClient = Prisma
) => {
  return await prisma.cashMovement.updateMany({
    where: {
      referenceType: CashMovementReferenceType.INVOICE,
      referenceId: invoiceId,
      deleted: false
    },
    data: { deleted: true },
  });
}

export const getCashMovementsByCashRegisterId = async (
  cashRegisterId: string,
  prisma: PrismaClient | PrismaTypes.TransactionClient = Prisma
) => {
  return await prisma.cashMovement.findMany({
    where: {
      cashRegisterId,
      deleted: false,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
}
