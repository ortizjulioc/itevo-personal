'use client';
import { confirmDialog, openNotification, queryStringToObject } from "@/utils";
import { Button, Pagination } from "@/components/ui";
import { IconEdit, IconTrashLines } from "@/components/icon";
import Tooltip from "@/components/ui/tooltip";
import Link from "next/link";
import Skeleton from "@/components/common/Skeleton";
import { TbPointFilled } from "react-icons/tb";
import { HiOutlinePaperAirplane } from "react-icons/hi";
import { deleteCashRegister } from "../../../lib/cash-register-request";
import useFetchCashRegisters from "../../../lib/use-fetch-cash-register";


interface Props {
    className?: string;
    query?: string;
}

export default function CashRegisterList({ className, query = '' }: Props) {
    const params = queryStringToObject(query);
    const { loading, error, cashRegisters, totalCashRegisters, setCashRegisters } = useFetchCashRegisters(query);
    if (error) {
        openNotification('error', error);
    }

    const onDelete = async (id: string) => {

        confirmDialog({
            title: 'Eliminar Cash',
            text: '¿Seguro que quieres eliminar este CashRegistero?',
            confirmButtonText: 'Sí, eliminar',
            icon: 'error'
        }, async () => {
            const resp = await deleteCashRegister(id);
            if (resp.success) {
                setCashRegisters(cashRegisters?.filter((cashRegister) => cashRegister.id !== id));
                openNotification('success', 'Caja eliminada correctamente');
                return;
            }
            openNotification('error', resp.message);
        });
    }
    console.log('cashRegisters', cashRegisters);

    if (loading) return <Skeleton rows={7} columns={['CODIGO', 'NOMBRE', 'DESCRIPCION', 'COSTO', 'PRECIO', 'STOCK']} />;

    return (
        <div className={className}>
            <div className="table-responsive mb-5 panel p-0 border-0 overflow-hidden">
                <table className="table-hover">
                    <thead>
                        <tr>
                            <th className="text-left">CAJA</th>
                            <th className="text-left">USUARIO</th>
                            <th className="text-left">FECHA DE CREACION</th>
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
                                    <td className="text-left">{CashRegister.name}</td>
                                    <td className="text-left">{CashRegister.user.name}</td>
                                    <td className="text-left">{new Date(CashRegister.openingDate).toLocaleDateString()}</td>
                                    <td className="text-left">
                                        {CashRegister.status === 'OPEN' ? (
                                               <span className={`flex items-center gap-1 font-bold min-w-max text-green-600 italic`}>
                                               <TbPointFilled />
                                               Abierto
                                           </span>
                                        ) : (
                                            <span className={`flex items-center gap-1 font-bold min-w-max text-red-600 italic`}>
                                                <TbPointFilled />
                                                Cerrado
                                            </span>
                                        )}
                                    </td>


                                    <td>
                                        <div className="flex gap-2 justify-end">
                                            
                                            <Tooltip title="Facturar">
                                                <Link href={`/invoices/${CashRegister.id}`}>
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
    );
};
