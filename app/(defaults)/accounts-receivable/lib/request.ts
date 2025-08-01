import apiRequest from "@/utils/lib/api-request/request";

export const changeAccountReceivableStatus = async (id: string, status: string) => {
  return await apiRequest.put(`/accounts-receivable/${id}/change-status`, { status });
}

