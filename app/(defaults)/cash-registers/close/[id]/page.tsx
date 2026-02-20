'use client'
import React, { use } from 'react'
import { formatCurrency } from '@/utils'
import { getFormattedDateTime } from '@/utils/date'
import Tooltip from '@/components/ui/tooltip'
import Link from 'next/link'
import { Button, Pagination } from '@/components/ui'
import { HiOutlinePaperAirplane } from 'react-icons/hi'
import Skeleton from "@/components/common/Skeleton";
import useFetchCashMovements from '../../lib/use-fetch-cash-movements'
import useFetchInvoices from '../../../bills/lib/use-fetch-invoices'
import ButtonCloseCashRegister from '../../components/button-close-cash-register'
import { useFetchCashRegistersById } from '@/app/(defaults)/invoices/lib/cash-register/use-fetch-cash-register'

interface Props {
    params: Promise<{
        id: string;
    }>;
}

export default function CloseCashRegister({ params }: Props) {
    const { id } = use(params);

    const { CashRegister } = useFetchCashRegistersById(id);
    const { cashMovements, loading } = useFetchCashMovements(id)
    const { invoices, loading: invoiceLoading } = useFetchInvoices(id)

    function getInvoiceSummaryFromMovements(cashMovements: any[], invoices: any[]) {
        const summary = {
            efectivo: 0,
            tarjeta: 0,
            transferencia: 0,
            cheque: 0,
            credito: 0,
            total: 0,
        };

        const invoiceMap = new Map(invoices.map(inv => [inv.id, inv]));

        cashMovements.forEach(movement => {
            if (movement.type === 'INCOME' && movement.referenceType === 'INVOICE') {
                const invoice = invoiceMap.get(movement.referenceId);
                if (!invoice) return;

                const amount = invoice.subtotal + invoice.itbis;
                summary.total += amount;

                switch (invoice.paymentMethod) {
                    case 'cash':
                        summary.efectivo += amount;
                        break;
                    case 'credit_card':
                        summary.tarjeta += amount;
                        break;
                    case 'bank_transfer':
                        summary.transferencia += amount;
                        break;
                    case 'check':
                        summary.cheque += amount;
                        break;
                    default:
                        summary.credito += amount;
                        break;
                }
            }
        });

        return summary;
    }

    function getTotalExpenses(cashMovements: any[]) {
        return cashMovements
            .filter(m => m.type === 'EXPENSE')
            .reduce((total, m) => total + m.amount, 0);
    }

    function getTotalIncome(cashMovements: any[]) {
        return cashMovements
            .filter(m => m.type === 'INCOME')
            .reduce((total, m) => total + m.amount, 0);
    }

    const totalIngresos = getTotalIncome(cashMovements);
    const totalEgresos = getTotalExpenses(cashMovements);
    const total = totalIngresos - totalEgresos + (CashRegister?.initialBalance || 0);
    const resumenFacturas = getInvoiceSummaryFromMovements(cashMovements, invoices);


    const totalEfectivo = resumenFacturas.efectivo + (CashRegister?.initialBalance || 0) - totalEgresos;

    if (loading) return <Skeleton rows={6} columns={['FECHA', "DESCRIPCION", 'MONTO', "TIPO"]} />;

    return (
        <>
            <div className=' grid grid-cols-12 gap-5' >
                <div className='col-span-3'>
                    <span className='ml-3 font-bold text-lg'>Resumen de movimentos</span>
                    <div className="panel p-4 space-y-4">
                        <div>
                            <p className="text-sm text-gray-600">Balance Inicial</p>
                            <p className="text-base font-medium">{formatCurrency(CashRegister?.initialBalance || 0)}</p>
                        </div>

                        <div>
                            <p className="text-sm text-gray-600">Ventas en Efectivo</p>
                            <p className="text-base font-medium">{formatCurrency(resumenFacturas.efectivo)}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Ventas en Tarjeta</p>
                            <p className="text-base font-medium">{formatCurrency(resumenFacturas.tarjeta)}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Ventas en Transferencia</p>
                            <p className="text-base font-medium">{formatCurrency(resumenFacturas.transferencia)}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Ventas en Cheque</p>
                            <p className="text-base font-medium">{formatCurrency(resumenFacturas.cheque)}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Total General</p>
                            <p className="text-base font-medium">{formatCurrency(total)}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Egresos</p>
                            <p className="text-base font-medium text-red-600">- {formatCurrency(totalEgresos)}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Total Efectivo</p>
                            <p className="text-base font-medium">{formatCurrency(totalEfectivo)}</p>
                        </div>


                    </div>
                </div>
                <div className='col-span-9'>
                    <span className='ml-3 font-bold text-lg'>Historial de movimentos</span>
                    <div className="table-responsive mb-5 panel p-0 border-0 overflow-hidden">
                        <table className="table-hover">
                            <thead>
                                <tr>
                                    <th className="text-left">FECHA</th>
                                    <th className="text-left">DESCRIPCION</th>
                                    <th className="text-left">MONTO</th>
                                    <th className="text-left">TIPO</th>
                                    <th />
                                </tr>
                            </thead>
                            <tbody>

                                {cashMovements?.length === 0 && (
                                    <tr>
                                        <td colSpan={7} className="text-center text-gray-500 dark:text-gray-600 italic">No se encontraron movimentos de caja</td>
                                    </tr>
                                )}
                                {cashMovements?.map((cashMovement) => {
                                    return (
                                        <tr key={cashMovement.id}>
                                            <td className="text-left">{getFormattedDateTime(new Date(cashMovement.createdAt))}</td>
                                            <td className="text-left ">{cashMovement.description}</td>
                                            <td className="text-left font-bold  whitespace-nowrap">
                                                {cashMovement.type === "EXPENSE"
                                                    ? `- ${formatCurrency(cashMovement.amount)}`
                                                    : formatCurrency(cashMovement.amount)}
                                            </td>
                                            <td className="text-left">
                                                <span className={cashMovement.type === "INCOME" ? "text-green-600 font-semibold" : "text-red-600 font-semibold"}>
                                                    {cashMovement.type === "INCOME" ? "Ingreso" : "Egreso"}
                                                </span>
                                            </td>





                                            <td>
                                                <div className="flex justify-end gap-2">
                                                    {cashMovement.referenceType === "INVOICE" && (
                                                        <Tooltip title="detalles">
                                                            <Link href={`/bills/${cashMovement.referenceId}`}>
                                                                <Button variant="outline" size="sm" icon={<HiOutlinePaperAirplane className="size-4 rotate-90" />} />
                                                            </Link>
                                                        </Tooltip>
                                                    )}
                                                    {cashMovement.type === "EXPENSE" && (
                                                        <Tooltip title="detalles del egreso">
                                                            <Link href={`/cash-registers/expenses/${cashMovement.id}`}>
                                                                <Button variant="outline" size="sm" icon={<HiOutlinePaperAirplane className="size-4 rotate-90" />} />
                                                            </Link>
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
                </div>
                {/* <div className="">
                <Pagination
                    currentPage={Number.parseInt(params?.page || '1')}
                    total={totalcashMovements}
                    top={Number.parseInt(params?.top || '10')}
                />
            </div> */}

            </div>
            <div className="panel sticky bottom-0 z-10 mt-5 bg-white p-4 shadow-md dark:bg-gray-900">
                <div className="flex justify-end">
                    <ButtonCloseCashRegister />

                </div>
            </div>

        </>
    )
}
