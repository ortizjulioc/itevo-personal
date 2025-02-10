import { ViewTitle } from "@/components/common";
import CreateEnrollmentForm from "../components/enrollment-form/create-form";





export default function NewEnrollment() {
  return (
    <div>
            <ViewTitle className='mb-6' title="Crear Inscripcion" showBackPage />
      <CreateEnrollmentForm/>
    </div>
  )
}
