import { useState, useEffect, useCallback } from 'react';
import apiRequest from "@/utils/lib/api-request/request";
import { EnrollmentWithRelations } from '@/@types/enrollment';

export interface EnrollmentSummary {
  total: number;
  waiting: number;
  confirmed: number;
  enrolled: number;
  completed: number;
  abandoned: number;
}

export interface EnrollmentResponse {
  enrollments: EnrollmentWithRelations[];
  totalEnrollments: number;
  summary: EnrollmentSummary;
}

const useFetchPromotionEnrollments = (promotionId: string, query: string, options: { [key: string]: any } = {}) => {
  const { preventFirstFetch = false } = options;
  const [enrollments, setEnrollments] = useState<EnrollmentWithRelations[]>([]);
  const [totalEnrollments, setTotalEnrollments] = useState<number>(0);
  const [summary, setSummary] = useState<EnrollmentSummary | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEnrollmentData = useCallback(async (promotionId: string, query: string) => {
    if (!promotionId) return;
    try {
      setLoading(true);
      const queryString = query ? `?${query}` : '';
      const response = await apiRequest.get<EnrollmentResponse>(`promotions/${promotionId}/enrollments${queryString}`);
      if (!response.success) {
        throw new Error(response.message);
      }
      setEnrollments(response.data?.enrollments || []);
      setTotalEnrollments(response.data?.totalEnrollments || 0);
      setSummary(response.data?.summary || null);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('Ha ocurrido un error al obtener las inscripciones de la promoción');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    Boolean(!preventFirstFetch) && fetchEnrollmentData(promotionId, query);
  }, [promotionId, query, preventFirstFetch, fetchEnrollmentData]);

  return {
    enrollments,
    totalEnrollments,
    summary,
    loading,
    error,
    setEnrollments,
    refetchEnrollments: () => fetchEnrollmentData(promotionId, query)
  };
};

export default useFetchPromotionEnrollments;
