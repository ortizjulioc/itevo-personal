import { useState, useEffect } from 'react';
import apiRequest from "@/utils/lib/api-request/request";
import type { Invoice , InvoiceItem, User } from "@prisma/client";



export interface AccountsReceivableResponse {
    accountsReceivable: Invoice[];
    totalAccountsReceivable: number;
}

export interface ItemsResponse {
    items: InvoiceItem[];
    totalItems: number;
}
export interface IvoicebyId extends Invoice{
    items:InvoiceItem[]
}


const useFetchAccountsReceivable = (query: string) => {
    const [accountsReceivable, setAccountsReceivable] = useState<Invoice[]>([]);
    const [totalAccountsReceivable, setTotalAccountsReceivable] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const fetchAccountsReceivableData = async (query: string) => {
        try {
            const response = await apiRequest.get<AccountsReceivableResponse>(`/accounts-receivable?${query}`);
            if (!response.success) {
                throw new Error(response.message);
            }
            setAccountsReceivable(response.data?.accountsReceivable || []);
            setTotalAccountsReceivable(response.data?.totalAccountsReceivable || 0);
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
        

        fetchAccountsReceivableData(query);
    }, [query]);

    return { accountsReceivable, setTotalAccountsReceivable, loading, error, setAccountsReceivable, totalAccountsReceivable,fetchAccountsReceivableData };
};


export default useFetchAccountsReceivable;


