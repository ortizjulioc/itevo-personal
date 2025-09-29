'use client';
import { confirmDialog, openNotification, queryStringToObject } from "@/utils";
import { Button, Pagination } from "@/components/ui";
import { IconEdit, IconTrashLines } from "@/components/icon";
import Tooltip from "@/components/ui/tooltip";
import Link from "next/link";
import Skeleton from "@/components/common/Skeleton";

import { deleteCashBox } from "../../lib/request";
import useFetchCashBoxes from "../../lib/use-fetch-cash-boxes";

interface Props {
    className?: string;
    query?: string;
}

export default function CashBoxList({ className, query = '' }: Props) {
    const params = queryStringToObject(query);
    const { loading, error, CashBoxes, totalCashBoxes, setCashBoxes } = useFetchCashBoxes(query);
    if (error) {
        openNotification('error', error);
    }

    const onDelete = async (id: string) => {

        confirmDialog({
            title: 'Eliminar Caja fisica',
            text: '¿Seguro que quieres eliminar esta Caja fisica?',
            confirmButtonText: 'Sí, eliminar',
            icon: 'error'
        }, async () => {
            const resp = await deleteCashBox(id);
            if (resp.success) {
                setCashBoxes(CashBoxes?.filter((CashBox) => CashBox.id !== id));
                openNotification('success', 'Caja fisica eliminada correctamente');
                return;
            }
            openNotification('error', resp.message);
        });
    }

    if (loading) return <Skeleton rows={4} columns={['NOMBRE', 'UBICACION', 'SUCURSAL', ]} />;

    return (
        <div className={className}>
            <div className="table-responsive mb-5 panel p-0 border-0">
                <table className="table-hover">
                    <thead>
                        <tr>
                            <th className="text-left">NOMBRE</th>
                            <th className="text-left">UBICACION</th>
                            <th className="text-left">SUCURSAL</th>
                            <th />
                        </tr>
                    </thead>
                    <tbody>
                        {CashBoxes?.length === 0 && (
                            <tr>
                                <td colSpan={4} className="text-center text-gray-500 dark:text-gray-600 italic">No se encontraron cajas fisicas registradas</td>
                            </tr>
                        )}
                        {CashBoxes?.map((CashBox) => {
                            return (
                                <tr key={CashBox.id}>
                                    <td>
                                        <div className="whitespace-nowrap">{CashBox.name}</div>
                                    </td>
                                    <td>
                                        <div className="whitespace-nowrap">{CashBox.location}</div>
                                    </td>
                                    <td>
                                        <div className="whitespace-nowrap">{CashBox.branch.name}</div>
                                    </td>


                                    <td>
                                        <div className="flex gap-2 justify-end">
                                            <Tooltip title="Eliminar">
                                                <Button onClick={() => onDelete(CashBox.id)} variant="outline" size="sm" icon={<IconTrashLines className="size-4" />} color="danger" />
                                            </Tooltip>
                                            <Tooltip title="Editar">
                                                <Link href={`/cash-boxes/${CashBox.id}`}>
                                                    <Button variant="outline" size="sm" icon={<IconEdit className="size-4" />} />
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
                    total={totalCashBoxes}
                    top={Number.parseInt(params?.top || '10')}
                />
            </div>
        </div>
    );
};
