import { Invoice, InvoiceItem, InvoiceItemType, PrismaClient } from "@prisma/client";
const Prisma = new PrismaClient();

interface InvoiceWithItems extends Invoice {
    items: InvoiceItem[];
}
export interface InvoiceCreateDataType {
    invoiceNumber: string;
    ncf: string;
    studentId?: string | null;
    createdBy: string;
    cashRegisterId: string;
    paymentDate?: Date | null;
    paymentMethod?: string | null;
    paymentDetails?: any; // Puedes tiparlo más estrictamente si quieres
}

export interface InvoiceItemCreateData {
    type: InvoiceItemType;
    productId?: string | null;
    accountReceivableId?: string | null;
    quantity: number;
    unitPrice: number;
    subtotal: number;
    itbis: number;
}

export interface InvoicePaymentData {
    paymentMethod: string;
    paymentDetails?: any; // JSON con detalles adicionales
}

export const getLastInvoice = async (prefix: string) : Promise<Invoice | null> => {
    return await Prisma.invoice.findFirst({
        where: { invoiceNumber: { startsWith: prefix } },
        orderBy: { invoiceNumber: 'desc' },
    });
}


export const createInvoice = async (data: InvoiceCreateDataType) : Promise<Invoice> => {
    const { invoiceNumber, ncf, studentId, createdBy, cashRegisterId } = data;

    const invoice = await Prisma.invoice.create({
        data: {
            invoiceNumber,
            ncf,
            studentId,
            createdBy,
            cashRegisterId,
            paymentDate: null,
        }
    });
    return invoice;
}

export const findInvoiceById = async (id: string): Promise<InvoiceWithItems | null> => {
    return await Prisma.invoice.findUnique({
        where: { id },
        include: { items: true },
    });
}

export const addNewItemToInvoice = async (invoiceId: string, data: InvoiceItemCreateData): Promise<{ invoiceUpdated: Invoice, itemCreated: InvoiceItem }> => {
    return await Prisma.$transaction(async (tx) => {
        // Crear el ítem
        const newItem = await tx.invoiceItem.create({
            data: {
                invoiceId,
                type: data.type,
                productId: data.type === 'PRODUCT' ? data.productId : null,
                accountReceivableId: data.type === 'RECEIVABLE' ? data.accountReceivableId : null,
                quantity: data.quantity,
                unitPrice: data.unitPrice,
                subtotal: data.subtotal,
                itbis: data.itbis,
            },
        });

        // Recalcular subtotal e itbis totales de la factura
        const items = await tx.invoiceItem.findMany({
            where: { invoiceId },
        });
        const newSubtotal = items.reduce((sum, item) => sum + item.subtotal, 0);
        const newItbis = items.reduce((sum, item) => sum + item.itbis, 0);

        // Actualizar la factura
        const invoiceUpdated = await tx.invoice.update({
            where: { id: invoiceId },
            data: {
                subtotal: newSubtotal,
                itbis: newItbis,
            },
            include: { items: true },
        });

        return { invoiceUpdated, itemCreated: newItem };
    });
}

export const payInvoice = async (invoiceId: string, paymentData: InvoicePaymentData): Promise<Invoice> => {
    return await Prisma.$transaction(async (tx) => {
        // Buscar la factura
        const invoice = await tx.invoice.findUnique({
            where: { id: invoiceId },
            include: { cashRegister: true, items: true },
        });
        if (!invoice) {
            throw new Error(`Factura con ID ${invoiceId} no encontrada`);
        }
        if (invoice.status !== 'DRAFT') {
            throw new Error(`Solo se pueden pagar facturas en estado DRAFT (actual: ${invoice.status})`);
        }
        if (invoice.items.length === 0) {
            throw new Error('No se puede pagar una factura sin ítems');
        }
        if (invoice.subtotal + invoice.itbis <= 0) {
            throw new Error('El monto total de la factura debe ser mayor a 0');
        }

        // Verificar que la caja está abierta
        if (invoice.cashRegister.status !== 'OPEN') {
            throw new Error(`La caja registradora ${invoice.cashRegisterId} está cerrada`);
        }

        // Obtener un NCF activo y verificar que currentSequence < endSequence
        const ncfRange = await tx.ncfRange.findFirst({
            where: { isActive: true },
            orderBy: { currentSequence: 'asc' }, // Tomamos el rango con menor secuencia disponible
        });
        if (!ncfRange) {
            throw new Error('No hay rangos de NCF activos disponibles');
        }
        if (ncfRange.currentSequence >= ncfRange.endSequence) {
            throw new Error(`El rango de NCF ${ncfRange.prefix} ha alcanzado su límite (${ncfRange.endSequence})`);
        }

        const newSequence = ncfRange.currentSequence + 1;
        const ncf = `${ncfRange.prefix}${newSequence.toString().padStart(8, '0')}`;

        // Verificar unicidad del NCF
        const ncfExists = await tx.invoice.findUnique({ where: { ncf } });
        if (ncfExists) {
            throw new Error(`El NCF ${ncf} ya está en uso`);
        }

        // Actualizar el rango de NCF
        await tx.ncfRange.update({
            where: { id: ncfRange.id },
            data: { currentSequence: newSequence },
        });

        // Crear el movimiento de caja
        const cashMovement = await tx.cashMovement.create({
            data: {
                cashRegisterId: invoice.cashRegisterId,
                type: 'INCOME',
                amount: invoice.subtotal + invoice.itbis,
                description: `Pago de factura ${invoice.invoiceNumber}`,
                referenceType: 'INVOICE',
                referenceId: invoiceId,
                createdBy: invoice.createdBy,
            },
        });

        // Actualizar la factura a PAID
        const invoiceUpdated = await tx.invoice.update({
            where: { id: invoiceId },
            data: {
                ncf,
                status: 'PAID',
                paymentDate: new Date(),
                paymentMethod: paymentData.paymentMethod,
                paymentDetails: paymentData.paymentDetails || {},
            },
            include: { items: true, cashRegister: true },
        });

        return invoiceUpdated;
    });
};
