import CreateCourseForm from '@/app/(defaults)/courses/components/course-form/create-form'
import { Dialog, Transition } from '@headlessui/react'
import { set } from 'lodash';

import React, { Fragment } from 'react'
interface Props {
    modal: boolean;
    setModal: (modal: boolean) => void;
    setFieldValue: (name: string, value: any) => void;
}

export default function ModalCreateCourse(
    {
        modal,
        setModal,
        setFieldValue,
    }: Props
) {

    const onClose = async (id: string) => {
        setFieldValue('courseId', id);
        setModal(false);
    };
    return (
        <div className="mb-5">
            <Transition appear show={modal} as={Fragment}>
                <Dialog as="div" open={modal} onClose={() => setModal(false)}>
                    <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
                        <div className="fixed inset-0" />
                    </Transition.Child>
                    <div className="fixed inset-0 z-[999] overflow-y-auto bg-[black]/60">
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
                                <Dialog.Panel as="div" className="mt-10 h-auto w-1/2 overflow-y-auto  p-6 text-black dark:bg-[#1E1E2D] dark:text-white">
                                    <div className="min-w-full">
                                        <CreateCourseForm onClose={onClose} />
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </div>
    );
}
