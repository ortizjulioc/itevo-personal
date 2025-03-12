import { useState, useEffect } from 'react';
import apiRequest from "@/utils/lib/api-request/request";
import { Holiday } from "@prisma/client";

export interface HolidayResponse {
  holidays: Holiday[];
  totalHolidays: number;
}

const useFetchHolidays = (query: string) => {
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [totalHolidays, setTotalHolidays] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchrolesData = async (query: string) => {
      try {
        const response = await apiRequest.get<HolidayResponse>(`/holidays?${query}`);
        if (!response.success) {
          throw new Error(response.message);
        }
        setHolidays(response.data?.holidays || []);
        setTotalHolidays(response.data?.totalHolidays || 0);
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError('Ha ocurrido un error al obtener los dias festivos');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchrolesData(query);
  }, [query]);

  return { holidays, totalHolidays, loading, error, setHolidays };
};

export const useFetchHolidayById = (id: string) => {
  const [holiday, setHoliday] = useState<Holiday | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHolidayData = async (id: string) => {
      try {
        const response = await apiRequest.get<Holiday>(`/holidays/${id}`);
        if (!response.success) {
          throw new Error(response.message);
        }
        setHoliday(response.data);
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

    fetchHolidayData(id);
  }, [id]);

  return { holiday, loading, error, setHoliday };
}

export default useFetchHolidays;
