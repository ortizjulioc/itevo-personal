'use client';
import PrintInvoice from '@/components/common/print/invoice';
import { Button, Input, Select } from '@/components/ui';
import { NCF_TYPES } from '@/constants/ncfType.constant';
import { formatCurrency } from '@/utils';
import { Dialog, Transition } from '@headlessui/react';
import { Invoice, NcfType } from '@prisma/client';
import { Fragment, useState } from 'react';
import { TbCancel, TbCheck } from 'react-icons/tb';
import { StylesConfig } from 'react-select';
import PrintInvoiceMpdal from '../print-invoice';

type OptionType = {
    value: string;
    label: string;
};

const customStyles: StylesConfig<OptionType, false> = {
    menuPortal: (base) => ({
        ...base,
        zIndex: 9999,
    }),
};

interface CustomModalProps {
    openModal: boolean;
    setOpenModal: (value: boolean) => void;
    Invoice: Invoice | null;
    setInvoice: (value: Invoice | null) => void;
    handleSubmit: () => void;
    paymentLoading: boolean;
}

type CreditCardDetails = {
    verifone: string;
    type: string;
    reference: string;
};

type BankTransferDetails = {
    TransferNumber?: string; // Solo si es transferencia bancaria
    bankName: string;

};

type CheckDetails = {
    TransferNumber?: string;
    bankName: string;
};

