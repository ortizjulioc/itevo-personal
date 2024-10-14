
import classNames from "classnames";
import { Branch } from "@prisma/client";
import { Button } from "@/components/ui";
import Switcher from "@/components/common/switcher";

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
    <div className={classNames('panel bg-white shadow-[4px_6px_10px_-3px_#bfc9d4] rounded border border-white-light dark:border-[#1b2e4b] dark:bg-[#191e3a] dark:shadow-none', className)}>
      <div className="flex flex-col justify-between h-full">
        <div>
          <div className="absolute top-4 right-4">
            <Switcher />
          </div>

          <div className="mt-4">
            <h4 className="text-base font-bold text-gray-900 dark:text-gray-50">{name}</h4>
            <span>{address}</span>
          </div>
        </div>

        <div className="mt-4">
          <Button variant="outline" className="w-full">Roles</Button>
        </div>
      </div>
    </div>
  );
};

export default BranchesOption;
