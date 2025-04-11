import apiRequest from "@/utils/lib/api-request/request";
import type { CashRegister } from "@prisma/client";

export interface CashRegisterResponse {
    cashRegisters: CashRegister[];
    totalCashRegisters: number;
}

export const createCashRegister = async (cashRegister: CashRegister) => {
    return await apiRequest.post<CashRegister>('/cashregister', cashRegister);
}

export const updateCashRegister = async (id: string, cashRegister: CashRegister) => {
    return await apiRequest.put<CashRegister>(`/cashregister/${id}`, cashRegister);
}

export const deleteCashRegister = async (id: string) => {
    return await apiRequest.remove<string>(`/cashregister/${id}`);
}
