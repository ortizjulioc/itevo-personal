import { Prisma as PrismaTypes } from '@prisma/client';

export const payablePaymentWithRelations = PrismaTypes.validator<PrismaTypes.PayablePaymentDefaultArgs>()({
  select: {
    id: true,
    amount: true,
    paymentDate: true,
    deleted: true,
    createdAt: true,
    updatedAt: true,
    accountPayable: {
      select: {
        id: true,
        amount: true,
        amountDisbursed: true,
        status: true,
        teacher: {
          select: {
            id: true,
            code: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        courseBranch: {
          select: {
            id: true,
            branch: true,
          },
        },
      },
    },
    cashMovement: {
      select: {
        id: true,
        amount: true,
        type: true,
        description: true,
        createdAt: true,
        user: {
          select: {
            id: true,
            name: true,
            lastName: true,
            email: true,
          },
        },
      },
    },
  },
});

export const accountPayableWithRelations = PrismaTypes.validator<PrismaTypes.AccountPayableDefaultArgs>()({
  include: {
    courseBranch: {
      select: {
        id: true,
        branch: true,
        course: true,
      },
    },
    teacher: true,
  },
});

export type AccountPayableWithRelations = PrismaTypes.AccountPayableGetPayload<typeof accountPayableWithRelations>;
export type PayablePaymentWithRelations = PrismaTypes.PayablePaymentGetPayload<typeof payablePaymentWithRelations>;
