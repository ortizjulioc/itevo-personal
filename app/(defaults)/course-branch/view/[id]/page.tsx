'use client';
import { ViewTitle } from "@/components/common";
import { objectToQueryString } from "@/utils";
import { useFetchCourseBranchById } from "../../lib/use-fetch-course-branch";
import CourseBranchDetails from "../../components/course-branch-details/course-branch-details";
import CourseBranchEnrollments from "../../components/course-branch-details/course-branch-enrollments";





export default function CourseBranchView({ params, searchParams }: { params: { id: string }, searchParams: Record<string, any> }) {

    const id = params?.id; // Extraer el ID de params
    const query = objectToQueryString({ ...searchParams,courseBranchId:id }); // Combinar id con searchParams
    const { loading, courseBranch } = useFetchCourseBranchById(id);

    return (
        <div>
            <ViewTitle className='mb-6' title="Vista de Oferta Academica" showBackPage />

            {loading && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-gray-200  dark:bg-gray-700 animate-pulse rounded-md h-70 md:col-span-2 "></div>
                    <div className="bg-gray-200 dark:bg-gray-700 animate-pulse rounded-md h-70 "></div>
                </div>
            )}

            {!loading && courseBranch && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <CourseBranchDetails courseBranch={courseBranch} />
                    <CourseBranchEnrollments query={query} />
                </div>
            )}

        </div>
    )
}
