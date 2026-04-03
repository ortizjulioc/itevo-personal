'use client';
import { confirmDialog, openNotification, queryStringToObject } from "@/utils";
import { Button, Pagination } from "@/components/ui";
import { IconEdit, IconTrashLines, IconEye } from "@/components/icon";
import Tooltip from "@/components/ui/tooltip";
import Link from "next/link";
import useFetchPromotions from "../../lib/use-fetch-promotions";
import { deletePromotion } from "../../lib/request";
import Skeleton from "@/components/common/Skeleton";
import { getFormattedDate } from "@/utils/date";
import { TbDetails } from "react-icons/tb";

interface Props {
    className?: string;
    query?: string;
}

export default function PromotionList({ className, query = '' }: Props) {
    const params = queryStringToObject(query);
    const { loading, error, promotions, totalPromotions, setPromotions } = useFetchPromotions(query);
    if (error) {
        openNotification('error', error);
    }

    const onDelete = async (id: string) => {

        confirmDialog({
            title: 'Eliminar promoción',
            text: '¿Seguro que quieres eliminar este promoción?',
            confirmButtonText: 'Sí, eliminar',
            icon: 'error'
        }, async () => {
            const resp = await deletePromotion(id);
            if (resp.success) {
                setPromotions(promotions?.filter((promotion) => promotion.id !== id));
                openNotification('success', 'Promoción eliminada correctamente');
                return;
            }
            openNotification('error', resp.message);
        });
    }

    if (loading) return <Skeleton rows={4} columns={['NOMBRE', 'NOMBRE NORMALIZADO']} />;

    return (
        <div className={className}>
            <div className="table-responsive mb-5 panel p-0 border-0">
                <table className="table-hover">
                    <thead>
                        <tr>
                            <th>Descripcion</th>
                            <th>Fecha de inicio</th>
                            <th>Fecha de fin</th>
                            <th />
                        </tr>
                    </thead>
                    <tbody>
                        {promotions?.length === 0 && (
                            <tr>
                                <td colSpan={4} className="text-center text-gray-500 dark:text-gray-600 italic">No se encontraron promociones registrados</td>
                            </tr>
                        )}
                        {promotions?.map((promotion) => {
                            return (
                                <tr key={promotion.id}>
                                    <td>
                                        <div className="whitespace-nowrap">{promotion.description}</div>
                                    </td>
                                    <td>
                                        <div className="whitespace-nowrap">{getFormattedDate(new Date(promotion.startDate))}</div>
                                    </td>
                                    <td>
                                        <div className="whitespace-nowrap">{getFormattedDate(new Date(promotion.endDate))}</div>
                                    </td>
                                    <td>
                                        <div className="flex items-center gap-3 justify-end">
                                            <Tooltip title="Eliminar">
                                                <button onClick={() => onDelete(promotion.id)}>
                                                    <IconTrashLines className="size-5 hover:text-danger hover:cursor-pointer" />
                                                </button>
                                            </Tooltip>
                                            <Tooltip title="Editar">
                                                <Link href={`/promotions/${promotion.id}`}>
                                                    <IconEdit className="size-5 hover:text-primary hover:cursor-pointer" />
                                                </Link>
                                            </Tooltip>
                                            <Tooltip title="Detalles">
                                                <Link href={`/promotions/${promotion.id}/view`}>
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
                    currentPage={Number.parseInt(params?.page || '1')}
                    total={totalPromotions}
                    top={Number.parseInt(params?.top || '10')}
                />
            </div>
        </div>
    );
};
