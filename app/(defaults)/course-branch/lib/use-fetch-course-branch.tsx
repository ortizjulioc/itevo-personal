import { useState, useEffect } from 'react';
import apiRequest from "@/utils/lib/api-request/request";
import { CourseBranch } from "@prisma/client";

export interface CourseBranchResponse {
  courseBranch: CourseBranch[];
  totalCourseBranch: number;
}

const useFetchCourseBranch = (query: string) => {
  const [courseBranch, setCourseBranch] = useState<CourseBranch[]>([]);
  const [totalCourseBranch, setTotalCourseBranch] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchrolesData = async (query: string) => {
      try {
        const response = await apiRequest.get<CourseBranchResponse>(`/course-branch?${query}`);
        if (!response.success) {
          throw new Error(response.message);
        }
        setCourseBranch(response.data?.courseBranch || []);
        setTotalCourseBranch(response.data?.totalCourseBranch || 0);
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError('Ha ocurrido un error al obtener las gestiones academicas');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchrolesData(query);
  }, [query]);

  return { courseBranch, totalCourseBranch, loading, error, setCourseBranch };
};

export const useFetchCourseBranchById = (id: string) => {
  const [courseBranch, seCourseBranch] = useState<CourseBranch | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourseData = async (id: string) => {
      try {
        const response = await apiRequest.get<CourseBranch>(`/course-branch/${id}`);
        if (!response.success) {
          throw new Error(response.message);
        }
        seCourseBranch(response.data);
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError('Ha ocurrido un error al obtener la gestion academica');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCourseData(id);
  }, [id]);

  return { courseBranch, loading, error, seCourseBranch };
}

export default useFetchCourseBranch;
