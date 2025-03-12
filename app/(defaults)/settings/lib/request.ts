import apiRequest from "@/utils/lib/api-request/request";
import { Setting } from "@prisma/client";


export const updateSetting = async (id: string, Setting: Setting) => {
    return await apiRequest.put<Setting>(`/settings/${id}`, Setting);
}

