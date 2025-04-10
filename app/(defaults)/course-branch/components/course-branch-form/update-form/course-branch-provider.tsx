import { createContext, useContext } from "react";

const CourseBranchContext = createContext<any>(null);
export const CourseBranchProvider = CourseBranchContext.Provider;

export const useCourseBranch = () => useContext(CourseBranchContext);

export default CourseBranchProvider;