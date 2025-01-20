'use client';
import { ViewTitle } from "@/components/common";
import { Tab } from "@headlessui/react";
import useFetchSetting from "./lib/settings/use-fetch-settings";
import UpdateSettingForm from "./components/settings/setting-form/update-form";
import { Fragment } from "react";
import ScheduleLists from "./components/schedules";


export default function EditSetting({ params }: { params: { id: string } }) {
    const { id } = params;
    const { loading, Setting } = useFetchSetting();
    
    return (
        <>
        <ViewTitle className='mb-6' title="Configuracion de la Empresa" />

        <div className="container mx-auto px-4 panel bg">
            
            <Tab.Group>
                <Tab.List className=" flex flex-wrap">
                    <Tab as={Fragment}>
                        {({ selected }) => (
                            <button
                                className={`${selected ? 'text-secondary !outline-none before:!w-full' : ''} relative -mb-[1px] flex items-center p-5 py-3 before:absolute before:bottom-0 before:left-0 before:right-0 before:m-auto before:inline-block before:h-[1px] before:w-0 before:bg-secondary before:transition-all before:duration-700 hover:text-secondary hover:before:w-full`}
                            >
                                Información general de la empresa
                            </button>
                        )}
                    </Tab>
                    <Tab as={Fragment}>
                        {({ selected }) => (
                            <button
                                className={`${selected ? 'text-secondary !outline-none before:!w-full' : ''} relative -mb-[1px] flex items-center p-5 py-3 before:absolute before:bottom-0 before:left-0 before:right-0 before:m-auto before:inline-block before:h-[1px] before:w-0 before:bg-secondary before:transition-all before:duration-700 hover:text-secondary hover:before:w-full`}
                            >
                                Horarios de clases
                            </button>
                        )}
                    </Tab>
                </Tab.List>

                <Tab.Panels>
                    <Tab.Panel>
                        <div className="mt-6">
                            {Setting && <UpdateSettingForm initialValues={Setting} />}
                        </div>
                    </Tab.Panel>
                    <Tab.Panel>
                        <div className="mt-6">
                           <ScheduleLists  />
                        </div>
                    </Tab.Panel>
                </Tab.Panels>
            </Tab.Group>
        </div>
        </>
    )
}
