import { AccountPayable } from "@prisma/client";
import apiRequest from "@/utils/lib/api-request/request";

export const PayAccount = async (id: string, accountPayable: any) => {
    return await apiRequest.post<AccountPayable>(`/account-payable/${id}/payments`, accountPayable);
}
