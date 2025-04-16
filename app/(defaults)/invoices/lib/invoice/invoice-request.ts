import apiRequest from "@/utils/lib/api-request/request";
import type { Invoice as InvoicePrisma } from "@prisma/client";

export interface InvoiceResponse {
    invoices: InvoicePrisma[];
    totalInvoices: number;
}

interface Invoice extends Pick<InvoicePrisma, 'cashRegisterId' | 'createdBy'> {}



export const createInvoice = async (invoice: Invoice) => {
    return await apiRequest.post<Invoice>('/invoices', invoice);
}

export const updateInvoice = async (id: string, invoice: InvoicePrisma) => {
    return await apiRequest.put<InvoicePrisma>(`/invoices/${id}`, invoice);
}

export const deleteInvoice = async (id: string) => {
    return await apiRequest.remove<string>(`/invoices/${id}`);
}
