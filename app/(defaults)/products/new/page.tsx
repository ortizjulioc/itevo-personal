import ViewTitle from "@/components/common/ViewTitle";
import CreateProductForm from "../components/product-forms/create-form";
import useFetchSetting from "../../settings/lib/use-fetch-settings";

export default function CreateProduct() {
    return (
        <div>
            <ViewTitle className='mb-6' title="Crear producto" showBackPage />
            <CreateProductForm />
        </div>
    );
}
