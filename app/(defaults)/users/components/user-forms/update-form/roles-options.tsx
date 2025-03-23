import React, { useContext, useState } from 'react'
import { Button, Checkbox, Drawer } from '@/components/ui';
import { Role } from '@prisma/client';
import { UserContext } from '@/context/user';

export default function RolesOptions({branchId}: {branchId: string}) {
  const [open, setOpen] = useState(false);
  // const { roles, user,assignRole,deleteRole} = useContext(UserContext)
  const userContext = useContext(UserContext);
  const roles = userContext?.roles;
  const user = userContext?.user;
  const assignRole = userContext?.assignRole;
  const deleteRole = userContext?.deleteRole;


 const BranchRoles = user?.branches.find((branch) => branch.id === branchId)?.roles;



  const onCheck = (checked: boolean,role:Role) => {
    if (checked) {
      assignRole?.(branchId, role);
    } else {
      deleteRole?.(branchId, role.id);
    }
  }

  return (
    <div>

      <div className="mt-4">
        <Button variant="outline" className="w-full" onClick={() => setOpen(true)}>Roles</Button>
      </div>
      <Drawer open={open} onClose={() => setOpen(false)} title="Title">
        <div className="flex flex-col space-y-4">
          <div>
            <h4 className="text-lg font-semibold">Roles</h4>
          </div>
        </div>

        <div className="grid mt-4 gap-2">
          {roles?.map((role) => (
            <Checkbox
              key={role.id}
              onChange={(checked) => onCheck(checked, role)}
              checked={BranchRoles?.some((branchRole) => branchRole.id === role.id)}
            >
              {role.name}
            </Checkbox>
          ))}
        </div>
      </Drawer>
    </div>
  )
}
