'use client';
import { confirmDialog, openNotification, queryStringToObject } from "@/utils";
import { Button, Pagination } from "@/components/ui";
import { IconEdit, IconTrashLines } from "@/components/icon";
import Tooltip from "@/components/ui/tooltip";
import Link from "next/link";
import Skeleton from "@/components/common/Skeleton";
import useFetchCourseBranch from "../../lib/use-fetch-course-branch";
import { deleteCourseBranch } from "../../lib/request";
import PromotionLabel from "@/components/common/info-labels/promotion-label";
import TeacherLabel from "@/components/common/info-labels/teacher-label";
import CourseLabel from "@/components/common/info-labels/course-label";
import StatusCourseBranch from "../status";
import { getFormattedDate } from "@/utils/date";
import { TbDetails } from "react-icons/tb";

interface Props {
    className?: string;
    query?: string;
}

export default function CourseBranchList({ className, query = '' }: Props) {
    const params = queryStringToObject(query);
    const { loading, error, courseBranches, totalCourseBranches, setCourseBranches } = useFetchCourseBranch(query);
    if (error) {
        openNotification('error', error);
    }


    const onDelete = async (id: string) => {

        confirmDialog({
            title: 'Eliminar oferta academica',
            text: '¿Seguro que quieres eliminar esta oferta  academica?',
            confirmButtonText: 'Sí, eliminar',
            icon: 'error'
        }, async () => {
            const resp = await deleteCourseBranch(id);
            if (resp.success) {
                setCourseBranches(courseBranches?.filter((courseBranch) => courseBranch.id !== id));
                openNotification('success', 'oferta  academica eliminada correctamente');
                return;
            } else {
                openNotification('error', resp.message);
            }
        });
    }

    if (loading) return <Skeleton rows={8} columns={['PROMOCION', 'SUCURSAL', 'PROFESOR', 'CURSO', 'MODALIDAD', 'F. INICIO', 'F. FIN']} />;

    return (
        <div className={className}>
            <div className="table-responsive mb-5 panel p-0 border-0">
                <table className="table-hover">
                    <thead>
                        <tr>
                            <th>PROMOCION</th>
                            <th>CURSO</th>
                            {/* <th>SUCURSAL</th> */}
                            <th>PROFESOR</th>
                            {/* <th>MODALIDAD</th> */}
                            <th>F. INICIO</th>
                            <th>F. FIN</th>
                            <th>CAPACIDAD</th>
                            <th>ESTADO</th>
                            <th />
                        </tr>
                    </thead>
                    <tbody>
                        {courseBranches?.length === 0 && (
                            <tr>
                                <td colSpan={6} className="text-center text-gray-500 dark:text-gray-600 italic">No se encontraron ofertas academicas registradas</td>
                            </tr>
                        )}
                        {courseBranches?.map((courseBranch) => {
                            return (
                                <tr key={courseBranch.id}>
                                    <td><PromotionLabel promotionId={courseBranch.promotionId} /></td>
                                    <td>{<CourseLabel courseId={courseBranch.courseId} />}</td>
                                    {/* <td>{<BranchLabel branchId={courseBranch.branchId} />}</td> */}
                                    <td>{<TeacherLabel teacherId={courseBranch.teacherId} />}</td>
                                    {/* <td><ModalityTag modality={courseBranch.modality} /></td> */}
                                    <td>{courseBranch.startDate ? getFormattedDate(new Date(courseBranch.startDate)) : ''}</td>
                                    <td>{courseBranch.endDate ? getFormattedDate(new Date(courseBranch.endDate)) : ''}</td>
                                    <td>{courseBranch.capacity}</td>
                                    <td>
                                        <StatusCourseBranch status={courseBranch.status} />
                                    </td>
                                    <td>
                                        <div className="flex items-center gap-2 justify-end">
                                            <Tooltip title="Eliminar">
                                                {/* <Button onClick={() => onDelete(courseBranch.id)} variant="outline" size="sm" icon={<IconTrashLines className="size-4" />} /> */}
                                                <button onClick={() => onDelete(courseBranch.id)}>
                                                    <IconTrashLines className="size-5 hover:text-danger hover:cursor-pointer" />
                                                </button>
                                            </Tooltip>
                                            <Tooltip title="Editar">
                                                <Link href={`/course-branch/${courseBranch.id}`}>
                                                    {/* <Button variant="outline" size="sm" icon={<IconEdit className="size-5" />} /> */}
                                                    <IconEdit className="size-5 hover:text-primary hover:cursor-pointer" />
                                                </Link>
                                            </Tooltip>
                                            <Tooltip title="Detalles">
                                                <Link href={`/course-branch/view/${courseBranch.id}`}>
                                                    <Button size="sm" icon={<TbDetails className="size-4 rotate-90" />} />
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
                    total={totalCourseBranches}
                    top={parseInt(params?.top || '10')}
                />
            </div>
        </div>
    );
};
