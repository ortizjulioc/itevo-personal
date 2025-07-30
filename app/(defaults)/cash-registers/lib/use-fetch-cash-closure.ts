'use client'
import { useState, useEffect } from 'react';
import apiRequest from "@/utils/lib/api-request/request";
import type { CashMovement as CashMovementPrima, CashRegisterClosure, User } from "@prisma/client";



const useFetchClosure = (id:string,query?: string) => {
    const [closure, setClosure] = useState<CashRegisterClosure |null>();
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchClosureData = async (id:string) => {
            try {
                const response = await apiRequest.get<CashRegisterClosure>(`/cash-register/${id}/closure`);
                if (!response.success) {
                    throw new Error(response.message);
                }
                console.log(response.data)
                setClosure(response.data);
              
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

        fetchClosureData(id);
    }, [id,query]);

    return { closure, loading, error, setClosure, };
};



export default useFetchClosure;
