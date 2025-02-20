'use client';
import { confirmDialog, openNotification, queryStringToObject } from "@/utils";
import { Button, Pagination } from "@/components/ui";
import { IconEdit, IconPlusCircle, IconTrashLines } from "@/components/icon";
import Tooltip from "@/components/ui/tooltip";
import Skeleton from "@/components/common/Skeleton";
import { useState } from "react";
import { Schedule } from "@prisma/client";
import { convertToAmPm } from "@/utils/date";
import { TbPlus } from "react-icons/tb";
import { deleteSchedule } from "../../lib/request";
import useFetchSchedule from "../../lib/use-fetch-schedules";
import ScheduleModal from "../schedules-modal";

interface Props {
    className?: string;
    query?: string;
}

const WEEKDAY = [
    'Domingo',
    'Lunes',
    'Martes',
    'Miércoles',
    'Jueves',
    'Viernes',
    'Sábado',
]

export default function ScheduleList({ className, query = '' }: Props) {
    const params = queryStringToObject(query);
    const [openModal, setOpenModal] = useState(false);
    const [scheduleToEdit, setScheduleToEdit] = useState<Schedule | undefined>(undefined); // State for the schedule being edited

    const { loading, error, schedules, setSchedules, totalSchedules } = useFetchSchedule(query);
    
    if (error) {
        openNotification('error', error);
    }

    const onDelete = async (id: string) => {

        confirmDialog({
            title: 'Eliminar Horario',
            text: '¿Seguro que quieres eliminar este horario?',
            confirmButtonText: 'Sí, eliminar',
            icon: 'error'
        }, async () => {
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

    if (loading) return <Skeleton rows={6} columns={['FECHA INICIO', 'FECHA FIN', 'DIA DE LA SEMANA', '']} />;

    return (
        <div className={className}>
            <div className="flex justify-end mb-4">
                <Button
                    variant="default"
                    icon={<TbPlus className="size-4" />}
                    onClick={() => {
                        setScheduleToEdit(undefined); // Clear schedule when adding a new one
                        setOpenModal(true);
                    }}
                    size="sm"
                >
                    Agregar Horario
                </Button>
            </div>
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
                                <td colSpan={5} className="text-center text-gray-500 dark:text-gray-600 italic">No se encontraron horarios registrados</td>
                            </tr>
                        )}
                        {schedules?.map((schedule) => (
                            <tr key={schedule.id}>
                                <td>{convertToAmPm(schedule.startTime)}</td>
                                <td>{convertToAmPm(schedule.endTime)}</td>
                                <td>{WEEKDAY[schedule.weekday]}</td>
                                <td>
                                    <div className="flex gap-2 justify-end">
                                        <Tooltip title="Eliminar">
                                            <Button onClick={() => onDelete(schedule.id)} variant="outline" size="sm" icon={<IconTrashLines className="size-4" />} color="danger" />
                                        </Tooltip>
                                        <Tooltip title="Editar">
                                            <Button variant="outline" size="sm" icon={<IconEdit className="size-4" />} onClick={() => {
                                                setScheduleToEdit(schedule); 
                                                setOpenModal(true);
                                            }} />
                                        </Tooltip>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div>
                <Pagination
                    currentPage={parseInt(params?.page || '1')}
                    total={totalSchedules}
                    top={parseInt(params?.top || '10')}
                />
            </div>

            {/* Schedule Modal for editing/creating */}
            <ScheduleModal
                openModal={openModal}
                setOpenModal={setOpenModal}
                value={scheduleToEdit}
                setSchedules={setSchedules}
            />
        </div>
    );
}
