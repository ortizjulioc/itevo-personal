import { NextRequest, NextResponse } from 'next/server';
import { validateObject } from '@/utils';
import { formatErrorMessage } from '@/utils/error-to-string';
import { createLog } from '@/utils/log';
import { PaymentStatus } from '@prisma/client';
import { createAccountReceivable, getAccountsReceivable } from '@/services/account-receivable';

// Obtener todas las cuentas por cobrar con filtros y paginación
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const top = parseInt(searchParams.get('top') || '10', 10);
    const status = searchParams.get('status') || undefined;
    const minAmount = searchParams.get('minAmount') ? parseFloat(searchParams.get('minAmount')!) : undefined;
    const maxAmount = searchParams.get('maxAmount') ? parseFloat(searchParams.get('maxAmount')!) : undefined;
    const dueDateStart = searchParams.get('dueDateStart') ? new Date(searchParams.get('dueDateStart')!) : undefined;
    const dueDateEnd = searchParams.get('dueDateEnd') ? new Date(searchParams.get('dueDateEnd')!) : undefined;
    const courseId = searchParams.get('courseId') || undefined;
    const studentId = searchParams.get('studentId') || undefined;

    const filters = {
      status,
      minAmount,
      maxAmount,
      dueDateStart,
      dueDateEnd,
      courseId,
      studentId,
    };
    const { accountsReceivable, totalAccountsReceivable } = await getAccountsReceivable(filters, page, top);

    return NextResponse.json({
      accountsReceivable,
      totalAccountsReceivable,
    }, { status: 200 });
  } catch (error) {
    await createLog({
      action: 'GET',
      description: formatErrorMessage(error),
      origin: 'accounts-receivable',
      success: false,
    });
    return NextResponse.json({ error: formatErrorMessage(error) }, { status: 500 });
  }
}

// Crear una nueva cuenta por cobrar
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validación de campos requeridos
    const { isValid, message } = validateObject(body, [
      'studentId',
      'courseBranchId',
      'amount',
      'dueDate',
    ]);

    if (!isValid) {
      return NextResponse.json({ code: 'E_MISSING_FIELDS', error: message }, { status: 400 });
    }

    // Validar el status si se proporciona
    if (body.status && !Object.values(PaymentStatus).includes(body.status)) {
      return NextResponse.json({
        code: 'E_INVALID_STATUS',
        message: `El estado debe ser uno de los siguientes: ${Object.values(PaymentStatus).join(', ')}`,
      }, { status: 400 });
    }

    const accountReceivable = await createAccountReceivable({
      studentId: body.studentId,
      courseBranchId: body.courseBranchId,
      amount: parseFloat(body.amount),
      dueDate: new Date(body.dueDate),
      status: body.status || PaymentStatus.PENDING,
      amountPaid: body.amountPaid ? parseFloat(body.amountPaid) : 0,
      enrollmentId: body.enrollmentId,
    });

    await createLog({
      action: 'POST',
      description: `Se creó la cuenta por cobrar con la siguiente información: \n${JSON.stringify(accountReceivable, null, 2)}`,
      origin: 'accounts-receivable',
      elementId: accountReceivable.id,
      success: true,
    });

    return NextResponse.json(accountReceivable, { status: 201 });
  } catch (error) {
    await createLog({
      action: 'POST',
      description: formatErrorMessage(error),
      origin: 'accounts-receivable',
      success: false,
    });
    return NextResponse.json({ error: formatErrorMessage(error) }, { status: 500 });
  }
}