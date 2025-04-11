'use client';
import { confirmDialog, openNotification, queryStringToObject } from "@/utils";
import { Button, Pagination } from "@/components/ui";
import { IconEdit, IconTrashLines } from "@/components/icon";
import Tooltip from "@/components/ui/tooltip";
import Link from "next/link";
import Skeleton from "@/components/common/Skeleton";
import useFetchCashRegisters from "../../lib/use-fetch-cash-register";
import { deleteCashRegister } from "../../lib/cash-register-request";
import { TbPointFilled } from "react-icons/tb";



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
                setCashRegisters(cashRegisters?.filter((CashRegister) => CashRegister.id !== id));
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
                                            <Tooltip title="Eliminar">
                                                <Button onClick={() => onDelete(CashRegister.id)} variant="outline" size="sm" icon={<IconTrashLines className="size-4" />} color="danger" />
                                            </Tooltip>
                                            <Tooltip title="Editar">
                                                <Link href={`/CashRegisters/${CashRegister.id}`}>
                                                    <Button variant="outline" size="sm" icon={<IconEdit className="size-4" />} />
                                                </Link>
                                            </Tooltip>
                                            {/* ALTERNATIVA */}
                                            {/* <Button onClick={() => onDelete(Role.id)} variant="outline" size="sm" color="danger" >Eliminar</Button>
                                            <Link href={`/Roles/${Role.id}`}>
                                                <Button variant="outline" size="sm">Editar</Button>
                                            </Link> */}
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
