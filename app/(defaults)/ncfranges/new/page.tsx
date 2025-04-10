import ViewTitle from "@/components/common/ViewTitle";
import CreateNcfRangeForm from "../components/ncfrange-forms/create-form";


export default function CreateNcfRange() {
    return (
        <div>
            <ViewTitle className='mb-6' title="Crear rango NCF" showBackPage />
            <CreateNcfRangeForm />
        </div>
    );
}
