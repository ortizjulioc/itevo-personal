import { useState, useEffect } from 'react';
import apiRequest from '@/utils/lib/api-request/request';
import type { AccountPayable, Invoice, InvoiceItem, PayableEarning, PayablePayment, User } from '@prisma/client';

export interface AccountsPayableResponse {
    accountsPayable: AccountPayable[];
    totalAccountsPayable: number;
}
export interface EarningsResponse {
    earnings: PayableEarning[];
}
export interface PaymentsResponse {
    payments: PayablePayment[];
}

export interface ItemsResponse {
    items: AccountPayable[];
    totalItems: number;
}

const useFetchAccountsPayable = (query: string) => {
    const [accountsPayable, setAccountsPayable] = useState<AccountPayable[]>([]);
    const [totalAccountsPayable, setTotalAccountsPayable] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const fetchAccountsPayableData = async (query: string) => {
        setLoading(true);
        try {
            const response = await apiRequest.get<AccountsPayableResponse>(`/account-payable?${query}`);
            if (!response.success) {
                throw new Error(response.message);
            }

            console.log(response.data);
            setAccountsPayable(response.data?.accountsPayable || []);
            setTotalAccountsPayable(response.data?.totalAccountsPayable || 0);
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
        if (!query) return;
        fetchAccountsPayableData(query);
    }, [query]);

    return { accountsPayable, setTotalAccountsPayable, loading, error, setAccountsPayable, totalAccountsPayable, fetchAccountsPayableData };
};

export const useFetchAccountsPayableByPayments = (id: string) => {
    const [payments, setPayments] = useState<PayablePayment[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const fetchPaymentsData = async (id: string) => {
        setLoading(true);
        try {
            const response = await apiRequest.get<PaymentsResponse>(`/account-payable/${id}/payments`);
            if (!response.success) {
                throw new Error(response.message);
            }

            setPayments(response.data?.payments || []);
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
        fetchPaymentsData(id);
    }, [id]);

    return { payments, loading, error, setPayments, fetchPaymentsData };
};
export const useFetchAccountsPayableByEarnings = (id: string) => {
    const [earnings, setEarnings] = useState<PayableEarning[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const fetchEarningsData = async (id: string) => {
        setLoading(true);
        try {
            const response = await apiRequest.get<EarningsResponse>(`/account-payable/${id}/earnings`);
            if (!response.success) {
                throw new Error(response.message);
            }

            console.log(response.data);
            setEarnings(response.data?.earnings || []);
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
        fetchEarningsData(id);
    }, [id]);

    return { earnings, loading, error, setEarnings, fetchEarningsData };
};

export default useFetchAccountsPayable;
