import Avatar from "@/components/common/Avatar";
import { fetchUsers } from "../lib/user";
import { formatPhoneNumber, getInitials, queryStringToObject } from "@/utils";
import { Button, Pagination } from "@/components/ui";
import IconEdit from "@/components/icon/icon-edit";
import IconTrashLines from "@/components/icon/icon-trash-lines";
import Tooltip from "@/components/ui/tooltip";
import Link from "next/link";
import OptionalInfo from "@/components/common/optional-info";

interface Props {
    className?: string;
    query?: string;
}

export default async function UserList({ className, query = '' }: Props) {
    const params = queryStringToObject(query);
    const response = await fetchUsers(query);
    const users = response?.users || [];
    const total = response?.totalUsers || 0;

    return (
        <div className={className}>
            <div className="table-responsive mb-5 panel p-0 border-0 overflow-hidden">
                <table className="table-hover">
                    <thead>
                        <tr>
                            <th>USUARIO</th>
                            <th>CORREO ELECTRÓNICO</th>
                            <th>TELEFONO</th>
                            <th />
                        </tr>
                    </thead>
                    <tbody>
                        {users?.map((user) => {
                            return (
                                <tr key={user.id}>
                                    <td>
                                        <div className="flex gap-2 items-center ml-2">
                                            <Avatar initials={getInitials(user.name, user.lastName)} size="sm" color="primary" />
                                            <div className='flex flex-col'>
                                                <span>{`${user.name} ${user.lastName}`}</span>
                                                <span className='font-semibold'>{user.username}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="whitespace-nowrap">{user.email}</div>
                                    </td>
                                    <td>
                                        <OptionalInfo content={formatPhoneNumber(user.phone)} />
                                    </td>
                                    <td>
                                        <div className="flex gap-2 justify-end">
                                            <Tooltip title="Eliminar">
                                                <Button variant="outline" size="sm" icon={<IconTrashLines className="size-4" />} color="danger"/>
                                            </Tooltip>
                                            <Tooltip title="Editar">
                                                <Link href={`/users/${user.id}`}>
                                                <Button variant="outline" size="sm" icon={<IconEdit className="size-4" />}/>
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
            <div className="flex justify-end w-full">
                <Pagination
                    currentPage={parseInt(params?.page || '1')}
                    total={total}
                    top={10}
                />
            </div>
        </div>
    );
};
