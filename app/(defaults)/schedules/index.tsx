'use client'
import { ViewTitle } from '@/components/common'
import React, { useState } from 'react'
import SchedulesForm from './components/schedules-form'
import { Button } from '@/components/ui';
import { TbPlus, TbX } from 'react-icons/tb';
import useFetchSchedule from './lib/use-fetch-schedules';
import ScheduleList from './components/schedules-list';
import { deleteSchedule } from './lib/request';
import { openNotification } from '@/utils';

export default function Schedule() {
  const { schedules, setSchedules, loading } = useFetchSchedule();
  const [isFormVisible, setIsFormVisible] = useState(false);

  const onDelete = async (id: string) => {
    const resp = await deleteSchedule(id);
    if (resp.success) {
      openNotification('success', 'Horario eliminado correctamente');
      setSchedules((prev: any) => prev.filter((item: any) => item.id !== id));
    } else {
      openNotification('error', resp.message);
    }
  };

  const onNewSchedule = (schedule: any) => {
    console.log(schedule);
    setSchedules((prev: any) => [...prev, schedule]);
    setIsFormVisible(false);
  }

  const toggleForm = (value: boolean) => {
    setIsFormVisible(value);
  };

  return (
    <div>
      <div>
        <ViewTitle
          className='mb-4'
          title="Horario de clases"
          rightComponent={
            <div className="flex justify-end">
              {isFormVisible && (
                <Button
                  color="danger"
                  variant="default"
                  icon={<TbX className="size-4" />}
                  onClick={() => toggleForm(false)}
                  size="sm"
                  className="transition-all duration-200 hover:shadow-md"
                >
                  Cerrar
                </Button>
              )}
              {!isFormVisible && (
                <Button
                  variant="default"
                  icon={<TbPlus className="size-4" />}
                  onClick={() => toggleForm(true)}
                  size="sm"
                  className="transition-all duration-200 hover:shadow-md"
                >
                  Agregar horario
                </Button>
              )}
            </div>
          }
        />
      </div>
      <SchedulesForm
        onCreated={onNewSchedule}
        isFormVisible={isFormVisible}
        className="mb-6"
      />

      <ScheduleList loading={loading} onDeleted={onDelete} schedules={schedules} className="z-30" />
    </div>
  )
}
