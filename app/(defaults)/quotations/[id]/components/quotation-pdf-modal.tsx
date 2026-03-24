import React, { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Button } from '@/components/ui';
import PrintQuotation from '@/components/common/print/quotation';
import { TbCheck } from 'react-icons/tb';

export default function QuotationPDFModal({
    quotation,
    openModal,
    setOpenModal
}: {
    quotation: any;
    openModal: boolean;
    setOpenModal: (open: boolean) => void;
}) {
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
                    <div className="fixed inset-0 bg-black/60 z-[999]" />
                </Transition.Child>
                <div className="fixed inset-0 z-[999]">
                    <div className="flex items-center justify-center min-h-screen px-4">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-md mx-auto p-6 text-center space-y-6">
                                <Dialog.Title className="text-xl font-semibold text-gray-900 dark:text-white">
                                    Opciones de Impresión
                                </Dialog.Title>
                                
                                <p className="text-gray-600 dark:text-gray-300">
                                    Puedes proceder a imprimir la cotización o cerrar este diálogo.
                                </p>

                                <div className="flex justify-center gap-4">
                                    <PrintQuotation quotation={quotation} />
                                    <Button
                                        type="button"
                                        onClick={() => setOpenModal(false)}
                                        className="flex items-center gap-1"
                                        color="dark"
                                        variant="outline"
                                    >
                                        <TbCheck className="size-5" />
                                        Cerrar
                                    </Button>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    )
}
