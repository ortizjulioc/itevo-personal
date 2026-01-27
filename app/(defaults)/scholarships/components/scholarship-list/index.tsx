'use client';
import { confirmDialog, openNotification, queryStringToObject, formatCurrency } from "@/utils";
import { Button, Pagination } from "@/components/ui";
import { IconEdit, IconTrashLines } from "@/components/icon";
import Tooltip from "@/components/ui/tooltip";
import Link from "next/link";
import useFetchScholarships from "../../lib/use-fetch-scholarships";
import { deleteScholarship } from "../../lib/request";
import Skeleton from "@/components/common/Skeleton";
import StatusActive from "@/components/common/info-labels/status/status-active";
import OptionalInfo from "@/components/common/optional-info";

interface Props {
    className?: string;
    query?: string;
}

export default function ScholarshipList({ className, query = '' }: Props) {
    const params = queryStringToObject(query);
    const { loading, error, scholarships, totalScholarships, setScholarships } = useFetchScholarships(query);

    if (error) {
        openNotification('error', error);
    }

    const onDelete = async (id: string) => {
        confirmDialog({
            title: 'Eliminar beca',
            text: '¿Seguro que quieres eliminar esta beca?',
            confirmButtonText: 'Sí, eliminar',
            icon: 'error'
        }, async () => {
            const resp = await deleteScholarship(id);
            if (resp.success) {
                setScholarships(scholarships?.filter((item) => item.id !== id));
                openNotification('success', 'Beca eliminada correctamente');
                return;
            }
            openNotification('error', resp.message);
        });
    };

    if (loading) return <Skeleton rows={4} columns={['NOMBRE', 'DESCRIPCIÓN', 'TIPO', 'VALOR']} />;

    return (
        <div className={className}>
            <div className="table-responsive mb-5 panel p-0 border-0">
                <table className="table-hover">
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Descripción</th>
                            <th>Tipo</th>
                            <th>Valor</th>
                            <th>Estado</th>
                            <th />
                        </tr>
                    </thead>
                    <tbody>
                        {scholarships?.length === 0 && (
                            <tr>
                                <td colSpan={5} className="text-center text-gray-500 dark:text-gray-600 italic">No se encontraron becas registradas</td>
                            </tr>
                        )}
                        {scholarships?.map((scholarship) => {
                            return (
                                <tr key={scholarship.id}>
                                    <td>
                                        <div className="whitespace-nowrap">{scholarship.name}</div>
                                    </td>
                                    <td>
                                        <div className="whitespace-nowrap">
                                            <OptionalInfo content={scholarship.description || undefined} />
                                        </div>
                                    </td>
                                    <td>
                                        <div className="whitespace-nowrap">{scholarship.type === 'percentage' ? 'Porcentaje' : 'Monto Fijo'}</div>
                                    </td>
                                    <td>
                                        <div className="whitespace-nowrap">
                                            {scholarship.type === 'fixed_amount'
                                                ? formatCurrency(scholarship.value)
                                                : `${scholarship.value} %`}
                                        </div>
                                    </td>
                                    <td>
                                        <div className="whitespace-nowrap">
                                            <StatusActive status={scholarship?.isActive} />
                                        </div>
                                    </td>
                                    <td>
                                        <div className="flex gap-2 justify-end">
                                            <Tooltip title="Eliminar">
                                                <Button onClick={() => onDelete(scholarship.id)} variant="outline" size="sm" icon={<IconTrashLines className="size-4" />} color="danger" />
                                            </Tooltip>
                                            <Tooltip title="Editar">
                                                <Link href={`/scholarships/${scholarship.id}`}>
                                                    <Button variant="outline" size="sm" icon={<IconEdit className="size-4" />} />
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
                    currentPage={Number.parseInt(params?.page || '1')}
                    total={totalScholarships}
                    top={Number.parseInt(params?.top || '10')}
                />
            </div>
        </div>
    );
};
