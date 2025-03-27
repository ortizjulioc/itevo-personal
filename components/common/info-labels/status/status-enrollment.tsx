import React from 'react';
import { TbPointFilled } from 'react-icons/tb';

interface StatusEnrollmentProps {
  status: EnrollmentStatus;
}

enum EnrollmentStatus {
  WAITING = "WAITING",
  ENROLLED = "ENROLLED",
  COMPLETED = "COMPLETED",
  ABANDONED = "ABANDONED",
}

const StatusLabels = {
  [EnrollmentStatus.WAITING]: 'En espera',
  [EnrollmentStatus.ENROLLED]: 'Inscrito',
  [EnrollmentStatus.COMPLETED]: 'Completado',
  [EnrollmentStatus.ABANDONED]: 'Abandonado',
};

const StatusColors = {
  [EnrollmentStatus.WAITING]: 'text-orange-600',
  [EnrollmentStatus.ENROLLED]: 'text-blue-600',
  [EnrollmentStatus.COMPLETED]: 'text-green-600',
  [EnrollmentStatus.ABANDONED]: 'text-red-600',
};

export default function StatusEnrollment({ status }: StatusEnrollmentProps) {
  console.log('status', status);
  return (
    <span className={`flex items-center gap-1 font-bold min-w-max ${StatusColors[status]}`}>
      <TbPointFilled />
      {StatusLabels[status]}
    </span>
  );
}
