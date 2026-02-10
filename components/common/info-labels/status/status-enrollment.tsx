import React from 'react';
import { TbPointFilled } from 'react-icons/tb';

interface StatusEnrollmentProps {
  status: EnrollmentStatus;
}

export enum EnrollmentStatus {
  WAITING = "WAITING",
  CONFIRMED = "CONFIRMED",
  ENROLLED = "ENROLLED",
  COMPLETED = "COMPLETED",
  ABANDONED = "ABANDONED",
}

const StatusLabels = {
  [EnrollmentStatus.WAITING]: 'En espera',
  [EnrollmentStatus.CONFIRMED]: 'Confirmado',
  [EnrollmentStatus.ENROLLED]: 'Inscrito',
  [EnrollmentStatus.COMPLETED]: 'Completado',
  [EnrollmentStatus.ABANDONED]: 'Abandonado',
};

const StatusColors = {
  [EnrollmentStatus.WAITING]: 'text-orange-600',
  [EnrollmentStatus.CONFIRMED]: 'text-blue-600',
  [EnrollmentStatus.ENROLLED]: 'text-indigo-600',
  [EnrollmentStatus.COMPLETED]: 'text-green-600',
  [EnrollmentStatus.ABANDONED]: 'text-red-600',
};

export default function StatusEnrollment({ status }: StatusEnrollmentProps) {

  return (
    <span className={`flex items-center gap-1 font-bold min-w-max ${StatusColors[status]}`}>
      <TbPointFilled />
      {StatusLabels[status]}
    </span>
  );
}
