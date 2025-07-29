import React, { useEffect, useState } from 'react'
import { CourseBranchFormType } from '../form.config';
import { FormikErrors, FormikTouched } from 'formik';
import useFetchSchedule, { useFetchScheduleByCourseId } from '@/app/(defaults)/schedules/lib/use-fetch-schedules';
import CourseScheduleAssigner from './course-schedule-assigner';
import { assignScheduleToCourseBranch, unassignScheduleToCourseBranch } from '../../../lib/request';
import { useParams } from 'next/navigation';
import { openNotification } from '@/utils';
import ModalCreateSchedule from './modal-create-schedule';

interface ScheduleFieldProps {
  values: CourseBranchFormType;
  errors: FormikErrors<CourseBranchFormType>;
  touched: FormikTouched<CourseBranchFormType>;
  className?: string;
}

export default function ScheduleField({ className }: ScheduleFieldProps) {
  const { id } = useParams();
  const courseBranchId = Array.isArray(id) ? id[0] : id;
  const { schedules,fetchSchedulesData } = useFetchSchedule();
  const { schedules: courseSchedules } = useFetchScheduleByCourseId(courseBranchId);
  const [assignedSchedules, setAssignedSchedules] = useState<string[]>([]);
  const [modal, setModal] =useState<boolean>(false)

  const onChange = async (scheduleId: string) => {
    if (assignedSchedules.includes(scheduleId)) {
      await unassignSchedule(scheduleId);
      return;
    }
    await assignSchedule(scheduleId);
  }

  const unassignSchedule = async (scheduleId: string) => {
    const resp = await unassignScheduleToCourseBranch(courseBranchId, scheduleId);

    if (resp.success) {
      setAssignedSchedules(assignedSchedules.filter(s => s !== scheduleId));
    } else {
      openNotification('error', resp.message);
    }
  }

  const assignSchedule = async (scheduleId: string) => {
    const resp = await assignScheduleToCourseBranch(courseBranchId, scheduleId);

    if (resp.success) {
      setAssignedSchedules([...assignedSchedules, scheduleId]);
    } else {
      openNotification('error', resp.message);
    }
  }

  useEffect(() => {
    setAssignedSchedules(courseSchedules.map(cs => cs.id));
  }, [courseSchedules]);

  return (
    <div className={className}>
      <div className=''>

        <CourseScheduleAssigner
          availableSchedules={schedules}
          assignedSchedules={assignedSchedules}
          onChange={onChange}
          modal={modal}
          setModal={setModal}
      
        />
        <ModalCreateSchedule
          modal={modal}
          setModal={setModal}
          fetchSchedulesData={fetchSchedulesData}
          />

      </div>
    </div>
  );
}