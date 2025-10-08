import { Prisma as PrismaTypes } from '@prisma/client';

export const accountReceivableWithRelations = PrismaTypes.validator<PrismaTypes.AccountReceivableDefaultArgs>()({
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

export type AccountReceivableWithRelations = PrismaTypes.AccountReceivableGetPayload<typeof accountReceivableWithRelations>;
