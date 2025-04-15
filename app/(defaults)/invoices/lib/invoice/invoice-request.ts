import apiRequest from "@/utils/lib/api-request/request";
import type { Invoice } from "@prisma/client";

export interface InvoiceResponse {
    invoices: Invoice[];
    totalInvoices: number;
}


export const createInvoice = async (invoice: Invoice) => {
    return await apiRequest.post<Invoice>('/invoices', invoice);
}

export const updateInvoice = async (id: string, invoice: Invoice) => {
    return await apiRequest.put<Invoice>(`/invoices/${id}`, invoice);
}

export const deleteInvoice = async (id: string) => {
    return await apiRequest.remove<string>(`/invoices/${id}`);
}
