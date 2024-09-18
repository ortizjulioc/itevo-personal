import ViewTitle from "@/components/common/ViewTitle";
import { UserForm } from "../components";

export default function CreateUser() {
    return (
        <div>
            <ViewTitle className='mb-6' title="Crear usuario" showBackPage />

            <UserForm />
        </div>
    );
}
