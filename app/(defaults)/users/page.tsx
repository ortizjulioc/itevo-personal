import { Suspense } from "react";
import UserList from "./user-list";

export default async function Users() {

    return (
        <div>
            <div>
                <h2 className='text-xl'>Usuarios</h2>
            </div>

            <span>WHYYYYYYYY</span>
            <Suspense key={1} fallback={<div>Loading...</div>}>
                <UserList />
            </Suspense>

        </div>
    );
}
