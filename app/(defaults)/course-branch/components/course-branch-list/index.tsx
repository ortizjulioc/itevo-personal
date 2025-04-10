'use client';
import { confirmDialog, formatCurrency, openNotification, queryStringToObject } from "@/utils";
import { Button, Pagination } from "@/components/ui";
import { IconEdit, IconTrashLines } from "@/components/icon";
import Tooltip from "@/components/ui/tooltip";
import Link from "next/link";
import TableSkeleton from "@/components/common/Skeleton";
import useFetchCourseBranch from "../../lib/use-fetch-course-branch";
import { deleteCourseBranch } from "../../lib/request";
import { TbDetails } from "react-icons/tb";
import { getFormattedDate } from "@/utils/date";
import ModalityTag from "../modality";
import StatusCourseBranch from "@/components/common/info-labels/status/status-course-branch";
import { CourseBranchStatus } from "@prisma/client";



interface Props {
    className?: string;
    query?: string;
}

export default function CourseBranchList({ className, query = '' }: Props) {
    const params = queryStringToObject(query);
    const { loading, error, courseBranches, totalCourseBranches, setCourseBranches } = useFetchCourseBranch(query);
    console.log('courseBranches', courseBranches);
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

    if (loading) return <TableSkeleton rows={8} columns={['CURSO', 'FECHAS', 'MODALIDAD', 'SESIONES', 'CAPACIDAD', 'COSTO', 'ESTADO' ]} />;

    return (
        <div className={className}>
            <div className="table-responsive mb-5 panel p-0 border-0">
                <table className="table-hover">
                    <thead>
                        <tr>
                            <th>CURSO</th>
                            <th>FECHAS</th>
                            <th>MODALIDAD</th>
                            <th>SESIONES</th>
                            <th>CAPACIDAD</th>
                            <th>COSTO</th>
                            <th>ESTADO</th>
                            <th />
                        </tr>
                    </thead>
                    <tbody>
                        {courseBranches?.length === 0 && (
                            <tr>
                                <td colSpan={8} className="text-center text-gray-500 dark:text-gray-600 italic">No se encontraron ofertas academicas registradas</td>
                            </tr>
                        )}
                        {courseBranches?.map((courseBranch) => {
                            return (
                                <tr key={courseBranch.id}>
                                    <td>
                                        <div className='flex flex-col'>
                                            <span className='font-semibold'>{courseBranch.course.name}</span>
                                            <span className="">
                                                {courseBranch.teacher.firstName} {courseBranch.teacher.lastName}
                                            </span>
                                        </div>
                                    </td>
                                    <td>{courseBranch.startDate ? getFormattedDate(new Date(courseBranch.startDate)) : ''} → {courseBranch.endDate ? getFormattedDate(new Date(courseBranch.endDate)) : ''}</td>
                                    <td><ModalityTag modality={courseBranch.modality} /></td>
                                    <td>{courseBranch.capacity}</td>
                                    <td>{courseBranch.sessionCount}</td>
                                    <td><span className='font-bold'>{formatCurrency(courseBranch.amount)}</span></td>
                                    <td>
                                        <StatusCourseBranch status={courseBranch.status as CourseBranchStatus} />
                                    </td>
                                    <td>
                                        <div className="flex items-center gap-4 justify-end">
                                            <Tooltip title="Eliminar">
                                                <button onClick={() => onDelete(courseBranch.id)}>
                                                    <IconTrashLines className="size-5 hover:text-danger hover:cursor-pointer" />
                                                </button>
                                            </Tooltip>
                                            <Tooltip title="Editar">
                                                <Link href={`/course-branch/${courseBranch.id}`}>
                                                    <IconEdit className="size-5 hover:text-primary hover:cursor-pointer" />
                                                </Link>
                                            </Tooltip>
                                            <Tooltip title="Detalles">
                                                <Link href={`/course-branch/view/${courseBranch.id}`}>
                                                    <Button size="sm" icon={<TbDetails className="size-4 rotate-90" />} />
                                                </Link>
                                            </Tooltip>
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
