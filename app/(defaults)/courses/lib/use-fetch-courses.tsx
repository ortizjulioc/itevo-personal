import { useState, useEffect } from 'react';
import apiRequest from "@/utils/lib/api-request/request";
import { Course } from "@prisma/client";

export interface CourseResponse {
  courses: Course[];
  totalCourses: number;
}

const useFetchcourses = (query: string) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [totalCourses, setTotalCourses] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchrolesData = async (query: string) => {
      try {
        const response = await apiRequest.get<CourseResponse>(`/courses?${query}`);
        if (!response.success) {
          throw new Error(response.message);
        }
        setCourses(response.data?.courses || []);
        setTotalCourses(response.data?.totalCourses || 0);
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError('Ha ocurrido un error al obtener los cursos');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchrolesData(query);
  }, [query]);

  return { courses, totalCourses, loading, error, setCourses };
};

export const useFetchCourseById = (id: string) => {
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourseData = async (id: string) => {
      try {
        const response = await apiRequest.get<Course>(`/courses/${id}`);
        if (!response.success) {
          throw new Error(response.message);
        }
        setCourse(response.data);
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError('Ha ocurrido un error al obtener el curso');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCourseData(id);
  }, [id]);

  return { course, loading, error, setCourse };
}

export default useFetchcourses;
