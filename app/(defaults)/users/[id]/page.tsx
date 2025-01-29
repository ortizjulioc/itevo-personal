'use client';
import { FormSkeleton, ViewTitle } from "@/components/common";
import { UpdateUserForm } from "../components/user-forms";
import { useFetchUserById, UserWithBranchesAndRoles } from "../lib/use-fetch-users";
import { useEffect } from "react";
import useFetchRole from "../lib/use-fetch-roles";
import { Role } from "@prisma/client";
import { AssingRole, RemoveRole } from "../lib/request";
import { openNotification } from "@/utils";
import { UserContext } from "@/context/user";


// const UserInitialValues = {
//     user: {
//         id: '',
//         name: '',
//         email: '',
//         search: '',
//         firstName: '',
//         lastName: '',
//         username: '',
//         phone: '',
//         createdAt: new Date(),
//         updatedAt: new Date(),
//         inactive: false,
//         deleted: false,
//         branches: [
//             {
//                 id: '',
//                 name: '',
//                 address: '',
//                 phone: '',
//                 createdAt: new Date(),
//                 updatedAt: new Date(),
//                 deleted: false,
//                 roles: [],
//             }
//         ],
//     },
//     onChange: (user: UserWithBranchesAndRoles | null) => { },
//     assignRole: (branchId: string, role: Role) => { },
//     deleteRole: (branchId: string, roleId: string) => { },
//     roles: [],
// };

// interface UserContextType {
//     user: UserWithBranchesAndRoles | null;
//     onChange: (user: UserWithBranchesAndRoles | null) => void;
//     assignRole: (branchId: string, role: Role) => void;
//     deleteRole: (branchId: string, roleId: string) => void;
//     roles: Role[];
// }

// export const UserContext = createContext<UserContextType>(UserInitialValues);

export default function EditUser({ params }: { params: { id: string } }) {
    const { id } = params;
    const { loading, user, setUser } = useFetchUserById(id);
    const { roles } = useFetchRole('');


    const onChange = (user: UserWithBranchesAndRoles | null) => {
        setUser(user);
    }
    const assignRole = async (branchId: string, role: Role) => {
      const resp = await AssingRole({ userId: id, branchId, roleId: role.id });

      if (resp.success) {
        setUser((prev) => {
          if (!prev) return null;
          const branchExists = prev.branches.find((branch) => branch.id === branchId);

          let newBranches;
          if (branchExists) {

            newBranches = prev.branches.map((branch) => {
              if (branch.id === branchId) {
                return {
                  ...branch,
                  roles: [...branch.roles, role],
                };
              }
              return branch;
            });
          } else {

            newBranches = [
              ...prev.branches,
              {
                id: branchId,
                roles: [role],
                name: '',
                phone: '',
                deleted: false,
                address: '',
                createdAt: new Date(),
                updatedAt: new Date()
              },
            ];
          }

          return {
            ...prev,
            branches: newBranches,
          };
        });
        openNotification('success', 'Rol asignado correctamente');
      } else {
        console.error('Error:', resp);
        openNotification('error', resp.message);
      }
    };

    const deleteRole = async (branchId: string, roleId: string) => {
      const resp = await RemoveRole({ userId: id, branchId, roleId });

      if (resp.success) {
        setUser((prev) => {
          if (!prev) return null;

          const newBranches = prev.branches
            .map((branch) => {
              if (branch.id === branchId) {
                const updatedRoles = branch.roles.filter((role) => role.id !== roleId);

                if (updatedRoles.length === 0) {
                  return null;
                }
                return {
                  ...branch,
                  roles: updatedRoles,
                };
              }
              return branch;
            })
            .filter((branch) => branch !== null);
          return {
            ...prev,
            branches: newBranches,
          };
        });
        openNotification('success', 'Rol eliminado correctamente');
      } else {
        console.error('Error:', resp);
        openNotification('error', resp.message);
      }
    };

      useEffect(() => {
        console.log('BRANCHES', user?.branches);
      }, [user]);


    return (
        <UserContext.Provider value={ { user, onChange, roles, assignRole, deleteRole }}>
            <ViewTitle className='mb-6' title="Editar usuario" showBackPage />

            {loading ? <FormSkeleton /> : <UpdateUserForm />}
        </UserContext.Provider>
    )
}
