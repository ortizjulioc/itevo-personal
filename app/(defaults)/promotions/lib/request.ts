import apiRequest from "@/utils/lib/api-request/request";
import type { Promotion } from "@prisma/client";

export interface PromotionResponse {
    promotions: Promotion[];
    totalPromotions: number;
}

export const createPromotion = async (promotion: Promotion) => {
    return await apiRequest.post<Promotion>('/promotions', promotion);
}

export const updatePromotion = async (id: string, promotion: Promotion) => {
    return await apiRequest.put<Promotion>(`/promotions/${id}`, promotion);
}

export const deletePromotion = async (id: string) => {
    return await apiRequest.remove<string>(`/promotions/${id}`);
}
