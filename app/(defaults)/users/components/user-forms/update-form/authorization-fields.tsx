import { Field } from "formik";
import { FormItem, Input } from "@/components/ui";
import BranchesOption from "./BranchesOption";
import useFetchBranch from "../../../lib/use-fetch-branches";

export default function AuthorizationFields({values, errors, touched }: any) {

      console.log(values.branches);
  const { loading, error, branches, totalBranches, setBranches } = useFetchBranch('');
    return (
        <>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
          {branches?.map((branch) => {
            return (
              <BranchesOption
              key={branch.id}
              branch={branch}
              onChange={() => {}}
              loading={false}
              active={values.branches?.includes(branch.id)}
              />
            );
          }
          )}
             
            </div>
        </>
    )
}
