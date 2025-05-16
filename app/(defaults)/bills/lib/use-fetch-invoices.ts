import { useState, useEffect } from 'react';
import apiRequest from "@/utils/lib/api-request/request";
import { Invoice } from "@prisma/client";

export interface InvoiceResponse {
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
                const response = await apiRequest.get<InvoiceResponse>(`/invoices?${query}`);
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

    return { invoices, totalInvoices, loading, error, setInvoices };
};

export const useFetchInvoiceById = (id: string) => {
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
                    setError('Ha ocurrido un error al obtener el rol');
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
