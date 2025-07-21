import { useState, useEffect } from 'react';
import apiRequest from "@/utils/lib/api-request/request";
import type { AccountPayable, Invoice , InvoiceItem, User } from "@prisma/client";



export interface AccountsPayableResponse {
    accountsPayable: AccountPayable[];
    totalAccountsPayable: number;
}

export interface ItemsResponse {
    items: AccountPayable[];
    totalItems: number;
}



const useFetchAccountsPayable = (query: string) => {
    const [accountsPayable, setAccountsPayable] = useState<AccountPayable[]>([]);
    const [totalAccountsPayable, setTotalAccountsPayable] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(true);
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
        fetchAccountsPayableData(query);
    }, [query]);

    return { accountsPayable, setTotalAccountsPayable, loading, error, setAccountsPayable, totalAccountsPayable, fetchAccountsPayableData };
};


export default useFetchAccountsPayable;


