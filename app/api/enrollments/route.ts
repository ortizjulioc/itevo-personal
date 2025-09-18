import { NextResponse, NextRequest } from "next/server";
import { validateObject } from "@/utils";
import { getEnrollments, createEnrollment } from "@/services/enrollment-service";
import { formatErrorMessage } from "@/utils/error-to-string";
import { createLog } from "@/utils/log";
import { findCourseBranchById } from "@/services/course-branch-service";
import { findStudentById } from "@/services/student-service";
import { createManyAccountsReceivable } from "@/services/account-receivable";
import { CourseBranchStatus, Enrollment, EnrollmentStatus } from "@prisma/client";
import { Prisma } from "@/utils/lib/prisma";
import { getCourseEndDate } from "@/utils/date";
import { getHolidays } from "@/services/holiday-service";

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
        const { isValid, message } = validateObject(body, ['studentId', 'courseBranchId', 'enrollmentDate', 'status']);
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

        if (courseBranch.id && courseBranch.amount) {
            // Check if the student is already enrolled in the course branch
            const existingEnrollment = await Prisma.enrollment.findFirst({
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

            const paymentPlan = await Prisma.courseBranchPaymentPlan.findUnique({
                where: { courseBranchId: courseBranch.id },
            });
        } else {
            return NextResponse.json({
                code: 'E_COURSE_BRANCH_INVALID',
                error: 'Course branch is invalid or missing required fields',
                message: 'El curso no es válido o falta información requerida',
            }, { status: 400 });
        }
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
