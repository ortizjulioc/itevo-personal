import NextAuth, { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface User extends DefaultUser {
    id: string;
    username: string;
    lastName: string;
    phone: string;
    mainBranch: any;
    activeBranchId: string;
    branches: any[];
    roles: any[];
  }

  interface Session {
    user: {
      id: string;
      username: string;
      lastName: string;
      phone: string;
      mainBranch: any;
      activeBranchId: string;
      branches: any[];
      roles: any[];
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    username: string;
    lastName: string;
    phone: string;
    mainBranch: any;
    activeBranchId: string;
    branches: any[];
    roles: any[];
  }
}
