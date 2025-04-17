import { findInvoiceById } from "@/services/invoice-service";
import { formatErrorMessage } from "@/utils/error-to-string";
import { createLog } from "@/utils/log";
import { NextRequest, NextResponse } from "next/server";

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;

    const invoice = await findInvoiceById(id);

    if (!invoice) {
      return NextResponse.json({ code: 'E_INVOICE_NOT_FOUND', message: 'Factura no encontrado' }, { status: 404 });
    }

    return NextResponse.json(invoice, { status: 200 });
  } catch (error) {
    await createLog({
      action: 'GET',
      description: formatErrorMessage(error),
      origin: 'invoices/[id]',
      success: false,
    });
    return NextResponse.json({ error: formatErrorMessage(error) }, { status: 500 });
  }
}
