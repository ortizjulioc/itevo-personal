import { CashMovementResponse } from "@/@types/cash-register";
import apiRequest from "@/utils/lib/api-request/request";
import type { CashMovement } from "@prisma/client";

export interface CreateDisbursementInput {
    amount: number;
    description?: string;
    createdBy: string;
    referenceType: 'DISBURSEMENT';
    type: 'EXPENSE';
}

export const createDisbursement = async (cashRegisterId: string, data: CreateDisbursementInput) => {
    return await apiRequest.post<CashMovementResponse>(`/cash-register/${cashRegisterId}/cash-movements`, data as any);
};

export const deleteDisbursement = async (cashRegisterId: string, movementId: string) => {
    return await apiRequest.remove<{ message: string }>(`/cash-register/${cashRegisterId}/cash-movements/${movementId}`);
};
