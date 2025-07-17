import 'server-only';
import { Prisma } from '@/utils/lib/prisma';

export const getCashRegisterClosure = async (cashRegisterId: string, prisma = Prisma) => {
  return await prisma.cashRegisterClosure.findMany({
    where: {
      cashRegisterId,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
}