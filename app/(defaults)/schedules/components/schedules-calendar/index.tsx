'use client'
import { Button } from '@/components/ui'
import React, { useState } from 'react'
import { TbPlus } from 'react-icons/tb'

const WEEKDAYS = [
  'Domingo',
  'Lunes',
  'Martes',
  'Miércoles',
  'Jueves',
  'Viernes',
  'Sábado',
];

interface Schedule {
  startTime: string;
  endTime: string;
}

export default function SchedulesCalendar() {
  const [schedules, setSchedules] = useState([[], [], [], [], [], [], []] as Schedule[][]);

  const newSchedule = (index: number) => async () => {
    // create new schedule locally
    const newSchedules = schedules.map((s, i) => {
      if (i === index) {
        return [...s, { startTime: '', endTime: '' }];
      }
      return s;
    });
    setSchedules(newSchedules);
  }

  console.log(schedules);
  return (
    <div>
      <div className="panel">
        {WEEKDAYS.map((day, index) => (
          <div key={day} className="mb-2">
            <div className='border-b border-gray-200 py-2'>
              <h3 className='text-xl font-semibold'>{day}</h3>
            </div>

            {schedules[index]?.length === 0 && (
              <div className='text-center text-gray-500 italic py-4'>
                No hay horarios para este día
              </div>
            )}

            <div className='flex justify-center items-center w-full'>
              <Button
                size='sm'
                variant='outline'
                onClick={newSchedule(index)}
                icon={<TbPlus className='text-xs' />}
              >
                Nuevo horario
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div >
  )
}
