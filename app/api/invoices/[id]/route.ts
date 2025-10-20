import { deleteEarningFromAccountsPayable } from "@/services/account-payable";
import { annularReceivablePayment, findAccountReceivableById, updateAccountReceivableById } from "@/services/account-receivable";
import { deleteCashMovementsByInvoiceId } from "@/services/cash-movement";
import { findInvoiceById, updateInvoice } from "@/services/invoice-service";
import { updateProductById } from "@/services/product-service";
import { formatErrorMessage } from "@/utils/error-to-string";
import { Prisma } from "@/utils/lib/prisma";
import { createLog } from "@/utils/log";
import { InvoiceItemType, InvoiceStatus } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;

    const invoice = await findInvoiceById(
      id,
      Prisma,
      {
        cashRegister: {
          select: {
            id: true,
            cashBox: true,
          }
        },
        student: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          }
        }
      }
    );

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
          const { accountReceivable, receivablePayment } = await annularReceivablePayment({
            unitPrice: item.unitPrice || 0,
            accountReceivableId: item.accountReceivableId,
            invoiceId: id,
            prisma,
          });

          if (accountReceivable.courseBranchId) {
            const accountPayable = await prisma.accountPayable.findFirst({
              where: { courseBranchId: accountReceivable.courseBranchId },
            });
            if (accountPayable) {
              await deleteEarningFromAccountsPayable(
                accountPayable.id,
                receivablePayment.id,
                prisma
              );
            }
          }


          // Eliminar cuenta por pagar asociada si existe
        }
      }
      // anular cashregister movements
      await deleteCashMovementsByInvoiceId(id, prisma);

      // anular invoice
      await updateInvoice(id, {
        status: InvoiceStatus.CANCELED,
      }, prisma);
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
