import { InvoiceItemType, PrismaClient } from "@prisma/client";
const Prisma = new PrismaClient();

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

export const getLastInvoice = async (prefix: string) => {
    return await Prisma.invoice.findFirst({
        where: { invoiceNumber: { startsWith: prefix } },
        orderBy: { invoiceNumber: 'desc' },
    });
}


export const createInvoice = async (data: InvoiceCreateDataType) => {
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

export const findInvoiceById = async (id: string) => {
    return await Prisma.invoice.findUnique({
        where: { id },
        include: { items: true },
    });
}

export const addNewItemToInvoice = async (invoiceId: string, data: InvoiceItemCreateData) => {
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