export default function PayInvoice({
    openModal,
    setOpenModal,
    Invoice,
    setInvoice,
    handleSubmit,
    paymentLoading
}: CustomModalProps) {
    if (!Invoice) return null;

    const [openPrintModal, setOpenPrintModal] = useState(false);

    const handleDetailsChange = (key: string, value: string) => {
        const currentDetails = (Invoice.paymentDetails || {}) as Record<string, any>;

        setInvoice({
            ...Invoice,
            paymentDetails: {
                ...currentDetails,
                [key]: value,
            },
        });
    };

    const handlePaymentMethodChange = (option: any) => {
        if (!Invoice) return;

        const isCash = option?.value === 'cash';
        const total = (Invoice.subtotal ?? 0) + (Invoice.itbis ?? 0);

        setInvoice({
            ...Invoice,
            paymentMethod: option?.value || '',
            paymentDetails: {
                ...(isCash ? {} : { receivedAmount: total.toFixed(2) }),
            },
        });
    };


    const renderAmountInput = () => {
        return (
            <div className="mt-4">
                <Input
                    className="Input"
                    placeholder="Monto recibido"
                    type="number"
                    min="0"
                    value={(Invoice.paymentDetails as any)?.receivedAmount || ''}
                    onChange={(e) => handleDetailsChange('receivedAmount', e.target.value)}
                    disabled={Invoice.paymentMethod !== 'cash'} // 👈 opcional para bloquear edición
                />

            </div>
        );
    };

    const renderPaymentDetails = () => {
        switch (Invoice.paymentMethod) {
            case 'credit_card': {
                const creditDetails = Invoice.paymentDetails as CreditCardDetails;
                return (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                            <Input
                                className="Input"
                                placeholder="Verifone"
                                value={creditDetails.verifone || ''}
                                onChange={(e) => handleDetailsChange('verifone', e.target.value)}
                            />
                            <Input
                                className="Input"
                                placeholder="Tipo de tarjeta"
                                value={creditDetails.type || ''}
                                onChange={(e) => handleDetailsChange('type', e.target.value)}
                            />
                            <Input
                                className="Input"
                                placeholder="Referencia"
                                value={creditDetails.reference || ''}
                                onChange={(e) => handleDetailsChange('reference', e.target.value)}
                            />
                        </div>
                        {renderAmountInput()}
                    </>
                );
            }
            case 'bank_transfer': {
                const bankDetails = Invoice.paymentDetails as BankTransferDetails;
                return (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                            <Input
                                className="Input"
                                placeholder="Banco"
                                value={bankDetails.bankName || ''}
                                onChange={(e) => handleDetailsChange('bankName', e.target.value)}
                            />
                            <Input
                                className="Input"
                                placeholder="Número de transferencia"
                                value={bankDetails.TransferNumber || ''}
                                onChange={(e) => handleDetailsChange('TransferNumber', e.target.value)}
                            />
                        </div>
                        {renderAmountInput()}
                    </>
                );
            }
            case 'check': {
                const checkDetails = Invoice.paymentDetails as CheckDetails;
                return (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                            <Input
                                className="Input"
                                placeholder="Nombre del banco"
                                value={checkDetails.bankName || ''}
                                onChange={(e) => handleDetailsChange('bankName', e.target.value)}
                            />
                            <Input
                                className="Input"
                                placeholder="Número de cheque"
                                value={checkDetails.TransferNumber || ''}
                                onChange={(e) => handleDetailsChange('TransferNumber', e.target.value)}
                            />

                        </div>
                        {renderAmountInput()}
                    </>
                );
            }
            case 'cash': {
                return renderAmountInput();
            }
            default:
                return null;
        }
    };

    const NCF_TYPES_OPTIONS = [
        { value: NCF_TYPES.FACTURA_CONSUMO.code, label: NCF_TYPES.FACTURA_CONSUMO.label },
        { value: NCF_TYPES.FACTURA_CREDITO_FISCAL.code, label: NCF_TYPES.FACTURA_CREDITO_FISCAL.label },
        { value: NCF_TYPES.GUBERNAMENTAL.code, label: NCF_TYPES.GUBERNAMENTAL.label },
        { value: NCF_TYPES.REGIMENES_ESPECIALES.code, label: NCF_TYPES.REGIMENES_ESPECIALES.label },
    ]
    const PAYMENT_METHODS_OPTIONS = [
        { value: 'cash', label: 'Efectivo' },
        { value: 'credit_card', label: 'Tarjeta de crédito' },
        { value: 'bank_transfer', label: 'Transferencia bancaria' },
        { value: 'check', label: 'Cheque' },
    ];

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
                            <Dialog.Panel className="panel border-0 p-0 rounded-lg overflow-visible w-full max-w-5xl my-8 text-black dark:text-white-dark">
                                <div className="p-5">
                                    <div className="grid grid-cols-12 gap-4">
                                        {/* <div className="col-span-12 md:col-span-4">
                                           
                                            {/* {Invoice?.type !== NCF_TYPES.FACTURA_CONSUMO.code && (
                                                <Input
                                                    className="Input mt-4"
                                                    placeholder="RNC del cliente"
                                                    value={(Invoice?.paymentDetails as Record<string, any>)?.customerRnc || ''}
                                                    onChange={(e) => setInvoice({
                                                        ...Invoice,
                                                        paymentDetails: {
                                                            ...((Invoice.paymentDetails && typeof Invoice.paymentDetails === 'object') ? Invoice.paymentDetails : {}),
                                                            customerRnc: e.target.value,
                                                        },
                                                    })}
                                                />
                                            
                                        </div>  */}
                                        <div className="col-span-12 ">
                                            <span className="text-lg font-bold">Datos de pago</span>
                                            <Select
                                                options={PAYMENT_METHODS_OPTIONS}
                                                value={PAYMENT_METHODS_OPTIONS.find((paymentMethod) => paymentMethod.value === Invoice?.paymentMethod)}
                                                onChange={handlePaymentMethodChange}
                                                isSearchable={false}
                                                placeholder="Selecciona un método de pago"
                                            //styles={customStyles}

                                            />
                                            {renderPaymentDetails()}
                                        </div>
                                    </div>
                                    <div className="mt-6 grid grid-cols-1 md:grid-cols-5 lg:grid-cols-5 gap-4 text-lg">
                                        <div className="flex flex-col items-center text-center">
                                            <span className="block text-gray-500 dark:text-gray-400">Subtotal</span>
                                            <span className="font-semibold">
                                                {formatCurrency(Invoice.subtotal ?? 0)}
                                            </span>
                                        </div>
                                        <div className="flex flex-col items-center text-center">
                                            <span className="block text-gray-500 dark:text-gray-400">ITBIS</span>
                                            <span className="font-semibold">
                                                {formatCurrency(Invoice.itbis ?? 0)}
                                            </span>
                                        </div>
                                        <div className="flex flex-col items-center text-center bg-blue-50 dark:bg-blue-900/30 p-2 rounded-lg">
                                            <span className="block  font-bold">Total</span>
                                            <span className="font-bold">
                                                {formatCurrency((Invoice.subtotal ?? 0) + (Invoice.itbis ?? 0))}
                                            </span>
                                        </div>
                                        <div className="flex flex-col items-center text-center">
                                            <span className="block text-gray-500 dark:text-gray-400">Recibido</span>
                                            <span className="font-semibold">
                                                {formatCurrency((Invoice.paymentDetails as any)?.receivedAmount || 0)}
                                            </span>
                                        </div>
                                        <div className="flex flex-col items-center text-center">
                                            <span className="block text-gray-500 dark:text-gray-400">Devuelta</span>
                                            <span className="font-semibold">
                                                {formatCurrency(
                                                    Math.max(
                                                        parseFloat((Invoice.paymentDetails as any)?.receivedAmount || 0) -
                                                        ((Invoice?.subtotal ?? 0) + (Invoice?.itbis ?? 0)),
                                                        0
                                                    )
                                                )}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex justify-end items-center gap-4 mt-8">
                                        <Button type="button" color="danger" onClick={() => (setOpenModal(false))} className="w-full md:w-auto">
                                            <TbCancel className='mr-1 size-6' />
                                            Cancelar
                                        </Button>
                                        <Button type="button" onClick={ async () => {
                                            await handleSubmit(); 
                                            setOpenPrintModal(true);
                                            setOpenModal(false)
                                        }

                                        } className="w-full md:w-auto" loading={paymentLoading}>
                                            <TbCheck className='mr-1 size-6' />
                                            Pagar
                                        </Button>
                                    </div>
                                    
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}
