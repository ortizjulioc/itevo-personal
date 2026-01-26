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
    student: {
      select: {
        id: true,
        code: true,
        firstName: true,
        lastName: true,
      },
    },
    courseBranch: {
      select: {
        id: true,
        course: {
          select: {
            id: true,
            code: true,
            name: true,
          },
        },
      },
    },
  },
});

export type AccountReceivableWithRelations = PrismaTypes.AccountReceivableGetPayload<typeof accountReceivableWithRelations>;
