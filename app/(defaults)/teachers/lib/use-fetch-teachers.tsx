import { useState, useEffect } from 'react';
import apiRequest from "@/utils/lib/api-request/request";
import { Role, Teacher } from "@prisma/client";

export interface TeacherResponse {
  teachers: Teacher[];
  totalTeachers: number;
}

const useFetchTeachers = (query: string) => {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [totalTeachers, setTotalTeachers] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchrolesData = async (query: string) => {
      try {
        const response = await apiRequest.get<TeacherResponse>(`/teachers?${query}`);
        if (!response.success) {
          throw new Error(response.message);
        }
        setTeachers(response.data?.teachers || []);
        setTotalTeachers(response.data?.totalTeachers || 0);
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError('Ha ocurrido un error al obtener los profesores');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchrolesData(query);
  }, [query]);

  return { teachers, totalTeachers, loading, error, setTeachers };
};

export const useFetchTeacherById = (id: string) => {
  const [teacher, setTeacher] = useState<Teacher | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTeacherData = async (id: string) => {
      try {
        const response = await apiRequest.get<Teacher>(`/teachers/${id}`);
        if (!response.success) {
          throw new Error(response.message);
        }
        setTeacher(response.data);
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError('Ha ocurrido un error al obtener el profesor');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchTeacherData(id);
  }, [id]);

  return { teacher, loading, error, setTeacher };
}

export default useFetchTeachers;
