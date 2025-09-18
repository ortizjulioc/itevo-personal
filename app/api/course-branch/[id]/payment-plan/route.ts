import { addPaymentPlanToCourseBranch, findCourseBranchById } from "@/services/course-branch-service";
import { validateObject } from "@/utils";
import { formatErrorMessage } from "@/utils/error-to-string";
import { Prisma } from "@/utils/lib/prisma";
import { createLog } from "@/utils/log";
import { Prisma as PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

type PaymentPlanBody = PrismaClient.CourseBranchPaymentPlanCreateInput;

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  try {
    console.log("Fetching payment plan for course branch ID:", params.id);
    const { id } = params;
    const courseBranch = await findCourseBranchById(id);
    if (!courseBranch) {
      return NextResponse.json({ code: 'E_COURSE_BRANCH_NOT_FOUND', error: 'Course branch not found' }, { status: 404 });
    }

    const paymentPlan = await Prisma.courseBranchPaymentPlan.findUnique({
      where: { courseBranchId: courseBranch.id },
    });

    if (!paymentPlan) {
      return NextResponse.json({ code: 'E_PAYMENT_PLAN_NOT_FOUND', error: 'Payment plan not found' }, { status: 404 });
    }
    return NextResponse.json(paymentPlan, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: formatErrorMessage(error) }, { status: 500 });
  }
}

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const body: PaymentPlanBody = await request.json();

    const { isValid, message } = validateObject(body, ['frequency']);
    if (!isValid) {
      return new Response(JSON.stringify({ code: 'E_MISSING_FIELDS', error: message }), { status: 400 });
    }
    console.log("Creating payment plan for course branch ID:", id);
    const courseBranch = await findCourseBranchById(id);
    console.log("Found course branch:", courseBranch);
    if (!courseBranch) {
      return NextResponse.json({ code: 'E_COURSE_BRANCH_NOT_FOUND', error: 'Course branch not found' }, { status: 404 });
    }

    const paymentPlan = await addPaymentPlanToCourseBranch({
      ...body,
      courseBranch: { connect: { id: courseBranch.id } },
    });

    await createLog({
      action: "POST",
      description: `Se creó un nuevo payment plan con la siguiente informacion: \n${JSON.stringify(paymentPlan, null, 2)}`,
      origin: "course-branch/[id]/payment-plan",
      elementId: request.headers.get("origin") || "",
      success: true,
    });

    return NextResponse.json(paymentPlan, { status: 201 });
  } catch (error) {
    console.error("Error creating payment plan:", error);
    await createLog({
      action: "POST",
      description: `Error al crear un payment plan: ${formatErrorMessage(error)}`,
      origin: "course-branch/[id]/payment-plan",
      elementId: request.headers.get("origin") || "",
      success: false,
    });

    return NextResponse.json({ error: formatErrorMessage(error) }, { status: 500 });
  }
}
