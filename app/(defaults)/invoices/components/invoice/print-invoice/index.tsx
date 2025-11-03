import PrintInvoice from '@/components/common/print/invoice';
import { Button } from '@/components/ui';
import { formatCurrency } from '@/utils';
import { Dialog, Transition } from '@headlessui/react';
import { useParams, useRouter } from 'next/navigation';
import React, { Fragment } from 'react'
import { TbCheck } from 'react-icons/tb';

export default function PrintInvoiceModal(
    {
        invoiceId,
        isCredit,
        returnedInvoice,
        openModal,
        setOpenModal
    }: {
        invoiceId: string;
        isCredit: boolean;
        returnedInvoice?: number;
        openModal: boolean;
        setOpenModal: (open: boolean) => void;
    }
) {
    const router = useRouter();

    const params = useParams();
    const cashRegisterId = params.id;
    const [loading, setLoading] = React.useState(false);


    return (
        <Transition appear show={openModal} as={Fragment}>
            <Dialog as="div" open={openModal} onClose={() => { }}>
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
                            <Dialog.Panel className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-lg mx-auto mt-20 p-6 text-center space-y-6">
                                <Dialog.Title className="text-2xl font-semibold text-gray-900 dark:text-white">
                                    {isCredit ? 'Factura completada con Éxito' : 'Factura pagada con Éxito'}
                                </Dialog.Title>
                                { !isCredit && returnedInvoice !== undefined && (
                                    <p className="text-xl text-gray-600 dark:text-gray-300">
                                        La devuelta es de: <strong>{formatCurrency(returnedInvoice)}</strong>
                                    </p>
                                )}
                                <div className="flex justify-center gap-4">

                                    <PrintInvoice invoiceId={invoiceId} />
                                    <Button
                                        type="button"
                                        onClick={() => {
                                            setLoading(true);
                                            router.push(`/invoices/${cashRegisterId}`);
                                        }}
                                        loading={loading}
                                        className="flex items-center gap-1 px-4 py-2 rounded-md bg-success text-white shadow hover:bg-success-dark"
                                    >
                                        <TbCheck className="size-5" />
                                        Continuar
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

