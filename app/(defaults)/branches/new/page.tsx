import ViewTitle from "@/components/common/ViewTitle";
import { CreateBranchForm } from "../components/branch-forms";

export default function CreateBranch() {
    return (
        <div>
            <ViewTitle className='mb-6' title="Crear Sucursal" showBackPage />
            <CreateBranchForm />
        </div>
    );
}
