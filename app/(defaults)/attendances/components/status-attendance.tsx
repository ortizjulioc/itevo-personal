import { AttendanceStatus } from '@prisma/client';
import React from 'react';
import { TbPointFilled } from 'react-icons/tb';

interface StatusAttendanceProps {
  status: AttendanceStatus;
}

const StatusLabels = {
  [AttendanceStatus.PRESENT]: 'Presente',
  [AttendanceStatus.ABSENT]: 'Ausente',
  [AttendanceStatus.EXCUSED]: 'Excusa',
};

const StatusColors = {
  [AttendanceStatus.EXCUSED]: 'text-orange-600',
  [AttendanceStatus.PRESENT]: 'text-green-600',
  [AttendanceStatus.ABSENT]: 'text-red-600',
};

export default function StatusAttendance({ status }: StatusAttendanceProps) {
  
  return (
    <span className={`flex items-center gap-1 font-bold min-w-max ${StatusColors[status]}`}>
      <TbPointFilled />
      {StatusLabels[status]}
    </span>
  );
}
