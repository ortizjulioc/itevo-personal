import { useState, useEffect, useCallback } from 'react';
import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

interface UseRequestResult<T> {
    data: T | null;
    error: string | null;
    loading: boolean;
    makeRequest: (config: AxiosRequestConfig) => Promise<void>;
}

const useRequest = <T = any>(initialConfig?: AxiosRequestConfig): UseRequestResult<T> => {
    const [data, setData] = useState<T | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const makeRequest = useCallback(async (config: AxiosRequestConfig) => {
        setLoading(true);
        setError(null);
        try {
            const response: AxiosResponse<T> = await axios(config);
            setData(response.data);
        } catch (err) {
            const axiosError = err as AxiosError;
            setError(axiosError.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (initialConfig) {
            makeRequest(initialConfig);
        }
    }, [initialConfig, makeRequest]);

    return { data, error, loading, makeRequest };
};

export default useRequest;
