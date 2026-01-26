import ViewTitle from "@/components/common/ViewTitle";
import { CreateScholarshipForm } from "../components/scholarship-forms";

export default function CreateScholarshipPage() {
    return (
        <div>
            <ViewTitle className='mb-6' title="Crear Beca" showBackPage />
            <CreateScholarshipForm />
        </div>
    );
}
