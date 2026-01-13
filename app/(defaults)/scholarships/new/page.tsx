
import ViewTitle from "@/components/common/ViewTitle";
import CreateScholarshipForm from "../components/scholarship-forms/create-form";

export default function CreateScholarshipPage() {
    return (
        <div>
            <ViewTitle title="Crear beca" className="mb-6" />
            <CreateScholarshipForm />
        </div>
    );
}
