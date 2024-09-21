import ViewTitle from "@/components/common/ViewTitle";
import { CreateUserForm } from "../user-forms";

export default function CreateUser() {
    return (
        <div>
            <ViewTitle className='mb-6' title="Crear usuario" showBackPage />
            <CreateUserForm />
        </div>
    );
}
