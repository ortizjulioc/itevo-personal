import CreateScheduleForm from '@/app/(defaults)/schedules/components/schedules-form/create-schedule'
import { Dialog, Transition } from '@headlessui/react'
import { set } from 'lodash'
import React, { Fragment } from 'react'
interface Props {
    modal: boolean
    setModal: (modal: boolean) => void
    fetchSchedulesData: any
    assignSchedule: (schedule: string) => void
}

export default function ModalCreateSchedule(
    {
        modal,
        setModal,
        fetchSchedulesData,
        assignSchedule
    }: Props
) {

    const onClose = async () => {

        await fetchSchedulesData('')
        setModal(false)

    }

    return (
        <div className="mb-5">
            <Transition appear show={modal} as={Fragment}>
                <Dialog as="div" open={modal} onClose={() => setModal(false)}>
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
                                <Dialog.Panel as="div" className="w-full sm:w-[90%] md:w-[70%] lg:w-1/2 h-auto mt-10  dark:bg-[#1E1E2D] text-black dark:text-white p-6 overflow-y-auto">
                                    <div className='min-w-full'>
                                        <CreateScheduleForm
                                            onClose={onClose}
                                            onCreated={(schedule) => assignSchedule(schedule.id)}
                                            layout="vertical" 
                                        />

                                    </div>

                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </div>
    )
}
