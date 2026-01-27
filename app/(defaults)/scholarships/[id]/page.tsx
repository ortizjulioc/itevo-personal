import ViewTitle from "@/components/common/ViewTitle";
import { UpdateScholarshipForm } from "../components/scholarship-forms";

interface Props {
    params: {
        id: string;
    };
}

export default function EditScholarshipPage({ params }: Props) {
    return (
        <div>
            <ViewTitle className='mb-6' title="Editar Beca" showBackPage />
            <UpdateScholarshipForm id={params.id} />
        </div>
    );
}
