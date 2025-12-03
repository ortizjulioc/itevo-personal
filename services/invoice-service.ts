import 'server-only';
import { Prisma } from "@/utils/lib/prisma";
import { generateNcf } from "@/utils/ncf";
import {
    CashMovementReferenceType,
    CashMovementType,
    CashRegisterStatus,
    Invoice,
    InvoiceItem,
    InvoiceItemType,
    InvoiceStatus,
    NcfType,
    PrismaClient,
    User,
    Prisma as PrismaTypes,
    CashRegister
} from "@prisma/client";
const USE_NCF = false;
export interface InvoiceWithItems extends Invoice {
    items: InvoiceItem[];
    user: Pick<User, 'id' | 'name' | 'email' | 'lastName'>;
    cashRegister?: CashRegister | null; // Incluye la caja registradora si es necesario
}
export interface InvoiceCreateDataType {
    invoiceNumber: string;
    ncf: string;
    studentId?: string | null;
    createdBy: string;
    cashRegisterId: string;
    paymentDate?: Date | null;
    paymentMethod?: string | null;
    paymentDetails?: any; // Puedes tiparlo más estrictamente si quieres,
    subtotal?: number; // Si no se especifica, se calculará al agregar ítems
    itbis?: number; // Si no se especifica, se calculará al agregar ítems
    status?: InvoiceStatus; // DRAFT, PAID, VOID
    type?: NcfType; // Si no se especifica, se mantendrá el tipo por defecto
    comment?: string; // Comentario opcional para la factura
    isCredit?: boolean; // Indica si la factura es a crédito
}

export interface InvoiceItemCreateData {
    type: InvoiceItemType;
    productId?: string | null;
    accountReceivableId?: string | null;
    quantity: number;
    unitPrice: number;
    subtotal: number;
    itbis: number;
    concept?: string;
}

export interface InvoicePaymentData {
    paymentMethod: string;
    studentId?: string;
    paymentDetails?: any; // JSON con detalles adicionales
    type?: NcfType;
    isCredit?: boolean;
}

interface InvoiceFilter {
    search?: string; // puede ser número de factura o nombre de estudiante
    type?: NcfType;
    status?: InvoiceStatus | InvoiceStatus[];
    fromDate?: Date;
    toDate?: Date;
    studentId?: string;
    createdBy?: string;
    cashRegisterId?: string;
    cashRegisterIds?: string[];
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
        cashRegisterId,
        cashRegisterIds,
        page = 1,
        pageSize = 10,
    } = filter;

    const where: any = {};

    if (type) where.type = type;
    if (status) where.status = status;
    if (studentId) where.studentId = studentId;
    if (createdBy) where.createdBy = createdBy;
    if (cashRegisterId) where.cashRegisterId = cashRegisterId;
    
    // Allow filtering by multiple cash registers (for cashiers)
    if (cashRegisterIds && cashRegisterIds.length > 0) {
        where.cashRegisterId = { in: cashRegisterIds };
    }

    // ✅ permitir múltiples estados
    if (status && Array.isArray(status) && status.length > 0) {
        where.status = { in: status };
    } else if (status) {
        where.status = status;
    }

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
            include: { student: true },
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

export const updateInvoice = async (
    id: string,
    data: Partial<InvoiceCreateDataType>,
    prisma: PrismaClient | PrismaTypes.TransactionClient = Prisma
): Promise<Invoice> => {
    const {
        invoiceNumber,
        ncf,
        studentId,
        createdBy,
        cashRegisterId,
        status,
        subtotal,
        itbis,
        type,
        paymentDate,
        paymentMethod,
        paymentDetails,
        comment,
        isCredit,
    } = data;

    return await prisma.invoice.update({
        where: { id },
        data: {
            invoiceNumber,
            ncf,
            studentId,
            createdBy,
            cashRegisterId,
            subtotal,
            itbis,
            type,
            paymentDate,
            paymentMethod,
            paymentDetails,
            comment,
            status: status || InvoiceStatus.DRAFT, // Si no se especifica, se mantiene en DRAFT
            isCredit,
        },
    });
}

export const findInvoiceById = async (
    id: string,
    prisma: PrismaClient | PrismaTypes.TransactionClient = Prisma,
    include: PrismaTypes.InvoiceInclude = {}
): Promise<InvoiceWithItems | null> => {
    return await prisma.invoice.findUnique({
        where: { id },
        include: {
            ...include,
            items: include.items ?? true, // Asegura que items sea true si no se especifica
            user: include.user ?? {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    lastName: true,
                }
            },
        },
    });
}

export const addNewItemToInvoice = async (
    invoiceId: string,
    data: InvoiceItemCreateData,
    prisma: PrismaClient | PrismaTypes.TransactionClient = Prisma
): Promise<{ invoiceUpdated: Invoice, itemCreated: InvoiceItem }> => {
    // Crear el ítem
    const newItem = await prisma.invoiceItem.create({
        data: {
            invoiceId,
            type: data.type,
            productId: data.type === InvoiceItemType.PRODUCT ? data.productId : null,
            accountReceivableId: data.type === InvoiceItemType.RECEIVABLE ? data.accountReceivableId : null,
            quantity: data.quantity,
            unitPrice: data.unitPrice,
            subtotal: data.subtotal,
            itbis: data.itbis,
            concept: data.concept,
        },
    });

    // Recalcular subtotal e itbis totales de la factura
    const items = await prisma.invoiceItem.findMany({
        where: { invoiceId },
    });
    const newSubtotal = items.reduce((sum, item) => sum + item.subtotal, 0);
    const newItbis = items.reduce((sum, item) => sum + item.itbis, 0);

    // Actualizar la factura
    const invoiceUpdated = await prisma.invoice.update({
        where: { id: invoiceId },
        data: {
            subtotal: newSubtotal,
            itbis: newItbis,
        },
        include: { items: true },
    });

    return { invoiceUpdated, itemCreated: newItem };
}

export const payInvoice = async (invoiceId: string, paymentData: InvoicePaymentData): Promise<Invoice> => {
    return await Prisma.$transaction(async (tx) => {
        // Buscar la factura
        const invoice = await tx.invoice.findUnique({
            where: { id: invoiceId },
            include: { cashRegister: true, items: true },
        });

        if (!invoice) throw new Error(`Factura con ID ${invoiceId} no encontrada`);
        if (invoice.status !== InvoiceStatus.DRAFT) throw new Error(`Solo se pueden pagar facturas en estado DRAFT (actual: ${invoice.status})`);
        if (invoice.items.length === 0) throw new Error('No se puede pagar una factura sin ítems');
        if (invoice.subtotal + invoice.itbis <= 0) throw new Error('El monto total de la factura debe ser mayor a 0');
        if (invoice.cashRegister.status !== CashRegisterStatus.OPEN) throw new Error(`La caja registradora ${invoice.cashRegisterId} está cerrada`);

        const finalType = paymentData.type || invoice.type;

        const ncf = USE_NCF ? await generateNcf(tx, finalType) : invoice.ncf;

        // Crear el movimiento de caja
        await tx.cashMovement.create({
            data: {
                cashRegisterId: invoice.cashRegisterId,
                type: CashMovementType.INCOME,
                amount: invoice.subtotal + invoice.itbis,
                description: `Pago de factura ${invoice.invoiceNumber} (${finalType})`,
                referenceType: CashMovementReferenceType.INVOICE,
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

export const deleteInvoiceItem = async (
    itemId: string,
    prisma: PrismaClient | PrismaTypes.TransactionClient = Prisma
) => {
    return await prisma.invoiceItem.delete({
        where: { id: itemId },
    })
}
