import ViewTitle from "@/components/common/ViewTitle";
import { CreateUserForm } from "../components";

export default function CreateUser() {
    return (
        <div>
            <ViewTitle className='mb-6' title="Crear usuario" showBackPage />
            <CreateUserForm />
        </div>
    );
}
