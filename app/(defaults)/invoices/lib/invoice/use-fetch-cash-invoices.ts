import { useState, useEffect } from 'react';
import apiRequest from "@/utils/lib/api-request/request";
import type { Invoice , InvoiceItem, User } from "@prisma/client";



export interface InvoicesResponse {
    invoices: Invoice[];
    totalInvoices: number;
}

export interface ItemsResponse {
    items: InvoiceItem[];
    totalItems: number;
}
export interface IvoicebyId extends Invoice{
    items:InvoiceItem[]
}


const useFetchInvoices = (query: string) => {
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [totalInvoices, setTotalInvoices] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const fetchInvoicesData = async (query: string) => {
        try {
            const response = await apiRequest.get<InvoicesResponse>(`/invoices?${query}`);
            if (!response.success) {
                throw new Error(response.message);
            }
            setInvoices(response.data?.invoices || []);
            setTotalInvoices(response.data?.totalInvoices || 0);
        } catch (error) {
            if (error instanceof Error) {
                setError(error.message);
            } else {
                setError('Ha ocurrido un error al obtener las facturas');
            }
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        

        fetchInvoicesData(query);
    }, [query]);

    return { invoices, setTotalInvoices, loading, error, setInvoices, totalInvoices,fetchInvoicesData };
};

export const useFetchInvoicesById = (id: string) => {
    const [invoice, setInvoice] = useState<IvoicebyId | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const fetchInvoiceData = async (id: string) => {
        try {
            const response = await apiRequest.get<IvoicebyId>(`/invoices/${id}`);
            if (!response.success) {
                throw new Error(response.message);
            }
            setInvoice(response.data);
        } catch (error) {
            if (error instanceof Error) {
                setError(error.message);
            } else {
                setError('Ha ocurrido un error al obtener las facturas');
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInvoiceData(id);
    }, [id]);

    return { invoice, loading, error, setInvoice,fetchInvoiceData };
}

export const useFetchItemInvoices= (id: string) => {
    const [items, setItems] = useState<InvoiceItem[]>([]);
    const [totalItems, setTotalItems] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const fetchItemsData = async (id: string) => {
        try {
            const response = await apiRequest.get<ItemsResponse>(`/invoices/${id}/items`);
            if (!response.success) {
                throw new Error(response.message);
            }
            setItems(response.data?.items || []);

            setTotalItems(response.data?.totalItems || 0);
        } catch (error) {
            if (error instanceof Error) {
                setError(error.message);
            } else {
                setError('Ha ocurrido un error al obtener las facturas');
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        

        fetchItemsData(id);
    }, [id]);

    return { items, setTotalItems, loading, error, setItems, totalItems,fetchItemsData };
};

export default useFetchInvoices;


