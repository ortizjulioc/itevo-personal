import { useState, useEffect } from 'react';
import apiRequest from "@/utils/lib/api-request/request";
import { Branch, Course, CourseBranch as CourseBranchPrisma, Teacher } from "@prisma/client";

export interface CourseBranch extends CourseBranchPrisma {
  course: Course;
  branch: Branch;
  teacher: Teacher;
}

export interface CourseBranchResponse {
  courseBranches: CourseBranch[];
  totalCourseBranches: number;
}

const useFetchCourseBranch = (query: string) => {
  const [courseBranches, setCourseBranches] = useState<CourseBranch[]>([]);
  const [totalCourseBranches, setTotalCourseBranches] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourseBranch = async (query: string) => {
      try {
        const response = await apiRequest.get<CourseBranchResponse>(`/course-branch?${query}`);
        if (!response.success) {
          throw new Error(response.message);
        }
        setCourseBranches(response.data?.courseBranches || []);
        setTotalCourseBranches(response.data?.totalCourseBranches || 0);
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError('Ha ocurrido un error al obtener las ofertas academicas');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCourseBranch(query);
  }, [query]);

  return { courseBranches, totalCourseBranches, loading, error, setCourseBranches };
};

export const useFetchCourseBranchById = (id: string) => {
  const [courseBranch, seCourseBranch] = useState<CourseBranchPrisma | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourseData = async (id: string) => {
      try {
        const response = await apiRequest.get<CourseBranchPrisma>(`/course-branch/${id}`);
        if (!response.success) {
          throw new Error(response.message);
        }
        seCourseBranch(response.data);
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError('Ha ocurrido un error al obtener la ofertas academica');
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
