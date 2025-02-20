import apiRequest from "@/utils/lib/api-request/request";
import { Schedule } from "@prisma/client";

export interface ScheduleResponse {
    schedules: Schedule[];
    totalSchedules: number;
}

export const createSchedule = async (schedule: Schedule) => {
    return await apiRequest.post<Schedule>('/schedules', schedule);
}

export const updateSchedule = async (id: string, schedule: Schedule) => {
    return await apiRequest.put<Schedule>(`/schedules/${id}`, schedule);
}

export const deleteSchedule = async (id: string) => {
    return await apiRequest.remove<string>(`/schedules/${id}`);
}