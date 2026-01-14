import { useState, useEffect, useCallback } from 'react';
import { getScholarships } from './student-scholarship-request';

const useFetchStudentScholarships = (studentId: string) => {
    const [loading, setLoading] = useState(true);
    const [scholarships, setScholarships] = useState<any[]>([]);
    const [total, setTotal] = useState(0);
    const [error, setError] = useState<string | null>(null);

    const fetchScholarships = useCallback(async () => {
        if (!studentId) return;
        setLoading(true);
        try {
            const response = await getScholarships(studentId);

            if (response.success) {
                // La API devuelve { data: [], total: 0 }
                // apiRequest probablemente envuelve esto en { success: true, data: { data: [], total: 0 } }
                const scholarshipsData = response.data?.data || response.data || [];
                console.log('✅ SCHOLARSHIPS DATA:', scholarshipsData);
                setScholarships(scholarshipsData);
                setTotal(response.data?.total || 0);
            } else {
                setError(response.message || 'Error fetching scholarships');
            }
        } catch (err: any) {
            setError(err.message || 'Error fetching scholarships');
        } finally {
            setLoading(false);
        }
    }, [studentId]);

    useEffect(() => {
        fetchScholarships();
    }, [fetchScholarships]);

    return { loading, scholarships, total, error, refresh: fetchScholarships, setScholarships };
};

export default useFetchStudentScholarships;
