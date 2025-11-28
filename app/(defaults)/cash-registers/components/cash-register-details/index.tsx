'use client';

import React from 'react'
import useFetchCashMovements from '../../lib/use-fetch-cash-movements';
import useFetchInvoices from '@/app/(defaults)/bills/lib/use-fetch-invoices';
import Tooltip from '@/components/ui/tooltip';
import Link from 'next/link';
import { Button } from '@/components/ui';
import { HiOutlinePaperAirplane } from 'react-icons/hi';
import { formatCurrency, openNotification } from '@/utils';
import { getFormattedDateTime } from '@/utils/date';
import useFetchClosure from '../../lib/use-fetch-cash-closure';
import UserLabel from '@/components/common/info-labels/user-label';
import { TbPointFilled } from 'react-icons/tb';
import { GenericSkeleton } from '@/components/common/Skeleton';
import StickyFooter from '@/components/common/sticky-footer';
import PrintClosure from '@/components/common/print/closure';
import { CASHIER } from "@/constants/role.constant";


export default function CashRegisterDetails({ cashRegister, currentUser }: { cashRegister: any, currentUser?: any }) {

    const isCashier = currentUser?.roles?.some((role: any) => role.normalizedName === CASHIER);
    const isOwner = cashRegister?.user?.id === currentUser?.id;


    if (isCashier && !isOwner) {
        return (
            <div className="flex flex-col items-center justify-center panel p-4 text-center">
                <h2 className="text-xl font-bold text-red-600">Acceso Denegado</h2>
                <p>No tienes permisos para ver esta caja registradora.</p>
                <Link href="/cash-registers">
                    <Button className="mt-4">Volver al listado</Button>
                </Link>
            </div>
        );
    }

    const { cashMovements, loading: cashMovementsLoading } = useFetchCashMovements(cashRegister?.id);
    const { invoices, loading: invoiceLoading } = useFetchInvoices(`cashRegisterId=${cashRegister?.id}`);
    const { closure, loading: closureLoading } = useFetchClosure(cashRegister?.id);

    function getTotalExpenses(cashMovements: any[]) {
        return cashMovements
            .filter((m) => m.type === 'EXPENSE')
            .reduce((total, m) => total + m.amount, 0);
    }

    function getTotalIncome(cashMovements: any[]) {
        return cashMovements
            .filter((m) => m.type === 'INCOME')
            .reduce((total, m) => total + m.amount, 0);
    }
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

        // Movimientos existentes
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

        // Facturas COMPLETED a crédito sin cash movement
        invoices
            .filter(inv => inv.status === 'COMPLETED' && inv.isCredit && !cashMovements.some(m => m.referenceId === inv.id))
            .forEach(inv => {
                const amount = inv.subtotal + inv.itbis;
                summary.credito += amount;
                summary.total += amount;
            });

        return summary;
    }


    function getCashLabel(key: string): string {
        const map: Record<string, string> = {
            one: formatCurrency(1),
            five: formatCurrency(5),
            ten: formatCurrency(10),
            twentyfive: formatCurrency(25),
            fifty: formatCurrency(50),
            hundred: formatCurrency(100),
            twoHundred: formatCurrency(200),
            fiveHundred: formatCurrency(500),
            thousand: formatCurrency(1000),
            twoThousand: formatCurrency(2000),
        };
        return map[key] || key;
    }

    const totalIngresos = getTotalIncome(cashMovements);
    const totalEgresos = getTotalExpenses(cashMovements);
    const total = totalIngresos - totalEgresos + (cashRegister?.initialBalance || 0);

    const resumenFacturas = getInvoiceSummaryFromMovements(cashMovements, invoices);

    // const handlePrintClosure = () => {
    //     if (cashRegister.id && closure?.id) {
    //         printClosure({ closureId: closure.id, cashRegisterId: cashRegister.id });
    //     } else {
    //         openNotification('error', 'No se puede imprimir el cierre. Faltan datos del cierre o caja');
    //     }
    // }

    return (
        <>
            <div className=" grid grid-cols-12 gap-5">
                <div className="col-span-12">
                    <span className="ml-3 text-lg font-bold">Detalles de Caja</span>
                    <div className="panel flex items-center justify-between gap-4 p-4">
                        <div>
                            <p className="text-sm text-gray-600">Fecha de Apertura</p>
                            <p className="text-base font-medium">{getFormattedDateTime(new Date(cashRegister.openingDate), { hour12: true })}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Nombre</p>
                            <p className="text-base font-medium">{cashRegister.cashBox.name}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Usuario</p>
                            <p className="text-base font-medium">{cashRegister?.user?.name}</p>
                        </div>

                        {cashRegister.closedAt && (
                            <div>
                                <p className="text-sm text-gray-600">Fecha de Cierre</p>
                                <p className="text-base font-medium">{getFormattedDateTime(new Date(cashRegister.closedAt), { hour12: true })}</p>
                            </div>
                        )}
                        <div>
                            <p className="text-sm text-gray-600">Estado</p>
                            {cashRegister.status === 'OPEN' ? (
                                <p className={`flex min-w-max items-center gap-1 font-bold text-green-600`}>
                                    <TbPointFilled />
                                    Abierto
                                </p>
                            ) : (
                                <p className={`flex min-w-max items-center gap-1 font-bold text-red-600`}>
                                    <TbPointFilled />
                                    Cerrado
                                </p>
                            )}
                        </div>
                    </div>
                </div>
                {closureLoading && (
                    <div className="col-span-12">
                        {' '}
                        <GenericSkeleton className="mb-6" lines={2} withHeader={false} />{' '}
                    </div>
                )}
                {!closureLoading && closure && (
                    <div className="col-span-12">
                        <span className="ml-3 text-lg font-bold">Detalles de Cierre</span>
                        <div className="panel flex items-center justify-between gap-4 p-4">
                            <div>
                                <p className="text-sm text-gray-600">Fecha de Cierre</p>
                                <p className="text-base font-medium">{getFormattedDateTime(new Date(closure.closureDate), { hour12: true })}</p>
                            </div>

                            <div>
                                <p className="text-sm text-gray-600">Efectivo Esperado</p>
                                <p className="text-base font-medium">{formatCurrency((closure as any).expectedTotalCash)}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Efectivo Reportado</p>
                                <p className="text-base font-medium">{formatCurrency(closure.totalCash)}</p>
                            </div>

                            <div>
                                <p className="text-sm text-gray-600">Diferencia</p>
                                <p className={`text-base font-medium ${(closure.totalCash - (closure as any).expectedTotalCash) > 0 ? 'text-green-600' : (closure.totalCash - (closure as any).expectedTotalCash) < 0 ? 'text-red-600' : 'text-gray-600'}`}>
                                    {(closure.totalCash - (closure as any).expectedTotalCash) > 0 && <>Sobrante: +{formatCurrency((closure.totalCash - (closure as any).expectedTotalCash))}</>}
                                    {(closure.totalCash - (closure as any).expectedTotalCash) < 0 && <>Faltante: -{formatCurrency(Math.abs((closure.totalCash - (closure as any).expectedTotalCash)))}</>}
                                    {(closure.totalCash - (closure as any).expectedTotalCash) === 0 && <>Sin diferencia</>}
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
                {closure && closure.cashBreakdown && (
                    <div className="col-span-12">
                        <span className="ml-3 text-lg font-bold">Desglose de Efectivo</span>
                        <div className="panel grid grid-cols-4 gap-4 p-4 text-sm">
                            {Object.entries(closure.cashBreakdown)
                                .reverse()
                                .map(([key, value]) => (
                                    <div key={key} className="flex justify-between rounded border p-2">
                                        <span className="capitalize">{getCashLabel(key)}</span>
                                        <span className="font-semibold">{value}</span>
                                    </div>
                                ))}
                        </div>
                    </div>
                )}

                {cashMovementsLoading && (
                    <div className="col-span-3">
                        <span className="ml-3 text-lg font-bold">Resumen de movimentos</span>
                        <GenericSkeleton className="w-full" lines={8} withHeader={false} />
                    </div>
                )}
                {!cashMovementsLoading && (
                    <div className="col-span-3">
                        <span className="ml-3 text-lg font-bold">Resumen de movimentos</span>
                        <div className="panel space-y-4 p-4">
                            <div>
                                <p className="text-sm text-gray-600">Balance Inicial</p>
                                <p className="text-base font-medium">{formatCurrency(cashRegister?.initialBalance || 0)}</p>
                            </div>

                            <div>
                                <p className="text-sm text-gray-600">Ventas Efectivo</p>
                                <p className="text-base font-medium">{formatCurrency(resumenFacturas.efectivo)}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Ventas Tarjeta</p>
                                <p className="text-base font-medium">{formatCurrency(resumenFacturas.tarjeta)}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Ventas Transferencia</p>
                                <p className="text-base font-medium">{formatCurrency(resumenFacturas.transferencia)}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Ventas Cheque</p>
                                <p className="text-base font-medium">{formatCurrency(resumenFacturas.cheque)}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Ventas a Crédito</p>
                                <p className="text-base font-medium text-yellow-600">{formatCurrency(resumenFacturas.credito)}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Egresos</p>
                                <p className="text-base font-medium text-red-600">- {formatCurrency(totalEgresos)}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Total General</p>
                                <p className="text-base font-medium">{formatCurrency(total)}</p>
                            </div>

                            <div>
                                <p className="text-sm text-gray-600">Efectivo esperado</p>
                                <p className="text-base font-medium">
                                    {formatCurrency((cashRegister?.initialBalance || 0) + resumenFacturas.efectivo - totalEgresos)}
                                </p>
                            </div>
                        </div>
                    </div>
                )}
                <div className="col-span-9">
                    <span className="ml-3 text-lg font-bold">Historial de movimentos</span>
                    <div className="table-responsive panel mb-5 overflow-hidden border-0 p-0">
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
                                {cashMovementsLoading && (
                                    <tr>
                                        <td colSpan={5}>
                                            <GenericSkeleton className="w-full" lines={8} withHeader={false} />
                                        </td>
                                    </tr>
                                )}

                                {!cashMovementsLoading &&
                                    cashMovements?.map((cashMovement) => (
                                        <tr key={cashMovement.id}>
                                            <td className="text-left">{getFormattedDateTime(new Date(cashMovement.createdAt), { hour12: true })}</td>
                                            <td className="text-left">{cashMovement.description}</td>
                                            <td className="whitespace-nowrap text-left font-bold">
                                                {cashMovement.type === 'EXPENSE'
                                                    ? `- ${formatCurrency(cashMovement.amount)}`
                                                    : formatCurrency(cashMovement.amount)}
                                            </td>
                                            <td className="text-left">
                                                <span className={cashMovement.type === 'INCOME' ? 'font-semibold text-green-600' : 'font-semibold text-red-600'}>
                                                    {cashMovement.type === 'INCOME' ? 'Ingreso' : 'Egreso'}
                                                </span>
                                            </td>
                                            <td>
                                                <div className="flex justify-end gap-2">
                                                    {cashMovement.referenceType === 'INVOICE' && (
                                                        <Tooltip title="detalles">
                                                            <Link href={`/bills/${cashMovement.referenceId}`}>
                                                                <Button
                                                                    variant="outline"
                                                                    size="sm"
                                                                    icon={<HiOutlinePaperAirplane className="size-4 rotate-90" />}
                                                                />
                                                            </Link>
                                                        </Tooltip>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}

                                {/* Facturas COMPLETED sin movimiento (Crédito) */}
                                {!cashMovementsLoading &&
                                    invoices
                                        .filter(inv => inv.status === 'COMPLETED' && !cashMovements.some(m => m.referenceId === inv.id))
                                        .map(inv => (
                                            <tr key={inv.id} className="bg-yellow-50 dark:bg-yellow-900/20">
                                                <td className="text-left">{getFormattedDateTime(new Date(inv.date), { hour12: true })}</td>
                                                <td className="text-left">Factura {inv.invoiceNumber} (Crédito)</td>
                                                <td className="whitespace-nowrap text-left font-bold">{formatCurrency(inv.subtotal + inv.itbis)}</td>
                                                <td className="text-left">
                                                    <span className="font-semibold text-amber-600">Credito</span>
                                                </td>
                                                <td>
                                                    <div className="flex justify-end gap-2">
                                                        <Tooltip title="detalles">
                                                            <Link href={`/bills/${inv.id}`}>
                                                                <Button
                                                                    variant="outline"
                                                                    size="sm"
                                                                    icon={<HiOutlinePaperAirplane className="size-4 rotate-90" />}
                                                                />
                                                            </Link>
                                                        </Tooltip>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {!closureLoading && closure && (
                <StickyFooter className='-mx-6 px-8 py-4 mt-6' stickyClass='border-t bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'>
                    <div className="flex justify-end gap-2">
                        <PrintClosure closureId={closure.id} cashRegisterId={cashRegister.id} />
                    </div>
                </StickyFooter>
            )}
        </>
    );
}
