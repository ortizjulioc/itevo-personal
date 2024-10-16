
import classNames from "classnames";
import { Branch } from "@prisma/client";
import { Switcher } from "@/components/ui";
import RolesOptions from "./roles-options";


interface BranchesOptionsProps {
  branch: Branch;
  className?: string;
  checked?: boolean;
}

const BranchesOption: React.FC<BranchesOptionsProps> = ({ branch, className, checked }) => {
  const { id, name, address } = branch;
  

  return (
    <>
      <div className={classNames('panel bg-white shadow-[4px_6px_10px_-3px_#bfc9d4] rounded border border-white-light dark:border-[#1b2e4b] dark:bg-[#191e3a] dark:shadow-none', className)}>
        <div className="flex flex-col justify-between h-full">
          <div>
            <div className="absolute top-4 right-4">
              <Switcher border="rounded" variant="outline" checked={checked} />
            </div>

            <div className="mt-4">
              <h4 className="text-base font-bold text-gray-900 dark:text-gray-50">{name}</h4>
              <span>{address}</span>
            </div>
          </div>

          <div className="mt-4">
            <RolesOptions branchId={id}/>
          </div>

        </div>
      </div>
    </>
  );
};

export default BranchesOption;
