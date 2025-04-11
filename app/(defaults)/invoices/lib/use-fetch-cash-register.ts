import { useState, useEffect } from 'react';
import apiRequest from "@/utils/lib/api-request/request";
import type { CashRegister } from "@prisma/client";

export interface CashRegistersResponse {
    cashRegisters: CashRegister[];
    totalCashRegisters: number;
}

const useFetchCashRegisters = (query: string) => {
    const [cashRegisters, setCashRegisters] = useState<CashRegister[]>([]);
    const [totalCashRegisters, setTotalCashRegisters] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCashRegistersData = async (query: string) => {
            try {
                const response = await apiRequest.get<CashRegistersResponse>(`/cashregister?search=${query}`);
                if (!response.success) {
                    throw new Error(response.message);
                }
                setCashRegisters(response.data?.cashRegisters || []);
                setTotalCashRegisters(response.data?.totalCashRegisters || 0);
            } catch (error) {
                if (error instanceof Error) {
                    setError(error.message);
                } else {
                    setError('Ha ocurrido un error al obtener las cajas registradoras');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchCashRegistersData(query);
    }, [query]);

    return { cashRegisters, setTotalCashRegisters, loading, error, setCashRegisters, totalCashRegisters };
};

export const useFetchCashRegistersById = (id: string) => {
    const [CashRegister, setCashRegister] = useState<CashRegister | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCashRegisterData = async (id: string) => {
            try {
                const response = await apiRequest.get<CashRegister>(`/cashregister/${id}`);
                if (!response.success) {
                    throw new Error(response.message);
                }
                setCashRegister(response.data);
            } catch (error) {
                if (error instanceof Error) {
                    setError(error.message);
                } else {
                    setError('Ha ocurrido un error al obtener la caja registradora');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchCashRegisterData(id);
    }, [id]);

    return { CashRegister, loading, error, setCashRegister };
}

export default useFetchCashRegisters;
