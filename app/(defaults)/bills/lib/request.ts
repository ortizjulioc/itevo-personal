import apiRequest from '@/utils/lib/api-request/request';

export const deleteInvoice = async (id: string) => {
  return await apiRequest.remove<string>(`/invoices/${id}`);
};
