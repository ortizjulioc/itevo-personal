'use client';
import { FormSkeleton, ViewTitle } from "@/components/common";
import useFetchSetting from "./lib/use-fetch-settings";
import UpdateSettingForm from "./components/setting-form/update-form";


export default function EditSetting() {
    const { setting,loading  } = useFetchSetting();
    console.log('editar', setting);

    return (
        <>
            <ViewTitle className="mb-6" title="Configuracion de la Empresa" />

            <div className="panel bg container mx-auto px-4">
                <div className="mt-6">
                    {loading && <FormSkeleton />}
                    {setting && <UpdateSettingForm initialValues={setting} />}
                </div>
            </div>
        </>
    );
}
