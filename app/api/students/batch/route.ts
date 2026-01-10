import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/auth-options";
import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@/utils/lib/prisma";
import { validateObject } from "@/utils";
import {
  findStudentByEmail,
  findStudentByIdentification,
} from "@/services/student-service";
import { formatErrorMessage } from "@/utils/error-to-string";
import { createLog } from "@/utils/log";
import { Student } from "@prisma/client";

type BatchError = {
  index: number;
  code: string;
  error: string;
};

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    const studentsData = await request.json();

    if (!session || !session.user) {
      return NextResponse.json(
        { code: "E_UNAUTHORIZED", error: "No autorizado" },
        { status: 401 }
      );
    }

    if (!Array.isArray(studentsData) || studentsData.length === 0) {
      return NextResponse.json(
        { code: "E_INVALID_INPUT", error: "Se requiere un arreglo de estudiantes" },
        { status: 400 }
      );
    }

    const createdStudents: Student[] = [];
    const errors: BatchError[] = [];

    // 👉 Paso 1: Generar códigos únicos por lote
    const currentYear = new Date().getFullYear();
    const lastStudent = await Prisma.student.findFirst({
      where: {
        code: {
          startsWith: currentYear.toString(),
        },
      },
      orderBy: {
        code: "desc",
      },
    });

    let startCodeNumber = 1;
    if (lastStudent) {
      const [, last] = lastStudent.code.split("-");
      startCodeNumber = parseInt(last, 10) + 1;
    }

    // 👉 Paso 2: Asignar códigos únicos en memoria
    studentsData.forEach((student, index) => {
      const code = `${currentYear}-${(startCodeNumber + index)
        .toString()
        .padStart(4, "0")}`;
      student.generatedCode = code;
    });

    // 👉 Paso 3: Insertar en base de datos dentro de una transacción
    await Prisma.$transaction(async (prisma) => {
      for (let index = 0; index < studentsData.length; index++) {
        const student = studentsData[index];
        try {
          const { isValid, message } = validateObject(student, ["nombres", "apellidos"]);
          if (!isValid) {
            errors.push({ index, code: "E_MISSING_FIELDS", error: message });
            continue;
          }

          // --- NORMALIZACIÓN ---
          // Normalizar cédula
          let identification: string | null = student.cedula ? String(student.cedula).trim().toUpperCase() : null;
          let identificationType = "CEDULA";

          if (identification) {
            if (identification.includes("MENOR") || identification.includes("SIN CEDULA") || identification === "") {
              identification = null;
            } else {
              // Dejar solo números
              identification = identification.replace(/\D/g, "");
              if (identification.length === 0) {
                identification = null;
              } else if (identification.length !== 11) {
                identificationType = "PASAPORTE";
              }
            }
          }

          // Normalizar teléfono
          let phone: string | null = student.telefono ? String(student.telefono) : null;
          if (phone) {
            // Separar por coma, slash o backslash
            const parts = phone.split(/[,/\\]/);
            const normalizedParts = parts
              .map((p) => p.replace(/\D/g, "")) // Solo números
              .filter((p) => p.length > 0); // Quitar vacíos

            if (normalizedParts.length > 0) {
              phone = normalizedParts.join(",");
            } else {
              phone = null;
            }
          }
          // ---------------------

          // Validar duplicados con datos normalizados
          if (student.email) {
            const exists = await findStudentByEmail(student.email);
            if (exists) {
              errors.push({ index, code: "E_EMAIL_EXISTS", error: "El email ya está en uso." });
              continue;
            }
          }

          if (identification) {
            const exists = await findStudentByIdentification(identification);
            if (exists) {
              errors.push({ index, code: "E_IDENTIFICATION_EXISTS", error: "La cédula ya está en uso." });
              continue;
            }
          }

          const branchId =
            student.branchId ||
            session?.user?.mainBranch?.id ||
            session?.user?.branches?.[0]?.id;

          if (!branchId) {
            errors.push({
              index,
              code: "E_BRANCH_MISSING",
              error: "No se pudo determinar la sucursal.",
            });
            continue;
          }

          const created = await prisma.student.create({
            data: {
              code: student.generatedCode,
              firstName: student.nombres,
              lastName: student.apellidos,
              identification: identification,
              identificationType: identificationType as any,
              phone: phone,
              email: student.email || null,
              address: student.direccion || null,
              hasTakenCourses: false,
              branchId,
            },
          });

          createdStudents.push(created);
        } catch (err) {
          errors.push({
            index,
            code: "E_UNKNOWN",
            error: formatErrorMessage(err),
          });
        }
      }
    });

    await createLog({
      action: "POST",
      description: `Creación en lote de estudiantes. Total: ${studentsData.length}, Exitosos: ${createdStudents.length}, Errores: ${errors.length}`,
      origin: "students/batch",
      success: true,
    });

    return NextResponse.json({ created: createdStudents, errors }, { status: 201 });
  } catch (error) {
    await createLog({
      action: "POST",
      description: `Fallo al crear estudiantes en lote: ${formatErrorMessage(error)}`,
      origin: "students/batch",
      success: false,
    });

    return NextResponse.json(
      { error: formatErrorMessage(error) },
      { status: 500 }
    );
  }
}
