import apiRequest from "@/utils/lib/api-request/request";
import type { CashRegister } from "@prisma/client";

export interface CashRegisterResponse {
    cashRegisters: CashRegister[];
    totalCashRegisters: number;
}
type CashRegisterInput = Omit<CashRegister,   'id' |'createdAt' | 'updatedAt' | 'deleted' | 'status' | "cashBreakdown">;


export const createCashRegister = async (cashRegister: CashRegisterInput) => {
    return await apiRequest.post<CashRegisterInput>('/cash-register', cashRegister);
}

export const updateCashRegister = async (id: string, cashRegister: CashRegister) => {
    return await apiRequest.put<CashRegister>(`/cash-register/${id}`, cashRegister);
}

export const deleteCashRegister = async (id: string) => {
    return await apiRequest.remove<string>(`/cash-register/${id}`);
}
