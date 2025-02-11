'use client';
import { confirmDialog, openNotification, queryStringToObject } from "@/utils";
import { Button, Pagination } from "@/components/ui";
import { IconEdit, IconTrashLines } from "@/components/icon";
import Tooltip from "@/components/ui/tooltip";
import Link from "next/link";

import Skeleton from "@/components/common/Skeleton";
import useFetchHolidays from "../../lib/use-fetch-holidays";
import { deleteHoliday } from "../../lib/request";




interface Props {
    className?: string;
    query?: string;
}

export default function HolidayList({ className, query = '' }: Props) {
    const params = queryStringToObject(query);
    const { loading, error, holidays, totalHolidays, setHolidays } = useFetchHolidays(query);
    if (error) {
        openNotification('error', error);
    }


    const onDelete = async (id: string) => {
  s
        confirmDialog({
            title: 'Eliminar Dia Feriado',
            text: '¿Seguro que quieres eliminar este dia festido?',
            confirmButtonText: 'Sí, eliminar',
            icon: 'error'
        }, async () => {
            const resp = await deleteHoliday(id);
            if (resp.success) {
                setHolidays(holidays?.filter((holiday) => holiday.id !== id));
                openNotification('success', 'dia feriado eliminado correctamente');
                return;
            } else {
                openNotification('error', resp.message);
            }
        });
    }

    if (loading) return <Skeleton rows={6} columns={['NOMBRE','DIA','ES RECURRENTE']} />;

    return (
        <div className={className}>
            <div className="table-responsive mb-5 panel p-0 border-0 overflow-hidden">
                <table className="table-hover">
                    <thead>
                        <tr>
                            <th>NOMBRE</th>
                            <th>DIA</th>
                            <th>ES RECURRENTE</th>
                            <th />
                        </tr>
                    </thead>
                    <tbody>
                        {holidays?.length === 0 && (
                            <tr>
                                <td colSpan={6} className="text-center text-gray-500 dark:text-gray-600 italic">No se encontraron dias feriados registrados</td>
                            </tr>
                        )}
                        {holidays?.map((holiday) => {
                            return (
                                <tr key={holiday.id}>
                                    <td>
                                        {holiday.name}
                                    </td>
                                    <td>
                                        {new Date(holiday.date).toLocaleDateString()}
                                    </td>
                                    <td>
                                        {holiday.isRecurring ? 'Si' : 'No'}
                                    </td>

                                    <td>
                                        <div className="flex gap-2 justify-end">
                                            <Tooltip title="Eliminar">
                                                <Button onClick={() => onDelete(holiday.id)} variant="outline" size="sm" icon={<IconTrashLines className="size-4" />} color="danger" />
                                            </Tooltip>
                                            <Tooltip title="Editar">
                                                <Link href={`/holidays/${holiday.id}`}>
                                                    <Button variant="outline" size="sm" icon={<IconEdit className="size-4" />} />
                                                </Link>
                                            </Tooltip>
                                            {/* ALTERNATIVA */}
                                            {/* <Button onClick={() => onDelete(Holidayt.id)} variant="outline" size="sm" color="danger" >Eliminar</Button>
                                            <Link href={`/Holidays/${Holidayt.id}`}>
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
                    currentPage={parseInt(params?.page || '1')}
                    total={totalHolidays}
                    top={parseInt(params?.top || '10')}
                />
            </div>
        </div>
    );
};
