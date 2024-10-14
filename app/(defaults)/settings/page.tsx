'use client';
import { FormSkeleton, ViewTitle } from "@/components/common";

import useFetchSetting from "./lib/use-fetch-settings";
import UpdateSettingForm from "./components/setting-form/update-form";



export default function EditSetting({ params }: { params: { id: string } }) {
    const { id } = params;
    const { loading, Setting } = useFetchSetting();
    return (
        <div>
            <ViewTitle className='mb-6' title="Configuracion de la Empresa"  />

            {/* {loading && <FormSkeleton />} */}
            {Setting && <UpdateSettingForm initialValues={Setting} />}
        </div>
    )
}
