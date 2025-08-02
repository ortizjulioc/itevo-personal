import apiRequest from "@/utils/lib/api-request/request";
import { Setting } from "@prisma/client";


export const updateSetting = async (id: string, Setting: Setting) => {
    return await apiRequest.put<Setting>(`/settings/${id}`, Setting);
}

export const uploadLogo = async (file: string) => {
  return await apiRequest.post('/settings/logo', { file });
};


 export const deleteLogo = async (fileName:string) => {
    return await apiRequest.remove(`/settings/logo`, { data: { fileName } });
}

