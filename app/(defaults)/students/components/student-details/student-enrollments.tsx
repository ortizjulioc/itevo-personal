'use client';
import { openNotification, queryStringToObject } from "@/utils";

import Skeleton from "@/components/common/Skeleton";
import StudentLabel from "@/components/common/info-labels/student-label";
import CourseBranchLabel from "@/components/common/info-labels/course-branch-label";
import { ENROLLMENT_STATUS } from "@/constants/enrollment.status.constant";
import useFetchEnrollments from "@/app/(defaults)/enrollments/lib/use-fetch-enrollments";
import { Pagination } from "@/components/ui";





interface Props {
    className?: string;
    query?: string;
}

export default function StudentEnrollments({ className, query = '' }: Props) {
    const params = queryStringToObject(query);
    const { loading, error, enrollments, totalEnrollments, setEnrollments } = useFetchEnrollments(query);
    if (error) {
        openNotification('error', error);
    }

    const enrollmentStatus = [
          { value: ENROLLMENT_STATUS.WAITING, label: 'En espera' },
          { value: ENROLLMENT_STATUS.ENROLLED, label: 'Inscrito' },
          { value: ENROLLMENT_STATUS.COMPLETED, label: 'Completado' },
          { value: ENROLLMENT_STATUS.ABANDONED, label: 'Abandonado' },
      ];
  
    if (loading) return <Skeleton rows={3} columns={['OFERTA ACADEMICA','FECHA DE INSCRIPCION','ESTADO']} />;

    return (
        <div className='col-span-2'>
            <h1 className="text-2xl font-semibold dark:text-white-light mb-3">Inscripciones</h1>
            <div className="table-responsive mb-5 panel p-0 border-0 overflow-hidden">
                <table className="table-hover">
                    <thead>
                        <tr>
                            <th>OFERTA ACADEMICA</th>
                            <th>FECHA DE INSCRIPCION</th>
                            <th>ESTADO</th>
                            
                        </tr>
                    </thead>
                    <tbody>
                        {enrollments?.length === 0 && (
                            <tr>
                                <td colSpan={6} className="text-center text-gray-500 dark:text-gray-600 italic">No se encontraron Inscripciones registradas</td>
                            </tr>
                        )}
                        {enrollments?.map((enrollment) => {
                            return (
                                <tr key={enrollment.id}>
                                    <td>
                                        <CourseBranchLabel CourseBranchId={enrollment.courseBranchId} />
                                    </td>
                                    <td>
                                        {new Date(enrollment.enrollmentDate).toLocaleDateString()}
                                    </td>
                                    <td>
                                       {enrollmentStatus.find((status) => status.value === enrollment.status)?.label}
                                    </td>
                                   
                                </tr>
                            );
                        })}
                    </tbody>
                </table>

            </div>
            <div className="">
                <Pagination
                    currentPage={parseInt(params?.page || '1')}
                    total={totalEnrollments}
                    top={parseInt(params?.top || '10')}
                />
            </div>
        </div>
    );
};
