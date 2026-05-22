import useFetchSetting from '@/app/(defaults)/settings/lib/use-fetch-settings';;
import { FormItem } from '@/components/ui';
import React, { useEffect, useCallback, useRef, useState } from 'react';
import useFetchCourseBranchRulesById from '../../../lib/use-fetch-rules';
import { createCourseBranchRules } from '../../../lib/request';
import { FormSkeleton } from '@/components/common';
import RulesEditor from '@/app/(defaults)/settings/components/rules-editor';
import { isLegacyRulesFormat, legacyRulesToTipTap } from '@/app/(defaults)/settings/lib/rules-transform';
import { JSONContent } from '@tiptap/react';


// Hook debounce
function useDebounceValue<T>(value: T, delay: number) {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);
    useEffect(() => {
        const handler = setTimeout(() => setDebouncedValue(value), delay);
        return () => clearTimeout(handler);
    }, [value, delay]);
    return debouncedValue;
}

export default function RulesFields({ values }: any) {
    const { setting, loading: settingLoading } = useFetchSetting();
    const { courseBranchRule, seCourseBranchRule, loading: rulesLoading } = useFetchCourseBranchRulesById(values.id);
    const [localRules, setLocalRules] = useState<JSONContent | null | undefined>(undefined);

    // Inicializar localRules según si existen normas o no
    useEffect(() => {
        if (rulesLoading || settingLoading) return;
        if (courseBranchRule?.rules) {
            // Si ya existen normas
            const ruleData = isLegacyRulesFormat(courseBranchRule.rules) 
                ? legacyRulesToTipTap(courseBranchRule.rules as string[])
                : courseBranchRule.rules as JSONContent;
            setLocalRules(ruleData);
        } else if (!courseBranchRule && setting?.rules) {
            // Si no hay normas creadas, mostrar las reglas por defecto localmente
            const ruleData = isLegacyRulesFormat(setting.rules) 
                ? legacyRulesToTipTap(setting.rules as string[])
                : setting.rules as JSONContent;
            setLocalRules(ruleData);
        } else {
            setLocalRules(null);
        }
    }, [courseBranchRule, rulesLoading, settingLoading, setting?.rules]);

    const debouncedRules = useDebounceValue(localRules, 1000);

    // Crea o actualiza las normas cuando el usuario edita (usando el debounce)
    useEffect(() => {
        if (!debouncedRules) return;
        
        const saveRules = async () => {
            try {
                const response = await createCourseBranchRules(
                    courseBranchRule?.courseBranchId || values.id,
                    { rules: debouncedRules }
                );
                seCourseBranchRule(response.data);
            } catch (error) {
                console.error('Error al guardar las normas:', error);
            }
        };

        saveRules();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedRules, values.id]);

    const handleUpdateRules = useCallback((newRules: JSONContent) => {
        setLocalRules(newRules);
    }, []);

    // Mientras carga los datos iniciales
    if (rulesLoading || settingLoading || localRules === undefined) {
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
                        onChange={(rulesJson: JSONContent) => handleUpdateRules(rulesJson)}
                    />
                </div>
            </FormItem>
        </div>
    );
}
