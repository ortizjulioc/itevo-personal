import { useState, useEffect } from 'react';
import apiRequest from "@/utils/lib/api-request/request";
import { Schedule } from "@prisma/client";

export interface ScheduleResponse {
    schedules: Schedule[];
    totalSchedules: number;
}

const useFetchSchedule = (query: string = '') => {
    const [schedules, setSchedules] = useState<Schedule[]>([]);
    const [totalSchedules, setTotalSchedules] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchSchedulesData = async (query: string) => {
            try {
                const response = await apiRequest.get<ScheduleResponse>(`/schedules?${query}`);
                if (!response.success) {
                    throw new Error(response.message);
                }
                setSchedules(response.data?.schedules || []);
                setTotalSchedules(response.data?.totalSchedules || 0);
            } catch (error) {
                if (error instanceof Error) {
                    setError(error.message);
                } else {
                    setError('Ha ocurrido un error al obtener los horarios');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchSchedulesData(query);
    }, [query]);

    return { schedules, totalSchedules, loading, error, setSchedules };
};

export const useFetchScheduleById = (id: string) => {
    const [Schedule, setSchedule] = useState<Schedule | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchScheduleData = async (id: string) => {
            try {
                const response = await apiRequest.get<Schedule>(`/schedules/${id}`);
                if (!response.success) {
                    throw new Error(response.message);
                }
                setSchedule(response.data);
            } catch (error) {
                if (error instanceof Error) {
                    setError(error.message);
                } else {
                    setError('Ha ocurrido un error al obtener el horario');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchScheduleData(id);
    }, [id]);

    return { Schedule, loading, error, setSchedule };
}

export default useFetchSchedule;
