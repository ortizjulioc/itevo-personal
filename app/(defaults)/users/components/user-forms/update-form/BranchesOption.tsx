import Card from "@/components/common/Card";

import classNames from "classnames";
import { Branch } from "@prisma/client";
import Switcher from "@/components/common/Switcher";


// import RoleModal from "./RoleModal";



interface BranchesOptionsProps {
  branch: Branch;
  className?: string;
  onChange: (checked: boolean, id: string) => void;
  loading: any;
  active: boolean;
}

const BranchesOption: React.FC<BranchesOptionsProps> = ({ branch, className, onChange, loading, active }) => {
  const { id, name, address } = branch

  return (
    <div className={classNames('panel', className)}>
      <div className='flex flex-col justify-between h-full'>
        <div className='flex flex-col justify-between mb-4'>
          <div className="flex justify-between items-center">
            <span className='text-base font-bold text-gray-900'>{name}</span>
            <div>
              <Switcher
                id={id.toString()}
                checked={active}
                onChange={(checked) => onChange(checked, id)}
              />
            </div>
          </div>
          <span>{address}</span>
        </div>
        {/* <RoleModal app={app} /> */}
      </div>
    </div>
  );
};

export default BranchesOption;
