'use client';
import { useState } from 'react';
import { LogEntry } from '@/utils/log';
import { openNotification, queryStringToObject } from '@/utils';
import { Button, Pagination } from '@/components/ui';
import Skeleton from '@/components/common/Skeleton';
import useFetchLogs from '../../lib/use-fetch-logs';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import IconRefresh from '@/components/icon/icon-refresh';
import IconInfoCircle from '@/components/icon/icon-info-circle';
import UserLabel from '@/components/common/info-labels/user-label';
import LogDetailsDrawer from '../log-details-drawer';
import { IconEye, IconCopy } from '@/components/icon';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import React from 'react';

const TippyTrigger = ({ ref, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { ref?: React.Ref<HTMLButtonElement> }) => (
    <button ref={ref} {...props} />
);

interface Props {
    className?: string;
    query?: string;
}

export default function LogList({ className, query = '' }: Props) {
    const params = queryStringToObject(query);
    const { loading, error, logs, totalLogs, refetch } = useFetchLogs(query);
    const [selectedLog, setSelectedLog] = useState<LogEntry | null>(null);
    const [logDrawerOpen, setLogDrawerOpen] = useState(false);

    if (error) {
        openNotification('error', error);
    }

    const getActionBadge = (action: string) => {
        switch (action) {
            case 'POST': return 'badge-outline-success';
            case 'PUT': return 'badge-outline-warning';
            case 'DELETE': return 'badge-outline-danger';
            case 'GET': return 'badge-outline-info';
            case 'PATCH': return 'badge-outline-secondary';
            default: return 'badge-outline-primary';
        }
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        openNotification('success', 'ID copiado al portapapeles');
    };

    if (loading) return <Skeleton rows={10} columns={['FECHA', 'AUTOR', 'ACCIÓN', 'ORIGEN', 'ELEMENTO ID', 'ESTADO', 'ACCIONES']} />;

    return (
        <div className={className}>
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold">Mostrando {logs.length} registros</h3>

            </div>

            <div className="table-responsive mb-5 panel p-0 border-0 overflow-hidden rounded-xl shadow-lg bg-white/60 dark:bg-black/60 backdrop-blur-md">
                <table className="table-hover">
                    <thead className="bg-white/40 dark:bg-black/40">
                        <tr>
                            <th>FECHA</th>
                            <th>AUTOR</th>
                            <th>ACCIÓN</th>
                            <th>ORIGEN</th>
                            <th>ELEMENTO ID</th>
                            <th className="text-center">ESTADO</th>
                            <th className="text-right">ACCIONES</th>
                        </tr>
                    </thead>
                    <tbody>
                        {logs.length === 0 && (
                            <tr>
                                <td colSpan={5} className="text-center text-gray-500 dark:text-gray-600 italic py-10">
                                    No se encontraron registros para los filtros seleccionados
                                </td>
                            </tr>
                        )}
                        {logs.map((log, index) => (
                            <tr key={`${log.date}-${index}`} className="group transition-all duration-200">
                                <td className="whitespace-nowrap font-medium">
                                    {format(new Date(log.date), 'dd MMM yyyy, HH:mm:ss', { locale: es })}
                                </td>
                                <td>
                                    <UserLabel UserId={log.authorId} />
                                </td>
                                <td>
                                    <span className={`badge ${getActionBadge(log.action)} uppercase`}>
                                        {log.action}
                                    </span>
                                </td>
                                <td className="font-semibold text-primary">
                                    {log.origin}
                                </td>
                                <td>
                                    {log.elementId ? (
                                        <div className="flex items-center gap-2 group/copy">
                                            <code className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                                                {log.elementId}
                                            </code>
                                            <Tippy content="Copiar ID">
                                                <TippyTrigger 
                                                    onClick={() => copyToClipboard(log.elementId!)}
                                                    className="opacity-0 group-hover/copy:opacity-100 text-gray-400 hover:text-primary transition-all"
                                                >
                                                    <IconCopy className="size-3.5" />
                                                </TippyTrigger>
                                            </Tippy>
                                        </div>
                                    ) : (
                                        <span className="text-gray-400 italic">N/A</span>
                                    )}
                                </td>
                                <td className="text-center">
                                    <span className={`badge ${log.success ? 'badge-outline-success' : 'badge-outline-danger'} rounded-full`}>
                                        {log.success ? 'Éxito' : 'Error'}
                                    </span>
                                </td>
                                <td className="text-right">
                                    <Tippy content="Ver detalles">
                                        <TippyTrigger 
                                            className="hover:text-primary transition-colors p-2"
                                            onClick={() => {
                                                setSelectedLog(log);
                                                setLogDrawerOpen(true);
                                            }}
                                        >
                                            <IconEye className="size-5" />
                                        </TippyTrigger>
                                    </Tippy>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <LogDetailsDrawer 
                log={selectedLog} 
                open={logDrawerOpen} 
                onClose={() => setLogDrawerOpen(false)} 
            />

            {totalLogs > 10 && (
                <div className="flex justify-center mt-4">
                    <Pagination
                        currentPage={parseInt(params?.page || '1')}
                        total={totalLogs}
                        top={parseInt(params?.top || '10')}
                    />
                </div>
            )}
        </div>
    );
}
