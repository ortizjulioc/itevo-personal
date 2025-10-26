// components/CourseScheduleAssigner.tsx
import React, { useState, useEffect } from 'react';
import Tooltip from '@/components/ui/tooltip';
import { convertTimeFrom24To12Format, getHoursDifferenceText } from '@/utils/date';
import { Schedule } from '@prisma/client';
import { IoMdAddCircleOutline } from 'react-icons/io';

interface CourseScheduleAssignerProps {
  availableSchedules: Schedule[];
  assignedSchedules: string[];
  onChange: (scheduleId: string) => Promise<void> | void;
  modal?: boolean;
  setModal: (modal: boolean) => void;
}

const weekdayNames = [
  'Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'
];

const CourseScheduleAssigner: React.FC<CourseScheduleAssignerProps> = ({
  availableSchedules,
  assignedSchedules,
  onChange,
  setModal
}) => {
  const [groupedSchedules, setGroupedSchedules] = useState<{ [key: number]: Schedule[] }>({});
  const [loading, setLoading] = useState(true);
  const [assigning, setAssigning] = useState<string | null>(null);

  useEffect(() => {
   
    // Cargamos los horarios de inmediato (sin esperar render inicial)
    const grouped = groupSchedulesByWeekday(availableSchedules);
    setGroupedSchedules(grouped);

    // Simulamos un pequeño delay visual para transición más suave
    const timer = setTimeout(() => {
      setLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [availableSchedules]);

  const handleToggleSchedule = async (scheduleId: string) => {
    try {
      setAssigning(scheduleId);
      await onChange(scheduleId);
    } finally {
      setAssigning(null);
    }
  };

  // 🔹 Si sigue cargando, mostramos el Skeleton
  if (loading) {
    return <CourseScheduleSkeleton />;
  }

  // 🔹 Si no hay horarios cargados en absoluto
  if (availableSchedules.length === 0) {
    return (
      <div className="max-w-2xl text-gray-500 italic">
        No hay horarios disponibles.
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      {/* Resumen de horarios asignados */}
      <div className='mb-4'>
        <label>Horarios del curso</label>
        {assignedSchedules.length > 0 ? (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <ul className="list-disc pl-5 text-gray-800">
              {assignedSchedules.map(id => {
                const schedule = availableSchedules.find(s => s.id === id);
                if (!schedule) return null;
                return (
                  <li key={id}>
                    {weekdayNames[schedule.weekday]}:{' '}
                    {convertTimeFrom24To12Format(schedule.startTime)} -{' '}
                    {convertTimeFrom24To12Format(schedule.endTime)} (
                    {getHoursDifferenceText(schedule.startTime, schedule.endTime)})
                  </li>
                );
              })}
            </ul>
          </div>
        ) : (
          <p className="mt-2 italic text-gray-500">
            Este curso aún no tiene horarios asignados.
          </p>
        )}
      </div>

      {/* Botón para agregar horario */}
      <div className='flex items-center gap-2 mb-4'>
        <h3 className="text-lg font-medium text-gray-700 leading-none">Horarios disponibles</h3>
        <Tooltip title='Agregar nuevo Horario'>
          <button
            type="button"
            className="p-0.5 text-primary transition-colors duration-200 hover:text-primary/80"
            onClick={() => setModal(true)}
          >
            <IoMdAddCircleOutline className="h-6 w-6 align-middle" />
          </button>
        </Tooltip>
      </div>

      {/* Lista de horarios */}
      <div className="space-y-4">
        {weekdayNames.map((day, index) => {
          const daySchedules = groupedSchedules[index] || [];
          if (daySchedules.length === 0) return null;

          return (
            <div key={index} className="border-b pb-2">
              <h3 className="text-lg font-medium text-gray-700">{day}</h3>
              <div className="mt-2 space-y-2">
                {daySchedules.map((schedule) => {
                  const isAssigned = assignedSchedules.includes(schedule.id);
                  const isLoading = assigning === schedule.id;

                  return (
                    <div
                      key={schedule.id}
                      className={`flex items-center justify-between p-2 rounded-md cursor-pointer transition-colors ${
                        isAssigned
                          ? 'bg-primary-light border border-primary'
                          : 'bg-gray-100 hover:bg-gray-200'
                      }`}
                      onClick={() => !isLoading && handleToggleSchedule(schedule.id)}
                    >
                      <span className="text-gray-800 flex items-center gap-2">
                        {isLoading && (
                          <span className="inline-block w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></span>
                        )}
                        {convertTimeFrom24To12Format(schedule.startTime)} -{' '}
                        {convertTimeFrom24To12Format(schedule.endTime)} (
                        {getHoursDifferenceText(schedule.startTime, schedule.endTime)})
                      </span>
                      <span
                        className={`font-medium ${
                          isAssigned ? 'text-primary' : 'text-gray-500'
                        }`}
                      >
                        {isLoading ? 'Actualizando...' : isAssigned ? 'Asignado' : 'Asignar'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// 👉 Skeleton de carga visual mientras se obtienen los horarios
function CourseScheduleSkeleton() {
  return (
    <div className="max-w-2xl space-y-6 animate-pulse">
      <div className="space-y-3">
        <div className="w-40 h-4 bg-gray-300 rounded"></div>
        <div className="w-full h-20 bg-gray-200 rounded"></div>
      </div>

      {[...Array(3)].map((_, i) => (
        <div key={i} className="space-y-3">
          <div className="w-32 h-4 bg-gray-300 rounded"></div>
          <div className="space-y-2">
            {[...Array(2)].map((_, j) => (
              <div key={j} className="w-full h-10 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// Agrupar horarios por día
function groupSchedulesByWeekday(schedules: Schedule[]): { [key: number]: Schedule[] } {
  const groupedByWeekday: { [key: number]: Schedule[] } = {};

  schedules.forEach(schedule => {
    if (!schedule.deleted) {
      const weekday = schedule.weekday;
      if (!groupedByWeekday[weekday]) groupedByWeekday[weekday] = [];
      groupedByWeekday[weekday].push(schedule);
    }
  });

  return groupedByWeekday;
}

export default CourseScheduleAssigner;
