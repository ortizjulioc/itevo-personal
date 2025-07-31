import { Prisma as PrismaTypes, Schedule } from "@prisma/client";

export const courseBranchWithRelations = PrismaTypes.validator<PrismaTypes.CourseBranchDefaultArgs>()({
  include: {
    branch: { select: { id: true, name: true } },
    teacher: { select: { id: true, firstName: true, lastName: true } },
    course: { select: { id: true, name: true } },
    schedules: { select: { schedule: true } },
  }
});

// Tipado original (basado en lo que devuelve Prisma)
type OriginalCourseBranch = PrismaTypes.CourseBranchGetPayload<typeof courseBranchWithRelations>;

// Tipado corregido para que coincida con la estructura final
export type CourseBranchWithRelations = Omit<OriginalCourseBranch, "schedules"> & {
  schedules: Schedule[]; // Ajuste aquí
};
