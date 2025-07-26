import apiRequest from "@/utils/lib/api-request/request";
import type { CashRegister } from "@prisma/client";





export const closeCashRegister = async (id:string, closureData: any) => {
    return await apiRequest.post<any>(`/cash-register/${id}/closure`, closureData);
}
