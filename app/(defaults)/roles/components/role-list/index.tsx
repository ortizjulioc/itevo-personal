'use client';
import { confirmDialog, openNotification, queryStringToObject } from "@/utils";
import { Button, Pagination } from "@/components/ui";
import {IconEdit, IconTrashLines} from "@/components/icon";
import Tooltip from "@/components/ui/tooltip";
import Link from "next/link";
import useFetchRoles from "../../lib/use-fetch-roles";
import { deleteRole } from "../../lib/request";
import Skeleton from "@/components/common/Skeleton";

interface Props {
    className?: string;
    query?: string;
}

export default function RoleList({ className, query = '' }: Props) {
    const params = queryStringToObject(query);
    const { loading, error, roles, totalroles, setRoles } = useFetchRoles(query);
    if (error) {
        openNotification('error', error);
    }

    const onDelete = async (id: string) => {
        
        confirmDialog({
            title: 'Eliminar rol',
            text: '¿Seguro que quieres eliminar este rol?',
            confirmButtonText: 'Sí, eliminar',
            icon: 'error'
        }, async() => {
            const resp = await deleteRole(id);
            if (resp.success) {
                setRoles(roles?.filter((role) => role.id !== id));
                openNotification('success', 'Rol eliminado correctamente');
                return;
            } else {
                openNotification('error', resp.message);
            }
        });
    }

    if (loading) return <Skeleton rows={4} columns={['NOMBRE', 'NOMBRE NORMALIZADO']} />;

    return (
        <div className={className}>
            <div className="table-responsive mb-5 panel p-0 border-0 ">
                <table className="table-hover">
                    <thead>
                        <tr>
                            <th>NOMBRE</th>
                            <th>NOMBRE NORMALIZADO</th>
                            <th />
                        </tr>
                    </thead>
                    <tbody>
                        {roles?.length === 0 && (
                            <tr>
                                <td colSpan={4} className="text-center text-gray-500 dark:text-gray-600 italic">No se encontraron roles registrados</td>
                            </tr>
                        )}
                        {roles?.map((Role) => {
                            return (
                                <tr key={Role.id}>
                                    <td>
                                        <div className="whitespace-nowrap">{Role.name}</div>
                                    </td>
                                    <td>
                                        <div className="whitespace-nowrap">{Role.normalizedName}</div>
                                    </td>
                                   
                                    <td>
                                        <div className="flex gap-2 justify-end">
                                            <Tooltip title="Eliminar">
                                                <Button onClick={() => onDelete(Role.id)} variant="outline" size="sm" icon={<IconTrashLines className="size-4" />} color="danger" />
                                            </Tooltip>
                                            <Tooltip title="Editar">
                                                <Link href={`/roles/${Role.id}`}>
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
                    currentPage={parseInt(params?.page || '1')}
                    total={totalroles}
                    top={parseInt(params?.top || '10')}
                />
            </div>
        </div>
    );
};
