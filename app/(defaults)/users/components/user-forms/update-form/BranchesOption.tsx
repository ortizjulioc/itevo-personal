import Card from "@/components/common/Card";
import Switcher from "@/components/common/Switcher";
import classNames from "classnames";

// import RoleModal from "./RoleModal";

interface App {
  id: number;
  code: string;
  name: string;
}

interface AppsOptionsProps {
  app: App;
  className?: string;
  onChange: (checked: boolean, id: number) => void;
  loading: boolean;
  active: boolean;
}

const BranchesOption: React.FC<AppsOptionsProps> = ({ app, className, onChange, loading, active }) => {
  const { id, code, name } = app;

  return (
    <div className={classNames('panel', className)}>
      <div className='flex flex-col justify-between h-full'>
        <div className='flex flex-col justify-between mb-4'>
          <div className="flex justify-between items-center">
            <span className='text-base font-bold text-gray-900'>{code}</span>
            <div>
              <Switcher
                checked={active}
                onChange={(checked) => onChange(checked, id)}
                isLoading={loading}
              />
            </div>
          </div>
          <span>{name}</span>
        </div>
        {/* <RoleModal app={app} /> */}
      </div>
    </div>
  );
};

export default BranchesOption;
