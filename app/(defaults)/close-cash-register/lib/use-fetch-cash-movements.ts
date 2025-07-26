'use client'
import { useState, useEffect } from 'react';
import apiRequest from "@/utils/lib/api-request/request";
import type { CashMovement as CashMovementPrima, User } from "@prisma/client";


export interface CashMovement extends CashMovementPrima {
    user: Omit<User, 'password' | 'email'>;
}

const useFetchCashMovements = (id:string,query?: string) => {
    const [cashMovements, setCashMovements] = useState<CashMovement[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCashMovementsData = async (id:string, query: string) => {
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
        };

        fetchCashMovementsData(id, query || '');
    }, [id,query]);

    return { cashMovements, loading, error, setCashMovements, };
};



export default useFetchCashMovements;
