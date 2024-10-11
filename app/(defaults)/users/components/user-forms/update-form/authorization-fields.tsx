import { Field } from "formik";
import { FormItem, Input } from "@/components/ui";
import BranchesOption from "./BranchesOption";

export default function AuthorizationFields({ errors, touched }: any) {
    return (
        <>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
           <BranchesOption
           key={'111'}
           app={{id: 1, name: 'Santo Domingo',code: 'SANTO DOMINGO'}}
           onChange={() => {}}
           loading={false}
           active={true}
            />
              <BranchesOption
              key={'222'}
                app={{id: 2, name: 'San Francisco de Macoris',code: 'SAN FRANCISCO'}}
                onChange={() => {}}
                loading={false}
                active={true}
                />

                <BranchesOption
                key={'333'}
                app={{id: 3, name: 'Nagua',code: 'NAGUA'}}
                onChange={() => {}}
                loading={false}
                active={true}
                />
            </div>
        </>
    )
}
