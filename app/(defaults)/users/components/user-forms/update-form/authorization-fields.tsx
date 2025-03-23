import BranchesOption from "./branches-option";
import useFetchBranch from "../../../lib/use-fetch-branches";
import { useContext } from "react";
import { UserContext } from "@/context/user";

const CardSkeleton = () => {
  return (
    <div className="animate-pulse border border-transparent rounded min-h-[156px]">
      <div className="animate-pulse bg-gray-300 dark:bg-gray-700 w-full h-full rounded"></div>
    </div>
  )
}

export default function AuthorizationFields() {
  const { branches, loading } = useFetchBranch('');
  const userContext = useContext(UserContext);
  const user = userContext?.user;
  return (
    <>
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
        {loading && (
          <>
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
          </>
        )}

        {branches?.map((branch) => {
          return (
            <BranchesOption
              key={branch.id}
              branch={branch}
              checked={user?.branches.some((userBranch) => userBranch.id === branch.id)}
            />
          );
        }
        )}

      </div>
    </>
  )
}
