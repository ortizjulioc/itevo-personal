import { PrismaClient } from "@prisma/client";
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
