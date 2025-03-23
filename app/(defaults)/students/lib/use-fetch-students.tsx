import { useState, useEffect } from 'react';
import apiRequest from "@/utils/lib/api-request/request";
import { Role, Student } from "@prisma/client";

export interface StudentResponse {
  students: Student[];
  totalStudents: number;
}

const useFetchStudents = (query: string) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [totalStudents, setTotalStudents] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchrolesData = async (query: string) => {
      try {
        const response = await apiRequest.get<StudentResponse>(`/students?${query}`);
        if (!response.success) {
          throw new Error(response.message);
        }
        setStudents(response.data?.students || []);
        setTotalStudents(response.data?.totalStudents || 0);
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError('Ha ocurrido un error al obtener los estudiantes');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchrolesData(query);
  }, [query]);

  return { students, totalStudents, loading, error, setStudents };
};

export const useFetchStudentById = (id: string) => {
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStudentData = async (id: string) => {
      try {
        setLoading(true)
        const response = await apiRequest.get<Student>(`/students/${id}`);
        if (!response.success) {
          throw new Error(response.message);
        }
        setStudent(response.data);
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError('Ha ocurrido un error al obtener el estudiante');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchStudentData(id);
  }, [id]);

  return { student, loading, error, setStudent };
}

export default useFetchStudents;
