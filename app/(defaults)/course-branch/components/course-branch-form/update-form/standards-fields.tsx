
import useFetchSetting from '@/app/(defaults)/settings/lib/use-fetch-settings';
import RichTextEditor from '@/components/common/rich-text-editor';
import { FormItem } from '@/components/ui';
import React, { useEffect, useCallback, useRef, useState } from 'react';
import useFetchCourseBranchRulesById from '../../../lib/use-fetch-rules';
import { createCourseBranchRules } from '../../../lib/request';
import { FormSkeleton } from '@/components/common';

// Hook debounce (igual que antes)
function useDebounceValue(value: string, delay: number) {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const handler = setTimeout(() => setDebouncedValue(value), delay);
        return () => clearTimeout(handler);
    }, [value, delay]);

    return debouncedValue;
}

export default function StandardsFields({ values }: any) {
    const { setting } = useFetchSetting();
    const { courseBranchRule, seCourseBranchRule, loading } = useFetchCourseBranchRulesById(values.id);

    const [localRules, setLocalRules] = useState<string>(''); // 👈 Texto que el usuario edita
    const [lastSavedRules, setLastSavedRules] = useState<string>('');
    const isUpdatingRef = useRef(false);

    // Inicializar localRules cuando se carga del servidor
    useEffect(() => {
        if (courseBranchRule?.rules && !isUpdatingRef.current) {
            setLocalRules(courseBranchRule.rules);
            setLastSavedRules(courseBranchRule.rules);
        }
    }, [courseBranchRule]);

    // Crear normas por defecto si no existen
    useEffect(() => {
        if (!courseBranchRule && !loading) {
            const createDefaultRules = async () => {
                try {
                    const response = await createCourseBranchRules(values.id, {
                        rules: setting?.rules || ''
                    });
                    seCourseBranchRule(response.data);
                    setLocalRules(setting?.rules || '');
                    setLastSavedRules(setting?.rules || '');
                } catch (error) {
                    console.error('Error al crear las normas por defecto:', error);
                }
            };
            createDefaultRules();
        }
    }, [courseBranchRule, loading, values.id, setting?.rules, seCourseBranchRule]);

    // Debounce sobre el texto local
    const debouncedRules = useDebounceValue(localRules, 1000);

    // Guardar en servidor cuando cambia el debounced
    const handleUpdateRules = useCallback(async (newRules: string) => {
        if (!courseBranchRule || isUpdatingRef.current || newRules === lastSavedRules) return;

        isUpdatingRef.current = true;
        try {
            const response = await createCourseBranchRules(courseBranchRule.courseBranchId, {
                rules: newRules
            });
            seCourseBranchRule(response.data);
            setLastSavedRules(newRules);
        } catch (error) {
            console.error('Error al actualizar las normas:', error);
        } finally {
            isUpdatingRef.current = false;
        }
    }, [courseBranchRule, lastSavedRules, seCourseBranchRule]);

    // Ejecutar actualización cuando cambie el valor debounced
    useEffect(() => {
        if (debouncedRules !== lastSavedRules) {
            handleUpdateRules(debouncedRules);
        }
    }, [debouncedRules, lastSavedRules, handleUpdateRules]);

    // Skeleton mientras carga
    if (loading) {
        return (
            <div>
                <FormItem label="Normas del curso">
                    <FormSkeleton />
                </FormItem>
            </div>
        );
    }

    return (
        <div>
            <FormItem label="Normas del curso">
                <RichTextEditor
                    value={localRules}
                    onChange={(value) => setLocalRules(value)}
                    placeholder="Escribe las normas aquí..."
                />
            </FormItem>
        </div>
    );
}
