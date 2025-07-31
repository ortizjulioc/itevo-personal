'use client';
import { confirmDialog, openNotification, queryStringToObject } from "@/utils";
import { Button, Pagination } from "@/components/ui";
import { IconEdit, IconTrashLines } from "@/components/icon";
import Tooltip from "@/components/ui/tooltip";
import Link from "next/link";
import Skeleton from "@/components/common/Skeleton";
import useFetchNcfRanges from "../../libs/use-fetch-nfcranges";
import { deleteNcfRange } from "../../libs/request";
import NcfStatus from "./NcfStatus";
import { getFormattedDate } from "@/utils/date";

interface Props {
    className?: string;
    query?: string;
}

export default function NcfRangeList({ className, query = '' }: Props) {
    const params = queryStringToObject(query);
    const { loading, error, ncfRanges, totalNcfRanges, setNcfRanges } = useFetchNcfRanges(query);
    if (error) {
        openNotification('error', error);
    }

    const onDelete = async (id: string) => {

        confirmDialog({
            title: 'Eliminar rango ncf',
            text: '¿Seguro que quieres eliminar este rango ncf?',
            confirmButtonText: 'Sí, eliminar',
            icon: 'error'
        }, async () => {
            const resp = await deleteNcfRange(id);
            if (resp.success) {
                setNcfRanges(ncfRanges?.filter((ncfRange) => ncfRange.id !== id));
                openNotification('success', 'rango ncf eliminado correctamente');
                return;
            }
            openNotification('error', resp.message);
        });
    }

    if (loading) return <Skeleton rows={7} columns={['N. AUTORIZACION', 'FECHA VENCIMIENTO', 'NCF INICIAL', 'NCF FINAL', 'CANT. DISPONIBLE', 'ESTADO']} />;

    return (
        <div className={className}>
            <div className="table-responsive mb-5 panel p-0 border-0 overflow-hidden">
                <table className="table-hover">
                    <thead>
                        <tr>
                            <th className="text-left">N. AUTORIZACION</th>
                            <th className="text-left">FECHA VENCIMIENTO</th>
                            <th className="text-left">NCF INICIAL</th>
                            <th className="text-left">NCF FINAL</th>
                            <th className="text-left">CANT. DISPONIBLE</th>
                            <th className="text-left">ESTADO</th>

                            <th />
                        </tr>
                    </thead>
                    <tbody>
                        {ncfRanges?.length === 0 && (
                            <tr>
                                <td colSpan={7} className="text-center text-gray-500 dark:text-gray-600 italic">No se encontraron rangos NCF registrados</td>
                            </tr>
                        )}
                        {ncfRanges?.map((ncfRange) => {
                            return (
                                <tr key={ncfRange.id}>
                                    <td>
                                        <div className="whitespace-nowrap">{ncfRange.authorizationNumber}</div>
                                    </td>
                                    <td>
                                        <div className="whitespace-nowrap">{getFormattedDate(new Date(ncfRange.dueDate))}</div>
                                    </td>
                                    <td>
                                        <div className="whitespace-nowrap">{`${ncfRange.prefix}${ncfRange.startSequence}`}</div>
                                    </td>
                                    <td>
                                        <div className="whitespace-nowrap">{`${ncfRange.prefix}${ncfRange.endSequence}`}</div>
                                    </td>
                                    <td>
                                    <div className="whitespace-nowrap">
                                        {Math.max(0, ncfRange.endSequence - ncfRange.currentSequence + 1)}
                                    </div>
                                    </td>
                                    <td>
                                        <div className="whitespace-nowrap">
                                            <NcfStatus isActive={ncfRange.isActive} />
                                        </div>
                                    </td>

                                    <td>
                                        <div className="flex gap-2 justify-end">
                                            <Tooltip title="Eliminar">
                                                <Button onClick={() => onDelete(ncfRange.id)} variant="outline" size="sm" icon={<IconTrashLines className="size-4" />} color="danger" />
                                            </Tooltip>
                                            <Tooltip title="Editar">
                                                <Link href={`/NcfRanges/${ncfRange.id}`}>
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
                    total={totalNcfRanges}
                    top={Number.parseInt(params?.top || '10')}
                />
            </div>
        </div>
    );
};
