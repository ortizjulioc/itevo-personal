'use client';
import { useURLSearchParams } from '@/utils/hooks';
import DateFilter from './date-filter';
import Select from '@/components/ui/select';
import { SearchInput } from '@/components/common';
import { Button } from '@/components/ui';
import IconRefresh from '@/components/icon/icon-refresh';
import AnimateHeight from 'react-animate-height';
import SelectUser from '@/components/common/selects/select-user';

const ACTION_OPTIONS = [
    { value: 'POST', label: 'POST' },
    { value: 'PUT', label: 'PUT' },
    { value: 'DELETE', label: 'DELETE' },
    { value: 'GET', label: 'GET' },
    { value: 'PATCH', label: 'PATCH' },
];

const SUCCESS_OPTIONS = [
    { value: 'true', label: 'Éxito' },
    { value: 'false', label: 'Error' },
];

interface Props {
    showFilters: boolean;
}

export default function LogFilters({ showFilters }: Props) {
    const params = useURLSearchParams();

    const hasFilters = params.get('action') || 
                      params.get('success') || 
                      params.get('origin') || 
                      params.get('elementId') || 
                      params.get('description') || 
                      params.get('authorId');

    const clearFilters = () => {
        params.delete('action');
        params.delete('success');
        params.delete('origin');
        params.delete('elementId');
        params.delete('description');
        params.delete('authorId');
    };

    return (
        <AnimateHeight duration={300} height={showFilters ? 'auto' : 0}>
            <div className="panel border-0 shadow-lg bg-white/50 dark:bg-black/50 backdrop-blur-md p-5 mb-6 overflow-hidden">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-gray-500 uppercase">Fecha</label>
                    <DateFilter />
                </div>
                
                <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-gray-500 uppercase">Descripción</label>
                    <SearchInput placeholder="Buscar por descripción..." searchKey="description" />
                </div>

                <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-gray-500 uppercase">Acción</label>
                    <Select
                        placeholder="-Todas-"
                        options={ACTION_OPTIONS}
                        isClearable
                        value={ACTION_OPTIONS.find(opt => opt.value === params.get('action'))}
                        onChange={(opt: any) => params.set('action', opt?.value || '')}
                    />
                </div>

                <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-gray-500 uppercase">Estado</label>
                    <Select
                        placeholder="-Todos-"
                        options={SUCCESS_OPTIONS}
                        isClearable
                        value={SUCCESS_OPTIONS.find(opt => opt.value === params.get('success'))}
                        onChange={(opt: any) => params.set('success', opt?.value || '')}
                    />
                </div>

                <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-gray-500 uppercase">Origen</label>
                    <SearchInput placeholder="Ej: users, billing..." searchKey="origin" />
                </div>

                <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-gray-500 uppercase">ID Elemento</label>
                    <SearchInput placeholder="Buscar ID..." searchKey="elementId" />
                </div>

                <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-gray-500 uppercase">Autor</label>
                    <SelectUser 
                        value={params.get('authorId')} 
                        onChange={(selected) => params.set('authorId', selected?.value || '')} 
                        placeholder="-Todos-"
                    />
                </div>

                <div className="flex items-end gap-2">
                    {hasFilters && (
                        <Button variant="outline" color="danger" className="w-full" onClick={clearFilters}>
                            Limpiar
                        </Button>
                    )}
                </div>
            </div>
        </div>
    </AnimateHeight>
    );
}
