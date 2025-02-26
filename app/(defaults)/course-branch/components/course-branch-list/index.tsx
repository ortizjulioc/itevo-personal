'use client';
import { confirmDialog, formatPhoneNumber, getInitials, openNotification, queryStringToObject } from "@/utils";
import { Button, Pagination } from "@/components/ui";
import { IconEdit, IconEye, IconTrashLines } from "@/components/icon";
import Tooltip from "@/components/ui/tooltip";
import Link from "next/link";
import Skeleton from "@/components/common/Skeleton";
import useFetchCourseBranch from "../../lib/use-fetch-course-branch";
import { deleteCourseBranch } from "../../lib/request";
import PromotionLabel from "@/components/common/info-labels/promotion-label";
import BranchLabel from "@/components/common/info-labels/branch-label";
import TeacherLabel from "@/components/common/info-labels/teacher-label";
import CourseLabel from "@/components/common/info-labels/course-label";
import { MODALITIES } from "@/constants/modality.constant";



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
                            <th>SUCURSAL</th>
                            <th>PROFESOR</th>
                            <th>CURSO</th>
                            <th>MODALIDAD</th>
                            <th>F. INICIO</th>
                            <th>F. FIN</th>
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
                                    <td>{<BranchLabel branchId={courseBranch.branchId} />}</td>
                                    <td>{<TeacherLabel teacherId={courseBranch.teacherId} />}</td>
                                    <td>{<CourseLabel courseId={courseBranch.courseId} />}</td>
                                    <td>{MODALITIES[courseBranch.modality]}</td>
                                    <td>{new Date(courseBranch.startDate).toLocaleDateString()}</td>
                                    <td>{new Date(courseBranch.endDate).toLocaleDateString()}</td>
                                    <td>
                                        <div className="flex gap-2 justify-end">
                                            <Tooltip title="Eliminar">
                                                <Button onClick={() => onDelete(courseBranch.id)} variant="outline" size="sm" icon={<IconTrashLines className="size-4" />} color="danger" />
                                            </Tooltip>
                                            <Tooltip title="Editar">
                                                <Link href={`/course-branch/${courseBranch.id}`}>
                                                    <Button variant="outline" size="sm" icon={<IconEdit className="size-4" />} />
                                                </Link>
                                            </Tooltip>
                                            <Tooltip title="Ver">
                                                <Link href={`/course-branch/view/${courseBranch.id}`}>
                                                    <Button variant="outline" color='success' size="sm" icon={<IconEye className="size-4" />} />
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
