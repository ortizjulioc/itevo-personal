import { ViewTitle } from "@/components/common";
import CreateCourseBranchForm from "../components/course-branch-form/create-form";




export default function NewCourse() {
    return (
        <div>
            <ViewTitle className='mb-6' title="Crear Oferta academica" showBackPage />
            <CreateCourseBranchForm />
        </div>
    )
}
