import apiRequest from "@/utils/lib/api-request/request";
import { Attendance, Fingerprint } from "@prisma/client";

export interface AttendanceResponse {
    attendances: Attendance[];
    totalAttendances: number;
}

export const createAttendance = async (attendance: Attendance) => {
    return await apiRequest.post<Attendance>('/attendances', attendance);
}

export const updateAttendance = async (id: string, attendance: Attendance) => {
    return await apiRequest.put<Attendance>(`/attendances/${id}`, attendance);
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

