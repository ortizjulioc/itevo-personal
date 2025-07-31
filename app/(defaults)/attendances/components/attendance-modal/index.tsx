import CreateAttendanceForm from '@/app/(defaults)/attendances/components/attendance-form';
import { Dialog, Transition } from '@headlessui/react';
import React, { Fragment } from 'react'

export default function AttendanceModal({ setOpenModal, openModal, fetchAttendanceData }: { setOpenModal: (open: boolean) => void, openModal: boolean, fetchAttendanceData?: (value: string) => void }) {


    return (
        <Transition appear show={openModal} as={Fragment}>
            <Dialog as="div" open={openModal} onClose={() => setOpenModal(false)}>
                <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
                    <div className="fixed inset-0" />
                </Transition.Child>
                <div className="fixed inset-0 z-[999] bg-[black]/60">
                    <div className="flex min-h-screen items-start justify-center px-4">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="panel w-1/2 max-w-5xl overflow-hidden rounded-lg border-0 p-0 text-black dark:text-white-dark">
                                <CreateAttendanceForm
                                    onCancel={() => setOpenModal(false)}
                                    onSuccess={() => {
                                        setOpenModal(false); // ✅ cierra el modal al guardar
                                        fetchAttendanceData?.(''); // ✅ refresca
                                    }}
                                />
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    )
}
