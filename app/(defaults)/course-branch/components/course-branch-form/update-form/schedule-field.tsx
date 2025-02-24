import React from 'react'
import { CourseBranchFormType } from '../form.config';
import { FormikErrors, FormikTouched } from 'formik';
import useFetchSchedule from '@/app/(defaults)/schedules/lib/use-fetch-schedules';
import { Schedule } from '@prisma/client';

interface ScheduleFieldProps {
  values: CourseBranchFormType;
  errors: FormikErrors<CourseBranchFormType>;
  touched: FormikTouched<CourseBranchFormType>;
  className?: string;
}

function groupSchedulesByWeekday(schedules: Schedule[]): { [key: number]: Omit<Schedule, 'weekday' | 'deleted' | 'createdAt' | 'updatedAt'>[] } {
  const groupedByWeekday: { [key: number]: Omit<Schedule, 'weekday' | 'deleted' | 'createdAt' | 'updatedAt'>[] } = {};

  schedules.forEach(schedule => {
    if (!schedule.deleted) {
      const weekday = schedule.weekday;

      if (!groupedByWeekday[weekday]) {
        groupedByWeekday[weekday] = [];
      }

      groupedByWeekday[weekday].push({
        id: schedule.id,
        startTime: schedule.startTime,
        endTime: schedule.endTime
      });
    }
  });

  return groupedByWeekday;
}

export default function ScheduleField({ values, errors, touched, className }: ScheduleFieldProps) {
  const { schedules } = useFetchSchedule();
  console.log('schedules', schedules);
  console.log('groupedSchedules', groupSchedulesByWeekday(schedules));

  return (
    <div className={className}>
      <div className=''>
        <label htmlFor="fullName">Horarios </label>

      </div>
    </div>
  )
}
