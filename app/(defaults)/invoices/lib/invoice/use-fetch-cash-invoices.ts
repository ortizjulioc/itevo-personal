import { useState, useEffect } from 'react';
import apiRequest from "@/utils/lib/api-request/request";
import type { Invoice , User } from "@prisma/client";



export interface InvoicesResponse {
    invoices: Invoice[];
    totalInvoices: number;
}

const useFetchInvoices = (query: string) => {
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [totalInvoices, setTotalInvoices] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchInvoicesData = async (query: string) => {
            try {
                const response = await apiRequest.get<InvoicesResponse>(`/invoices?search=${query}`);
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

        fetchInvoicesData(query);
    }, [query]);

    return { invoices, setTotalInvoices, loading, error, setInvoices, totalInvoices };
};

export const useFetchInvoicesById = (id: string) => {
    const [invoice, setInvoice] = useState<Invoice | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchInvoiceData = async (id: string) => {
            try {
                const response = await apiRequest.get<Invoice>(`/invoices/${id}`);
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

        fetchInvoiceData(id);
    }, [id]);

    return { invoice, loading, error, setInvoice };
}

export default useFetchInvoices;
