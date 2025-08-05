import { getPayablePaymentById, getPayablePaymentsByAccountPayableId } from "@/services/account-payable";
import { formatErrorMessage } from "@/utils/error-to-string";
import { createLog } from "@/utils/log";
import { NextRequest, NextResponse } from "next/server";


export async function GET(request: NextRequest, { params }: { params: { id: string, paymentId: string } }) {
    try {
        // Fetch payments for the specified account payable
        const payment = await getPayablePaymentById(params.paymentId);
        return NextResponse.json(payment, { status: 200 });
    } catch (error) {
        await createLog({
            action: 'GET',
            description: `Error fetching payments by id: ${formatErrorMessage(error)}`,
            origin: 'account-payable/[id]/payments/[paymentId]',
            elementId: params.paymentId,
            success: false,
        });
        return NextResponse.json({ error: formatErrorMessage(error) }, { status: 500 });
    }
}
