
import React from 'react'
import useFetchCashMovements from '../../lib/use-fetch-cash-movements';
import useFetchInvoices from '@/app/(defaults)/bills/lib/use-fetch-invoices';
import Tooltip from '@/components/ui/tooltip';
import Link from 'next/link';
import { Button } from '@/components/ui';
import { HiOutlinePaperAirplane } from 'react-icons/hi';
import { formatCurrency } from '@/utils';
import { getFormattedDateTime } from '@/utils/date';
import useFetchClosure from '../../lib/use-fetch-cash-closure';
import UserLabel from '@/components/common/info-labels/user-label';
import { TbPointFilled } from 'react-icons/tb';



export default function CashRegisterDetails({ cashRegister }: { cashRegister: any }) {

    const { cashMovements, loading } = useFetchCashMovements(cashRegister?.id)
    const { invoices, loading: invoiceLoading } = useFetchInvoices(cashRegister?.id)
    const { closure } = useFetchClosure(cashRegister?.id)
    // console.log(closure)
    console.log(cashRegister)
    function getInvoiceSummary(invoices: any[]) {
        const summary = {
            total: 0,
            efectivo: 0,
            tarjeta: 0,
            transferencia: 0,
            cheque: 0,
            credito: 0,
        };

        invoices.forEach((invoice) => {
            const method = invoice.paymentMethod;

            const amount = invoice.subtotal + invoice.itbis;
            summary.total += amount;

            switch (method) {
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
    const total = totalIngresos - totalEgresos + (cashRegister?.initialBalance || 0);



    const resumenFacturas = getInvoiceSummary(invoices);

    return (
        <>

            <div className=' grid grid-cols-12 gap-5' >
                <div className="col-span-12">
                    <span className="ml-3 font-bold text-lg">Detalles de Caja</span>
                    <div className="panel p-4 grid grid-cols-6 gap-4">
                        <div>
                            <p className="text-sm text-gray-600">Fecha de Apertura</p>
                            <p className="text-base font-medium">{getFormattedDateTime(new Date(cashRegister.openingDate))}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Nombre</p>
                            <p className="text-base font-medium">{cashRegister.name}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Usuario</p>
                            <p className="text-base font-medium">{cashRegister?.user?.name}</p>
                        </div>

                        {cashRegister.closedAt && (
                            <div>
                                <p className="text-sm text-gray-600">Fecha de Cierre</p>
                                <p className="text-base font-medium">{getFormattedDateTime(new Date(cashRegister.closedAt))}</p>
                            </div>
                        )}
                        <div>
                            <p className="text-sm text-gray-600">Estado</p>
                            {cashRegister.status === 'OPEN' ? (
                                <p className={`flex items-center gap-1 font-bold min-w-max text-green-600 italic`}>
                                    <TbPointFilled />
                                    Abierto
                                </p>
                            ) : (
                                <p className={`flex items-center gap-1 font-bold min-w-max text-red-600 italic`}>
                                    <TbPointFilled />
                                    Cerrado
                                </p>
                            )}
                        </div>
                    </div>
                </div>
                {closure && (
                    <div className="col-span-12">
                        <span className="ml-3 font-bold text-lg">Detalles de Cierre</span>
                        <div className="panel p-4 grid grid-cols-6 gap-4">
                            <div>
                                <p className="text-sm text-gray-600">Fecha de Cierre</p>
                                <p className="text-base font-medium">{getFormattedDateTime(new Date(closure.closureDate))}</p>
                            </div>


                            <div>
                                <p className="text-sm text-gray-600">Esperado</p>
                                <p className="text-base font-medium">{formatCurrency(closure.totalExpected)}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Total Reportado</p>
                                <p className="text-base font-medium">{formatCurrency(closure.totalIncome)}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Diferencia</p>
                                <p className={`text-base font-medium ${closure.difference === 0 ? 'text-green-600' : 'text-red-600'}`}>
                                    {formatCurrency(closure.difference)}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Cerrado por</p>
                                <p className="text-base font-medium">
                                    <UserLabel UserId={closure.closedBy} />
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                <div className='col-span-3'>
                    <span className='ml-3 font-bold text-lg'>Resumen de movimentos</span>
                    <div className="panel p-4 space-y-4">
                        <div>
                            <p className="text-sm text-gray-600">Balance Inicial</p>
                            <p className="text-base font-medium">{formatCurrency(cashRegister?.initialBalance || 0)}</p>
                        </div>

                        <div>
                            <p className="text-sm text-gray-600">Efectivo</p>
                            <p className="text-base font-medium">{formatCurrency(resumenFacturas.efectivo)}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Tarjeta</p>
                            <p className="text-base font-medium">{formatCurrency(resumenFacturas.tarjeta)}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Transferencia</p>
                            <p className="text-base font-medium">{formatCurrency(resumenFacturas.transferencia)}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Cheque</p>
                            <p className="text-base font-medium">{formatCurrency(resumenFacturas.cheque)}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Egresos</p>
                            <p className="text-base font-medium text-red-600">- {formatCurrency(totalEgresos)}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Total</p>
                            <p className="text-base font-medium">{formatCurrency(total)}</p>
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
            {/* <div className="panel sticky bottom-0 z-10 mt-5 bg-white p-4 shadow-md dark:bg-gray-900">
                <div className="flex justify-end">
                    <ButtonCloseCashRegister />

                </div>
            </div> */}

        </>
    )
}
