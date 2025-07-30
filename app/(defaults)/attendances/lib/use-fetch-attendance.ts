import { useState, useEffect } from 'react';
import apiRequest from '@/utils/lib/api-request/request';
import { Attendance } from '@prisma/client';

export interface AttendanceResponse {
    attendanceRecords: Attendance[];
    totalAttendanceRecords: number;
}

const useFetchAttendances = (query: string) => {
    const [attendances, setAttendances] = useState<Attendance[]>([]);
    const [totalAttendances, setTotalAttendances] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchrolesData = async (query: string) => {
            try {
                const response = await apiRequest.get<AttendanceResponse>(`/attendances?${query}`);
                if (!response.success) {
                    throw new Error(response.message);
                }
                console.log(response.data);
                setAttendances(response.data?.attendanceRecords || []);
                setTotalAttendances(response.data?.totalAttendanceRecords || 0);
            } catch (error) {
                if (error instanceof Error) {
                    setError(error.message);
                } else {
                    setError('Ha ocurrido un error al obtener las asistencias');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchrolesData(query);
    }, [query]);

    return { attendances, totalAttendances, loading, error, setAttendances };
};

export default useFetchAttendances;
