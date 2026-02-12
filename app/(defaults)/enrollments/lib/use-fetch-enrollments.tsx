import { useState, useEffect, useCallback } from 'react';
import apiRequest from "@/utils/lib/api-request/request";
import { Enrollment } from "@prisma/client";
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

const useFetchEnrollments = (query: string, options: { [key: string]: any } = {}) => {
  const { preventFirstFetch = false } = options;
  const [enrollments, setEnrollments] = useState<EnrollmentWithRelations[]>([]);
  const [totalEnrollments, setTotalEnrollments] = useState<number>(0);
  const [summary, setSummary] = useState<EnrollmentSummary | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEnrollmentData = useCallback(async (query: string) => {
    try {
      setLoading(true);
      const response = await apiRequest.get<EnrollmentResponse>(`/enrollments?${query}`);
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
        setError('Ha ocurrido un error al obtener las incripciones');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    Boolean(!preventFirstFetch) && fetchEnrollmentData(query);
  }, [query, preventFirstFetch, fetchEnrollmentData]);

  return {
    enrollments,
    totalEnrollments,
    summary,
    loading,
    error,
    setEnrollments,
    refetchEnrollments: fetchEnrollmentData
  };
};

export const useFetchEnrollmentById = (id: string) => {
  const [enrollment, setEnrollment] = useState<Enrollment | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEnrollmentData = async (id: string) => {
      try {
        setLoading(true)
        const response = await apiRequest.get<Enrollment>(`/enrollments/${id}`);
        if (!response.success) {
          throw new Error(response.message);
        }
        setEnrollment(response.data);
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError('Ha ocurrido un error al obtener la inscripción');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchEnrollmentData(id);
  }, [id]);

  return { enrollment, loading, error, setEnrollment };
}

export default useFetchEnrollments;
