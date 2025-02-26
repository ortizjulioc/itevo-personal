'use client';
import { SvgSpinner } from "@/assets/svgs/loading-1.";
import Loading from "@/components/layouts/loading";
import { confirmDialog } from "@/utils";
import { convertTimeFrom24To12Format, getHoursDifferenceText } from "@/utils/date";
import { Schedule } from "@prisma/client";

interface Props {
    className?: string;
    onDeleted?: (id: string) => void;
    schedules: Schedule[];
    loading?: boolean;
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

function groupSchedulesByWeekday(schedules: Schedule[]): { [key: number]: Omit<Schedule, 'weekday' | 'deleted'>[] } {
    const groupedByWeekday: { [key: number]: Omit<Schedule, 'weekday' | 'deleted'>[] } = {};

    schedules.forEach(schedule => {
        if (!schedule.deleted) {
            const weekday = schedule.weekday;
            if (!groupedByWeekday[weekday]) {
                groupedByWeekday[weekday] = [];
            }
            groupedByWeekday[weekday].push({
                id: schedule.id,
                startTime: schedule.startTime,
                endTime: schedule.endTime,
                createdAt: schedule.createdAt,
                updatedAt: schedule.updatedAt
            });
        }
    });

    return groupedByWeekday;
}

export default function ScheduleList({ className, schedules, onDeleted, loading }: Props) {
    const groupedSchedules = groupSchedulesByWeekday(schedules);

    const handleDeleteSchedule = (id: string) => {
        confirmDialog({
            title: 'Eliminar horario',
            text: '¿Seguro que quieres eliminar este horario?',
            confirmButtonText: 'Sí, eliminar',
            icon: 'error'
        }, async () => onDeleted?.(id));
    };

    return (
        <div className={`panel ${className}`}>
            {loading && (
                <div className="flex items-center justify-center">
                    <SvgSpinner className="size-14" />
                </div>
            )}

            {/* Visualización de horarios por día */}
            <div className="">
                {WEEKDAY.map((day, index) => {
                    const daySchedules = groupedSchedules[index] || [];
                    if (daySchedules.length === 0) return null;

                    return (
                        <div key={index} className="border-b pb-2">
                            <h3 className="text-lg font-medium text-gray-700">{day}</h3>
                            <div className="mt-2 space-y-2">
                                {daySchedules.map((schedule) => (
                                    <div
                                        key={schedule.id}
                                        className="flex items-center justify-between p-2 bg-gray-100 hover:bg-gray-200 rounded-md"
                                    >
                                        <span className="text-gray-800">
                                            {convertTimeFrom24To12Format(schedule.startTime)} - {convertTimeFrom24To12Format(schedule.endTime)} ({getHoursDifferenceText(schedule.startTime, schedule.endTime)})
                                        </span>
                                        <button
                                            onClick={() => handleDeleteSchedule(schedule.id)}
                                            className="text-red-500 hover:text-red-700 font-medium"
                                        >
                                            Eliminar
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
