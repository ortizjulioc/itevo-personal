import { NextRequest, NextResponse } from 'next/server';
import { formatErrorMessage } from '@/utils/error-to-string';
import { createLog } from '@/utils/log';
import { findAccountsReceivableByStudentId } from '@/services/student-service';

// Obtener todas las cuentas por cobrar para un studentId
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id: studentId } = params;

    // Validar que studentId sea un string no vacío
    if (!studentId) {
      return NextResponse.json({ code: 'E_INVALID_STUDENT_ID', error: 'El studentId es requerido' }, { status: 400 });
    }

    const accountsReceivable = await findAccountsReceivableByStudentId(studentId);

    if (!accountsReceivable || accountsReceivable.length === 0) {
      return NextResponse.json({ code: 'E_ACCOUNTS_RECEIVABLE_NOT_FOUND', message: `No se encontraron cuentas por cobrar para el estudiante con ID ${studentId}` }, { status: 404 });
    }

    return NextResponse.json({
      accountsReceivable,
      totalAccountsReceivable: accountsReceivable.length,
    }, { status: 200 });
  } catch (error) {
    await createLog({
      action: 'GET',
      description: formatErrorMessage(error),
      origin: 'accounts-receivable/student/[studentId]',
      success: false,
    });
    return NextResponse.json({ error: formatErrorMessage(error) }, { status: 500 });
  }
}