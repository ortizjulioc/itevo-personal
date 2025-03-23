import ViewTitle from "@/components/common/ViewTitle";
import { CreatePromotionForm } from "../components/promotion-forms";

export default function CreateRole() {
    return (
        <div>
            <ViewTitle className='mb-6' title="Crear promoción" showBackPage />
            <CreatePromotionForm />
        </div>
    );
}
