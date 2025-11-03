'use client';
import { CourseBranchRules } from "@prisma/client";
import { useEffect, useState } from "react";
import apiRequest from "@/utils/lib/api-request/request";

export const useFetchCourseBranchRulesById = (id: string) => {
  const [courseBranchRules, seCourseBranchRules] = useState<CourseBranchRules | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourseData = async (id: string) => {
      try {
        const response = await apiRequest.get<CourseBranchRules>(`/course-branch/${id}/rules`);
        if (!response.success) {
          throw new Error(response.message);
        }
        seCourseBranchRules(response.data);
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

  return { courseBranchRules, loading, error, seCourseBranchRules };
}

export default useFetchCourseBranchRulesById;
