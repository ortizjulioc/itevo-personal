'use client'
import React from 'react'
import { formatCurrency } from '@/utils'
import { getFormattedDateTime } from '@/utils/date'
import Tooltip from '@/components/ui/tooltip'
import Link from 'next/link'
import { Button, Pagination } from '@/components/ui'
import { HiOutlinePaperAirplane } from 'react-icons/hi'
import Skeleton from "@/components/common/Skeleton";
import useFetchCashMovements from '../lib/use-fetch-cash-movements'
import ButtonCloseCashRegister from '../components/button-close-cash-register'

interface Props {
    params: {
        search?: string;
        page?: string;
        top?: string
        id: string;
    };
}

export default function CloseCashRegister({ params }: Props) {


    const { cashMovements, loading } = useFetchCashMovements(params?.id)

    console.log(cashMovements)

    if (loading) return <Skeleton rows={6} columns={['FECHA', "DESCRIPCION", 'MONTO', "TIPO"]} />;

    return (
        <div >
            <span className='ml-3 font-bold text-lg'>Historial de movimentos de caja</span>
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
                                    <td className="text-left font-bold">{formatCurrency(cashMovement.amount)}</td>
                                    <td className="text-left">
                                        <span className={cashMovement.type === "INCOME" ? "text-green-600 font-semibold" : "text-red-600 font-semibold"}>
                                            {cashMovement.type === "INCOME" ? "Ingreso" : "Gasto"}
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
            {/* <div className="">
                <Pagination
                    currentPage={Number.parseInt(params?.page || '1')}
                    total={totalcashMovements}
                    top={Number.parseInt(params?.top || '10')}
                />
            </div> */}
            <div className="panel sticky bottom-0 z-10 mt-5 bg-white p-4 shadow-md dark:bg-gray-900">
                <div className="flex justify-end">
                    <ButtonCloseCashRegister />

                </div>
            </div>
        </div>
    )
}
