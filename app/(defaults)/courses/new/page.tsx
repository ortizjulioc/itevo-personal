import { ViewTitle } from "@/components/common";
import CreateCourseForm from "../components/course-form/create-form";



export default function NewCourse() {
  return (
    <div>
            <ViewTitle className='mb-6' title="Crear Curso" showBackPage />
      <CreateCourseForm />
    </div>
  )
}
