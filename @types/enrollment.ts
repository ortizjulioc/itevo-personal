import { Prisma as PrismaTypes } from "@prisma/client";

export const enrollmentWithRelations = PrismaTypes.validator<PrismaTypes.EnrollmentDefaultArgs>()({
  include: {
    student: true,
    courseBranch: {
      select: {
        id: true,
        courseId: true,
        branchId: true,
        teacherId: true,
        teacher: { select: { code: true, firstName: true, lastName: true } },
        course: { select: { name: true, code: true } },
        branch: { select: { name: true } },
        schedules: { select: { schedule: true } },
      },
    },
  },
});

export type EnrollmentWithRelations = PrismaTypes.EnrollmentGetPayload<typeof enrollmentWithRelations>;
