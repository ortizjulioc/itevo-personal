import { Button, Input } from '@/components/ui'
import { Dialog, Transition } from '@headlessui/react'
import React, { Fragment, useState } from 'react'

const billsList: Record<string, number> = {
    twoThousand: 2000,
    oneThousand: 1000,
    fiveHundred: 500,
    twoHundred: 200,
    oneHundred: 100,
    fifty: 50,
    twentyfive: 25,
    ten: 10,
    five: 5,
    one: 1,
};
export default function CashRegisterClose({ setOpenModal, openModal }: { setOpenModal: (open: boolean) => void, openModal: boolean }) {

    const [bills, setBills] = useState({
        twoThousand: { quantity: 0, total: 0 },
        oneThousand: { quantity: 0, total: 0 },
        fiveHundred: { quantity: 0, total: 0 },
        twoHundred: { quantity: 0, total: 0 },
        oneHundred: { quantity: 0, total: 0 },
        fifty: { quantity: 0, total: 0 },
        twentyfive: { quantity: 0, total: 0 },
        ten: { quantity: 0, total: 0 },
        five: { quantity: 0, total: 0 },
        one: { quantity: 0, total: 0 },
    });

const totalGeneral = Object.values(bills).reduce((acc, curr) => acc + curr.total, 0);

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
                <div className="fixed inset-0 bg-[black]/60 z-[999]">
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
                            <Dialog.Panel className="panel border-0 p-0 rounded-lg overflow-hidden w-full max-w-5xl my-8 text-black dark:text-white-dark">
                                <div className="flex bg-[#fbfbfb] dark:bg-[#121c2c] items-center justify-between px-5 py-3">
                                    <h5 className="font-bold text-lg">Desgloce de efectivo</h5>
                                </div>
                                <div className="p-5">
                                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                                        {Object.entries(bills).map(([key, { quantity, total }]) => (
                                            <div key={key} className="mb-5">
                                                <div className="flex ">
                                                    {/* Denominación */}
                                                    <div className="bg-[#eee] flex justify-center items-center ltr:rounded-l-md rtl:rounded-r-md px-3 font-semibold border ltr:border-r-0 rtl:border-l-0 border-white-light dark:border-[#17263c] dark:bg-[#1b2e4b] min-w-[100px]">
                                                        RD${billsList[key as keyof typeof billsList]}
                                                    </div>


                                                    <Input
                                                        type="number"
                                                        placeholder="Cantidad"
                                                        value={quantity === 0 ? '' : quantity}
                                                        onChange={(e) => {
                                                            const qty = parseInt(e.target.value) || 0;
                                                            const denomination = billsList[key as keyof typeof billsList];
                                                            setBills((prev) => ({
                                                                ...prev,
                                                                [key]: {
                                                                    quantity: qty,
                                                                    total: qty * denomination,
                                                                },
                                                            }));
                                                        }}
                                                    />

                                                    {/* Total por denominación */}
                                                    <div className="text-sm text-gray-700 dark:text-gray-300 ml-4">
                                                        Total: RD${total.toLocaleString()}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}


                                    </div>
                                    <div className="flex justify-end mt-8">
                                        <div className="text-lg font-semibold px-4 py-2  ">
                                            Total general: RD${totalGeneral.toLocaleString()}
                                        </div>
                                    </div>
                                    <div className="flex justify-end items-center mt-8 gap-3">
                                        <Button onClick={() => setOpenModal(false)} variant='outline' color='danger' >
                                            Cancelar
                                        </Button>
                                        <Button onClick={() => setOpenModal(false)} variant='default' >
                                            Cerrar Caja
                                        </Button>
                                    </div>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    )
}
