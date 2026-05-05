import apiRequest from '@/utils/lib/api-request/request';

export const deleteInvoice = async (id: string) => {
  return await apiRequest.remove<string>(`/invoices/${id}`);
};

export const restoreInvoice = async (id: string) => {
  return await apiRequest.patch<{ message: string }>(`/invoices/${id}/restore`);
};
