'use client';
import { confirmDialog, formatPhoneNumber, getInitials, openNotification, queryStringToObject } from "@/utils";
import { Button, Pagination } from "@/components/ui";
import { IconEdit, IconTrashLines } from "@/components/icon";
import Tooltip from "@/components/ui/tooltip";
import Link from "next/link";
import OptionalInfo from "@/components/common/optional-info";
import Skeleton from "@/components/common/Skeleton";
import useFetchCourses from "../../lib/use-fetch-courses";
import { deleteCourse } from "../../lib/request";



interface Props {
    className?: string;
    query?: string;
}

export default function CoursetList({ className, query = '' }: Props) {
    const params = queryStringToObject(query);
    const { loading, error, courses, totalCourses, setCourses } = useFetchCourses(query);
    if (error) {
        openNotification('error', error);
    }
  

    const onDelete = async (id: string) => {
       
        confirmDialog({
            title: 'Eliminar Curso',
            text: '¿Seguro que quieres eliminar este Curso?',
            confirmButtonText: 'Sí, eliminar',
            icon: 'error'
        }, async () => {
            const resp = await deleteCourse(id);
            if (resp.success) {
                setCourses(courses?.filter((Courset) => Courset.id !== id));
                openNotification('success', 'curso eliminado correctamente');
                return;
            } else {
                openNotification('error', resp.message);
            }
        });
    }

    if (loading) return <Skeleton rows={6} columns={['CODIGO','NOMBRE', 'DESCRIPCION', 'DURACION','REQUIERE GRADUUACION']} />;

    return (
        <div className={className}>
            <div className="table-responsive mb-5 panel p-0 border-0 overflow-hidden">
                <table className="table-hover">
                    <thead>
                        <tr>
                            <th>CODIGO</th>
                            <th>NOMBRE</th>
                            <th>DESCRIPCION</th>
                            <th>DURACION</th>
                            <th>REQUIERE GRADUACION</th>
                            <th />
                        </tr>
                    </thead>
                    <tbody>
                        {courses?.length === 0 && (
                            <tr>
                                <td colSpan={6} className="text-center text-gray-500 dark:text-gray-600 italic">No se encontraron cursos registrados</td>
                            </tr>
                        )}
                        {courses?.map((course) => {
                            return (
                                <tr key={course.id}>
                                    <td>
                                        {course.code}
                                    </td>
                                    <td>
                                        {course.name}
                                    </td>
                                    <td>
                                        <div className="whitespace-nowrap">{course.description}</div>
                                    </td>
                                    <td>
                                        {course.duration} Horas
                                    </td>
                                    <td>
                                        {course.requiresGraduation ? 'Si' : 'No'}
                                    </td>
                                    <td>
                                        <div className="flex gap-2 justify-end">
                                            <Tooltip title="Eliminar">
                                                <Button onClick={() => onDelete(course.id)} variant="outline" size="sm" icon={<IconTrashLines className="size-4" />} color="danger" />
                                            </Tooltip>
                                            <Tooltip title="Editar">
                                                <Link href={`/courses/${course.id}`}>
                                                    <Button variant="outline" size="sm" icon={<IconEdit className="size-4" />} />
                                                </Link>
                                            </Tooltip>
                                            {/* ALTERNATIVA */}
                                            {/* <Button onClick={() => onDelete(Courset.id)} variant="outline" size="sm" color="danger" >Eliminar</Button>
                                            <Link href={`/courses/${Courset.id}`}>
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
                    total={totalCourses}
                    top={parseInt(params?.top || '10')}
                />
            </div>
        </div>
    );
};
