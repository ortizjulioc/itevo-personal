import { useState, useEffect, useCallback } from 'react';
import apiRequest from "@/utils/lib/api-request/request";
import { QuotationWithItems } from '@/services/quotation-service';

export interface QuotationsResponse {
    quotations: QuotationWithItems[];
    totalQuotations: number;
}

const useFetchQuotations = (query: string = '') => {
    const [quotations, setQuotations] = useState<QuotationWithItems[]>([]);
    const [totalQuotations, setTotalQuotations] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchQuotationsData = useCallback(async (queryParam: string) => {
        setLoading(true);
        try {
            const queryParams = new URLSearchParams(queryParam);
            const paramsOb: any = {};
            queryParams.forEach((value, key) => {
                paramsOb[key] = value;
            });
            const response = await apiRequest.get<QuotationsResponse>(`/quotations`, { params: paramsOb });
            if (!response.success) {
                throw new Error(response.message);
            }
            setQuotations(response.data?.quotations || []);
            setTotalQuotations(response.data?.totalQuotations || 0);
            setError(null);
        } catch (error) {
            if (error instanceof Error) {
                setError(error.message);
            } else {
                setError('Ha ocurrido un error al obtener las cotizaciones');
            }
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchQuotationsData(query);
    }, [query, fetchQuotationsData]);

    return { quotations, totalQuotations, loading, error, setQuotations, fetchQuotationsData };
};

export const useFetchQuotationById = (id: string) => {
    const [quotation, setQuotation] = useState<QuotationWithItems | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchQuotationData = useCallback(async (id: string) => {
        try {
            const response = await apiRequest.get<QuotationWithItems>(`/quotations/${id}`);
            if (!response.success) {
                throw new Error(response.message);
            }
            setQuotation(response.data);
            setError(null);
        } catch (error) {
            if (error instanceof Error) {
                setError(error.message);
            } else {
                setError('Ha ocurrido un error al obtener la cotización');
            }
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (id) {
            fetchQuotationData(id);
        }
    }, [id, fetchQuotationData]);

    return { quotation, loading, error, setQuotation, fetchQuotationData };
}

export default useFetchQuotations;
