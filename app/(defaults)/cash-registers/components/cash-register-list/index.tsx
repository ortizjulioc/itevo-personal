'use client';
import { openNotification, queryStringToObject } from "@/utils";
import { Button, Pagination } from "@/components/ui";
import Tooltip from "@/components/ui/tooltip";
import Link from "next/link";
import Skeleton from "@/components/common/Skeleton";
import { TbPointFilled } from "react-icons/tb";
import { HiOutlinePaperAirplane } from "react-icons/hi";
import { ViewTitle } from "@/components/common";
import { getFormattedDateTime } from "@/utils/date";

import useFetchCashRegisters from "@/app/(defaults)/invoices/lib/cash-register/use-fetch-cash-register";
import { getSession } from "next-auth/react";


interface Props {
    className?: string;
    query?: string;
    cashRegisterId?: string;
}

export default function CashRegisterList({ className, query = '', cashRegisterId }: Props) {
    const params = queryStringToObject(query);
    const { loading, error, cashRegisters, totalCashRegisters, setCashRegisters } = useFetchCashRegisters(query);
    if (error) {
        openNotification('error', error);
    }


    console.log(cashRegisters)
    if (loading) return <Skeleton rows={4} columns={['CAJA', 'USUARIO', 'FECHA DE CREACION', 'ESTADO']} />;

    return (
        <>
            <ViewTitle className='mb-6' title=" Cuadre de Cajas" rightComponent={
                <>
                    {/* {cashRegisters?.length === 0 && (
                        <CashRegisterModal />
                    )} */}


                </>
            } />

            <div className={className}>
                <div className="table-responsive mb-5 panel p-0 border-0 ">
                    <table className="table-hover">
                        <thead>
                            <tr>
                                <th className="text-left">CAJA</th>
                                <th className="text-left">USUARIO</th>
                                <th className="text-left">FECHA DE APERTURA</th>
                                {/* <th className="text-left">FECHA DE CIERRE</th> */}
                                <th className="text-left">ESTADO</th>

                                <th />
                            </tr>
                        </thead>
                        <tbody>
                            {cashRegisters?.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="text-center text-gray-500 dark:text-gray-600 italic">No se encontraron cajas registradas</td>
                                </tr>
                            )}
                            {cashRegisters?.map((CashRegister: any) => {
                                return (
                                    <tr key={CashRegister.id}>
                                        <td className="text-left">{CashRegister.cashBox.name}</td>
                                        <td className="text-left">{CashRegister.user.name}</td>
                                        <td className="text-left">{getFormattedDateTime(new Date(CashRegister.openingDate), { hour12: true })}</td>
                                        <td className="text-left">
                                            {CashRegister.status === 'OPEN' ? (
                                                <span className={`flex items-center gap-1 font-bold min-w-max text-green-600`}>
                                                    <TbPointFilled />
                                                    Abierto
                                                </span>
                                            ) : (
                                                <span className={`flex items-center gap-1 font-bold min-w-max text-red-600`}>
                                                    <TbPointFilled />
                                                    Cerrado
                                                </span>
                                            )}
                                        </td>


                                        <td>
                                            <div className="flex gap-2 justify-end">

                                                <Tooltip title="ver Detalles">
                                                    <Link href={`/cash-registers/${CashRegister.id}`}>
                                                        <Button variant="outline" size="sm" icon={<HiOutlinePaperAirplane className="size-4 rotate-90" />} />
                                                    </Link>
                                                </Tooltip>

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
                        total={totalCashRegisters}
                        top={Number.parseInt(params?.top || '10')}
                    />
                </div>
            </div>
        </>
    );
};
