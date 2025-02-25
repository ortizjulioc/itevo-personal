import React, { useState } from 'react'
import { CourseBranchFormType } from '../form.config';
import { FormikErrors, FormikTouched } from 'formik';
import useFetchSchedule, { useFetchScheduleByCourseId } from '@/app/(defaults)/schedules/lib/use-fetch-schedules';
import CourseScheduleAssigner from './course-schedule-assigner';
import { assignScheduleToCourseBranch } from '../../../lib/request';
import { useParams } from 'next/navigation';

interface ScheduleFieldProps {
  values: CourseBranchFormType;
  errors: FormikErrors<CourseBranchFormType>;
  touched: FormikTouched<CourseBranchFormType>;
  className?: string;
}

export default function ScheduleField({ values, errors, touched, className }: ScheduleFieldProps) {
  const { id } = useParams();
  const courseBranchId = Array.isArray(id) ? id[0] : id;
  
  const { schedules } = useFetchSchedule();
  const { schedules: courseSchedules } = useFetchScheduleByCourseId(courseBranchId);
  const [assignedSchedules, setAssignedSchedules] = useState<string[]>([]);

  const onChange = async(scheduleId:string) => {
    console.log(scheduleId);
    await assignSchedule(scheduleId);

  }

  const assignSchedule = async(scheduleId: string) => {
    const resp = await assignScheduleToCourseBranch(courseBranchId, scheduleId);
    console.log('resp:', resp);
  }

  console.log('courseBranchId:', courseBranchId);
  console.log('courseSchedules:', courseSchedules);

  return (
    <div className={className}>
      <div className=''>

        <CourseScheduleAssigner
          availableSchedules={schedules}
          assignedSchedules={assignedSchedules}
          onChange={onChange}
        />
      </div>
    </div>
  )
}
