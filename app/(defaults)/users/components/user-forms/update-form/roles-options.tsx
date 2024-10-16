import React, { useContext, useState } from 'react'
import { Button, Checkbox, Drawer } from '@/components/ui';
import { UserContext } from '../../../[id]/page';

export default function RolesOptions() {
  const [open, setOpen] = useState(false);
  const { roles } = useContext(UserContext)
  console.log(roles);

  const onCheck = (checked: boolean) => {
    console.log(checked);
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
          {roles.map((role) => (
            <Checkbox
              key={role.id}
              // onChange={(checked) => console.log(checked)}
            >
              {role.name}
            </Checkbox>
          ))}
        </div>
      </Drawer>
    </div>
  )
}
