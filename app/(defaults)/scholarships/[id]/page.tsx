'use client';
import Skeleton from "@/components/common/Skeleton";
import ViewTitle from "@/components/common/ViewTitle";
import { openNotification } from "@/utils";
import { useFetchScholarshipById } from "../libs/use-fetch-scholarships";
import UpdateScholarshipForm from "../components/scholarship-forms/update-form";


export default function UpdateScholarshipPage({ params }: { params: { id: string } }) {
    const { scholarship, loading, error } = useFetchScholarshipById(params.id);

    if (error) {
        openNotification('error', error);
    }

    if (loading) return <Skeleton rows={1} columns={['NOMBRE', 'PORCENTAJE']} />;

    if (!scholarship) return <div>No se encontró la beca</div>;

    return (
        <div>
            <ViewTitle title="Editar beca" className="mb-6" />
            <UpdateScholarshipForm initialValues={scholarship} />
        </div>
    );
}
