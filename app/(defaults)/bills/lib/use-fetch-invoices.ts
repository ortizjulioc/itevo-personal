import { useState, useEffect, useCallback } from 'react';
import apiRequest from "@/utils/lib/api-request/request";
import { Invoice, Student } from "@prisma/client";

export interface InvoiceWithStudent extends Invoice {
    student: Student;
}

export interface InvoiceResponse {
    invoices: InvoiceWithStudent[];
    totalInvoices: number;
}

const useFetchInvoices = (query: string) => {
    const [invoices, setInvoices] = useState<InvoiceWithStudent[]>([]);
    const [totalInvoices, setTotalInvoices] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchInvoicesData = useCallback(async (queryParam: string) => {
        setLoading(true);
        try {
            const queryParams = new URLSearchParams(queryParam);
            const paramsOb: any = {};
            queryParams.forEach((value, key) => {
                paramsOb[key] = value;
            });
            const response = await apiRequest.get<InvoiceResponse>(`/invoices`, { params: paramsOb });
            if (!response.success) {
                throw new Error(response.message);
            }
            setInvoices(response.data?.invoices || []);
            setTotalInvoices(response.data?.totalInvoices || 0);
            setError(null);
        } catch (error) {
            if (error instanceof Error) {
                setError(error.message);
            } else {
                setError('Ha ocurrido un error al obtener las facturas');
            }
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchInvoicesData(query);
    }, [query, fetchInvoicesData]);

    return { invoices, totalInvoices, loading, error, setInvoices, fetchInvoicesData };
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
