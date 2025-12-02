'use client';
import Drawer from '@/components/ui/drawer';
import React, { useState } from 'react';
import useFetchCashMovements from '@/app/(defaults)/cash-registers/lib/use-fetch-cash-movements';
import { Tab } from '@headlessui/react';
import { formatCurrency } from '@/utils';
import { getFormattedDateTime } from '@/utils/date';
import { Button } from '@/components/ui';
import Link from 'next/link';
import PrintExpense from '@/components/common/print/expense';
import PrintInvoice from '@/components/common/print/invoice';
import { HiOutlineEye } from 'react-icons/hi';

interface CashMovementsDrawerProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    cashRegisterId: string;
}

export default function CashMovementsDrawer({ open, setOpen, cashRegisterId }: CashMovementsDrawerProps) {
    const { cashMovements, loading } = useFetchCashMovements(cashRegisterId);
    const [filter, setFilter] = useState<'ALL' | 'INCOME' | 'EXPENSE'>('ALL');

    const filteredMovements = cashMovements.filter(m => {
        if (filter === 'ALL') return true;
        return m.type === filter;
    });

    const categories = ['Todos', 'Ingresos', 'Egresos'];

    return (
        <Drawer
            open={open}
            onClose={() => setOpen(false)}
            title="Movimientos de Caja"
            className="w-full max-w-2xl"
        >
            <div className="flex flex-col h-full">
                <div className="mb-4">
                    <Tab.Group onChange={(index) => {
                        const filters: ('ALL' | 'INCOME' | 'EXPENSE')[] = ['ALL', 'INCOME', 'EXPENSE'];
                        setFilter(filters[index]);
                    }}>
                        <Tab.List className="flex space-x-1 rounded-xl bg-blue-900/20 p-1">
                            {categories.map((category) => (
                                <Tab
                                    key={category}
                                    className={({ selected }) =>
                                        `w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-blue-700 ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2
                                        ${selected
                                            ? 'bg-white shadow'
                                            : 'text-blue-100 hover:bg-white/[0.12] hover:text-white'
                                        }`
                                    }
                                >
                                    {category}
                                </Tab>
                            ))}
                        </Tab.List>
                    </Tab.Group>
                </div>

                <div className="flex-1 overflow-y-auto pr-2">
                    {loading ? (
                        <div className="flex justify-center items-center h-40">
                            <span className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                        </div>
                    ) : filteredMovements.length === 0 ? (
                        <div className="text-center py-10 text-gray-500">
                            No hay movimientos registrados.
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {filteredMovements.map((movement) => (
                                <div key={movement.id} className="border rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <span className={`text-xs font-bold px-2 py-1 rounded ${movement.type === 'INCOME' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                {movement.type === 'INCOME' ? 'Ingreso' : 'Egreso'}
                                            </span>
                                            <h4 className="font-semibold mt-2">{movement.description || 'Sin descripción'}</h4>
                                            <p className="text-sm text-gray-500">
                                                {getFormattedDateTime(new Date(movement.createdAt), { hour12: true })}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className={`font-bold text-lg ${movement.type === 'INCOME' ? 'text-green-600' : 'text-red-600'}`}>
                                                {formatCurrency(movement.amount)}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {movement.user?.name}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex justify-end gap-2 mt-4 pt-2 border-t border-gray-100 dark:border-gray-700">
                                        {/* Ver Detalle */}
                                        {movement.referenceType === 'INVOICE' && movement.referenceId ? (
                                            <Link href={`/bills/${movement.referenceId}`} target="_blank">
                                                <Button size="sm" variant="outline" className="gap-1">
                                                    <HiOutlineEye /> Detalle
                                                </Button>
                                            </Link>
                                        ) : (
                                            <Link href={`/cash-registers/${cashRegisterId}/expenses/${movement.id}`} target="_blank">
                                                <Button size="sm" variant="outline" className="gap-1">
                                                    <HiOutlineEye /> Detalle
                                                </Button>
                                            </Link>
                                        )}

                                        {/* Reimprimir */}
                                        {movement.referenceType === 'INVOICE' && movement.referenceId ? (
                                            <PrintInvoice invoiceId={movement.referenceId} />
                                        ) : (
                                            <PrintExpense cashMovement={movement} />
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </Drawer>
    );
}
