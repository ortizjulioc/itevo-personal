import { ViewTitle } from "@/components/common";
import CreateEnrollmentForm from "../components/enrollment-form/create-form";



interface EnrollmentListProps {
  searchParams: Promise<{
    courseBranchId?: string;
    studentId?: string;
  }>;
}

export default async function NewEnrollment({ searchParams }: EnrollmentListProps) {
  const params = await searchParams;
  const courseBranchId = params?.courseBranchId || ''
  const studentId = params?.studentId || ''

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
