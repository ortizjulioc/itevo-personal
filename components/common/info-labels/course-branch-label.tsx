
import React, { useEffect, useState } from 'react';
import apiRequest from '@/utils/lib/api-request/request';
import ModalityTag from '@/app/(defaults)/course-branch/components/modality';
import { formatSchedule } from '@/utils/schedule';
import { CourseBranch } from '@/app/(defaults)/course-branch/lib/use-fetch-course-branch';
import OptionalInfo from '../optional-info';

type Props = {
  CourseBranchId?: string;
  isSelected?: boolean;
  showTeacher?: boolean;
  clickable?: boolean;
  courseBranch?: CourseBranch | null;
};

export default function CourseBranchLabel({ CourseBranchId, isSelected, showTeacher = true, clickable = false, courseBranch: courseBranchFromProps }: Props) {
  const [courseBranch, setCourseBranch] = useState<CourseBranch | null>(courseBranchFromProps || null);
  const [noData, setNoData] = useState(false);
  useEffect(() => {
    if (!courseBranchFromProps && CourseBranchId) {
      const fetchCourseBranchById = async () => {
        try {
          const response = await apiRequest.get<CourseBranch>(`course-branch/${CourseBranchId}`);
          const data = response.data;

          if (
            response.success &&
            data &&
            typeof data === 'object' &&
            Object.keys(data).length > 0
          ) {
            setCourseBranch(data);
            setNoData(false);
          } else {
            setNoData(true);
            setCourseBranch(null);
          }
        } catch (error) {
          console.error('Error fetching single courseBranch:', error);
          setNoData(true); // podrías separar errores reales si lo deseas
        }
      };
      fetchCourseBranchById();
    } else if (courseBranchFromProps) {
      setCourseBranch(courseBranchFromProps);
    }

  }, [CourseBranchId, courseBranchFromProps]);

  if (noData) {
    return (
      <div className="p-3">
        <OptionalInfo message="No se encontraron datos del curso." />
      </div>
    );
  }

  return courseBranch ? (
    <div
      className={`flex items-center justify-between p-2 rounded-md  transition px-4
        ${isSelected ? 'bg-gray-100 dark:bg-gray-700' : ''}
        ${clickable ? 'cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-600' : ''}`}
    >
      <div className="flex flex-col">
        <div>
          <span className="font-semibold text-base text-black dark:text-white mr-2">
            {courseBranch?.course?.name}
          </span>
          <ModalityTag modality={courseBranch.modality} />
        </div>
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {showTeacher && (
            <>
              {courseBranch?.teacher?.firstName} {courseBranch?.teacher?.lastName} |{' '}
            </>
          )}
          {courseBranch?.branch?.name}
        </span>

        {courseBranch.schedules && (
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {formatSchedule(courseBranch.schedules)}
          </span>
        )}
      </div>

    </div>
  ) : (
    null
  );
}
