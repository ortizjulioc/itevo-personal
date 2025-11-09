import useFetchSetting from '@/app/(defaults)/settings/lib/use-fetch-settings';;
import { FormItem } from '@/components/ui';
import React, { useEffect, useCallback, useRef, useState } from 'react';
import useFetchCourseBranchRulesById from '../../../lib/use-fetch-rules';
import { createCourseBranchRules } from '../../../lib/request';
import { FormSkeleton } from '@/components/common';
import RulesEditor from '@/app/(defaults)/settings/components/rules-editor';


// Hook debounce
function useDebounceValue(value: string, delay: number) {
    const [debouncedValue, setDebouncedValue] = useState(value);
    useEffect(() => {
        const handler = setTimeout(() => setDebouncedValue(value), delay);
        return () => clearTimeout(handler);
    }, [value, delay]);
    return debouncedValue;
}

export default function RulesFields({ values }: any) {
    const { setting } = useFetchSetting();
    const { courseBranchRule, seCourseBranchRule, loading } = useFetchCourseBranchRulesById(values.id);
    const [localRules, setLocalRules] = useState<string[]>([]);

    // Inicializar localRules según si existen normas o no
    useEffect(() => {
        if (loading) return;
        if (courseBranchRule?.rules) {
            // Si ya existen normas
            setLocalRules(courseBranchRule.rules as string[]);
        } else if (!courseBranchRule && setting?.rules) {
            // Si no hay normas creadas, mostrar las reglas por defecto localmente
            setLocalRules(setting.rules as string[]);
        }
    }, [courseBranchRule, loading, setting?.rules]);

    // Valor debounced para evitar guardar en cada tecla

    // Crea o actualiza las normas cuando el usuario edita
    const handleUpdateRules = useCallback(async (newRules: string[]) => {
        try {
            const response = await createCourseBranchRules(
                courseBranchRule?.courseBranchId || values.id,
                { rules: newRules }
            );

            seCourseBranchRule(response.data);
        } catch (error) {
            console.error('Error al guardar las normas:', error);
        }
    }, [courseBranchRule, seCourseBranchRule, values.id]);

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
            <FormItem label="">
                <div className="mt-4">
                    <RulesEditor
                        value={localRules}
                        onChange={(rulesArray: string[]) => handleUpdateRules(rulesArray)}
                    />
                </div>
            </FormItem>
        </div>
    );
}
