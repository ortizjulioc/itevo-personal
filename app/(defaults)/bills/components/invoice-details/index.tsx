import React from 'react'
import InvoiceStatusField from '../invoice-list/invoice-status'
import UserLabel from '@/components/common/info-labels/user-label'
import ProductLabel from '@/components/common/info-labels/product-label'
import { Button } from '@/components/ui'
import { TbCancel, TbPrinter } from 'react-icons/tb'

export default function InvoiceDetails({ invoice }: { invoice: any }) {
    console.log(invoice, 'invoice')

    const PAYMENT_METHODS = {
        cash: 'Efectivo',
        credit_card: 'Tarjeta',
        bank_transfer: 'Transferencia',
        'check': 'Cheque',
    }
    const PAYMENT_PROPERTIES = {
        receivedAmount: 'Monto Recibido',
        cardHolderName: 'Nombre del Titular',
        cardNumber: 'Número de Tarjeta',
        bankName: 'Nombre del Banco',
        accountNumber: 'Número de Cuenta',
        checkNumber: 'Número de Cheque',

    }
    return (
        <>
            <div className='panel'>
                <div className='grid grid-cols-1 md:grid-cols-12 gap-4'>
                    <div className='md:col-span-8 text-lg'>
                        <h3 className='text-xl font-bold mb-2'>Detalles</h3>
                        <p><strong>Fecha:</strong> {new Date(invoice.createdAt).toLocaleString()}</p>
                        <p><strong>Fecha de Pago</strong> {invoice.paymentDate ? new Date(invoice.paymentDate).toLocaleString() : 'No pagado'}</p>

                        <p className="flex items-center gap-1">
                            <strong>Estado:</strong>{' '}
                            <InvoiceStatusField status={invoice.status} />
                        </p>
                        <p><strong>Creada por:</strong> {
                            <UserLabel UserId={invoice.createdBy} />
                        }</p>
                        <p>
                            <strong>Metodo de Pago:</strong>{' '}
                            {invoice?.paymentMethod ? PAYMENT_METHODS[invoice.paymentMethod as keyof typeof PAYMENT_METHODS] : 'No disponible'}
                        </p>
                        {invoice?.paymentDetails &&
                            Object.entries(invoice.paymentDetails).map(([key, value]) => (

                                <p key={key}> <strong>{PAYMENT_PROPERTIES[key as keyof typeof PAYMENT_PROPERTIES]}:</strong> {String(value)} </p>

                            ))}


                    </div>
                    <div className=' flex flex-col items-end md:col-span-4  text-lg'>
                        <h3 className='text-xl font-bold mb-2'>Consumidores finales</h3>
                        <p><strong>NCF:</strong> {invoice.ncf}</p>
                        <p><strong>Tipo:</strong> {invoice.type}</p>
                        <p><strong>N. Factura:</strong> {invoice.invoiceNumber}</p>
                    </div>
                </div>
                <div>
                    <div className="overflow-x-auto mt-4">
                        <table className="min-w-full table-auto">
                            <thead>
                                <tr className="bg-gray-100 dark:bg-gray-700 text-sm">
                                    <th className="text-left px-2 py-2">PRODUCTO</th>
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
                                            No se encontraron productos registrados
                                        </td>
                                    </tr>
                                )}
                                {invoice?.items?.map((item: any) => (
                                    <tr key={item.id} className="border-t text-sm">
                                        <td className="px-2 py-2">
                                            <ProductLabel
                                                ProductId={item.productId}
                                            />

                                        </td>
                                        <td className="px-2 py-2">{item.quantity}</td>
                                        <td className="px-2 py-2">{item.unitPrice}</td>
                                        <td className="px-2 py-2">{item.subtotal.toFixed(2)}</td>
                                        <td className="px-2 py-2">{item.itbis.toFixed(2)}</td>
                                        <td className="px-2 py-2">{(item.subtotal + item.itbis).toFixed(2)}</td>
                                        <td className="px-2 py-2"></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="flex justify-end mt-12">
                    <div className=" space-y-2 w-1/4">
                        <div className="flex justify-between text-sm ">
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

            </div>
            <div className="panel sticky mt-5 bottom-0 bg-white dark:bg-gray-900 p-4 shadow-md z-10">
                <div className="flex justify-between">
                    <Button icon={<TbCancel />} type="button" color="danger" className="w-full md:w-auto"> 
                        Cancelar
                    </Button>
                    <Button icon={<TbPrinter />} type="button" color="primary"  className="w-full md:w-auto">
                        Imprimir
                    </Button>
                </div>
            </div>
        </>
    )
}
