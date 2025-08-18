import { useState, useEffect } from 'react';
import apiRequest from '@/utils/lib/api-request/request';
import { Attendance, CourseBranch, Student } from '@prisma/client';

export interface AttendanceWithStudent extends Attendance {
    student: Student;
    CourseBranch: CourseBranch;
}

export interface AttendanceResponse {
    attendanceRecords: AttendanceWithStudent[];
    totalAttendanceRecords: number;
}

const useFetchAttendances = (query: string) => {
    const [attendances, setAttendances] = useState<AttendanceWithStudent[]>([]);
    const [totalAttendances, setTotalAttendances] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const fetchAttendanceData = async (query: string) => {
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

    useEffect(() => {
        

        fetchAttendanceData(query);
    }, [query]);

    return { attendances, totalAttendances, loading, error, setAttendances, fetchAttendanceData };
};

export default useFetchAttendances;
