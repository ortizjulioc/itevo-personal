import { Prisma as PrismaTypes } from "@prisma/client";

export const courseBranchWithRelations = PrismaTypes.validator<PrismaTypes.CourseBranchDefaultArgs>()({
  include: {
    branch: { select: { id: true, name: true } },
    teacher: { select: { id: true, firstName: true, lastName: true } },
    course: { select: { id: true, name: true } },
    schedules: { select: { schedule: true } },
  }
});

export type CourseBranchWithRelations = PrismaTypes.CourseBranchGetPayload<typeof courseBranchWithRelations>;
