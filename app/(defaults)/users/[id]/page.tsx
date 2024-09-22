import { ViewTitle } from "@/components/common";
import { fetchUserById } from "../lib/request";
import { UpdateUserForm } from "../components/user-forms";


export default async function EditUser ({ params }: { params: { id: string } }) {
    const { id } = params;

    const response = await fetchUserById(id);
    console.log(response);
    return (
        <div>
            <ViewTitle className='mb-6' title="Editar usuario" showBackPage />
            {response?.data && <UpdateUserForm initialValues={response.data} />}
        </div>
    )
}
