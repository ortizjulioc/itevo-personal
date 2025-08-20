import apiRequest from "@/utils/lib/api-request/request";
import { Attendance, AttendanceStatus, Fingerprint } from "@prisma/client";

export interface AttendanceResponse {
    attendances: Attendance[];
    totalAttendances: number;
}
type AttendanceCreateInput = {
  status: AttendanceStatus;
  studentId: string;
  date: string; // o Date, depende de tu backend
  courseBranchId: string;
};
type AttendanceUpdateInput = {
  status?: AttendanceStatus;
  date?: string;
  courseBranchId?: string;
  studentId?: string;
  
};



export const createAttendance = async (attendance: AttendanceCreateInput) => {
    return await apiRequest.post<AttendanceCreateInput>('/attendances', attendance);
}

export const updateAttendance = async (id: string, attendance: AttendanceUpdateInput) => {
    return await apiRequest.put<AttendanceUpdateInput>(`/attendances/${id}`, attendance);
}

export const deleteAttendance = async (id: string) => {
    return await apiRequest.remove<string>(`/attendances/${id}`);
}


export const getFingerPrintById = async (id: string) => {
    return await apiRequest.get<Fingerprint>(`/students/${id}/fingerprint`);
}
export const deteleFingerPrintById = async (id: string) => {
    return await apiRequest.remove<Fingerprint>(`/students/${id}/fingerprint`);
}

