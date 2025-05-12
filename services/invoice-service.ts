import { Prisma } from "@/utils/lib/prisma";
import { generateNcf } from "@/utils/ncf";
import { Invoice, InvoiceItem, InvoiceItemType, InvoiceStatus, NcfType } from "@prisma/client";

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
    studentId?: string;
    paymentDetails?: any; // JSON con detalles adicionales
    type?: NcfType;
}

interface InvoiceFilter {
    search?: string; // puede ser número de factura o nombre de estudiante
    type?: NcfType;
    status?: InvoiceStatus;
    fromDate?: Date;
    toDate?: Date;
    studentId?: string;
    createdBy?: string;
    page?: number;
    pageSize?: number;
}

export const findInvoices = async (filter: InvoiceFilter): Promise<{
    invoices: Invoice[];
    totalInvoices: number,
    currentPage: number,
    totalPages: number,
}> => {
    const {
        search,
        type,
        status,
        fromDate,
        toDate,
        studentId,
        createdBy,
        page = 1,
        pageSize = 10,
    } = filter;

    const where: any = {};

    if (type) where.type = type;
    if (status) where.status = status;
    if (studentId) where.studentId = studentId;
    if (createdBy) where.createdBy = createdBy;

    if (fromDate || toDate) {
        where.date = {};
        if (fromDate) where.date.gte = fromDate;
        if (toDate) where.date.lte = toDate;
    }

    if (search) {
        where.OR = [
            { invoiceNumber: { contains: search, mode: "insensitive" } },
            {
                student: {
                    name: { contains: search, mode: "insensitive" },
                },
            },
        ];
    }

    const [data, total] = await Prisma.$transaction([
        Prisma.invoice.findMany({
            where,
            orderBy: { date: "desc" },
            skip: (page - 1) * pageSize,
            take: pageSize,
        }),
        Prisma.invoice.count({ where }),
    ]);

    return {
        invoices: data,
        totalInvoices: total,
        currentPage: page,
        totalPages: Math.ceil(total / pageSize),
    };
}

export const getLastInvoice = async (prefix: string): Promise<Invoice | null> => {
    return await Prisma.invoice.findFirst({
        where: { invoiceNumber: { startsWith: prefix } },
        orderBy: { invoiceNumber: 'desc' },
    });
}


export const createInvoice = async (data: InvoiceCreateDataType): Promise<Invoice> => {
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

        if (!invoice) throw new Error(`Factura con ID ${invoiceId} no encontrada`);
        if (invoice.status !== 'DRAFT') throw new Error(`Solo se pueden pagar facturas en estado DRAFT (actual: ${invoice.status})`);
        if (invoice.items.length === 0) throw new Error('No se puede pagar una factura sin ítems');
        if (invoice.subtotal + invoice.itbis <= 0) throw new Error('El monto total de la factura debe ser mayor a 0');
        if (invoice.cashRegister.status !== 'OPEN') throw new Error(`La caja registradora ${invoice.cashRegisterId} está cerrada`);

        const finalType = paymentData.type || invoice.type;

        const ncf = await generateNcf(tx, finalType);

        // Crear el movimiento de caja
        await tx.cashMovement.create({
            data: {
                cashRegisterId: invoice.cashRegisterId,
                type: 'INCOME',
                amount: invoice.subtotal + invoice.itbis,
                description: `Pago de factura ${invoice.invoiceNumber} (${finalType})`,
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
                type: finalType,
                status: 'PAID',
                studentId: paymentData.studentId || invoice.studentId,
                paymentDate: new Date(),
                paymentMethod: paymentData.paymentMethod,
                paymentDetails: paymentData.paymentDetails || {},
            },
            include: { items: true, cashRegister: true },
        });

        return invoiceUpdated;
    });
};

export const deleteInvoiceItem = async (invoiceId: string, itemId: string): Promise<Invoice> => {
    return await Prisma.$transaction(async (tx) => {
        // Verificar que la factura existe y está en DRAFT
        const invoice = await tx.invoice.findUnique({
            where: { id: invoiceId },
            include: { items: true },
        });
        if (!invoice) throw new Error(`Factura con ID ${invoiceId} no encontrada`);
        if (invoice.status !== 'DRAFT') throw new Error(`Solo se pueden eliminar ítems de facturas en estado DRAFT (actual: ${invoice.status})`);

        // Verificar que el ítem pertenece a la factura y eliminarlo
        const itemToDelete = await tx.invoiceItem.findUnique({
            where: { id: itemId },
        });
        if (!itemToDelete || itemToDelete.invoiceId !== invoiceId) throw new Error(`El ítem ${itemId} no pertenece a la factura ${invoiceId}`);

        // Eliminar el ítem y recalcular totales
        await tx.invoiceItem.delete({
            where: { id: itemId },
        });

        // Recalcular subtotal e itbis de los ítems restantes
        const remainingItems = await tx.invoiceItem.findMany({
            where: { invoiceId },
        });
        const newSubtotal = remainingItems.reduce((sum, item) => sum + item.subtotal, 0);
        const newItbis = remainingItems.reduce((sum, item) => sum + item.itbis, 0);

        // Actualizar la factura
        const invoiceUpdated = await tx.invoice.update({
            where: { id: invoiceId },
            data: {
                subtotal: newSubtotal,
                itbis: newItbis,
            },
            include: { items: true },
        });

        return invoiceUpdated;
    });
}
