import { fetchUsers } from "../lib/user";

interface Props {
    className?: string;
    query?: string;
}

export default async function UserList({ className, query = '' }: Props) {
    const users = await fetchUsers(query);
    return (
        <div className={className}>
            <div className="table-responsive mb-5 panel p-0 border-0 overflow-hidden">
                <table className="table-hover">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Nombre de usuario</th>
                            <th>Correo electrónico</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users?.map((user) => {
                            return (
                                <tr key={user.id}>
                                    <td>{user.id}</td>
                                    <td>
                                        <div className="whitespace-nowrap">{user.username}</div>
                                    </td>
                                    <td>{user.email}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
