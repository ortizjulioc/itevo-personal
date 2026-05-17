'use client';
import { formatCurrency, openNotification, queryStringToObject } from "@/utils";
import { Button, Pagination } from "@/components/ui";
import Skeleton from "@/components/common/Skeleton";
import useFetchInvoices from "../../lib/use-fetch-invoices";
import Tooltip from "@/components/ui/tooltip";
import Link from "next/link";
import { HiOutlinePaperAirplane } from "react-icons/hi";
import InvoiceStatusField from "./invoice-status";
import { getFormattedDateTime } from "@/utils/date";
import OptionalInfo from "@/components/common/optional-info";
import { INVOICE_STATUS_OPTIONS, PAYMENT_METHODS_OPTIONS } from "@/constants/invoice.constant";
import { useSession } from "next-auth/react";
import { SUPER_ADMIN, GENERAL_ADMIN, BILLING_ADMIN, ADMIN } from "@/constants/role.constant";
import PrintInvoice from "@/components/common/print/invoice";
import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useState } from 'react';
import { IoMdPrint } from 'react-icons/io';
import { LuRotateCcw } from "react-icons/lu";
import { restoreInvoice } from "../../lib/request";
import { confirmDialog } from "@/utils";

interface Props {
    className?: string;
    query?: string;
}

export default function InvoiceList({ className, query = '' }: Props) {
    const { data: session } = useSession();
    const isAdmin = session?.user?.roles?.some((role: any) =>
        [SUPER_ADMIN, GENERAL_ADMIN, BILLING_ADMIN, ADMIN].includes(role.normalizedName)
    );
    const isSuperAdmin = session?.user?.roles?.some((role: any) => role.normalizedName === SUPER_ADMIN);

    const [printModalOpen, setPrintModalOpen] = useState(false);
    const [invoiceToPrint, setInvoiceToPrint] = useState<string | null>(null);

    const params = queryStringToObject(query);
    const { loading, error, invoices, totalInvoices, setInvoices, fetchInvoicesData } = useFetchInvoices(query);
    if (error) {
        openNotification('error', error);
    }

    const onRestore = async (id: string) => {
        confirmDialog({
            title: 'Restaurar Factura',
            text: '¿Quieres restaurar esta factura cancelada?',
            confirmButtonText: 'Sí, restaurar',
            icon: 'info'
        }, async () => {
            const resp = await restoreInvoice(id);
            if (resp.success) {
                openNotification('success', 'Factura restaurada correctamente');
                fetchInvoicesData(query);
                return;
            } else {
                openNotification('error', resp.message);
            }
        });
    }



    if (loading) return <Skeleton rows={7} columns={isAdmin ? ['N. DE FACTURA', 'NCF', 'ESTUDIANTE', 'FECHA DE CREACIÓN', 'FECHA DE PAGO', 'METODO DE PAGO', 'TOTAL', 'ESTADO'] : ['N. DE FACTURA', 'NCF', 'ESTUDIANTE', 'FECHA DE CREACIÓN', 'FECHA DE PAGO', 'METODO DE PAGO', 'TOTAL']} />;

    return (
        <div className={className}>
            <div className="table-responsive mb-5 panel p-0 border-0">
                <table className="table-hover">
                    <thead>
                        <tr>
                            <th className="text-left">NO. DE FACTURA</th>
                            <th className="text-left">NCF</th>
                            <th>ESTUDIANTE</th>
                            <th className="text-left">FECHA DE CREACIÓN</th>
                            <th className="text-left">FECHA DE PAGO</th>
                            <th className="text-left">METODO DE PAGO</th>
                            <th className="text-left">TOTAL</th>
                            {isAdmin && <th className="text-left">ESTADO</th>}

                            <th />
                        </tr>
                    </thead>
                    <tbody>
                        {invoices?.length === 0 && (
                            <tr>
                                <td colSpan={7} className="text-center text-gray-500 dark:text-gray-600 italic">No se encontraron Facturas registradas</td>
                            </tr>
                        )}
                        {invoices?.map((invoice) => {
                            const isCanceled = invoice.status === 'CANCELED';
                            return (
                                <tr key={invoice.id} className={isCanceled ? "opacity-50 grayscale-[0.5]" : ""}>
                                    <td className="text-left">{invoice.invoiceNumber}</td>
                                    <td className="text-left">{invoice.ncf.startsWith('B') ? invoice.ncf : <OptionalInfo />}</td>
                                    <td className="text-left"> {invoice.studentId ? <OptionalInfo content={`${invoice.student?.firstName} ${invoice.student?.lastName}`} message="No registrado" /> : <OptionalInfo content='' />}</td>
                                    <td className="text-left">{getFormattedDateTime(new Date(invoice.createdAt))}</td>
                                    <td className="text-left">
                                        <OptionalInfo content={invoice.paymentDate ? getFormattedDateTime(new Date(invoice.paymentDate)) : ''} message="No pagado" />
                                    </td>
                                    <td>
                                        {invoice.isCredit
                                            ? 'Crédito'
                                            : invoice.paymentMethod
                                                ? PAYMENT_METHODS_OPTIONS[invoice.paymentMethod as keyof typeof PAYMENT_METHODS_OPTIONS]
                                                : <OptionalInfo content='' />
                                        }
                                    </td>
                                    <td className="text-left font-semibold">{formatCurrency(invoice.subtotal + invoice.itbis)}</td>
                                    {isAdmin && (
                                        <td className="text-left">
                                            <InvoiceStatusField status={invoice.status} />
                                        </td>
                                    )}

                                    <td>
                                        <div className="flex justify-end gap-2">
                                            {isAdmin ? (
                                                <Tooltip title="detalles">
                                                    <Link href={`/bills/${invoice.id}`}>
                                                        <Button variant="outline" size="sm" icon={<HiOutlinePaperAirplane className="size-4 rotate-90" />} />
                                                    </Link>
                                                </Tooltip>
                                            ) : (
                                                <Tooltip title="Imprimir">
                                                    <div>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            icon={<IoMdPrint className="text-lg" />}
                                                            onClick={() => {
                                                                setInvoiceToPrint(invoice.id);
                                                                setPrintModalOpen(true);
                                                            }}
                                                        />
                                                    </div>
                                                </Tooltip>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>

            </div>
            <div className="">
                <Pagination
                    currentPage={Number.parseInt(params?.page || '1')}
                    total={totalInvoices}
                    top={Number.parseInt(params?.top || '10')}
                />
            </div>

            <Transition appear show={printModalOpen} as={Fragment}>
                <Dialog as="div" className="relative z-50" onClose={() => setPrintModalOpen(false)}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black/60" />
                    </Transition.Child>

                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4 text-center">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all dark:bg-[#1b2e4b] border border-gray-100 dark:border-gray-800">
                                    <div className="p-6">
                                        <div className="flex items-center gap-4 mb-2">
                                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                                                <IoMdPrint className="text-2xl" />
                                            </div>
                                            <div>
                                                <Dialog.Title as="h3" className="text-xl font-bold leading-6 text-gray-900 dark:text-white">
                                                    Imprimir Factura
                                                </Dialog.Title>
                                                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                                                    Al confirmar, se generará el documento PDF de la factura en el formato adecuado para su impresión.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="bg-gray-50 dark:bg-black/20 px-6 py-4 flex justify-end gap-3 border-t border-gray-100 dark:border-gray-800">
                                        <Button variant="outline" onClick={() => setPrintModalOpen(false)}>
                                            Cancelar
                                        </Button>
                                        {invoiceToPrint && <PrintInvoice invoiceId={invoiceToPrint} />}
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </div>
    );
};
