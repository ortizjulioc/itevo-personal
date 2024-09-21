'use server';
import Link from "next/link";
import Tooltip from "@/components/ui/tooltip";
import { Button } from "@/components/ui";
import IconEdit from "@/components/icon/icon-edit";
import { deleteUserAction } from "../lib/actions";
import IconTrashLines from "@/components/icon/icon-trash-lines";

export async function DeleteUser({ id }: { id: string }) {
    const deleteUserWithId = deleteUserAction.bind(null, id);

    return (
        <form action={deleteUserWithId}>
            <Tooltip title="Eliminar">
                <Button variant="outline" size="sm" icon={<IconTrashLines className="size-4" />} color="danger" />
            </Tooltip>
        </form>
    );
}

export async function UpdateUser({ id }: { id: string }) {
    return (
        <Tooltip title="Editar">
            <Link href={`/users/${id}`}>
                <Button variant="outline" size="sm" icon={<IconEdit className="size-4" />} />
            </Link>
        </Tooltip>
    );
}
