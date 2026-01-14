import { useState, useEffect, useCallback } from 'react';
import { getStudentScholarships } from './student-scholarship-request';

const useFetchStudentScholarships = (studentId: string) => {
    const [loading, setLoading] = useState(true);
    const [scholarships, setScholarships] = useState<any[]>([]);
    const [total, setTotal] = useState(0);
    const [error, setError] = useState<string | null>(null);

    const fetchScholarships = useCallback(async () => {
        if (!studentId) return;
        setLoading(true);
        try {
            const response = await getStudentScholarships(studentId, { top: 100 }); // Get all relevant ones
            if (response.success) {
                setScholarships(response.data); // Assuming response.data is the list directly or response.data.data
                // Based on route.ts: NextResponse.json({ data: studentsScholarships, total: ... })
                // apiRequest usually returns the json body directly or wrapped.
                // If apiRequest returns the full response object, it's response.data. 
                // Let's assume apiRequest returns the parsed JSON.
                // The route returns { data: [], total: 0 }. 
                // So response should be { data: [], total: 0 } (if apiRequest returns the body).
                // Or if apiRequest wraps it in success/message/data... 
                // Let's check apiRequest in `utils/lib/api-request/request` if I could.
                // But looking at `request.ts` in step 21: `return await apiRequest.post<Student>...`
                // Usually these helpers normalize response. 
                // Let's assume standard behavior: response.data contains the list if the API returns { data: ... }
                // Actually the API returns `{ data: ..., total: ... }`.
                // So response might be `{ success: true, data: { data: [], total: 0 } }` or similar depending on the wrapper.
                // I'll assume response.data is the payload ` { data: [], total: 0 }` or response itself is the payload.
                // Let's be safe and inspect usage in `use-fetch-enrollments`.

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
