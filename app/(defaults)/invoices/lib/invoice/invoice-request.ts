import apiRequest from '@/utils/lib/api-request/request';
import type { InvoiceItem, InvoiceItemType, Invoice as InvoicePrisma } from '@prisma/client';

export interface InvoiceResponse {
    invoices: InvoicePrisma[];
    totalInvoices: number;
}

interface Invoice extends Pick<InvoicePrisma, 'cashRegisterId' | 'createdBy'> {}

export const createInvoice = async (invoice: Invoice) => {
    return await apiRequest.post<Invoice>('/invoices', invoice);
};

export const updateInvoice = async (id: string, invoice: InvoicePrisma) => {
    return await apiRequest.put<InvoicePrisma>(`/invoices/${id}`, invoice);
};

export const addItemsInvoice = async (id: string, invoiceItem: InvoiceItem) => {
    return await apiRequest.post<InvoiceItem>(`/invoices/${id}/items`, invoiceItem);
};

export const payInvoice = async (id: string, invoice: Invoice) => {
    return await apiRequest.post<Invoice>(`/invoices/${id}/pay`, invoice);
};
