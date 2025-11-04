import useFetchSetting from '@/app/(defaults)/settings/lib/use-fetch-settings';;
import { FormItem } from '@/components/ui';
import React, { useEffect, useCallback, useRef, useState } from 'react';
import useFetchCourseBranchRulesById from '../../../lib/use-fetch-rules';
import { createCourseBranchRules } from '../../../lib/request';
import { FormSkeleton } from '@/components/common';

import dynamic from "next/dynamic";
// 🚀 Importa solo en cliente
const RichTextEditor = dynamic(() => import("@/components/common/rich-text-editor"), {
  ssr: false,
});


// Hook debounce
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

    const [localRules, setLocalRules] = useState<string>('');
    const [lastSavedRules, setLastSavedRules] = useState<string>('');
    const isUpdatingRef = useRef(false);

    // Inicializar localRules según si existen normas o no
    useEffect(() => {
        if (loading) return;

        if (courseBranchRule?.rules) {
            // Si ya existen normas
            setLocalRules(courseBranchRule.rules);
            setLastSavedRules(courseBranchRule.rules);
        } else if (!courseBranchRule && setting?.rules) {
            // Si no hay normas creadas, mostrar las reglas por defecto localmente
            setLocalRules(setting.rules);
            setLastSavedRules(''); // aún no guardado en servidor
        }
    }, [courseBranchRule, loading, setting?.rules]);

    // Valor debounced para evitar guardar en cada tecla
    const debouncedRules = useDebounceValue(localRules, 1000);

    // Crea o actualiza las normas cuando el usuario edita
    const handleUpdateRules = useCallback(async (newRules: string) => {
        if (!newRules.trim()) return;
        if (isUpdatingRef.current || newRules === lastSavedRules) return;

        isUpdatingRef.current = true;
        try {
            const response = await createCourseBranchRules(
                courseBranchRule?.courseBranchId || values.id,
                { rules: newRules }
            );

            seCourseBranchRule(response.data);
            setLastSavedRules(newRules);
        } catch (error) {
            console.error('Error al guardar las normas:', error);
        } finally {
            isUpdatingRef.current = false;
        }
    }, [courseBranchRule, lastSavedRules, seCourseBranchRule, values.id]);

    // Ejecutar guardado si el usuario escribió algo y pasó el debounce
    useEffect(() => {
        if (!debouncedRules.trim()) return;
        if (debouncedRules !== lastSavedRules) {
            handleUpdateRules(debouncedRules);
        }
    }, [debouncedRules, lastSavedRules, handleUpdateRules]);

    // Mientras carga los datos iniciales
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
