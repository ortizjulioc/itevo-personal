import ViewTitle from "@/components/common/ViewTitle";
import CreateCashBoxForm from "../components/cash-box-forms/create-form";



export default function CreateCashBoxRange() {
    return (
        <div>
            <ViewTitle className='mb-6' title="Crear Caja fisica" showBackPage />
           <CreateCashBoxForm />

        </div>
    );
}
