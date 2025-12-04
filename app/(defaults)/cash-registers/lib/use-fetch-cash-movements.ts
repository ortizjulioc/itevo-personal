'use client'
import { useState, useEffect, useCallback } from 'react';
import apiRequest from "@/utils/lib/api-request/request";
import type { AccountPayable, CashMovement as CashMovementPrima, PayablePayment, Teacher, User } from "@prisma/client";


export interface CashMovement extends CashMovementPrima {
    user: Omit<User, 'password' | 'email'>;
    PayablePayment?: (PayablePayment & {
        accountPayable: AccountPayable & {
            teacher: Teacher
        }
    }) | null;
}

const useFetchCashMovements = (id: string, query?: string) => {
    const [cashMovements, setCashMovements] = useState<CashMovement[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchCashMovementsData = useCallback(async (id: string, query: string) => {
        setLoading(true);
        try {
            const response = await apiRequest.get<CashMovement[]>(`/cash-register/${id}/cash-movements?${query}`);
            if (!response.success) {
                throw new Error(response.message);
            }
            console.log(response.data)
            setCashMovements(response.data || []);

        } catch (error) {
            if (error instanceof Error) {
                setError(error.message);
            } else {
                setError('Ha ocurrido un error al obtener las cajas registradoras');
            }
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCashMovementsData(id, query || '');
    }, [id, query, fetchCashMovementsData]);

    return { cashMovements, loading, error, setCashMovements, fetchCashMovementsData };
};



export default useFetchCashMovements;
