import { NextRequest, NextResponse } from 'next/server';
import { createLog } from '@/utils/log';
import { formatErrorMessage } from '@/utils/error-to-string';
import { z } from 'zod';
import { Prisma } from '@/utils/lib/prisma';
import { createCashMovement } from '@/services/cash-movement';
import { CashMovementReferenceType, CashMovementType } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth-options';
import { newPayablePayment, getPayablePaymentsByAccountPayableId } from '@/services/account-payable';

const CreatePayablePaymentSchema = z.object({
  amount: z.number().positive(),
  cashRegisterId: z.string().uuid(),
  description: z.string().optional(),
});

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const session = await getServerSession(authOptions);
        const body = await request.json();
        const validatedData = CreatePayablePaymentSchema.parse(body);
        // Validate the request body
        if (!validatedData) {
            return NextResponse.json({ code: 'E_MISSING_FIELDS' }, { status: 400 });
        }
        // Init prisma transaction
        const resp = await Prisma.$transaction(async (prisma) => {
            // Verify if the cash register exists
            const cashRegister = await prisma.cashRegister.findUnique({
                where: { id: validatedData.cashRegisterId },
            });

            if (!cashRegister) {
                throw new Error(`No se encontró la caja registradora con ID ${validatedData.cashRegisterId}`);
            }

            // Create cash movement
            const cashMovement = await createCashMovement({
                cashRegister: { connect: { id: validatedData.cashRegisterId } },
                type: CashMovementType.EXPENSE,
                amount: validatedData.amount,
                description: validatedData.description || `Pago de cuenta por pagar ${params.id}`,
                referenceType: CashMovementReferenceType.PAYABLE_PAYMENT,
                referenceId: params.id,
                user: { connect: { id: session.user.id || '' } },
            }, prisma);

            // Create payment record
            const payment = await newPayablePayment(
                params.id,
                validatedData.amount,
                cashMovement.id,
                prisma
            );

            // Log the payment creation
            await createLog({
                action: 'POST',
                description: `Se creó un pago de cuenta por pagar con los siguientes datos: ${JSON.stringify(payment, null, 2)}`,
                origin: 'account-payable/[id]/payments',
                elementId: params.id,
                success: true,
            });
            return payment;
        });
        return NextResponse.json({ payment: resp, message: 'Payment processed successfully' }, { status: 200 });
    } catch (error) {
        await createLog({
            action: 'POST',
            description: `Error processing payment: ${formatErrorMessage(error)}`,
            origin: 'account-payable/[id]/payments',
            elementId: params.id,
            success: false,
        });
        return NextResponse.json({ error: formatErrorMessage(error) }, { status: 500 });
    }
}

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        // Fetch payments for the specified account payable
        const payments = await getPayablePaymentsByAccountPayableId(params.id);
        return NextResponse.json({ payments }, { status: 200 });
    } catch (error) {
        await createLog({
            action: 'GET',
            description: `Error fetching payments: ${formatErrorMessage(error)}`,
            origin: 'account-payable/[id]/payments',
            elementId: params.id,
            success: false,
        });
        return NextResponse.json({ error: formatErrorMessage(error) }, { status: 500 });
    }
}
