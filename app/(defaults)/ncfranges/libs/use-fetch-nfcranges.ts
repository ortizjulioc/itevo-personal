import { useState, useEffect } from 'react';
import apiRequest from '@/utils/lib/api-request/request';
import type { NcfRange } from '@prisma/client';

export interface NcfRangesResponse {
    ncfRanges: NcfRange[];
    totalNcfRanges: number;
}

const useFetchNcfRanges = (query: string) => {
    const [ncfRanges, setNcfRanges] = useState<NcfRange[]>([]);
    const [totalNcfRanges, setTotalNcfRanges] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchNcfRangesData = async (query: string) => {
            try {
                const response = await apiRequest.get<NcfRangesResponse>(`/ncf-ranges?search=${query}`);
                if (!response.success) {
                    throw new Error(response.message);
                }
                setNcfRanges(response.data?.ncfRanges || []);
                setTotalNcfRanges(response.data?.totalNcfRanges || 0);
            } catch (error) {
                if (error instanceof Error) {
                    setError(error.message);
                } else {
                    setError('Ha ocurrido un error al obtener los rangos de NCF');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchNcfRangesData(query);
    }, [query]);

    return { ncfRanges, setTotalNcfRanges, loading, error, setNcfRanges, totalNcfRanges };
};

export const useFetchNcfRangesById = (id: string) => {
    const [ncfRange, setNcfRange] = useState<NcfRange | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchNcfRangeData = async (id: string) => {
            try {
                const response = await apiRequest.get<NcfRange>(`/ncf-ranges/${id}`);
                if (!response.success) {
                    throw new Error(response.message);
                }
                setNcfRange(response.data);
            } catch (error) {
                if (error instanceof Error) {
                    setError(error.message);
                } else {
                    setError('Ha ocurrido un error al obtener el rango de NCF');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchNcfRangeData(id);
    }, [id]);

    return { ncfRange, loading, error, setNcfRange };
};

export default useFetchNcfRanges;
