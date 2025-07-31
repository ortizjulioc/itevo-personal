import { getAccountsPayable } from "@/services/account-payable";
import { formatErrorMessage } from "@/utils/error-to-string";
import { createLog } from "@/utils/log";
import { PaymentStatus } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (request: NextRequest) => {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const top = parseInt(searchParams.get('top') || '10', 10);
    const filters = {
      courseBranchId: searchParams.get('courseBranchId') || undefined,
      teacherId: searchParams.get('teacherId') || undefined,
      status: searchParams.get('status') as PaymentStatus || undefined,
    };

    const {accountsPayable, totalAccountsPayable} = await getAccountsPayable(filters, page, top);

    return NextResponse.json({
        accountsPayable,
        total: totalAccountsPayable,
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
