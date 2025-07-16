'use client';
import { ViewTitle } from "@/components/common";
import useFetchSetting from "./lib/use-fetch-settings";
import UpdateSettingForm from "./components/setting-form/update-form";


export default function EditSetting() {
    const { setting } = useFetchSetting();

    return (
        <>
            <ViewTitle className='mb-6' title="Configuracion de la Empresa" />

            <div className="container mx-auto px-4 panel bg">
                <div className="mt-6">
                    {setting && <UpdateSettingForm initialValues={setting} />}
                </div>
            </div>
        </>
    )
}
