import { findAccountReceivableById, updateAccountReceivableById } from "@/services/account-receivable";
import { findInvoiceById, updateInvoice } from "@/services/invoice-service";
import { updateProductById } from "@/services/product-service";
import { formatErrorMessage } from "@/utils/error-to-string";
import { Prisma } from "@/utils/lib/prisma";
import { createLog } from "@/utils/log";
import { CashMovementReferenceType, InvoiceItemType, InvoiceStatus } from "@prisma/client";
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

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const data = await request.json();

    const invoice = await findInvoiceById(id);

    if (!invoice) {
      return NextResponse.json({ code: 'E_INVOICE_NOT_FOUND', message: 'Factura no encontrado' }, { status: 404 });
    }

    const updatedInvoice = await updateInvoice(id, data);

    return NextResponse.json(updatedInvoice, { status: 200 });
  } catch (error) {
    await createLog({
      action: 'PUT',
      description: formatErrorMessage(error),
      origin: 'invoices/[id]',
      success: false,
    });
    return NextResponse.json({ error: formatErrorMessage(error) }, { status: 500 });
  }
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;

    const invoice = await findInvoiceById(id);

    if (!invoice) {
      return NextResponse.json({ code: 'E_INVOICE_NOT_FOUND', message: 'Factura no encontrado' }, { status: 404 });
    }
    
    await Prisma.$transaction(async (prisma) => {
      for (const item of invoice.items) {
        if (item.type === InvoiceItemType.PRODUCT && item.productId) {
          await updateProductById(item.productId, { stock: { increment: item.quantity || 0 } }, prisma);
        } else if (item.type === InvoiceItemType.RECEIVABLE && item.accountReceivableId) {
          const receivable = await findAccountReceivableById(item.accountReceivableId);

          if (receivable) {
            const newAmountPending = receivable.amountPaid - (item.quantity || 0);
            await updateAccountReceivableById(item.accountReceivableId, {
                amountPaid: newAmountPending,
                status: newAmountPending >= receivable.amount ? 'PAID' : 'PENDING',
              },
              prisma
            );
          }
        }
      }
    });

    // anular cashregister movements
    // TODO: Cambiar a cashMovement Service cuando esté listo
    await Prisma.cashMovement.deleteMany({
      where: {
        referenceType: CashMovementReferenceType.INVOICE,
        referenceId: id,
      },
    });

    // anular invoice
    await updateInvoice(id, {
      status: InvoiceStatus.CANCELED,
    });

    return NextResponse.json({ message: 'Factura anulada correctamente' }, { status: 200 });
  } catch (error) {
    await createLog({
      action: 'DELETE',
      description: formatErrorMessage(error),
      origin: 'invoices/[id]',
      success: false,
    });
    return NextResponse.json({ error: formatErrorMessage(error) }, { status: 500 });
  }
}
