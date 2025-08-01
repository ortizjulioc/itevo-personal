import { changeAccountReceivableStatus } from "@/services/account-receivable";
import { formatErrorMessage } from "@/utils/error-to-string";
import { createLog } from "@/utils/log";
import { NextRequest, NextResponse } from "next/server";
import * as Zod from "zod";

// Define the schema for the request body
const ChangeStatusSchema = Zod.object({
  status: Zod.enum(['PENDING', 'PAID', 'CANCELED'], {
    errorMap: () => ({ message: "El estado debe ser uno de los siguientes: " + ['PENDING', 'PAID', 'CANCELED'].join(", ") }),
  }),
});


// Actualizar una cuenta por cobrar por ID
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  try {
    const body = await request.json();
    const { status } = body;

    // Validar el cuerpo de la solicitud
    const parsed = ChangeStatusSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ code: 'E_INVALID_REQUEST', message: parsed.error.errors[0].message }, { status: 400 });
    }
    // Validar el ID de la cuenta por cobrar
    if (!id) {
      return NextResponse.json({ code: 'E_INVALID_REQUEST', message: 'El ID de la cuenta por cobrar es requerido' }, { status: 400 });
    }

    // Call the service to change the status
    const accountReceivableUpdated = await changeAccountReceivableStatus(id, status);
    // Log the successful status change
    await createLog({
      action: 'PUT',
      description: `Estado de la cuenta por cobrar: ${id} cambiado a ${status}`,
      origin: 'accounts-receivable/[id]/change-status',
      elementId: id,
      success: true,
    });
    return NextResponse.json({ accountReceivable: accountReceivableUpdated, message: 'Estado actualizado correctamente' }, { status: 200 });
  } catch (error) {
    await createLog({
      action: 'PUT',
      description: formatErrorMessage(error),
      origin: 'accounts-receivable/[id]/change-status',
      elementId: id,
      success: false,
    });
    return NextResponse.json({ code: 'E_UNKNOWN', message: formatErrorMessage(error) }, { status: 500 });
  }
}