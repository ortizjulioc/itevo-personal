import { useState, useEffect } from 'react';
import apiRequest from "@/utils/lib/api-request/request";
import { Scholarship } from "@prisma/client";

export interface ScholarshipResponse {
    data: Scholarship[];
    total: number;
}

const useFetchScholarships = (query: string) => {
    const [scholarships, setScholarships] = useState<Scholarship[]>([]);
    const [totalScholarships, setTotalScholarships] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchScholarshipsData = async (query: string) => {
            try {
                // query comes with '?' usually, or empty. apiRequest expects full path.
                // In students: `/students?${query}`. 
                // Let's verify how query is passed. In Step 100, query param default was ''.
                // In students example: useFetchStudents takes query: string.

                const response = await apiRequest.get<ScholarshipResponse>(`/scholarschips?${query}`);

                // Note: Students example checks !response.success. apiRequest likely returns { success, data, message }.
                if (!response.success) {
                    throw new Error(response.message);
                }

                // Students example: response.data.students / response.data.totalStudents
                // My API (Step 61) returns { data: scholarships, total: totalScholarships }
                // So response.data will have { data, total } structure matching ScholarshipResponse interface?
                // Wait, apiRequest.get<T> usually implies T is the type of `response.data`.
                // In Step 61, the API returns json({ data: ..., total: ... }).
                // If apiRequest wraps it, response.data (from apiRequest) might be the body.
                // Let's check apiRequest implementation or infer from students. 
                // StudentResponse interface: { students: Student[], totalStudents: number }.
                // My API return: { data: Scholarship[], total: number }. 
                // So I will define ScholarshipResponse as { data: Scholarship[], total: number }.

                setScholarships(response.data?.data || []);
                setTotalScholarships(response.data?.total || 0);

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

    return { scholarships, totalScholarships, loading, error, setScholarships };
};

export const useFetchScholarshipById = (id: string) => {
    const [scholarship, setScholarship] = useState<Scholarship | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchScholarshipData = async (id: string) => {
            try {
                setLoading(true);
                const response = await apiRequest.get<Scholarship>(`/scholarschips/${id}`);
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

        if (id) {
            fetchScholarshipData(id);
        }
    }, [id]);

    return { scholarship, loading, error, setScholarship };
};

export default useFetchScholarships;
