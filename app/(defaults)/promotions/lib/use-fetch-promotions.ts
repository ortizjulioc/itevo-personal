import { useState, useEffect } from 'react';
import apiRequest from "@/utils/lib/api-request/request";
import type { Promotion } from "@prisma/client";

export interface PromotionsResponse {
    promotions: Promotion[];
    totalPromotions: number;
}

const useFetchPromotions = (query: string) => {
    const [promotions, setPromotions] = useState<Promotion[]>([]);
    const [totalPromotions, setTotalPromotions] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPromotionsData = async (query: string) => {
            try {
                const response = await apiRequest.get<PromotionsResponse>(`/promotions?${query}`);
                if (!response.success) {
                    throw new Error(response.message);
                }
                setPromotions(response.data?.promotions || []);
                setTotalPromotions(response.data?.totalPromotions || 0);
            } catch (error) {
                if (error instanceof Error) {
                    setError(error.message);
                } else {
                    setError('Ha ocurrido un error al obtener los promociones');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchPromotionsData(query);
    }, [query]);

    return { promotions, setTotalPromotions, loading, error, setPromotions, totalPromotions };
};

export const useFetchPromotionsById = (id: string) => {
    const [promotion, setPromotion] = useState<Promotion | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPromotionData = async (id: string) => {
            try {
                const response = await apiRequest.get<Promotion>(`/promotions/${id}`);
                if (!response.success) {
                    throw new Error(response.message);
                }
                setPromotion(response.data);
            } catch (error) {
                if (error instanceof Error) {
                    setError(error.message);
                } else {
                    setError('Ha ocurrido un error al obtener el promoción');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchPromotionData(id);
    }, [id]);

    return { promotion, loading, error, setPromotion };
}

export default useFetchPromotions;
