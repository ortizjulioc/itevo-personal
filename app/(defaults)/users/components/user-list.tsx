import { fetchUsers } from "../lib/user";

export default async function UserList() {
    const users = await fetchUsers();
    return (
        <div>
            <ul>
                {users?.map((user) => (
                    <div key={user.id}>
                        <li key={user.id}>{user.username}</li>
                    </div>
                ))}
            </ul>
        </div>
    );
};
