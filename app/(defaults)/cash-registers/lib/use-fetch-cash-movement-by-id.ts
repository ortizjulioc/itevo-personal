'use client'
import { useState, useEffect } from 'react';
import apiRequest from "@/utils/lib/api-request/request";
import type { CashMovement as CashMovementPrima, User, PayablePayment, AccountPayable, Teacher } from "@prisma/client";

export interface CashMovement extends CashMovementPrima {
    user: Omit<User, 'password' | 'email'>;
    PayablePayment?: (PayablePayment & {
        accountPayable: AccountPayable & {
            teacher: Teacher
        }
    }) | null;
}

const useFetchCashMovementById = (cashRegisterId: string, id: string) => {
    const [cashMovement, setCashMovement] = useState<CashMovement | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCashMovementData = async (cashRegisterId: string, id: string) => {
            if (!id) return;
            try {
                const response = await apiRequest.get<CashMovement>(`/cash-register/${cashRegisterId}/cash-movements/${id}`);
                if (!response.success) {
                    throw new Error(response.message);
                }
                setCashMovement(response.data || null);

            } catch (error) {
                if (error instanceof Error) {
                    setError(error.message);
                } else {
                    setError('Ha ocurrido un error al obtener el movimiento de caja');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchCashMovementData(cashRegisterId, id);
    }, [cashRegisterId, id]);

    return { cashMovement, loading, error };
};

export default useFetchCashMovementById;
