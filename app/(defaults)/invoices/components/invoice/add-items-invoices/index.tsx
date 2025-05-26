'use client';
import { Button, Input } from '@/components/ui';
import { useRouter } from 'next/navigation';
import { confirmDialog, formatCurrency, openNotification } from '@/utils';
import type { Invoice, InvoiceItem } from '@prisma/client';
import { addItemsInvoice, payInvoice, removeItemsInvoice } from '@/app/(defaults)/invoices/lib/invoice/invoice-request';
import { useRef, useState } from 'react';
import SelectProduct, { ProductSelect } from '@/components/common/selects/select-product';
import { IvoicebyId, useFetchItemInvoices } from '../../../lib/invoice/use-fetch-cash-invoices';
import { TbCancel, TbCheck, TbPrinter, TbX } from 'react-icons/tb';
import ProductLabel from '@/components/common/info-labels/product-label';
import PayInvoice from '../pay-invoice';
import { parse } from 'path';




export default function AddItemsInvoices({
    InvoiceId,
    Invoice,
    fetchInvoiceData,
    setInvoice,
    cashRegisterId,
}: {
    InvoiceId: string;
    Invoice: IvoicebyId;
    fetchInvoiceData: (id: string) => Promise<void>;
    setInvoice: any,
    cashRegisterId: string;
}) {
    const quantityRef = useRef<HTMLInputElement>(null);
    const productRef = useRef<HTMLSelectElement>(null);
    const route = useRouter();
    const [item, setItem] = useState<InvoiceItem | null>(null);
    const [itemLoading, setItemloading] = useState(false)
    const [paymentLoading, setPaymentLoading] = useState(false)
    const [openModal, setOpenModal] = useState(false)

    const onSelectProduct = (selected: ProductSelect | null) => {
        if (!selected) return;
        setItem((prev) => ({
            ...prev!,
            productId: selected.value,
            unitPrice: selected.price,

        }));

        console.log('quantityRef', quantityRef.current);
        if (quantityRef.current) {
            setItem((prev) => ({
                ...prev!,
                quantity: 1,
            }));
            quantityRef.current.select();
            quantityRef.current.focus();
        }
    }


    const handleSubmit = async () => {
        if (!Invoice) {
            openNotification('error', 'No hay información de la factura');
            return;
        }
        setPaymentLoading(true);
        const resp = await payInvoice(InvoiceId, Invoice);

        if (resp.success) {
            openNotification("success", "Factura pagada correctamente");
            route.push(`/invoices/${cashRegisterId}`);

        } else {
            openNotification("error", resp.message);
            console.log(resp);
        }
        setPaymentLoading(false);
    }
    const handleAddItem = async () => {
        setItemloading(true);
        if (!item?.productId || !item?.quantity) {
            openNotification('error', 'datos faltantes');
            setItemloading(false);
            return;
        }
        const itemWithType = {
            ...item,
            type: 'PRODUCT' as const,
        };
        const resp = await addItemsInvoice(InvoiceId, itemWithType);

        if (resp.success) {
            openNotification('success', 'Producto agregado correctamente');
            setItem(null);
            await fetchInvoiceData(InvoiceId); // ✅ recargar la data actualizada
            if (productRef.current) {
                productRef.current.focus();
            }
        } else {
            openNotification('error', resp.message);
            console.log(resp.message);
        }
        setItemloading(false);
    };

    const handleDeteleItem = async (itemId: string) => {
        setItemloading(true);
        confirmDialog({
            title: 'Eliminar producto',
            text: '¿Seguro que quieres eliminar este producto?',
            confirmButtonText: 'Sí, eliminar',
            icon: 'error',
        }, async () => {
            console.log('item', itemId);
            console.log('factura', InvoiceId);
            const resp = await removeItemsInvoice(InvoiceId, itemId);
            if (resp.success) {
                openNotification('success', 'Producto eliminado correctamente');
                await fetchInvoiceData(InvoiceId); // ✅ recargar la data actualizada
                return;
            }
            openNotification('error', resp.message);
        });

        setItemloading(false);
    }


    return (
        <div className="panel p-4">
            <div className="mb-4 grid grid-cols-1 md:grid-cols-12 gap-4">
                <div className="md:col-span-9 col-span-12">
                    <div className="flex flex-col md:flex-row items-stretch gap-4">
                        <div className="flex-1">
                            <SelectProduct
                                ref={productRef}
                                value={item?.productId ?? undefined}
                                onChange={onSelectProduct}
                                disabled={itemLoading}
                            />
                        </div>
                        <div className="w-full md:w-1/4">
                            <Input
                                ref={quantityRef}
                                placeholder="Cantidad"
                                type="number"
                                value={item?.quantity ?? ''}
                                disabled={itemLoading}
                                onChange={(e) => {
                                    setItem((prev) => ({
                                        ...prev!,
                                        quantity: Number(e.target.value),
                                    }));
                                }}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault(); // evita que el form haga submit
                                        handleAddItem();    // agrega el producto si los datos están listos
                                    }
                                }}
                            />
                        </div>
                    </div>

                    <div className="overflow-x-auto mt-4">
                        <table className="min-w-full table-auto">
                            <thead>
                                <tr className="bg-gray-100 dark:bg-gray-700 text-sm">
                                    <th className="text-left px-2 py-2">DESCRIPCION</th>
                                    <th className="text-left px-2 py-2">CANTIDAD</th>
                                    <th className="text-left px-2 py-2">PRECIO</th>
                                    <th className="text-left px-2 py-2">SUBTOTAL</th>
                                    <th className="text-left px-2 py-2">ITBS</th>
                                    <th className="text-left px-2 py-2">TOTAL</th>
                                    <th className="px-2 py-2"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {Invoice?.items?.length === 0 && (
                                    <tr>
                                        <td colSpan={7} className="text-center text-gray-500 dark:text-gray-400 italic py-4">
                                            No se encontraron productos registrados
                                        </td>
                                    </tr>
                                )}
                                {Invoice?.items?.map((item) => (
                                    <tr key={item.id} className="border-t text-sm">
                                        <td className="px-2 py-2">
                                            <ProductLabel
                                                ProductId={item.productId}
                                            />

                                        </td>
                                        <td className="px-2 py-2">{item.quantity}</td>
                                        <td className="px-2 py-2">{formatCurrency(item.unitPrice || 0)}</td>
                                        <td className="px-2 py-2">{formatCurrency(item.subtotal)}</td>
                                        <td className="px-2 py-2">{formatCurrency(item.itbis)}</td>
                                        <td className="px-2 py-2">{formatCurrency((item.subtotal + item.itbis) || 0)}</td>
                                        <td className="px-2 py-2">
                                            <Button
                                                variant="outline"
                                                color="danger"
                                                size="sm"
                                                onClick={() => { handleDeteleItem(item.id) }}
                                            >
                                                <TbX className='size-4' />
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="md:col-span-3 col-span-12 space-y-2">
                    <div className="flex justify-between text-sm">
                        <span className="font-medium text-gray-600 dark:text-gray-300">Subtotal:</span>
                        <span className="text-right">{Invoice?.subtotal?.toFixed(2) ?? '0.00'}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="font-medium text-gray-600 dark:text-gray-300">ITBS:</span>
                        <span className="text-right">{Invoice?.itbis?.toFixed(2) ?? '0.00'}</span>
                    </div>
                    <div className="flex justify-between text-sm font-semibold border-t pt-2">
                        <span className="text-gray-800 dark:text-gray-100">Total:</span>
                        <span className="text-right"
                        >
                            {((Invoice?.subtotal ?? 0) + (Invoice?.itbis ?? 0)).toFixed(2)}
                        </span>
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
                <Button type="button" color="success" onClick={() => (setOpenModal(true))} className="w-full md:w-auto">
                    <TbCheck className='mr-1 size-6' />
                    Completar
                </Button>
            </div>
            <PayInvoice
                openModal={openModal}
                setOpenModal={setOpenModal}
                Invoice={Invoice}
                setInvoice={setInvoice}
                handleSubmit={handleSubmit}
                paymentLoading={paymentLoading}

            />
        </div>
    );
}
