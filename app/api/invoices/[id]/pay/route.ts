import { NextRequest, NextResponse } from 'next/server';
import { findInvoiceById, InvoicePaymentData, updateInvoice } from '@/services/invoice-service';
import { createLog } from '@/utils/log';
import { formatErrorMessage } from '@/utils/error-to-string';
import { Prisma } from '@/utils/lib/prisma';
import { CashMovementReferenceType, CashMovementType, CashRegisterStatus, Invoice, InvoiceItemType, InvoiceStatus, NcfType, PaymentStatus } from '@prisma/client';
import { getSettings } from '@/services/settings-service';
import { generateNcf } from '@/utils/ncf';
import { createCashMovement } from '@/services/cash-movement';

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
    const { id } = params; // ID de la factura
    try {
        const body: InvoicePaymentData = await req.json();

        let newInvoiceData: Invoice | null = null;
        // Verificar que la factura existe
        await Prisma.$transaction(async (tx) => {
            const invoice = await findInvoiceById(id, tx, { cashRegister: true });
            if (!invoice) throw new Error(`Factura con ID ${id} no encontrada`);
            if (invoice.status !== InvoiceStatus.DRAFT) throw new Error(`Solo se pueden pagar facturas en estado DRAFT (actual: ${invoice.status})`);
            if (invoice.items.length === 0) throw new Error('No se puede pagar una factura sin ítems');
            if (invoice.subtotal + invoice.itbis <= 0) throw new Error('El monto total de la factura debe ser mayor a 0');
            if (invoice.cashRegister?.status !== CashRegisterStatus.OPEN) throw new Error(`La caja registradora ${invoice.cashRegisterId} está cerrada`);

            const finalType = (body.type || invoice.type) as NcfType;
            const settings = await getSettings(tx);
            const USE_NCF = settings?.billingWithoutNcf !== true;
            const ncf = USE_NCF ? await generateNcf(tx, finalType) : invoice.ncf;

            const isCredit = body.isCredit !== undefined ? body.isCredit : invoice.isCredit;

            if (isCredit && !body.studentId && !invoice.studentId) {
                throw new Error('Para facturas a crédito se debe especificar el ID del estudiante');
            }


            if (isCredit) {
                const updatedInvoice = await updateInvoice(id, {
                    ncf,
                    type: finalType,
                    status: InvoiceStatus.COMPLETED,
                    studentId: body.studentId || invoice.studentId,
                    paymentDate: new Date(),
                    paymentMethod: body.paymentMethod,
                    paymentDetails: body.paymentDetails || {},
                    isCredit,
                }, tx);
                newInvoiceData = updatedInvoice;
                // Si es crédito, crear cuenta por cobrar
                const receivable = await tx.accountReceivable.create({
                    data: {
                        student: { connect: { id: body.studentId || invoice.studentId! } },
                        concept: `Factura a crédito: ${invoice.invoiceNumber}`,
                        amount: invoice.subtotal + invoice.itbis,
                        status: PaymentStatus.PENDING,
                        dueDate: new Date(new Date().setDate(new Date().getDate() + 30)),
                    },
                });
                await createLog({
                    action: 'POST',
                    description: `Cuenta por cobrar ${receivable.id} creada para la factura ${updatedInvoice.invoiceNumber} por un monto de ${receivable.amount}`,
                    origin: `invoices/[id]/pay`,
                    elementId: receivable.id,
                    success: true,
                });
            } else {
                const updatedInvoice = await updateInvoice(id, {
                    ncf,
                    type: finalType,
                    status: InvoiceStatus.PAID,
                    studentId: body.studentId || invoice.studentId,
                    paymentDate: new Date(),
                    paymentMethod: body.paymentMethod,
                    paymentDetails: body.paymentDetails || {},
                    isCredit,
                }, tx);
                newInvoiceData = updatedInvoice;

                await createCashMovement({
                    cashRegister: { connect: { id: invoice.cashRegisterId } },
                    type: CashMovementType.INCOME,
                    amount: invoice.subtotal + invoice.itbis,
                    description: `Pago de factura ${invoice.invoiceNumber}`,
                    referenceType: CashMovementReferenceType.INVOICE,
                    referenceId: updatedInvoice.id,
                    user: { connect: { id: invoice.createdBy } },
                }, tx);

            }
            await createLog({
                action: 'POST',
                description: `Factura ${newInvoiceData.invoiceNumber} ${isCredit ? 'registrada a crédito' : 'pagada'
                    }.\nInformación: ${JSON.stringify(newInvoiceData, null, 2)}`, origin: `invoices/[id]/pay`,
                elementId: newInvoiceData.id,
                success: true,
            });

        });

        return NextResponse.json(newInvoiceData, { status: 200 });
    } catch (error) {
        // Registrar log de error
        await createLog({
            action: 'POST',
            description: `Error al pagar factura ${id}: ${formatErrorMessage(error)}`,
            origin: `invoices/[id]pay`,
            success: false,
        });

        return NextResponse.json({ error: formatErrorMessage(error) }, { status: 500 });
    }
}
