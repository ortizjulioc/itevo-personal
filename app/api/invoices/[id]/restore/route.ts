import { NextRequest, NextResponse } from 'next/server';
import { restoreInvoiceById, findInvoiceById } from '@/services/invoice-service';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../auth/[...nextauth]/auth-options';
import { formatErrorMessage } from '@/utils/error-to-string';
import { createLog } from '@/utils/log';

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const session = await getServerSession(authOptions);
        const isSuperAdmin = session?.user?.roles?.some((role: any) => role.normalizedName === 'super_admin');

        if (!isSuperAdmin) {
            return NextResponse.json({ error: 'No tienes permisos para realizar esta acción' }, { status: 403 });
        }

        const { id } = await params;

        // Verificar si la factura existe
        const invoice = await findInvoiceById(id);
        if (!invoice) {
            return NextResponse.json({ code: 'E_INVOICE_NOT_FOUND' }, { status: 404 });
        }

        // Restaurar
        await restoreInvoiceById(id);

        // Enviar log de auditoría
        await createLog({
            action: 'PATCH',
            description: `Se restauró la factura con ID ${id}. Número: ${invoice.invoiceNumber}`,
            origin: 'invoices/[id]/restore',
            elementId: id,
            success: true,
        });

        return NextResponse.json({ message: 'Factura restaurada correctamente' }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: formatErrorMessage(error) }, { status: 500 });
    }
}
