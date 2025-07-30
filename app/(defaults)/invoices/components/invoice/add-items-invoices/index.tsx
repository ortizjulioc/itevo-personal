'use client';
import { Button, Input } from '@/components/ui';
import { useRouter } from 'next/navigation';
import { confirmDialog, formatCurrency, openNotification } from '@/utils';
import { InvoiceItemType, type AccountReceivable, type Invoice, type InvoiceItem } from '@prisma/client';
import { addItemsInvoice, cancelInvoice, payInvoice, removeItemsInvoice, updateInvoice } from '@/app/(defaults)/invoices/lib/invoice/invoice-request';
import { useEffect, useRef, useState } from 'react';
import SelectProduct, { ProductSelect } from '@/components/common/selects/select-product';
import { IvoicebyId, } from '../../../lib/invoice/use-fetch-cash-invoices';
import { TbCancel, TbCheck, TbX } from 'react-icons/tb';
import ProductLabel from '@/components/common/info-labels/product-label';
import PayInvoice from '../pay-invoice';
import PrintInvoiceModal from '../print-invoice';
import { Tab } from '@headlessui/react';
import { Fragment } from 'react';

import SelectStudent, { StudentSelect } from '@/components/common/selects/select-student';
import apiRequest from '@/utils/lib/api-request/request';
import AccountReceivableModal from '../account-receivable-modal';
import { useInvoice } from '../../../[id]/bill/[billid]/invoice-provider';
import { set } from 'lodash';

export interface AccountsReceivablesResponse {
    accountsReceivable: AccountReceivable[];
    totalAccountsReceivables: number;
}



