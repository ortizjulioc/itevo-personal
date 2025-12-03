import React from 'react'
import InvoiceStatusField from '../invoice-list/invoice-status'
import UserLabel from '@/components/common/info-labels/user-label'
import ProductLabel from '@/components/common/info-labels/product-label'
import { Button } from '@/components/ui'
import { TbCancel, TbPrinter } from 'react-icons/tb'
import PrintInvoice from '@/components/common/print/invoice'
import { IoMdPrint } from 'react-icons/io'
import Tooltip from '@/components/ui/tooltip'
import { getFormattedDate } from '@/utils/date'
import { confirmDialog, formatCurrency, openNotification } from '@/utils'
import OptionalInfo from '@/components/common/optional-info'
import { deleteInvoice } from '../../lib/request'
import { useRouter } from 'next/navigation';
import { InvoiceStatus } from '@prisma/client'
import { CASHIER } from '@/constants/role.constant'
import Link from 'next/link'

export default function InvoiceDetails({ invoice, currentUser }: { invoice: any, currentUser?: any }) {
    console.log(invoice, 'invoice')
    const route = useRouter();

    // Check if user is a cashier and if they own this invoice's cash register
    const isCashier = currentUser?.roles?.some((role: any) => role.normalizedName === CASHIER);
    const isOwnCashRegister = invoice?.cashRegister?.user?.id === currentUser?.id;

    // Cashiers can only view invoices from their own cash register
    const canViewInvoice = !isCashier || (isCashier && isOwnCashRegister);
    // Cashiers cannot cancel invoices, only admins can
    const canCancelInvoice = !isCashier;

    const handleCancelInvoice = async () => {
        confirmDialog({
            title: 'Cancelar Factura',
            text: '¿Seguro que quieres cancelar esta factura?',
            confirmButtonText: 'Sí, cancelar',
            cancelButtonText: 'No, mantener',
            icon: 'error'
        }, async () => {
            console.log('Cancelar factura', invoice.id);
            const resp = await deleteInvoice(invoice.id);
            console.log(resp);
            if (resp.success) {
                openNotification('success', 'Factura cancelada exitosamente');
                route.back()
            } else {
                openNotification('error', resp.message || 'Error al cancelar la factura');
            }
        });
        // Lógica para cancelar la factura
    }

    const PAYMENT_METHODS = {
        cash: 'Efectivo',
        credit_card: 'Tarjeta',
        bank_transfer: 'Transferencia',
        'check': 'Cheque',
    }
    const PAYMENT_PROPERTIES = {
        verifone: "Verifone",
        type: "Tipo de Tarjeta",
        reference: "Referencia de Tarjeta",
        TransferNumber: "Numero de Transferencia",
        bankName: "Nombre del Banco",
        receivedAmount: "Monto Recibido"

    }
    // If cashier doesn't own this cash register, show access denied
    if (isCashier && !isOwnCashRegister) {
        return (
            <div className=" flex flex-col items-center justify-center h-screen panel p-4 text-center">
                <h2 className="text-xl font-bold text-red-600">Acceso Denegado</h2>
                <p>No tienes permisos para ver esta factura.</p>
                <p className="text-sm text-gray-600 mt-2">Solo puedes ver facturas creadas en tu caja registradora.</p>
                <Link href="/bills">
                    <Button className="mt-4">Volver al listado</Button>
                </Link>
            </div>
        );
    }

    return (
        <>
            <div className="panel">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-12">
                    <div className="text-lg md:col-span-8">
                        <h3 className="mb-2 text-xl font-bold">Detalles</h3>
                        <p>
                            <strong>Fecha:</strong> {getFormattedDate(new Date(invoice.createdAt))}
                        </p>
                        <p>
                            <strong>Fecha de Pago</strong> {invoice.paymentDate ? getFormattedDate(new Date(invoice.paymentDate)) : 'No pagado'}
                        </p>

                        <p className="flex items-center gap-1">
                            <strong>Estado:</strong> <InvoiceStatusField status={invoice.status} />
                        </p>
                        <p>
                            <strong>Creada por:</strong> {<UserLabel UserId={invoice.createdBy} />}
                        </p>
                        <p>
                            <strong>Metodo de Pago:</strong> {invoice?.paymentMethod ? PAYMENT_METHODS[invoice.paymentMethod as keyof typeof PAYMENT_METHODS] : 'No disponible'}
                        </p>
                        {invoice?.paymentDetails &&
                            Object.entries(invoice.paymentDetails).map(([key, value]) => (
                                <p key={key}>
                                    {' '}
                                    <strong>{PAYMENT_PROPERTIES[key as keyof typeof PAYMENT_PROPERTIES]}:</strong> {String(value)}{' '}
                                </p>
                            ))}
                    </div>
                    <div className=" flex flex-col items-end text-lg  md:col-span-4">
                        <h3 className="mb-2 text-xl font-bold">Consumidores finales</h3>
                        <p>
                            <strong>NCF: </strong>
                            <OptionalInfo content={invoice.ncf.includes('TEMP') ? '' : invoice.ncf} message='No disponible' />

                        </p>
                        <p>
                            <strong>Tipo:</strong> <span className='capitalize'>{invoice.type.replace(/_/g, ' ').toLowerCase()}</span>
                        </p>
                        <p>
                            <strong>N. Factura:</strong> {invoice.invoiceNumber}
                        </p>
                        <p>
                            <strong>Estudiante:</strong> {invoice.studentId ? <OptionalInfo content={`${invoice.student?.firstName} ${invoice.student?.lastName}`} message="No registrado" /> : <OptionalInfo content='' />}
                        </p>
                    </div>
                </div>
                <div>
                    <div className="mt-4 overflow-x-auto">
                        <table className="min-w-full table-auto">
                            <thead>
                                <tr className="bg-gray-100 text-sm dark:bg-gray-700">
                                    <th className="px-2 py-2 text-left">DESCRIPCION</th>
                                    <th className="px-2 py-2 text-left">CANTIDAD</th>
                                    <th className="px-2 py-2 text-left">PRECIO</th>
                                    <th className="px-2 py-2 text-left">SUBTOTAL</th>
                                    <th className="px-2 py-2 text-left">ITBS</th>
                                    <th className="px-2 py-2 text-left">TOTAL</th>
                                    <th className="px-2 py-2"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {invoice?.items?.length === 0 && (
                                    <tr>
                                        <td colSpan={7} className="py-4 text-center italic text-gray-500 dark:text-gray-400">
                                            No se encontraron productos registrados
                                        </td>
                                    </tr>
                                )}
                                {invoice?.items?.map((item: any) => (
                                    <tr key={item.id} className="border-t text-sm">
                                        <td>{item.productId ? <ProductLabel ProductId={item.productId} /> : <span>{item.concept || 'Cuenta por cobrar'}</span>}</td>
                                        <td className="px-2 py-2">{item.quantity}</td>
                                        <td className="px-2 py-2">{formatCurrency(item.unitPrice)}</td>
                                        <td className="px-2 py-2">{formatCurrency(item.subtotal)}</td>
                                        <td className="px-2 py-2">{formatCurrency(item.itbis)}</td>
                                        <td className="px-2 py-2">{formatCurrency(item.subtotal + item.itbis)}</td>
                                        <td className="px-2 py-2"></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="mt-12 flex justify-end">
                    <div className=" w-1/4 space-y-2">
                        <div className="flex justify-between text-sm ">
                            <span className="font-medium text-gray-600 dark:text-gray-300">Subtotal:</span>
                            <span className="text-right">{formatCurrency(invoice?.subtotal ?? 0)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="font-medium text-gray-600 dark:text-gray-300">ITBS:</span>
                            <span className="text-right">{formatCurrency(invoice?.itbis ?? 0)}</span>
                        </div>
                        <div className="flex justify-between border-t pt-2 text-sm font-semibold">
                            <span className="text-gray-800 dark:text-gray-100">Total:</span>
                            <span className="text-right">{formatCurrency((invoice?.subtotal ?? 0) + (invoice?.itbis ?? 0))}</span>
                        </div>
                    </div>
                </div>
            </div>
            <div className="panel sticky bottom-0 z-10 mt-5 bg-white p-4 shadow-md dark:bg-gray-900">
                <div className="flex justify-between">
                    {canCancelInvoice ? (
                        <Button
                            icon={<TbCancel />}
                            type="button"
                            color="danger"
                            className="w-full md:w-auto"
                            onClick={handleCancelInvoice}
                        >
                            Cancelar
                        </Button>
                    ) : (
                        <div></div>
                    )}
                    {(invoice.status === InvoiceStatus.PAID || invoice.status === InvoiceStatus.COMPLETED) ? (
                        <PrintInvoice invoiceId={invoice.id} />
                    ) : (
                        <Tooltip title={'solo es posile imprimir facturas con el estado PAGADO'}>
                            <div>
                                <Button disabled={true} icon={<IoMdPrint className="text-lg " />}>
                                    Imprimir
                                </Button>
                            </div>
                        </Tooltip>
                    )}
                </div>
            </div>
        </>
    );
}
