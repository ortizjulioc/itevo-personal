import { fetchUsers } from "../lib/user";

export default async function UserList() {
    const users = await fetchUsers();
    console.log('USERS: ',users);
    return (
        <div>
            <h1>User List</h1>

            <pre>{JSON.stringify(users, null, 2)}</pre>
            <ul>
                {(users as []).map((user) => (
                    <div key={user.id}>
                        {console.log('USER: ',user)}
                        <li key={user.id}>{user.name}</li>
                    </div>
                ))}
            </ul>
        </div>
    );
};
