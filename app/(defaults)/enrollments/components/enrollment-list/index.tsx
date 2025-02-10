'use client';
import { confirmDialog, openNotification, queryStringToObject } from "@/utils";
import { Button, Pagination } from "@/components/ui";
import { IconEdit, IconTrashLines } from "@/components/icon";
import Tooltip from "@/components/ui/tooltip";
import Link from "next/link";
import Skeleton from "@/components/common/Skeleton";
import useFetchEnrollments from "../../lib/use-fetch-enrollments";
import { deleteEnrollment } from "../../lib/request";





interface Props {
    className?: string;
    query?: string;
}

export default function EnrollmentList({ className, query = '' }: Props) {
    const params = queryStringToObject(query);
    const { loading, error, enrollments, totalEnrollments, setEnrollments } = useFetchEnrollments(query);
    if (error) {
        openNotification('error', error);
    }


    const onDelete = async (id: string) => {
        console.log('delete', id);
        confirmDialog({
            title: 'Eliminar inscripcion',
            text: '¿Seguro que quieres eliminar esta inscripcion?',
            confirmButtonText: 'Sí, eliminar',
            icon: 'error'
        }, async () => {
            const resp = await deleteEnrollment(id);
            if (resp.success) {
                setEnrollments(enrollments?.filter((enrollment) => enrollment.id !== id));
                openNotification('success', 'inscripcion eliminado correctamente');
                return;
            } else {
                openNotification('error', resp.message);
            }
        });
    }

    if (loading) return <Skeleton rows={6} columns={['ESTUDIANTE','OFERTA ACADEMICA','FECHA DE INSCRIPCION']} />;

    return (
        <div className={className}>
            <div className="table-responsive mb-5 panel p-0 border-0 overflow-hidden">
                <table className="table-hover">
                    <thead>
                        <tr>
                            <th>ESTUDIANTE</th>
                            <th>OFERTA ACADEMICA</th>
                            <th>FECHA DE INSCRIPCION
                            </th>
                            <th />
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
                                        {enrollment.studentId}
                                    </td>
                                    <td>
                                        {enrollment.courseBranchId}
                                    </td>
                                    <td>
                                        {new Date(enrollment.createdAt).toLocaleDateString()}
                                    </td>
                                   
                                    <td>
                                        <div className="flex gap-2 justify-end">
                                            <Tooltip title="Eliminar">
                                                <Button onClick={() => onDelete(enrollment.id)} variant="outline" size="sm" icon={<IconTrashLines className="size-4" />} color="danger" />
                                            </Tooltip>
                                            <Tooltip title="Editar">
                                                <Link href={`/enrollments/${enrollment.id}`}>
                                                    <Button variant="outline" size="sm" icon={<IconEdit className="size-4" />} />
                                                </Link>
                                            </Tooltip>
                                            {/* ALTERNATIVA */}
                                            {/* <Button onClick={() => onDelete(Enrollmentt.id)} variant="outline" size="sm" color="danger" >Eliminar</Button>
                                            <Link href={`/Enrollments/${Enrollmentt.id}`}>
                                                <Button variant="outline" size="sm">Editar</Button>
                                            </Link> */}
                                        </div>
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
