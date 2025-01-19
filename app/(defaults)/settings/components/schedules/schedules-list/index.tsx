'use client';
import { confirmDialog, formatPhoneNumber, openNotification, queryStringToObject } from "@/utils";
import { Button, Pagination } from "@/components/ui";
import {IconEdit, IconTrashLines} from "@/components/icon";
import Tooltip from "@/components/ui/tooltip";
import Link from "next/link";
import Skeleton from "@/components/common/Skeleton";
import OptionalInfo from "@/components/common/optional-info";
import useFetchSchedule from "../../../lib/schedules/use-fetch-schedules";
import { deleteSchedule } from "../../../lib/schedules/request";

interface Props {
    className?: string;
    query?: string;
}

export default function ScheduleList({ className, query = '' }: Props) {
    const params = queryStringToObject(query);
    const { loading, error, schedules,setSchedules,totalSchedules } = useFetchSchedule(query);
    if (error) {
        openNotification('error', error);
    }

    const onDelete = async (id: string) => {
        console.log('delete', id);
        confirmDialog({
            title: 'Eliminar Horario',
            text: '¿Seguro que quieres eliminar este horario?',
            confirmButtonText: 'Sí, eliminar',
            icon: 'error'
        }, async() => {
            const resp = await deleteSchedule(id);
            if (resp.success) {
                setSchedules(schedules?.filter((schedule) => schedule.id !== id));
                openNotification('success', 'Horario eliminado correctamente');
                return;
            } else {
                openNotification('error', resp.message);
            }
        });
    }

    if (loading) return <Skeleton rows={6} columns={['FECHA INICIO', 'FECHA FIN','DIA DE LA SEMANA','']} />;

    return (
        <div className={className}>
            <div className="table-responsive mb-5 panel p-0 border-0 overflow-hidden">
                <table className="table-hover">
                    <thead>
                        <tr>
                            <th>FECHA INICIO</th>
                            <th>FECHA FIN</th>
                            <th>DIA DE LA SEMANA</th>
                            <th />
                        </tr>
                    </thead>
                    <tbody>
                        {schedules?.length === 0 && (
                            <tr>
                                <td colSpan={5} className="text-center text-gray-500 dark:text-gray-600 italic">No se encontraron Sucursales registradas</td>
                            </tr>
                        )}
                        {schedules?.map((schedule) => {
                            return (
                                <tr key={schedule.id}>
                                    <td>
                                        <div className="whitespace-nowrap">{schedule.startTime}</div>
                                    </td>
                                    <td>
                                        <div className="whitespace-nowrap">{schedule.endTime}</div>
                                    </td>
                                    <td>
                                    <div className="whitespace-nowrap">{schedule.weekday}</div>
                                    </td>
                                   
                                    <td>
                                        <div className="flex gap-2 justify-end">
                                            <Tooltip title="Eliminar">
                                                <Button onClick={() => onDelete(schedule.id)} variant="outline" size="sm" icon={<IconTrashLines className="size-4" />} color="danger" />
                                            </Tooltip>
                                            <Tooltip title="Editar">
                                                <Link href={`/shedules/${schedule.id}`}>
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
                    currentPage={parseInt(params?.page || '1')}
                    total={totalSchedules}
                    top={parseInt(params?.top || '10')}
                />
            </div>
        </div>
    );
};
