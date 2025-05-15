'use client';
import { Button, Input, Select } from '@/components/ui';
import { NCF_TYPES } from '@/constants/ncfType.constant';
import { Dialog, Transition } from '@headlessui/react';
import { Invoice, NcfType } from '@prisma/client';
import { Fragment } from 'react';
import { TbCancel, TbCheck } from 'react-icons/tb';
import { StylesConfig } from 'react-select';

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
    cardHolderName: string;
    cardNumber: string;
};

type BankTransferDetails = {
    bankName: string;
    accountNumber: string;
};

type CheckDetails = {
    checkNumber: string;
    bankName: string;
};

export default function PayInvoice({ 
    openModal, 
    setOpenModal, 
    Invoice, 
    setInvoice,
    handleSubmit ,
    paymentLoading
}: CustomModalProps) {
    if (!Invoice) return null;


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

        setInvoice({
            ...Invoice,
            paymentMethod: option?.value || '',
            paymentDetails: {}, // Reiniciar detalles
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
                                placeholder="Nombre en la tarjeta"
                                value={creditDetails.cardHolderName || ''}
                                onChange={(e) => handleDetailsChange('cardHolderName', e.target.value)}
                            />
                            <Input
                                className="Input"
                                placeholder="Número de tarjeta"
                                value={creditDetails.cardNumber || ''}
                                onChange={(e) => handleDetailsChange('cardNumber', e.target.value)}
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
                                placeholder="Número de cuenta"
                                value={bankDetails.accountNumber || ''}
                                onChange={(e) => handleDetailsChange('accountNumber', e.target.value)}
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
                                placeholder="Número de cheque"
                                value={checkDetails.checkNumber || ''}
                                onChange={(e) => handleDetailsChange('checkNumber', e.target.value)}
                            />
                            <Input
                                className="Input"
                                placeholder="Nombre del banco"
                                value={checkDetails.bankName || ''}
                                onChange={(e) => handleDetailsChange('bankName', e.target.value)}
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

    const NCF_TYPES_OPTIONS = Object.values(NCF_TYPES).map((type) => ({
        value: type.code,
        label: type.label,
    }));

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
                                        <div className="col-span-6 md:col-span-4">
                                            <span className="text-lg font-bold">Datos de factura</span>
                                            <Select
                                                options={NCF_TYPES_OPTIONS}
                                                value={NCF_TYPES_OPTIONS.find((ncfType) => ncfType.value === Invoice?.type)}
                                                onChange={(option: { value: string; label: string } | null) => {
                                                    if (Invoice) {
                                                        setInvoice({
                                                            ...Invoice,
                                                            type: option?.value as NcfType || '',
                                                        });
                                                    }
                                                }}
                                                isSearchable={false}
                                                placeholder="Selecciona un tipo de comprobante"
                                                styles={customStyles}
                                            />
                                        </div>
                                        <div className="col-span-6 md:col-span-8">
                                            <span className="text-lg font-bold">Datos de pago</span>
                                            <Select
                                                options={PAYMENT_METHODS_OPTIONS}
                                                value={PAYMENT_METHODS_OPTIONS.find((paymentMethod) => paymentMethod.value === Invoice?.paymentMethod)}
                                                onChange={handlePaymentMethodChange}
                                                isSearchable={false}
                                                placeholder="Selecciona un método de pago"
                                                styles={customStyles}
                                            />
                                            {renderPaymentDetails()}
                                        </div>
                                    </div>
                                    <div className="mt-6 grid grid-cols-1 md:grid-cols-5 lg:grid-cols-5 gap-4 text-lg">
                                        <div>
                                            <span className="block text-gray-500 dark:text-gray-400">Subtotal</span>
                                            <span className="font-semibold">
                                                RD$ {Invoice.subtotal?.toFixed(2) || '0.00'}
                                            </span>
                                        </div>
                                        <div>
                                            <span className="block text-gray-500 dark:text-gray-400">ITBIS</span>
                                            <span className="font-semibold">
                                                RD$ {Invoice.itbis?.toFixed(2) || '0.00'}
                                            </span>
                                        </div>
                                        <div>
                                            <span className="block text-gray-500 dark:text-gray-400">Total</span>
                                            <span className="font-semibold">
                                                RD$ {((Invoice?.subtotal ?? 0) + (Invoice?.itbis ?? 0)).toFixed(2)}
                                            </span>
                                        </div>
                                        <div>
                                            <span className="block text-gray-500 dark:text-gray-400">Recibido</span>
                                            <span className="font-semibold">
                                                RD$ {parseFloat((Invoice.paymentDetails as any)?.receivedAmount || 0).toFixed(2)}
                                            </span>
                                        </div>
                                        <div>
                                            <span className="block text-gray-500 dark:text-gray-400">Devuelta</span>
                                            <span className="font-semibold">
                                                RD$ {Math.max(
                                                    parseFloat((Invoice.paymentDetails as any)?.receivedAmount || 0) -
                                                    ((Invoice?.subtotal ?? 0) + (Invoice?.itbis ?? 0)),
                                                    0
                                                ).toFixed(2)}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex justify-end items-center gap-4 mt-8">
                                        <Button type="button" color="danger" onClick={() => (setOpenModal(false))}  className="w-full md:w-auto">
                                            <TbCancel className='mr-1 size-6' />
                                            Cancelar
                                        </Button>
                                        <Button type="button" onClick={handleSubmit} className="w-full md:w-auto" loading={paymentLoading}>
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
