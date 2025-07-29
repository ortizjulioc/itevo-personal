

import { useState, useEffect } from 'react';
import apiRequest from "@/utils/lib/api-request/request";
import { Setting } from "@prisma/client";

export interface SettingResponse {
    settings: Setting; // 👈 ya no es un array
}

const useFetchSetting = () => {
    const [setting, setSetting] = useState<Setting>();
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchSettingsData = async () => {
            try {
                const response = await apiRequest.get<SettingResponse>(`/settings`);
                if (!response.success) {
                    throw new Error(response.message);
                }

                const setting = response.data?.settings;
                setSetting(setting);
            } catch (error) {
                if (error instanceof Error) {
                    setError(error.message);
                } else {
                    setError('Ha ocurrido un error al obtener la configuración de la empresa');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchSettingsData();
    }, []);

    return { setting, loading, error, setSetting };
};

export default useFetchSetting;
;
