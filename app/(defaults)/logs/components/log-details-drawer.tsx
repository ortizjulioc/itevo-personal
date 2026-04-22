'use client';
import Drawer from '@/components/ui/drawer';
import { LogEntry } from '@/utils/log';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import UserLabel from '@/components/common/info-labels/user-label';
import { Button } from '@/components/ui';
import IconCopy from '@/components/icon/icon-copy';
import { openNotification } from '@/utils';

interface Props {
    log: LogEntry | null;
    open: boolean;
    onClose: () => void;
}

export default function LogDetailsDrawer({ log, open, onClose }: Props) {
    if (!log) return null;

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        openNotification('success', 'Copiado al portapapeles');
    };

    const isJson = (str: string) => {
        try {
            JSON.parse(str);
            return true;
        } catch (e) {
            return false;
        }
    };

    // Intentar extraer JSON si está envuelto en texto
    let displayDescription = log.description;
    let jsonContent: any = null;

    if (log.description.includes('{')) {
        const start = log.description.indexOf('{');
        const end = log.description.lastIndexOf('}') + 1;
        const potentialJson = log.description.substring(start, end);
        if (isJson(potentialJson)) {
            jsonContent = JSON.parse(potentialJson);
            displayDescription = log.description.substring(0, start).trim();
        }
    }

    return (
        <Drawer open={open} onClose={onClose} title="Detalles del Registro" className="max-w-[600px]">
            <div className="flex flex-col gap-6 p-2">
                {/* Header Info */}
                <div className="grid grid-cols-2 gap-4 bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-100 dark:border-gray-700">
                    <div>
                        <label className="text-[10px] font-bold text-gray-500 uppercase block mb-1">Fecha y Hora</label>
                        <span className="text-sm font-medium">
                            {format(new Date(log.date), 'dd MMMM yyyy, HH:mm:ss', { locale: es })}
                        </span>
                    </div>
                    <div>
                        <label className="text-[10px] font-bold text-gray-500 uppercase block mb-1">Estado</label>
                        <span className={`badge ${log.success ? 'badge-outline-success' : 'badge-outline-danger'} rounded-full`}>
                            {log.success ? 'Éxito' : 'Error'}
                        </span>
                    </div>
                    <div>
                        <label className="text-[10px] font-bold text-gray-500 uppercase block mb-1">Acción</label>
                        <span className="text-sm font-bold text-primary">{log.action}</span>
                    </div>
                    <div>
                        <label className="text-[10px] font-bold text-gray-500 uppercase block mb-1">Origen</label>
                        <span className="text-sm font-semibold">{log.origin}</span>
                    </div>
                </div>

                {/* Author Info */}
                <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-100 dark:border-gray-700">
                    <label className="text-[10px] font-bold text-gray-500 uppercase block mb-1">Realizado por</label>
                    <div className="flex items-center gap-2">
                        <UserLabel UserId={log.authorId} />
                        <span className="text-[10px] text-gray-400 font-mono">({log.authorId})</span>
                    </div>
                </div>

                {/* Description */}
                <div className="flex flex-col gap-2">
                    <div className="flex justify-between items-center">
                        <label className="text-[10px] font-bold text-gray-500 uppercase">Descripción</label>
                        <Button variant="outline" size="sm" icon={<IconCopy className="size-3" />} onClick={() => copyToClipboard(log.description)}>
                            Copiar
                        </Button>
                    </div>
                    <div className="p-4 rounded-xl bg-gray-900 text-gray-100 font-sans text-sm leading-relaxed whitespace-pre-wrap border border-gray-700 shadow-inner">
                        {displayDescription}
                    </div>
                </div>

                {/* JSON Data if exists */}
                {jsonContent && (
                    <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-bold text-gray-500 uppercase">Datos Técnicos (JSON)</label>
                        <div className="p-4 rounded-xl bg-black text-green-400 font-mono text-xs overflow-x-auto border border-gray-800 shadow-lg">
                            <pre>{JSON.stringify(jsonContent, null, 2)}</pre>
                        </div>
                    </div>
                )}

                {/* Element ID */}
                {log.elementId && (
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-100 dark:border-blue-800/30 flex justify-between items-center gap-4">
                        <div className="flex-1">
                            <label className="text-[10px] font-bold text-blue-500 uppercase block mb-1">ID del Elemento Afectado</label>
                            <code className="text-sm font-mono text-blue-600 dark:text-blue-400 break-all">{log.elementId}</code>
                        </div>
                        <Button 
                            variant="outline" 
                            size="sm" 
                            color="primary"
                            icon={<IconCopy className="size-4" />} 
                            onClick={() => copyToClipboard(log.elementId!)}
                        >
                            Copiar
                        </Button>
                    </div>
                )}
            </div>
        </Drawer>
    );
}
