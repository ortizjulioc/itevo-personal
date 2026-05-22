import { deleteEarningFromAccountsPayable } from "@/services/account-payable";
import { annularReceivablePayment, findAccountReceivableById, updateAccountReceivableById } from "@/services/account-receivable";
import { deleteCashMovementsByInvoiceId } from "@/services/cash-movement";
import { findInvoiceById, updateInvoice } from "@/services/invoice-service";
import { findProductById, updateProductById } from "@/services/product-service";
import { recordInventoryMovement } from "@/services/inventory-service";
import { formatErrorMessage } from "@/utils/error-to-string";
import { Prisma } from "@/utils/lib/prisma";
import { createLog } from "@/utils/log";
import { InvoiceItemType, InvoiceStatus, MovementType } from '@/generated/prisma/client';
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth-options";

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    const invoice = await findInvoiceById(
      id,
      Prisma,
      {
        cashRegister: {
          select: {
            id: true,
            cashBox: {
              select: { id: true, name: true, branch: true}
            },
            user: {
              select: {
                id: true,
                name: true,
                lastName: true,
              }
            }
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

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const data = await request.json();

    const invoice = await findInvoiceById(id);

    if (!invoice) {
      return NextResponse.json({ code: 'E_INVOICE_NOT_FOUND', message: 'Factura no encontrado' }, { status: 404 });
    }

    if (invoice.status === InvoiceStatus.PAID) {
      return NextResponse.json({ code: 'E_INVOICE_PAID', message: 'No se puede editar una factura pagada' }, { status: 400 });
    }

    if (invoice.studentId && data.studentId && invoice.studentId !== data.studentId) {
      return NextResponse.json({ code: 'E_STUDENT_ALREADY_ASSIGNED', message: 'La factura ya tiene un estudiante asignado' }, { status: 400 });
    }

    const updatedInvoice = await updateInvoice(id, data);

    await createLog({
      action: 'PUT',
      description: `Se actualizó la factura ${invoice.invoiceNumber}. \nDatos enviados: ${JSON.stringify(data, null, 2)}`,
      origin: 'invoices/[id]',
      elementId: id,
      success: true,
    });

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

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    const { id } = await params;

    const invoice = await findInvoiceById(id);

    if (!invoice) {
      return NextResponse.json({ code: 'E_INVOICE_NOT_FOUND', message: 'Factura no encontrado' }, { status: 404 });
    }

    await Prisma.$transaction(async (prisma) => {
      for (const item of invoice.items) {
        if (item.type === InvoiceItemType.PRODUCT && item.productId) {
          const product = await findProductById(item.productId);
          if (product) {
              await recordInventoryMovement({
                  productId: product.id,
                  quantity: item.quantity || 0,
                  previousStock: product.stock,
                  newStock: product.stock + (item.quantity || 0),
                  type: MovementType.IN,
                  reference: id,
                  note: `Anulación de factura`,
                  branchId: product.branchId || null,
                  createdBy: session?.user?.id as string || '',
                  tx: prisma,
              });
              await updateProductById(item.productId, { stock: product.stock + (item.quantity || 0) }, prisma);
          }
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


    await createLog({
      action: 'DELETE',
      description: `Anulación de factura.\nNúmero de factura: ${invoice.invoiceNumber}\nID Técnico: ${id}`,
      origin: 'invoices/[id]',
      elementId: id,
      success: true,
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
