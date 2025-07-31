
import { Button, Input } from '@/components/ui';
import { Dialog, Transition, Tab } from '@headlessui/react';
import React, { Fragment, useState } from 'react';
import { closeCashRegister } from '../../lib/request-cash';
import { openNotification } from '@/utils';
import { useParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Branch } from '@prisma/client';


const billsList: Record<string, number> = {
    twoThousand: 2000,
    thousand: 1000,
    fiveHundred: 500,
    twoHundred: 200,
    hundred: 100,
    fifty: 50,
    twentyfive: 25,
    ten: 10,
    five: 5,
    one: 1,
};


export default function ModalCashRegisterClose({ setOpenModal, openModal }: { setOpenModal: (open: boolean) => void, openModal: boolean }) {
    const { id } = useParams()
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const cashRegisterId = Array.isArray(id) ? id[0] : id || '';

    const { data: session, status } = useSession();
    const user = session?.user as {
        id: string;
        name?: string | null;
        email?: string | null;
        username?: string;
        phone?: string;
        lastName?: string;
        roles?: any[];
        mainBranch: Branch;
        branches?: any[];
    };

    const [bills, setBills] = useState(
        Object.keys(billsList).reduce((acc, key) => {
            acc[key] = { quantity: 0, total: 0 };
            return acc;
        }, {} as Record<string, { quantity: number; total: number }>)
    );

    const [otherPayments, setOtherPayments] = useState({
        card: 0,
        transfers: 0,
        checks: 0
    });

    const totalGeneral = Object.values(bills).reduce((acc, curr) => acc + curr.total, 0);


    const handleCloseCashRegister = async () => {
        setLoading(true)

        const cashBreakdown = Object.entries(bills).reduce((acc, [key, value]) => {
            acc[key as keyof typeof billsList] = value.quantity;
            return acc;
        }, {} as Record<keyof typeof billsList, number>);
        
        const closureData = {
            cashBreakdown,
            userId: user.id,
            totalCash: totalGeneral,
            totalCard: otherPayments.card,
            totalCheck: otherPayments.checks,
            totalTransfer: otherPayments.transfers,
        };

        try {
            const resp = await closeCashRegister(cashRegisterId, closureData)


            if (resp.success) {
                openNotification("success", "caja cerrada con exito")
                router.push("/invoices")

            } else {
                setLoading(false)
            }
        } catch (error) {
            console.log(error)
            setLoading(false)
        }

    }

    return (
        <Transition appear show={openModal} as={Fragment}>
            <Dialog as="div" open={openModal} onClose={() => setOpenModal(false)}>
                <div className="fixed inset-0 bg-[black]/60 z-[999] overflow-y-auto">
                    <div className="flex items-start justify-center min-h-screen px-4 py-10">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="panel border-0 p-0 rounded-lg overflow-hidden w-full max-w-4xl text-black dark:text-white-dark">
                                <div className="flex bg-[#fbfbfb] dark:bg-[#121c2c] items-center justify-between px-5 py-3">
                                    <h5 className="font-bold text-lg">Cierre de caja</h5>
                                </div>
                                <div className="p-5">
                                    <Tab.Group>
                                        <Tab.List className="mt-3 flex flex-wrap border-b border-white-light dark:border-[#191e3a]">
                                            {['Desglose de Efectivo', 'Otros Pagos'].map((tab, idx) => (
                                                <Tab as={Fragment} key={idx}>
                                                    {({ selected }) => (
                                                        <button
                                                            className={`${selected ? '!border-white-light !border-b-white text-primary !outline-none dark:!border-[#191e3a] dark:!border-b-black' : ''} dark:hover:border-b-black -mb-[1px] block border border-transparent p-3.5 py-2 hover:text-primary`}
                                                        >
                                                            {tab}
                                                        </button>
                                                    )}
                                                </Tab>
                                            ))}
                                        </Tab.List>
                                        <Tab.Panels>
                                            <Tab.Panel>
                                                <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mt-5'>
                                                    {Object.entries(bills).map(([key, { quantity, total }]) => (
                                                        <div key={key} className="mb-5">
                                                            <div className="flex">
                                                                <div className="bg-[#eee] flex justify-center items-center ltr:rounded-l-md rtl:rounded-r-md px-3 font-semibold border ltr:border-r-0 rtl:border-l-0 border-white-light dark:border-[#17263c] dark:bg-[#1b2e4b] min-w-[100px]">
                                                                    RD${billsList[key as keyof typeof billsList]}
                                                                </div>
                                                                <Input
                                                                    type="number"
                                                                    onWheel={(e) => (e.target as HTMLInputElement).blur()}
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
                                                                <div className="text-sm text-gray-700 dark:text-gray-300 ml-4">
                                                                    Total: RD${total.toLocaleString()}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                                <div className="flex justify-end mt-8">
                                                    <div className="text-lg font-semibold px-4 py-2">
                                                        Total efectivo: RD${totalGeneral.toLocaleString()}
                                                    </div>
                                                </div>
                                            </Tab.Panel>
                                            <Tab.Panel>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
                                                    {['card', 'checks', 'transfers'].map((type) => (
                                                        <div key={type} className="flex items-center gap-3">
                                                            <label className="min-w-[120px] capitalize">
                                                                {type === 'card' ? 'Tarjeta' : type === 'checks' ? 'Cheques' : 'Transferencias'}:
                                                            </label>
                                                            <Input
                                                                type="number"
                                                                onWheel={(e) => (e.target as HTMLInputElement).blur()}
                                                                placeholder="RD$"
                                                                value={otherPayments[type as keyof typeof otherPayments] || ''}
                                                                onChange={(e) => {
                                                                    const value = parseFloat(e.target.value) || 0;
                                                                    setOtherPayments((prev) => ({ ...prev, [type]: value }));
                                                                }}
                                                            />
                                                        </div>
                                                    ))}
                                                </div>
                                            </Tab.Panel>
                                        </Tab.Panels>
                                    </Tab.Group>

                                    <div className="flex justify-end items-center mt-8 gap-3">
                                        <Button onClick={() => setOpenModal(false)} variant='outline' color='danger'>
                                            Cancelar
                                        </Button>
                                        <Button loading={loading} onClick={() => handleCloseCashRegister()} variant='default'>
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
    );
}
