'use client';
import { openNotification, queryStringToObject } from "@/utils";
import { Button, Pagination } from "@/components/ui";
import Tooltip from "@/components/ui/tooltip";
import Link from "next/link";
import Skeleton from "@/components/common/Skeleton";
import { TbPointFilled, TbEye } from "react-icons/tb";
import { HiOutlinePaperAirplane } from "react-icons/hi";
import useFetchCashRegisters from "../../../lib/cash-register/use-fetch-cash-register";
import { ViewTitle } from "@/components/common";
import CashRegisterModal from "../cash-register-modal";
import { useSession } from 'next-auth/react';
import { getFormattedDate } from "@/utils/date";
import { CashRegister } from "@prisma/client";

interface Props {
    className?: string;
    query?: string;
    cashRegisterId?: string;
}


export default function CashRegisterList({ className, query = '', cashRegisterId }: Props) {

    const { data: session } = useSession();

    const rawParams = queryStringToObject(query);
    const user = session?.user as {
        id: string;
        name?: string | null;
        email?: string | null;
        username?: string;
        phone?: string;
        lastName?: string;
        roles?: any[];
        branches?: any[];
    };


    rawParams.userId = user?.id;
    // rawParams.status = 'OPEN';

    const finalQuery = new URLSearchParams(rawParams).toString();

    const { loading, error, cashRegisters, totalCashRegisters } = useFetchCashRegisters(finalQuery);
    if (error) {
        openNotification('error', error);
    }



    const hasOpenCashRegister = cashRegisters?.some((cr: CashRegister) => cr.status === 'OPEN');
    if (loading) return <Skeleton rows={4} columns={['CAJA', 'USUARIO', 'FECHA DE CREACION', 'ESTADO']} />;

    return (
        <>
            <ViewTitle className='mb-6' title="Facturacion" rightComponent={
                <>
                    {!hasOpenCashRegister && (
                        <CashRegisterModal />
                    )}


                </>
            } />

            <div className={className}>
                <div className="table-responsive mb-5 panel p-0 border-0 overflow-hidden">
                    <table className="table-hover">
                        <thead>
                            <tr>
                                <th className="text-left">CAJA</th>
                                <th className="text-left">USUARIO</th>
                                <th className="text-left">FECHA DE APERTURA</th>
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
                            {cashRegisters?.map((CashRegister) => {
                                return (
                                    <tr key={CashRegister.id}>
                                        <td className="text-left">{CashRegister.cashBox.name}</td>
                                        <td className="text-left">{CashRegister.user.name} {CashRegister.user.lastName}</td>
                                        <td className="text-left">{getFormattedDate(new Date(CashRegister.openingDate))}</td>
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

                                                <Tooltip title={CashRegister.status === 'OPEN' ? "Facturar" : "Ver Detalle"}>
                                                    <Link href={CashRegister.status === 'OPEN' ? `/invoices/${CashRegister.id}` : `/invoices/closed/${CashRegister.id}`}>
                                                        <Button variant="outline" size="sm" icon={
                                                            CashRegister.status === 'OPEN' ? <HiOutlinePaperAirplane className="size-4 rotate-90" /> : <TbEye className="size-4" />
                                                        } />
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
                        currentPage={Number.parseInt(rawParams?.page || '1')}
                        total={totalCashRegisters}
                        top={Number.parseInt(rawParams?.top || '10')}
                    />
                </div>
            </div>
        </>
    );
};
