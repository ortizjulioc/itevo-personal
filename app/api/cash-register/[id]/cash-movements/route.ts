import { NextRequest, NextResponse } from 'next/server';
import { getCashMovementsByCashRegisterId } from '@/services/cash-movement';
import { createLog } from '@/utils/log';
import { formatErrorMessage } from '@/utils/error-to-string';

// Get cash movements by cash register ID
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const { id } = params;

        const cashMovements = await getCashMovementsByCashRegisterId(id);

        if (!cashMovements || cashMovements.length === 0) {
            return NextResponse.json({ code: 'E_CASH_MOVEMENTS_NOT_FOUND', message: 'No se encontraron movimientos de caja' }, { status: 404 });
        }

        return NextResponse.json(cashMovements, { status: 200 });
    } catch (error) {
        await createLog({
        action: 'GET',
        description: formatErrorMessage(error),
        origin: 'cash-register/[id]/cash-movements',
        success: false,
        });
        return NextResponse.json({ error: formatErrorMessage(error) }, { status: 500 });
    }
}
