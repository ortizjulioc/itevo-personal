'use client';
import { Button, Input } from '@/components/ui';
import { useRouter } from 'next/navigation';
import { openNotification } from '@/utils';
import type { Invoice, InvoiceItem } from '@prisma/client';
import { payInvoice } from '@/app/(defaults)/invoices/lib/invoice/invoice-request';
import { useState } from 'react';
import SelectProduct from '@/components/common/selects/select-product';
import { useFetchItemInvoices } from '../../../lib/invoice/use-fetch-cash-invoices';
import { TbCancel, TbCheck, TbPrinter } from 'react-icons/tb';

export default function AddItemsInvoices({ InvoiceId, Invoice }: { InvoiceId: string, Invoice: Invoice | null }) {
    const route = useRouter();
    const [item, setItem] = useState<InvoiceItem | null>(null);
    const { loading, items } = useFetchItemInvoices(InvoiceId);

    const handleSubmit = async () => {
        if (!Invoice) {
            openNotification('error', 'No hay información de la factura');
            return;
        }

        const resp = await payInvoice(InvoiceId, Invoice);

        if (resp.success) {
            route.push('/Invoicess');
        } else {
            openNotification("error", resp.message);
        }
    }

    return (
        <div className="panel p-4">
            <div className="mb-4 grid grid-cols-1 md:grid-cols-12 gap-4">
                <div className="md:col-span-8 col-span-12">
                    <div className="flex flex-col md:flex-row items-stretch gap-4">
                        <div className="flex-1">
                            <SelectProduct
                                value={item?.productId ?? undefined}
                                onChange={(selected) => {
                                    setItem((prev) => ({
                                        ...prev!,
                                        productId: selected?.value ?? null,
                                    }));
                                }}
                            />
                        </div>
                        <div className="w-full md:w-1/4">
                            <Input
                                placeholder="Cantidad"
                                type="number"
                                value={item?.quantity ?? ''}
                                onChange={(e) => {
                                    setItem((prev) => ({
                                        ...prev!,
                                        quantity: Number(e.target.value),
                                    }));
                                }}
                            />
                        </div>
                    </div>

                    <div className="overflow-x-auto mt-4">
                        <table className="min-w-full table-auto">
                            <thead>
                                <tr className="bg-gray-100 dark:bg-gray-700 text-sm">
                                    <th className="text-left px-2 py-2">PRODUCTO</th>
                                    <th className="text-left px-2 py-2">CANTIDAD</th>
                                    <th className="text-left px-2 py-2">PRECIO UNITARIO</th>
                                    <th className="text-left px-2 py-2">COSTO</th>
                                    <th className="text-left px-2 py-2">SUBTOTAL</th>
                                    <th className="text-left px-2 py-2">ITBS</th>
                                    <th className="px-2 py-2"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {items?.length === 0 && (
                                    <tr>
                                        <td colSpan={7} className="text-center text-gray-500 dark:text-gray-400 italic py-4">
                                            No se encontraron productos registrados
                                        </td>
                                    </tr>
                                )}
                                {items?.map((item) => (
                                    <tr key={item.id} className="border-t text-sm">
                                        <td className="px-2 py-2">{item.productId}</td>
                                        <td className="px-2 py-2">{item.quantity}</td>
                                        <td className="px-2 py-2">{item.unitPrice}</td>
                                        <td className="px-2 py-2">{item.subtotal}</td>
                                        <td className="px-2 py-2">{item.itbis}</td>
                                        <td className="px-2 py-2"></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <div className="mt-6 flex flex-col md:flex-row justify-end gap-2">
                <Button type="button" color="danger" onClick={() => route.back()} className="w-full md:w-auto">
                    <TbCancel className='mr-1 size-6' />
                    Cancelar
                </Button>
                <Button type="button" color="primary" onClick={() => route.push('/invoices')} className="w-full md:w-auto">
                    <TbPrinter className='mr-1 size-6' />
                    Imprimir
                </Button>
                <Button type="button" color="success" onClick={handleSubmit} className="w-full md:w-auto">
                    <TbCheck className='mr-1 size-6' />
                    Completar
                </Button>
            </div>
        </div>
    );
}