export default function AddItemsInvoices({
    InvoiceId,
    fetchInvoiceData,
    cashRegisterId,
}: {
    InvoiceId: string;
    fetchInvoiceData: (id: string) => Promise<void>;
    cashRegisterId: string;
}) {
    const { invoice, setInvoice } = useInvoice()

    const quantityRef = useRef<HTMLInputElement>(null);
    const productRef = useRef<HTMLSelectElement>(null);
    const route = useRouter();
    const [item, setItem] = useState<InvoiceItem | null>(null);
    const [itemLoading, setItemloading] = useState(false)
    const [paymentLoading, setPaymentLoading] = useState(false)
    const [openModal, setOpenModal] = useState(false)
    const [openPrintModal, setOpenPrintModal] = useState(false);
    const [student, setStudent] = useState<string | null>(
        invoice?.studentId || null
    );
    const [searchLoading, setSearchLoading] = useState(false);
    const [accountReceivables, setAccountReceivables] = useState<AccountReceivable[] | null>(null);
    const [openAccountReceivableModal, setOpenAccountReceivableModal] = useState(false);




    const onSelectProduct = (selected: ProductSelect | null) => {
        if (!selected) return;
        setItem((prev) => ({
            ...prev!,
            productId: selected.value,
            unitPrice: selected.price,
            accountReceivableId: null,

        }));


        if (quantityRef.current) {
            setItem((prev) => ({
                ...prev!,
                quantity: 1,
            }));
            quantityRef.current.select();
            quantityRef.current.focus();
        }
    }




    const handleSubmit = async (): Promise<boolean> => {
        if (!invoice) {
            openNotification('error', 'No hay información de la factura');
            return false;
        }

        const totalFactura = invoice.subtotal + invoice.itbis;
        const montoRecibido = invoice?.paymentDetails?.receivedAmount;

        if (montoRecibido === undefined || montoRecibido < totalFactura) {
            openNotification('error', 'El monto recibido es menor al total de la factura');
            return false;
        }

        setPaymentLoading(true);

        const resp = await payInvoice(InvoiceId, invoice);

        setPaymentLoading(false);

        if (resp.success) {
            openNotification("success", "Factura pagada correctamente");
            setOpenPrintModal(true)
            return true; // ✅ pago exitoso
        } else {
            openNotification("error", resp.message);
            console.log(resp);
            return false; // ❌ fallo en el backend
        }
    };

    const handleAddItem = async (item: any) => {
        setItemloading(true);
        if (!item?.quantity) {
            openNotification('error', 'datos faltantes');
            setItemloading(false);
            return;
        }
        const type = item?.productId ? InvoiceItemType.PRODUCT : InvoiceItemType.RECEIVABLE;
        const itemWithType = {
            ...item,
            type,
        };
        const resp = await addItemsInvoice(InvoiceId, itemWithType);

        if (resp.success) {
            openNotification('success', 'Item agregado correctamente');
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

    const handleDeteleItem = async (item: InvoiceItem) => {
        setItemloading(true);
        confirmDialog({
            title: 'Eliminar Item',
            text: '¿Seguro que quieres eliminar este Item?',
            confirmButtonText: 'Sí, eliminar',
            icon: 'error',
        }, async () => {

            const resp = await removeItemsInvoice(InvoiceId, item.id);
            if (resp.success) {
                openNotification('success', 'Item eliminado correctamente');
                await fetchInvoiceData(InvoiceId);

                console.log('item eliminado', item);

                setAccountReceivables(prev => {
                    if (!prev) return [];
                    return prev.map(ar =>
                        ar.id === item.accountReceivableId
                            ? {
                                ...ar,

                                AmountPaid: 0,
                                uiStatus: null,
                            }
                            : ar
                    );
                });
                return;
            }
            openNotification('error', resp.message);
        });

        setItemloading(false);
    }

    const handleSearchAccountReceivables = async (studentId: string | null) => {
        if (!studentId) {
            openNotification('error', 'Por favor, selecciona un estudiante');
            return;
        }
        setSearchLoading(true);
        try {
            const res = await apiRequest.get<AccountsReceivablesResponse>(`/accounts-receivable?studentId=${studentId}`);
            if (!res.success) {
                openNotification('error', res.message);
                return;
            }
            const accounts = res.data?.accountsReceivable || [];
            if (accounts) {
                setAccountReceivables(accounts);

            }
        } catch (error) {
            console.error('Error fetching accounts receivable:', error);
            openNotification('error', 'Error al buscar cuentas por cobrar');
        } finally {
            setSearchLoading(false);
        }
    };
    const onChangeStudent = async (selected: StudentSelect) => {
        const studentId = selected?.value ?? null;
        setStudent(studentId);

        setInvoice((prev: IvoicebyId) => ({
            ...prev!,
            studentId: studentId,
        }));

        try {

            const resp = await updateInvoice(InvoiceId, {
                ...invoice,
                studentId: studentId,
            } as Invoice);
            if (resp.success) {
                openNotification('success', 'Estudiante actualizado correctamente');
            }
            await handleSearchAccountReceivables(studentId);
            setOpenAccountReceivableModal(true);
        } catch (error) {
            console.error('Error updating invoice with student:', error);
            openNotification('error', 'Error al actualizar el estudiante en la factura');

        }
    }

    const handleCancelInvoice = async () => {
        confirmDialog({
            title: 'Cancelar Factura',
            text: '¿Seguro que quieres cancelar esta factura?',
            confirmButtonText: 'Sí, cancelar',
            icon: 'warning',
        }, async () => {
            const resp = await cancelInvoice(InvoiceId);
            if (resp.success) {
                openNotification('success', 'Factura cancelada correctamente');
                route.push(`/invoices/${cashRegisterId}`)
            } else {
                openNotification('error', resp.message);
            }
        });
    }

    useEffect(() => {
        if (invoice?.studentId) {
            setStudent(invoice.studentId);
            handleSearchAccountReceivables(invoice.studentId);
        } else {
            setStudent(null);
        }
    }, [invoice?.studentId]);



    return (
        <div className="panel p-4">
            <div className="mb-4 grid grid-cols-1 md:grid-cols-12 gap-4">
                <div className="md:col-span-9 col-span-12">
                    <Tab.Group>
                        <Tab.List className="mt-3 flex flex-wrap border-b border-white-light dark:border-[#191e3a]">
                            <Tab as={Fragment}>
                                {({ selected }) => (
                                    <button
                                        className={`${selected ? '!border-white-light !border-b-white text-primary !outline-none dark:!border-[#191e3a] dark:!border-b-black' : ''}
                        dark:hover:border-b-black -mb-[1px] block border border-transparent p-3.5 py-2 hover:text-primary`}>
                                        Estudiantes
                                    </button>
                                )}
                            </Tab>
                            <Tab as={Fragment}>
                                {({ selected }) => (
                                    <button
                                        className={`${selected ? '!border-white-light !border-b-white text-primary !outline-none dark:!border-[#191e3a] dark:!border-b-black' : ''}
                        dark:hover:border-b-black -mb-[1px] block border border-transparent p-3.5 py-2 hover:text-primary`}>
                                        Productos
                                    </button>
                                )}
                            </Tab>

                        </Tab.List>

                        <Tab.Panels>
                            <Tab.Panel>
                                <div className="flex flex-col md:flex-row items-stretch justify-between gap-4 mt-4">
                                    <div className="flex-1 w-full ">
                                        <SelectStudent
                                            value={student ?? undefined}
                                            loading={searchLoading}
                                            //className="w-full md:w-1/3"
                                            onChange={(selected: StudentSelect | null) => {
                                                if (!selected) {
                                                    setStudent(null);
                                                    setInvoice((prev: IvoicebyId) => ({
                                                        ...prev!,
                                                        studentId: null,
                                                    }));
                                                    return;
                                                }
                                                onChangeStudent(selected);
                                            }}
                                            isDisabled={Boolean(student)}
                                        />

                                    </div>
                                    <div className="w-full md:w-1/3  flex items-center justify-center mr-2">
                                        {student && (
                                            <Button
                                                type="button"
                                                color="primary"

                                                onClick={async () => {
                                                    setOpenAccountReceivableModal(true);
                                                }}
                                            >
                                                Agregar Pagos
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </Tab.Panel>
                            <Tab.Panel>
                                <div className="flex flex-col md:flex-row items-stretch gap-4 mt-4">
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
                                            onWheel={(e) => (e.target as HTMLInputElement).blur()}
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
                                                    e.preventDefault();
                                                    handleAddItem(item);
                                                }
                                            }}
                                        />
                                    </div>
                                </div>
                            </Tab.Panel>
                        </Tab.Panels>
                    </Tab.Group>


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
                                {invoice?.items?.length === 0 && (
                                    <tr>
                                        <td colSpan={7} className="text-center text-gray-500 dark:text-gray-400 italic py-4">
                                            No se han agregado items a esta factura.
                                        </td>
                                    </tr>
                                )}
                                {invoice?.items?.map((item: InvoiceItem) => (
                                    <tr key={item.id} className="border-t text-sm">
                                        <td className="px-2 py-2">
                                            {item.productId ? (
                                                <ProductLabel
                                                    ProductId={item.productId}
                                                />

                                            ) : (
                                                <span className="text-gray-500 dark:text-gray-400">
                                                    {item.concept || 'Cuenta por cobrar'}
                                                </span>
                                            )}
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
                                                onClick={() => { handleDeteleItem(item) }}
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
                        <span className="text-right">{invoice?.subtotal?.toFixed(2) ?? '0.00'}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="font-medium text-gray-600 dark:text-gray-300">ITBS:</span>
                        <span className="text-right">{invoice?.itbis?.toFixed(2) ?? '0.00'}</span>
                    </div>
                    <div className="flex justify-between text-sm font-semibold border-t pt-2">
                        <span className="text-gray-800 dark:text-gray-100">Total:</span>
                        <span className="text-right"
                        >
                            {((invoice?.subtotal ?? 0) + (invoice?.itbis ?? 0)).toFixed(2)}
                        </span>
                    </div>
                </div>

            </div>

            <div className="mt-6 flex flex-col md:flex-row justify-end gap-2">
                <Button
                    type="button"
                    color="danger"
                    onClick={handleCancelInvoice}
                    className="w-full md:w-auto"
                    icon={<TbCancel className='mr-1 size-6' />}
                >
                    Cancelar
                </Button>

                <Button
                    type="button"
                    color="success"
                    onClick={() => (setOpenModal(true))}
                    className="w-full md:w-auto"
                    icon={<TbCheck className='mr-1 size-6' />}
                >

                    Completar
                </Button>
            </div>
            <PayInvoice
                openModal={openModal}
                setOpenModal={setOpenModal}
                // Invoice={nvoice}
                // setInvoice={setInvoice}
                handleSubmit={handleSubmit}
                paymentLoading={paymentLoading}

            />
            <PrintInvoiceModal
                invoiceId={invoice.id}
                returnedInvoice={Math.max(
                    parseFloat((invoice.paymentDetails as any)?.receivedAmount || 0) -
                    ((invoice?.subtotal ?? 0) + (invoice?.itbis ?? 0)),
                    0
                )}
                openModal={openPrintModal}
                setOpenModal={setOpenPrintModal}
            />
            <AccountReceivableModal
                studentId={student ?? ''}
                accountReceivables={accountReceivables ?? []}
                openModal={openAccountReceivableModal}
                handleAddItemsInvoice={handleAddItem}
                setAccountsReceivables={setAccountReceivables}
                setItem={setItem}
                setOpenModal={(open) => {
                    setOpenAccountReceivableModal(open);

                }}
            />
        </div>
    );
}
