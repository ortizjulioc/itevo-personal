import 'server-only';
import { Prisma } from '@/utils/lib/prisma';
import { CashMovementReferenceType, PrismaClient, Prisma as PrismaTypes } from '@prisma/client';

export const createCashMovement = async (
  data: PrismaTypes.CashMovementCreateInput,
  prisma: PrismaClient | PrismaTypes.TransactionClient = Prisma
) => {
  return await prisma.cashMovement.create({
    data,
    include: { user: true, cashRegister: { select: { id: true, cashBox: { select: { id: true, branch: true } } } } }
  });
}

export const getCashMovementById = async (
  id: string,
  prisma: PrismaClient | PrismaTypes.TransactionClient = Prisma
) => {
  return await prisma.cashMovement.findFirst({
    where: {
      id,
      deleted: false
    },
    include: { user: true, cashRegister: { select: { id: true, cashBox: { select: { id: true, branch: true } } } } }
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
    include: {
      user: {
        select: {
          id: true,
          name: true,
          lastName: true,
          username: true,
          phone: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
}
