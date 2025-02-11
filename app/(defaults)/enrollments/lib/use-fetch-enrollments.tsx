import { useState, useEffect } from 'react';
import apiRequest from "@/utils/lib/api-request/request";
import { Enrollment } from "@prisma/client";

export interface EnrollmentResponse {
  enrollments: Enrollment[];
  totalEnrollments: number;
}

const useFetchEnrollments = (query: string) => {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [totalEnrollments, setTotalEnrollments] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchrolesData = async (query: string) => {
      try {
        console.log(query);
        const response = await apiRequest.get<EnrollmentResponse>(`/enrollments?${query}`);
       ;
        if (!response.success) {
          throw new Error(response.message);
        }
        setEnrollments(response.data?.enrollments || []);
        setTotalEnrollments(response.data?.totalEnrollments || 0);
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError('Ha ocurrido un error al obtener las incripciones');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchrolesData(query);
  }, [query]);

  return { enrollments, totalEnrollments, loading, error, setEnrollments };
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
