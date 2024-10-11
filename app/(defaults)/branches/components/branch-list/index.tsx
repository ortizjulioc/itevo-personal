'use client';
import { confirmDialog, formatPhoneNumber, openNotification, queryStringToObject } from "@/utils";
import { Button, Pagination } from "@/components/ui";
import {IconEdit, IconTrashLines} from "@/components/icon";
import Tooltip from "@/components/ui/tooltip";
import Link from "next/link";
import useFetchBranch from "../../lib/use-fecth-branches";
import { deleteBranch } from "../../lib/request";
import Skeleton from "@/components/common/Skeleton";
import OptionalInfo from "@/components/common/optional-info";

interface Props {
    className?: string;
    query?: string;
}

export default function BranchList({ className, query = '' }: Props) {
    const params = queryStringToObject(query);
    const { loading, error, branches, totalBranches, setBranches } = useFetchBranch(query);
    if (error) {
        openNotification('error', error);
    }

    const onDelete = async (id: string) => {
        console.log('delete', id);
        confirmDialog({
            title: 'Eliminar Sucursal',
            text: '¿Seguro que quieres eliminar esta Sucursal?',
            confirmButtonText: 'Sí, eliminar',
            icon: 'error'
        }, async() => {
            const resp = await deleteBranch(id);
            if (resp.success) {
                setBranches(branches?.filter((branch) => branch.id !== id));
                openNotification('success', 'Sucursal eliminada correctamente');
                return;
            } else {
                openNotification('error', resp.message);
            }
        });
    }

    if (loading) return <Skeleton rows={4} columns={['NOMBRE', 'DIRECCION','']} />;

    return (
        <div className={className}>
            <div className="table-responsive mb-5 panel p-0 border-0 overflow-hidden">
                <table className="table-hover">
                    <thead>
                        <tr>
                            <th>NOMBRE</th>
                            <th>DIRECCION</th>
                            <th>TELEFONO</th>
                            <th />
                        </tr>
                    </thead>
                    <tbody>
                        {branches?.length === 0 && (
                            <tr>
                                <td colSpan={5} className="text-center text-gray-500 dark:text-gray-600 italic">No se encontraron Sucursales registradas</td>
                            </tr>
                        )}
                        {branches?.map((branch) => {
                            return (
                                <tr key={branch.id}>
                                    <td>
                                        <div className="whitespace-nowrap">{branch.name}</div>
                                    </td>
                                    <td>
                                        <div className="whitespace-nowrap">{branch.address}</div>
                                    </td>
                                    <td>
                                    <OptionalInfo content={formatPhoneNumber(branch.phone)} />
                                    </td>
                                   
                                    <td>
                                        <div className="flex gap-2 justify-end">
                                            <Tooltip title="Eliminar">
                                                <Button onClick={() => onDelete(branch.id)} variant="outline" size="sm" icon={<IconTrashLines className="size-4" />} color="danger" />
                                            </Tooltip>
                                            <Tooltip title="Editar">
                                                <Link href={`/branches/${branch.id}`}>
                                                    <Button variant="outline" size="sm" icon={<IconEdit className="size-4" />} />
                                                </Link>
                                            </Tooltip>
                                            {/* ALTERNATIVA */}
                                            {/* <Button onClick={() => onDelete(Sucursale.id)} variant="outline" size="sm" color="danger" >Eliminar</Button>
                                            <Link href={`/Sucursales/${Sucursale.id}`}>
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
                    total={totalBranches}
                    top={parseInt(params?.top || '10')}
                />
            </div>
        </div>
    );
};
