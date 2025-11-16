import apiRequest from "@/utils/lib/api-request/request";
import { Setting } from "@prisma/client";


export const updateSetting = async (id: string, Setting: Setting) => {
    return await apiRequest.put<Setting>(`/settings/${id}`, Setting);
}

export const uploadLogo = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);


  return await apiRequest.post<FormData>('/settings/logo',formData);
};

export const uploadLogoReport = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);


  return await apiRequest.post<FormData>('/settings/logo-report',formData);
};

export const deleteLogo = async (fileName:string) => {
    return await apiRequest.remove(`/settings/logo`, { data: { fileName } });
}

export const deleteLogoReport = async (fileName:string) => {
    return await apiRequest.remove(`/settings/logo-report`, { data: { fileName } });
}
