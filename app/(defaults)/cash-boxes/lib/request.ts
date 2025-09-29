import apiRequest from '@/utils/lib/api-request/request';
import { CashBox  } from '@prisma/client';

export const createCashBox  = async (CashBox : CashBox ) => {
  return await apiRequest.post<CashBox >('/CashBox s', CashBox );
};

export const updateCashBox  = async (id: string, CashBox : CashBox ) => {
  return await apiRequest.put<CashBox >(`/CashBox s/${id}`, CashBox );
};

export const deleteCashBox  = async (id: string) => {
  return await apiRequest.remove<string>(`/CashBox s/${id}`);
};
