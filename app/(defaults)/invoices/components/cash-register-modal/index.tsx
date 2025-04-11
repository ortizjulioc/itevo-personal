'use client';

import { IconPlusCircle } from '@/components/icon';
import { Button } from '@/components/ui';
import { Dialog, Transition, Tab } from '@headlessui/react';
import { useState, Fragment, useEffect, use } from 'react';
import CreateCashRegisterForm from '../cash-register-form/create-form';



export default  function CashRegisterModal() {
    const [modal1, setModal1] = useState(false);


    return (
        <>
            <Button
                icon={<IconPlusCircle />}
                onClick={() => setModal1(true)}
            >
                Empezar a Facturar
            </Button>

            <Transition appear show={modal1} as={Fragment}>
                <Dialog as="div" open={modal1} onClose={() => setModal1(false)}>
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
                                    <CreateCashRegisterForm />
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </>

    )
}
