'use client';
import { useState, useEffect } from 'react';
import { LogEntry } from '@/utils/log';

export default function useFetchLogs(query: string) {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [logs, setLogs] = useState<LogEntry[]>([]);
    const [totalLogs, setTotalLogs] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);

    const fetchLogs = async () => {
        setLoading(true);
        try {
            const response = await fetch(`/api/logs${query ? `?${query}` : ''}`);
            const data = await response.json();
            if (response.ok) {
                setLogs(data.logs);
                setTotalLogs(data.totalLogs);
                setTotalPages(data.totalPages);
                setCurrentPage(data.currentPage);
            } else {
                setError(data.error || 'Error al obtener los logs');
            }
        } catch (err) {
            setError('Error de red al obtener los logs');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLogs();
    }, [query]);

    return { 
        loading, 
        error, 
        logs, 
        totalLogs, 
        totalPages, 
        currentPage, 
        setLogs, 
        refetch: fetchLogs 
    };
}
