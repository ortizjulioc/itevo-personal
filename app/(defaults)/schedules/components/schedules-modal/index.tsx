'use client';
import { Dialog, Transition } from "@headlessui/react";
import React from "react";
import { Fragment } from 'react';
import CreateScheduleForm from "../schedules-form/create-schedule";
import UpdateScheduleForm from "../schedules-form/update-schedule";

interface ScheduleModalProps {
    setOpenModal: (value: boolean) => void;
    openModal: boolean;
    value: any;
    setSchedules?: any;
}

const ScheduleModal: React.FC<ScheduleModalProps> = ({ setOpenModal, openModal, value,setSchedules }) => {
    return (
        <Transition appear show={openModal} as={Fragment}>
            <Dialog as="div" open={openModal} onClose={() => setOpenModal(false)}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0" />
                </Transition.Child>
                <div className="fixed inset-0 bg-[black]/60 z-[999] overflow-y-auto">
                    <div className="flex items-start justify-center min-h-screen px-4">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel as="div" className="panel border-0 p-0 rounded-lg overflow-hidden my-8 w-full max-w-lg text-black dark:text-white-dark">
                               
                                <div className="p-5">
                                    {value === undefined ? (
                                        <CreateScheduleForm 
                                            setOpenModal={setOpenModal}
                                            setSchedules={setSchedules}
                                            />
                                    ) : (
                                        <UpdateScheduleForm 
                                            initialValues={value}  
                                            setOpenModal={setOpenModal}
                                            setSchedules={setSchedules}
                                            />
                                    )}


                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
};

export default ScheduleModal;