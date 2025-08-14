import { useState, useEffect, useCallback } from 'react';
import apiRequest from "@/utils/lib/api-request/request";
import { Course } from "@prisma/client";

export interface CourseResponse {
  courses: Course[];
  totalCourses: number;
}

export interface CourseWithPrerequisites extends Course {
  prerequisites: Course[];
}

interface PrerequisiteResponse {
  courseId: string;
  prerequisiteId: string;
  prerequisite: Course;
}

const useFetchcourses = (query: string) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [totalCourses, setTotalCourses] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async (query: string) => {
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
  }, []);

  useEffect(() => {
    fetchData(query);
  }, [query, fetchData]);

  return { courses, totalCourses, loading, error, setCourses, fetchCourses: fetchData };
};

export const useFetchCourseById = (id: string) => {
  const [course, setCourse] = useState<CourseWithPrerequisites | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourseData = async (id: string) => {
      try {
        const response = await apiRequest.get<CourseWithPrerequisites>(`/courses/${id}`);
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

export const useFetchPreRequisites = (id: Course['id']) => {
  const [preRequisites, setPreRequisites] = useState<PrerequisiteResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPreRequisitesData = useCallback(async (id: string) => {
    try {
      const response = await apiRequest.get<PrerequisiteResponse[]>(`/courses/${id}/prerequisites`);
      if (!response.success) {
        throw new Error(response.message);
      }
      setPreRequisites(response.data || []);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('Ha ocurrido un error al obtener los cursos');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPreRequisitesData(id);
  }, [id, fetchPreRequisitesData]);

  return { preRequisites, loading, error, setPreRequisites, fetchPreRequisites: fetchPreRequisitesData };
}

export default useFetchcourses;
