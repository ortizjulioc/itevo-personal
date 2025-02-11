import { ViewTitle } from "@/components/common";
import CreateEnrollmentForm from "../components/enrollment-form/create-form";



interface EnrollmentListProps {
  searchParams?: {
    courseBranchId?: string;
    studentId?: string;
  };
}

export default function NewEnrollment({ searchParams }: EnrollmentListProps) {
  const courseBranchId = searchParams?.courseBranchId || ''
  const studentId = searchParams?.studentId || ''

  console.log('oferta academica', courseBranchId)

  return (
    <div>
      <ViewTitle className='mb-6' title="Crear Inscripcion" showBackPage />
      <CreateEnrollmentForm
        courseBranchId={courseBranchId}
        studentId={studentId}
      />
    </div>
  )
}
