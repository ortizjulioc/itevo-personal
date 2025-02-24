import React from 'react'
import { CourseBranchFormType } from '../form.config';
import { FormikErrors, FormikTouched } from 'formik';
import { FormItem } from '@/components/ui';
import useFetchSchedule from '@/app/(defaults)/schedules/lib/use-fetch-schedules';

interface ScheduleFieldProps {
  values: CourseBranchFormType;
  errors: FormikErrors<CourseBranchFormType>;
  touched: FormikTouched<CourseBranchFormType>;
  className?: string;
}

export default function ScheduleField({ values, errors, touched, className }: ScheduleFieldProps) {
  const { schedules } = useFetchSchedule();
  console.log('schedules', schedules);
  return (
    <div className={className}>
      <div className=''>
        <label htmlFor="fullName">Horarios </label>
        
      </div>
    </div>
  )
}
