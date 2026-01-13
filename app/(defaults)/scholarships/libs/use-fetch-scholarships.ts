import { useState, useEffect } from 'react';
import apiRequest from "@/utils/lib/api-request/request";
import type { Scholarship, ScholarshipResponse } from './request';

const useFetchScholarships = (query: string) => {
    const [scholarships, setScholarships] = useState<Scholarship[]>([]);
    const [totalScholarships, setTotalScholarships] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchScholarshipsData = async (query: string) => {
            try {
                const response = await apiRequest.get<ScholarshipResponse>(`/scholarships?search=${query}`);
                if (!response.success) {
                    throw new Error(response.message);
                }
                setScholarships(response.data?.scholarships || []);
                setTotalScholarships(response.data?.totalScholarships || 0);
            } catch (error) {
                if (error instanceof Error) {
                    setError(error.message);
                } else {
                    setError('Ha ocurrido un error al obtener las becas');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchScholarshipsData(query);
    }, [query]);

    return { scholarships, setTotalScholarships, loading, error, setScholarships, totalScholarships };
};

export const useFetchScholarshipById = (id: string) => {
    const [scholarship, setScholarship] = useState<Scholarship | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchScholarshipData = async (id: string) => {
            try {
                const response = await apiRequest.get<Scholarship>(`/scholarships/${id}`);
                if (!response.success) {
                    throw new Error(response.message);
                }
                setScholarship(response.data);
            } catch (error) {
                if (error instanceof Error) {
                    setError(error.message);
                } else {
                    setError('Ha ocurrido un error al obtener la beca');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchScholarshipData(id);
    }, [id]);

    return { scholarship, loading, error, setScholarship };
}

export default useFetchScholarships;
