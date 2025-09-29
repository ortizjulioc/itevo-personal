import apiRequest from '@/utils/lib/api-request/request';
import { CashBox  } from '@prisma/client';

export const createCashBox  = async (CashBox : CashBox ) => {
  return await apiRequest.post<CashBox >('/cash-box', CashBox );
};

export const updateCashBox  = async (id: string, CashBox : CashBox ) => {
  return await apiRequest.put<CashBox >(`/cash-box/${id}`, CashBox );
};

export const deleteCashBox  = async (id: string) => {
  return await apiRequest.remove<string>(`/cash-box/${id}`);
};
