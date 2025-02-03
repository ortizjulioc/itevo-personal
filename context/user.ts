import { createContext } from "react";
import { Role } from "@prisma/client";
import { UserWithBranchesAndRoles } from "@/app/(defaults)/users/lib/use-fetch-users";

interface UserContextType {
  user: UserWithBranchesAndRoles | null;
  onChange: (user: UserWithBranchesAndRoles | null) => void;
  assignRole: (branchId: string, role: Role) => void;
  deleteRole: (branchId: string, roleId: string) => void;
  roles: Role[];
}

export const UserContext = createContext<UserContextType | null>(null);