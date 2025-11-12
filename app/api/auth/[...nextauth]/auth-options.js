import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import { findUserByEmail, findUserByUsername } from "@/services/user-service";
import { createLog } from "@/utils/log";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        identifier: { label: "Email or Username", type: "text", placeholder: "jsmith@example.com or jsmith" },
        password: { label: "Password", type: "password", placeholder: "*****" },
      },
      async authorize(credentials) {
        const { identifier, password } = credentials;

        let user = await findUserByEmail(identifier);
        if (!user) user = await findUserByUsername(identifier);

        if (!user) throw new Error("Usuario o contraseña incorrectos");

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) throw new Error("Usuario o contraseña incorrectos");

        await createLog({
          action: "POST",
          description: `Inicio de sesión de usuario ${user.username}`,
          origin: "auth",
          elementId: user.id,
          success: true,
        });

        // Determinar la sucursal activa (primera sucursal por defecto)
        const activeBranch = user.branches[0];
        const activeBranchRoles = activeBranch?.roles || [];

        return {
          id: user.id,
          username: user.username,
          name: user.name,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone,
          mainBranch: activeBranch,
          activeBranchId: activeBranch?.id,
          branches: user.branches,
          roles: activeBranchRoles,
        };
      },
    }),
  ],
  pages: { signIn: "/login" },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      // Inicialización del token cuando el usuario inicia sesión
      if (user) {
        token.id = user.id;
        token.username = user.username;
        token.name = user.name;
        token.lastName = user.lastName;
        token.email = user.email;
        token.phone = user.phone;
        token.mainBranch = user.mainBranch;
        token.activeBranchId = user.activeBranchId;
        token.branches = user.branches;
        token.roles = user.roles;
      }

      // Actualizar sucursal activa cuando se cambia desde el frontend
      if (trigger === 'update' && session?.activeBranchId) {
        const activeBranch = token.branches?.find(b => b.id === session.activeBranchId);
        if (activeBranch) {
          token.activeBranchId = session.activeBranchId;
          token.mainBranch = activeBranch;
          token.roles = activeBranch.roles || [];
        }
      }

      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.username = token.username;
      session.user.name = token.name;
      session.user.lastName = token.lastName;
      session.user.email = token.email;
      session.user.phone = token.phone;
      session.user.mainBranch = token.mainBranch;
      session.user.activeBranchId = token.activeBranchId;
      session.user.branches = token.branches;
      session.user.roles = token.roles;
      return session;
    },
  },
};
