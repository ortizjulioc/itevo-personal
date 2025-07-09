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