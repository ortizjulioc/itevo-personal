
import React, { useEffect, useState } from 'react';
import apiRequest from '@/utils/lib/api-request/request';
import ModalityTag from '@/app/(defaults)/course-branch/components/modality';
import { formatSchedule } from '@/utils/schedule';
import { CourseBranch } from '@/app/(defaults)/course-branch/lib/use-fetch-course-branch';

type Props = {
  CourseBranchId: string;
  isSelected?: boolean;
  showTeacher?: boolean;

};

export default function CourseBranchLabel({ CourseBranchId, isSelected, showTeacher = true }: Props) {
  const [courseBranch, setCourseBranch] = useState<CourseBranch | null>(null);

  useEffect(() => {
    const fetchCourseBranchById = async () => {
      try {
        const response = await apiRequest.get<CourseBranch>(`/course-branch/${CourseBranchId}`);
        if (response.success && response.data) {
          console.log('response course branch', response);
          setCourseBranch(response.data);
        }
      } catch (error) {
        console.error('Error fetching single courseBranch:', error);
      }
    };
    fetchCourseBranchById();
  }, [CourseBranchId]);

  return courseBranch ? (
    <div
      className={`flex items-center justify-between p-2 rounded-md cursor-pointer transition px-4
        ${isSelected ? 'bg-gray-100 dark:bg-gray-700' : 'hover:bg-gray-50 dark:hover:bg-gray-600'}`}
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
