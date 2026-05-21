'use client';
import { confirmDialog, formatPhoneNumber, getInitials, openNotification, queryStringToObject } from "@/utils";
import { Button, Pagination } from "@/components/ui";
import { IconEdit, IconTrashLines } from "@/components/icon";
import Tooltip from "@/components/ui/tooltip";
import Link from "next/link";
import OptionalInfo from "@/components/common/optional-info";
import Skeleton from "@/components/common/Skeleton";
import useFetchCourses from "../../lib/use-fetch-courses";
import { deleteCourse, restoreCourse } from "../../lib/request";
import { useSession } from "next-auth/react";
import { LuRotateCcw } from "react-icons/lu";
import { SUPER_ADMIN } from "@/constants/role.constant";



interface Props {
    className?: string;
    query?: string;
}

export default function CoursetList({ className, query = '' }: Props) {
    const params = queryStringToObject(query);
    const { data: session } = useSession();
    const isSuperAdmin = session?.user?.roles?.some((role: any) => role.normalizedName === SUPER_ADMIN);
    const { loading, error, courses, totalCourses, setCourses, refetch } = useFetchCourses(query);
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

    const onRestore = async (id: string) => {
        confirmDialog({
            title: 'Restaurar Curso',
            text: '¿Quieres restaurar este curso?',
            confirmButtonText: 'Sí, restaurar',
            icon: 'info'
        }, async () => {
            const resp = await restoreCourse(id);
            if (resp.success) {
                openNotification('success', 'Curso restaurado correctamente');
                refetch(); // Recargar la lista para reflejar el cambio de estado
                return;
            } else {
                openNotification('error', resp.message);
            }
        });
    }

    if (loading) return <Skeleton rows={6} columns={['CODIGO','NOMBRE', 'DESCRIPCION', 'DURACION','REQUIERE GRADUUACION']} />;

    return (
        <div className={className}>
            <div className="table-responsive mb-5 panel p-0 border-0 ">
                <table className="table-hover">
                    <thead>
                        <tr>
                            <th>CODIGO</th>
                            <th>NOMBRE</th>
                            <th>DESCRIPCION</th>
                            <th>SESIONES</th>
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
                            const isDeleted = (course as any).deleted;
                            return (
                                <tr key={course.id} className={isDeleted ? "opacity-50 grayscale-[0.5]" : ""}>
                                    <td>
                                        {course.code}
                                    </td>
                                    <td>
                                        <div className="flex items-center gap-2">
                                            <span>{course.name}</span>
                                            {isDeleted && <span className="badge bg-danger text-xs">Eliminado</span>}
                                        </div>
                                    </td>
                                    <td>
                                        <div className="whitespace-nowrap">
                                            <OptionalInfo content={course.description || ''} />
                                        </div>
                                    </td>
                                    <td>
                                        {course.duration}
                                    </td>
                                    <td>
                                        {course.requiresGraduation ? 'Si' : 'No'}
                                    </td>
                                    <td>
                                        <div className="flex gap-2 justify-end">
                                            {isSuperAdmin && isDeleted ? (
                                                <Tooltip title="Restaurar">
                                                    <Button
                                                        onClick={() => onRestore(course.id)}
                                                        variant="outline"
                                                        size="sm"
                                                        color="success"
                                                        icon={<LuRotateCcw className="size-4" />}
                                                    />
                                                </Tooltip>
                                            ) : (
                                                <>
                                                    <Tooltip title="Eliminar">
                                                        <Button onClick={() => onDelete(course.id)} variant="outline" size="sm" icon={<IconTrashLines className="size-4" />} color="danger" />
                                                    </Tooltip>
                                                    <Tooltip title="Editar">
                                                        <Link href={`/courses/${course.id}`}>
                                                            <Button variant="outline" size="sm" icon={<IconEdit className="size-4" />} />
                                                        </Link>
                                                    </Tooltip>
                                                </>
                                            )}
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
