import { NextResponse, NextRequest } from "next/server";
import { validateObject } from "@/utils";
import { getEnrollments, createEnrollment } from "@/services/enrollment-service";
import { formatErrorMessage } from "@/utils/error-to-string";
import { createLog } from "@/utils/log";
import { findCourseBranchById } from "@/services/course-branch-service";
import { findStudentById } from "@/services/student-service";
import { createManyAccountsReceivable } from "@/services/account-receivable";
import { CourseBranchStatus, Enrollment, EnrollmentStatus, PaymentStatus } from "@prisma/client";
import { Prisma } from "@/utils/lib/prisma";
import { addDaysToDate, getCourseEndDate } from "@/utils/date";
import { getHolidays } from "@/services/holiday-service";
import { addMonths } from "date-fns";

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);

        const filters = {
            page: parseInt(searchParams.get('page') || '1', 10),
            top: parseInt(searchParams.get('top') || '10', 10),
            studentId: searchParams.get('studentId') || undefined,
            courseId: searchParams.get('courseId') || undefined,
            teacherId: searchParams.get('teacherId') || undefined,
            branchId: searchParams.get('branchId') || undefined,
            promotionId: searchParams.get('promotionId') || undefined,
            modality: searchParams.get('modality') || undefined,
            status: searchParams.get('status') || undefined,
            enrollmentDate: searchParams.get('enrollmentDate') || undefined,
            courseBranchId: searchParams.get('courseBranchId') || undefined,
        }

        const { enrollments, totalEnrollments } = await getEnrollments(filters);

        return NextResponse.json({
            enrollments,
            totalEnrollments,
        }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: formatErrorMessage(error) }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();

        // Validate the request body
        const { isValid, message } = validateObject(body, ['studentId', 'courseBranchId', 'status']);
        if (!isValid) {
            return NextResponse.json({ code: 'E_MISSING_FIELDS', error: message }, { status: 400 });
        }

        let courseBranch = await findCourseBranchById(body.courseBranchId);
        if (!courseBranch) {
            return NextResponse.json({ code: 'E_COURSE_BRANCH_NOT_FOUND', error: 'Course branch not found' }, { status: 404 });
        }

        if (courseBranch.status === CourseBranchStatus.DRAFT || courseBranch.status === CourseBranchStatus.CANCELED || courseBranch.status === CourseBranchStatus.COMPLETED) {
            return NextResponse.json({
                code: 'E_COURSE_BRANCH_INVALID',
                error: 'Course branch is not active',
                message: 'Este curso no está disponible para inscripciones',
            }, { status: 400 });
        }

        if (courseBranch.endDate && new Date(courseBranch.endDate) < new Date()) {
            return NextResponse.json({
                code: 'E_COURSE_BRANCH_EXPIRED',
                error: 'Course branch has expired',
                message: 'El curso ha expirado',
            }, { status: 400 });
        }

        const student = await findStudentById(body.studentId);
        if (!student) {
            return NextResponse.json({ code: 'E_STUDENT_NOT_FOUND', error: 'Student not found' }, { status: 404 });
        }

        return await Prisma.$transaction(async (prisma) => {
            if (courseBranch.id && courseBranch.amount && courseBranch.startDate) {
                // Start Prisma transaction
                // Check if the student is already enrolled in the course branch
                const existingEnrollment = await prisma.enrollment.findFirst({
                    where: {
                        studentId: student.id,
                        courseBranchId: courseBranch.id,
                        status: {
                            in: [EnrollmentStatus.ENROLLED, EnrollmentStatus.WAITING],
                        },
                    },
                });

                if (existingEnrollment) {
                    return NextResponse.json({
                        code: 'E_STUDENT_ALREADY_ENROLLED',
                        error: 'Student is already enrolled in this course branch',
                        message: 'El estudiante ya está inscrito en este curso',
                    }, { status: 400 });
                }

                const paymentPlan = await prisma.courseBranchPaymentPlan.findUnique({
                    where: { courseBranchId: courseBranch.id },
                });

                // 1. Crear el Enrollment
                const enrollment = await createEnrollment({
                    student: { connect: { id: student.id } },
                    courseBranch: { connect: { id: courseBranch.id } },
                    enrollmentDate: body.enrollmentDate ? new Date(body.enrollmentDate) : new Date(),
                    status: body.status,
                }, prisma);

                // 2. Verificar que existe un plan de pago
                if (!paymentPlan) {
                    return NextResponse.json({
                        code: 'E_PAYMENT_PLAN_NOT_FOUND',
                        error: 'Payment plan not found for this course branch',
                        message: 'El curso no tiene plan de pago configurado',
                    }, { status: 400 });
                }

                // 3. Generar las cuentas por cobrar
                const receivables: any[] = [];
                const startDate = new Date(courseBranch.startDate);
                const amountPerInstallment = courseBranch.amount;

                // cuota de inscripción si aplica
                if (courseBranch.enrollmentAmount && courseBranch.enrollmentAmount > 0) {
                    receivables.push({
                        enrollmentId: enrollment.id,
                        amount: courseBranch.enrollmentAmount,
                        studentId: student.id,
                        courseBranchId: courseBranch.id,
                        dueDate: startDate, // mismo día de inicio
                        status: PaymentStatus.PENDING,
                    });
                }

                // Generar cuotas según frecuencia
                for (let i = 0; i < paymentPlan.installments; i++) {
                    let dueDate = new Date(startDate);

                    switch (paymentPlan.frequency) {
                        case 'MONTHLY':
                            const dateWithDay = addDaysToDate(dueDate, paymentPlan.dayOfMonth || dueDate.getDate());
                            dueDate = addMonths(dateWithDay, i);
                            break;

                        case 'WEEKLY':
                            dueDate.setDate(dueDate.getDate() + i * 7);
                            break;

                        case 'BIWEEKLY':
                            dueDate.setDate(dueDate.getDate() + i * 14);
                            break;

                        case 'PER_CLASS':
                            // usar las sesiones del curso si tienes las fechas
                            // por simplicidad aquí lo tratamos como semanal
                            dueDate.setDate(dueDate.getDate() + i * 7);
                            break;

                        case 'ONCE':
                            if (i === 0) {
                                dueDate.setDate(dueDate.getDate());
                            } else {
                                continue; // no generar más de una cuota
                            }
                            break;

                        default:
                            throw new Error(`Unsupported frequency: ${paymentPlan.frequency}`);
                    }

                    // aplicar días de gracia si existen
                    if (paymentPlan.graceDays && paymentPlan.graceDays > 0) {
                        dueDate.setDate(dueDate.getDate() + paymentPlan.graceDays);
                    }

                    receivables.push({
                        enrollmentId: enrollment.id,
                        studentId: student.id,
                        courseBranchId: courseBranch.id,
                        amount: amountPerInstallment,
                        dueDate,
                        status: PaymentStatus.PENDING,
                    });

                }

                // 4. Insertar las cuentas por cobrar
                await prisma.accountReceivable.createMany({
                    data: receivables,
                });

                //Crear logs de auditoría
                await createLog({
                    action: "POST",
                    description: `Se creó un nuevo enrollment con la siguiente informacion: \n${JSON.stringify(enrollment, null, 2)}`,
                    origin: "enrollments",
                    elementId: enrollment.id,
                    success: true,
                });

                if (receivables.length > 0) {
                    await createLog({
                        action: "POST",
                        description: `Se crearon las siguientes cuentas por cobrar para el enrollment ${enrollment.id}: \n${JSON.stringify(receivables, null, 2)}`,
                        origin: "enrollments",
                        elementId: enrollment.id,
                        success: true,
                    });
                }

                return NextResponse.json({
                    enrollment,
                    receivables,
                }, { status: 200 });
            } else {
                return NextResponse.json({
                    code: 'E_COURSE_BRANCH_INVALID',
                    error: 'Course branch is invalid or missing required fields',
                    message: 'El curso no es válido o falta información requerida',
                }, { status: 400 });
            }
        });
    } catch (error) {
        await createLog({
            action: "POST",
            description: `Error al crear un enrollment: ${formatErrorMessage(error)}`,
            origin: "enrollments",
            elementId: request.headers.get("origin") || "",
            success: false,
        });

        return NextResponse.json({ error: formatErrorMessage(error) }, { status: 500 });
    }
}
