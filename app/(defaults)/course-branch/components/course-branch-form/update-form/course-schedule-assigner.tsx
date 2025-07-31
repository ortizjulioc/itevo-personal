// components/CourseScheduleAssigner.tsx
import { Button } from '@/components/ui';
import Tooltip from '@/components/ui/tooltip';
import { convertTimeFrom24To12Format, getHoursDifferenceText } from '@/utils/date';
import { Schedule } from '@prisma/client';
import React from 'react';
import { IoMdAdd, IoMdAddCircleOutline } from 'react-icons/io';

interface CourseScheduleAssignerProps {
  availableSchedules: Schedule[]; // Horarios existentes en el sistema
  assignedSchedules: string[]; // IDs de horarios ya asignados al curso
  onChange: (scheduleId: string) => void; // Callback para actualizar asignaciones
  modal?: boolean,
  setModal: (modal: boolean) => void
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
  const groupedSchedules = groupSchedulesByWeekday(availableSchedules);

  const handleToggleSchedule = (scheduleId: string) => {
    onChange(scheduleId);
  };

  return (
    <div className="max-w-2xl">
      {/* Resumen de horarios asignados */}
      <div className='mb-4'>
        <label htmlFor="">Horarios del curso</label>
        {assignedSchedules.length > 0 ? (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <ul className="list-disc pl-5 text-gray-800">
              {assignedSchedules.map(id => {
                const schedule = availableSchedules.find(s => s.id === id);
                if (!schedule) return null;
                return (
                  <li key={id}>
                    {weekdayNames[schedule.weekday]}: {convertTimeFrom24To12Format(schedule.startTime)} - {convertTimeFrom24To12Format(schedule.endTime)} ({getHoursDifferenceText(schedule.startTime, schedule.endTime)})
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


      <div className='flex  items-center  gap-2 mb-4'>
        <h3 className="text-lg font-medium text-gray-700 leading-none">Horarios disponibles</h3>
        <Tooltip title='Agregar nuevo Horario'>
          <button type="button" className="p-0.5 text-primary transition-colors duration-200 hover:text-primary/80" onClick={() => setModal(true)}>
            <IoMdAddCircleOutline className="h-6 w-6 align-middle" />
          </button>
        </Tooltip>
      </div>


      {/* Lista de horarios disponibles */}
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
                  return (
                    <div
                      key={schedule.id}
                      className={`flex items-center justify-between p-2 rounded-md cursor-pointer transition-colors ${isAssigned
                        ? 'bg-primary-light border border-primary'
                        : 'bg-gray-100 hover:bg-gray-200'
                        }`}
                      onClick={() => handleToggleSchedule(schedule.id)}
                    >
                      <span className="text-gray-800">
                        {convertTimeFrom24To12Format(schedule.startTime)} - {convertTimeFrom24To12Format(schedule.endTime)} ({getHoursDifferenceText(schedule.startTime, schedule.endTime)})
                      </span>
                      <span className={`font-medium ${isAssigned ? 'text-primary' : 'text-gray-500'
                        }`}>
                        {isAssigned ? 'Asignado' : 'Asignar'}
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

// Reutilizamos la función groupSchedulesByWeekday
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

export default CourseScheduleAssigner;