import apiRequest from "@/utils/lib/api-request/request";
import type { CashRegister } from "@prisma/client";

export interface CashRegisterResponse {
    cashRegisters: CashRegister[];
    totalCashRegisters: number;
}
type CashRegisterInput = Omit<CashRegister, 'id' | 'createdAt' | 'updatedAt' | 'deleted' | 'status' | "cashBreakdown"| "openingDate">;


export const createCashRegister = async (cashRegister: CashRegisterInput) => {
    return await apiRequest.post<CashRegisterInput>('/cashregister', cashRegister);
}

export const updateCashRegister = async (id: string, cashRegister: CashRegister) => {
    return await apiRequest.put<CashRegister>(`/cashregister/${id}`, cashRegister);
}

export const deleteCashRegister = async (id: string) => {
    return await apiRequest.remove<string>(`/cashregister/${id}`);
}
