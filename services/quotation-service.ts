import 'server-only';
import { Prisma } from "@/utils/lib/prisma";
import { Quotation, QuotationItem, QuotationStatus, PrismaClient, Prisma as PrismaTypes, InvoiceItemType } from '@/generated/prisma/client';

export interface QuotationWithItems extends Quotation {
    items: QuotationItem[];
    user: { id: string, name: string, lastName: string, email: string };
    student?: any | null;
}

export interface QuotationCreateDataType {
    quotationNumber: string;
    studentId?: string | null;
    createdBy: string;
    concept?: string | null;
    branchId?: string | null;
    date?: Date;
}

export interface QuotationItemCreateData {
    type: InvoiceItemType;
    productId?: string | null;
    courseBranchId?: string | null;
    quantity: number;
    unitPrice: number;
    subtotal: number;
    itbis: number;
    discount?: number;
    concept?: string;
}

interface QuotationFilter {
    search?: string;
    status?: QuotationStatus | QuotationStatus[];
    studentId?: string;
    createdBy?: string;
    page?: number;
    pageSize?: number;
}

export const findQuotations = async (filter: QuotationFilter) => {
    const {
        search,
        status,
        studentId,
        createdBy,
        page = 1,
        pageSize = 10,
    } = filter;

    const where: any = {};

    if (status) {
        if (Array.isArray(status)) {
            where.status = { in: status };
        } else {
            where.status = status;
        }
    }
    if (studentId) where.studentId = studentId;
    if (createdBy) where.createdBy = createdBy;

    if (search) {
        where.OR = [
            { quotationNumber: { contains: search } },
            { concept: { contains: search } },
        ];
    }

    const [data, total] = await Prisma.$transaction([
        Prisma.quotation.findMany({
            where,
            include: { branch: true, student: true, items: true, user: { select: { id: true, name: true, lastName: true } } },
            orderBy: { date: "desc" },
            skip: (page - 1) * pageSize,
            take: pageSize,
        }),
        Prisma.quotation.count({ where }),
    ]);

    return {
        quotations: data,
        totalQuotations: total,
        currentPage: page,
        totalPages: Math.ceil(total / pageSize),
    };
}

export const getLastQuotation = async (prefix: string): Promise<Quotation | null> => {
    return await Prisma.quotation.findFirst({
        where: { quotationNumber: { startsWith: prefix } },
        orderBy: { quotationNumber: 'desc' },
    });
}

export const createQuotation = async (data: QuotationCreateDataType): Promise<Quotation> => {
    return await Prisma.quotation.create({
        data: {
            quotationNumber: data.quotationNumber,
            studentId: data.studentId,
            createdBy: data.createdBy,
            concept: data.concept,
            branchId: data.branchId,
            date: data.date || new Date(),
        }
    });
}

export const updateQuotation = async (
    id: string,
    data: Partial<QuotationCreateDataType & { status: QuotationStatus }>,
    prisma: PrismaClient | PrismaTypes.TransactionClient = Prisma
): Promise<Quotation> => {
    return await prisma.quotation.update({
        where: { id },
        data: {
            quotationNumber: data.quotationNumber,
            studentId: data.studentId,
            createdBy: data.createdBy,
            concept: data.concept,
            branchId: data.branchId,
            date: data.date,
            status: data.status,
        },
    });
}

export const findQuotationById = async (
    id: string,
    prisma: PrismaClient | PrismaTypes.TransactionClient = Prisma,
    include: PrismaTypes.QuotationInclude = {}
): Promise<QuotationWithItems | null> => {
    return await prisma.quotation.findUnique({
        where: { id },
        include: {
            ...include,
            items: include.items ?? { include: { product: true } },
            user: include.user ?? {
                select: {
                    id: true,
                    name: true,
                    lastName: true,
                    email: true,
                }
            },
            student: include.student ?? true,
            branch: include.branch ?? true,
        },
    }) as any;
}

export const addQuotationItem = async (
    quotationId: string,
    data: QuotationItemCreateData,
    prisma: PrismaClient | PrismaTypes.TransactionClient = Prisma
) => {
    return await prisma.quotationItem.create({
        data: {
            quotationId,
            type: data.type,
            productId: data.type === InvoiceItemType.PRODUCT ? data.productId : null,
            courseBranchId: data.courseBranchId, // Encotización sí se permite vincular a curso directo u otros
            quantity: data.quantity,
            unitPrice: data.unitPrice,
            subtotal: data.subtotal,
            itbis: data.itbis,
            discount: data.discount || 0,
            concept: data.concept || "",
        },
    });
}

export const deleteQuotationItem = async (
    itemId: string,
    prisma: PrismaClient | PrismaTypes.TransactionClient = Prisma
) => {
    return await prisma.quotationItem.delete({
        where: { id: itemId },
    });
}
