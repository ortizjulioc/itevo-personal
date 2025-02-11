'use client';
import { ViewTitle } from "@/components/common";
import { useFetchStudentById } from "../../lib/use-fetch-students";
import StudentDetails from "../../components/student-details/student-details";
import { objectToQueryString } from "@/utils";
import StudentEnrollments from "../../components/student-details/student-enrollments";





export default function StudentView({ params, searchParams }: { params: { id: string }, searchParams: Record<string, any> }) {

    const id = params?.id; // Extraer el ID de params
    const query = objectToQueryString({ ...searchParams, id }); // Combinar id con searchParams
    const { loading, student } = useFetchStudentById(id);

    return (
        <div>
            <ViewTitle className='mb-6' title="Vista de estudiante" showBackPage />

            {loading && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-gray-200  dark:bg-gray-700 animate-pulse rounded-md h-70 "></div>
                    <div className="bg-gray-200 dark:bg-gray-700 animate-pulse rounded-md h-70 md:col-span-2"></div>
                </div>
            )}

            {!loading && student && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <StudentDetails student={student} />
                    <StudentEnrollments query={query} />
                </div>
            )}

        </div>
    )
}
