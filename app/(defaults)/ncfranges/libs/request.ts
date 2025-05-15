import apiRequest from "@/utils/lib/api-request/request";
import type { NcfRange } from "@prisma/client";

export interface NcfRangeResponse {
    ncfRanges: NcfRange[];
    totalNcfRanges: number;
}

export const createNcfRange = async (ncfRange: NcfRange) => {
    return await apiRequest.post<NcfRange>('/ncf-ranges', ncfRange);
}

export const updateNcfRange = async (id: string, ncfRange: NcfRange) => {
    return await apiRequest.put<NcfRange>(`/ncf-ranges/${id}`, ncfRange);
}

export const deleteNcfRange = async (id: string) => {
    return await apiRequest.remove<string>(`/ncf-ranges/${id}`);
}
