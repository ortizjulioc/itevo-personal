import { CourseBranch } from '@prisma/client';
import React, { useEffect, useState } from 'react'
import apiRequest from '@/utils/lib/api-request/request';
import PromotionLabel from './promotion-label';
import BranchLabel from './branch-label';
import CourseLabel from './course-label';
import TeacherLabel from './teacher-label';

export default function CourseBranchLabel({ CourseBranchId }: { CourseBranchId: string }) {
  const [courseBranch, setCourseBranch] = useState<CourseBranch | null>(null);

  const fetchCourseBranchById = async () => {
    try {
      const response = await apiRequest.get<CourseBranch>(`/course-branch/${CourseBranchId}`);
   
      if (response.success && response.data) {
        setCourseBranch(response.data);
      }
    } catch (error) {
      console.error('Error fetching single courseBranch:', error);
    }
  };

  useEffect(() => {
    fetchCourseBranchById();
  }, []);

  return (
    <>
      {courseBranch ? (
        <>
          <CourseLabel courseId={courseBranch.courseId} /> {' || '}
          <TeacherLabel teacherId={courseBranch.teacherId} /> {' || '}
          <BranchLabel branchId={courseBranch.branchId} /> {' || '}
          <PromotionLabel promotionId={courseBranch.promotionId} />
        </>
      ) : (
        '...'
      )}
    </>

  )
}
