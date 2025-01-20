'use client';
import { confirmDialog, openNotification, queryStringToObject } from "@/utils";
import { Button, Pagination } from "@/components/ui";
import {IconEdit, IconTrashLines} from "@/components/icon";
import Tooltip from "@/components/ui/tooltip";
import Link from "next/link";
import useFetchPromotions from "../../lib/use-fetch-promotions";
import { deletePromotion } from "../../lib/request";
import Skeleton from "@/components/common/Skeleton";

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
        console.log('delete', id);
        confirmDialog({
            title: 'Eliminar promoción',
            text: '¿Seguro que quieres eliminar este promoción?',
            confirmButtonText: 'Sí, eliminar',
            icon: 'error'
        }, async() => {
            const resp = await deletePromotion(id);
            if (resp.success) {
                setPromotions(promotions?.filter((promotion) => promotion.id !== id));
                openNotification('success', 'Promoción eliminada correctamente');
                return;
            }
            openNotification('error', resp.message);
        });
    }
    console.log('promotions', promotions);
    if (loading) return <Skeleton rows={4} columns={['NOMBRE', 'NOMBRE NORMALIZADO']} />;

    return (
        <div className={className}>
            <div className="table-responsive mb-5 panel p-0 border-0 overflow-hidden">
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
                                        <div className="whitespace-nowrap">{new Date(promotion.startDate).toLocaleDateString()}</div>
                                    </td>
                                    <td>
                                        <div className="whitespace-nowrap">{new Date(promotion.endDate).toLocaleDateString()}</div>
                                    </td>
                                    <td>
                                        <div className="flex gap-2 justify-end">
                                            <Tooltip title="Eliminar">
                                                <Button onClick={() => onDelete(promotion.id)} variant="outline" size="sm" icon={<IconTrashLines className="size-4" />} color="danger" />
                                            </Tooltip>
                                            <Tooltip title="Editar">
                                                <Link href={`/promotions/${promotion.id}`}>
                                                    <Button variant="outline" size="sm" icon={<IconEdit className="size-4" />} />
                                                </Link>
                                            </Tooltip>
                                            {/* ALTERNATIVA */}
                                            {/* <Button onClick={() => onDelete(Role.id)} variant="outline" size="sm" color="danger" >Eliminar</Button>
                                            <Link href={`/Roles/${Role.id}`}>
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
                    currentPage={Number.parseInt(params?.page || '1')}
                    total={totalPromotions}
                    top={Number.parseInt(params?.top || '10')}
                />
            </div>
        </div>
    );
};
