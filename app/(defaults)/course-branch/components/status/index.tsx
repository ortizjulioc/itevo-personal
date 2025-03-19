import { CourseBranchStatus } from '@prisma/client';
import React from 'react'
import { TbPointFilled } from 'react-icons/tb';

interface StatusCourseBranchProps {
  status: CourseBranchStatus;
}

const StatusLabels = {
  [CourseBranchStatus.DRAFT]: 'Borrador',
  [CourseBranchStatus.WAITING]: 'En espera',
  [CourseBranchStatus.CONFIRMED]: 'Confirmado',
  [CourseBranchStatus.IN_PROGRESS]: 'En progreso',
  [CourseBranchStatus.COMPLETED]: 'Completado',
  [CourseBranchStatus.CANCELED]: 'Cancelado',
}

const StatusColors = {
  [CourseBranchStatus.DRAFT]: 'text-gray-600',
  [CourseBranchStatus.WAITING]: 'text-orange-600',
  [CourseBranchStatus.CONFIRMED]: 'text-blue-600',
  [CourseBranchStatus.IN_PROGRESS]: 'text-green-600',
  [CourseBranchStatus.COMPLETED]: 'text-teal-600',
  [CourseBranchStatus.CANCELED]: 'text-red-600',
}

// const StatusFeedback = {
//   [CourseBranchStatus.DRAFT]: 'Borrador',
//   [CourseBranchStatus.WAITING]: 'En espera',
//   [CourseBranchStatus.CONFIRMED]: 'Confirmado',
//   [CourseBranchStatus.IN_PROGRESS]: 'En progreso',
//   [CourseBranchStatus.COMPLETED]: 'Completado',
//   [CourseBranchStatus.CANCELED]: 'Cancelado',
// }

export default function StatusCourseBranch({ status }: StatusCourseBranchProps) {

  return (
    <span className={`flex items-center gap-1 font-bold ${StatusColors[status]}`}><TbPointFilled />{StatusLabels[status]}</span>
  )
}
