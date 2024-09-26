import ViewTitle from "@/components/common/ViewTitle";
import { CreateRoleForm } from "../components/role-forms";

export default function CreateRole() {
    return (
        <div>
            <ViewTitle className='mb-6' title="Crear role" showBackPage />
            <CreateRoleForm />
        </div>
    );
}
