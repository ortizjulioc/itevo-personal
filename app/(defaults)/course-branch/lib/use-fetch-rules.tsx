'use client';
import { CourseBranchRules } from "@prisma/client";
import { useEffect, useState } from "react";
import apiRequest from "@/utils/lib/api-request/request";

export const useFetchCourseBranchRulesById = (id: string) => {
  const [courseBranchRule, seCourseBranchRule] = useState<CourseBranchRules | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourseData = async (id: string) => {
      try {
        const response = await apiRequest.get<CourseBranchRules>(`/course-branch/${id}/rules`);
        if (!response.success) {
          throw new Error(response.message);
        }
        seCourseBranchRule(response.data);
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

  return { courseBranchRule, loading, error, seCourseBranchRule };
}

export default useFetchCourseBranchRulesById;
