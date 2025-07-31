import { NextRequest, NextResponse } from 'next/server';
import { getPayableEarningsByAccountPayableId } from '@/services/account-payable';
import { createLog } from '@/utils/log';
import { formatErrorMessage } from '@/utils/error-to-string';

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  try {
    const earnings = await getPayableEarningsByAccountPayableId(params.id);
    return NextResponse.json({ earnings }, { status: 200 });
  } catch (error) {
    await createLog({
      action: 'GET',
      description: `Error fetching earnings: ${formatErrorMessage(error)}`,
      origin: 'account-payable/[id]/earnings',
      elementId: params.id,
      success: false,
    });
    return NextResponse.json({ error: formatErrorMessage(error) }, { status: 500 });
  }
}
