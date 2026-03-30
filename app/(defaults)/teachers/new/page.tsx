import { ViewTitle } from "@/components/common";
import CreateTeacherForm from "../components/teacher-form/create-form";


export default function NewTeacher() {
    return (
        <div>
            <ViewTitle className='mb-6' title="Crear Profesor" showBackPage />
            <CreateTeacherForm />
        </div>
    )
}
