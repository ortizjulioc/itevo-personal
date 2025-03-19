import apiRequest from "@/utils/lib/api-request/request";
import { Schedule } from "@prisma/client";

type ScheduleToCreate = Omit<Schedule, 'id' | 'createdAt'| 'updatedAt' | 'deleted'>;

export interface ScheduleResponse {
    schedules: Schedule[];
    totalSchedules: number;
}

export const createSchedule = async (schedule: ScheduleToCreate) => {
    return await apiRequest.post<ScheduleToCreate>('/schedules', schedule);
}

export const updateSchedule = async (id: string, schedule: ScheduleToCreate) => {
    return await apiRequest.put<ScheduleToCreate>(`/schedules/${id}`, schedule);
}

export const deleteSchedule = async (id: string) => {
    return await apiRequest.remove<string>(`/schedules/${id}`);
}
