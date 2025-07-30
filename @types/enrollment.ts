import { Prisma as PrismaTypes } from "@prisma/client";

export const enrollmentWithRelations = PrismaTypes.validator<PrismaTypes.EnrollmentDefaultArgs>()({
  include: {
    student: true,
    courseBranch: {
      select: {
        id: true,
        courseId: true,
        branchId: true,
        course: {
          select: { name: true },
        },
        branch: {
          select: { name: true },
        },
      },
    },
  },
});

export type EnrollmentWithRelations = PrismaTypes.EnrollmentGetPayload<typeof enrollmentWithRelations>;
