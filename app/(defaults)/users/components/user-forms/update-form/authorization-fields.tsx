import BranchesOption from "./branches-option";
import useFetchBranch from "../../../lib/use-fetch-branches";

const CardSkeleton = () => {
  return (
    <div className="animate-pulse border border-transparent rounded min-h-[156px]">
      <div className="animate-pulse bg-gray-300 dark:bg-gray-700 w-full h-full rounded"></div>
    </div>
  )
}

export default function AuthorizationFields() {
  const { branches, loading } = useFetchBranch('');
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
            />
          );
        }
        )}

      </div>
    </>
  )
}
