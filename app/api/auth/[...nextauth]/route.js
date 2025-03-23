import NextAuth from "next-auth";
import { authOptions } from "./auth-options";

// export const authOptions = {
//   providers: [
//     CredentialsProvider({
//       name: "Credentials",
//       credentials: {
//         identifier: { label: "Email or Username", type: "text", placeholder: "jsmith@example.com or jsmith" }, // Un solo campo para email o username
//         password: { label: "Password", type: "password", placeholder: "*****" },
//       },
//       async authorize(credentials, req) {
//         const { identifier, password } = credentials;

//         let user = await findUserByEmail(identifier);

//         if (!user) {
//           user = await findUserByUsername(identifier);
//         }

//         if (!user) {
//           throw new Error('Usuario o contraseña incorrectos');
//         }
//         const isPasswordCorrect = await bcrypt.compare(password, user.password);

//         if (!isPasswordCorrect) {
//           throw new Error('Usuario o contraseña incorrectos');
//         }

//         // Enviar al log de auditoria

//         await createLog({
//             action: "POST",
//             description: `Inicio de sesión de usuario ${user.username}`,
//             origin: "auth",
//             elementId: user.id,
//             success: true,
//         });


//         // Retorna el objeto de usuario si todo está correcto
//         return {
//           id: user.id,
//           username: user.username,
//           name: user.name,
//           lastName: user.lastName,
//           email: user.email,
//           phone: user.phone,
//           branches: user.branches,
//         };
//       },
//     }),
//   ],
//   pages: {
//     signIn: "/login",
//   },
//   callbacks: {
//     async jwt({ token, user }) {

//       if (user) {
//         token.id = user.id;
//         token.username = user.username;
//         token.name = user.name;
//         token.lastName = user.lastName;
//         token.email = user.email;
//         token.phone = user.phone;
//         token.branches = user.branches;
//         token.roles= user.branches[0]?.roles;

//       }
//       return token;
//     },
//     async session({ session, token }) {
//       // Agrega más parámetros a la sesión
//       session.user.id = token.id;
//       session.user.username = token.username
//       session.user.name = token.name;
//       session.user.lastName = token.lastName;
//       session.user.email = token.email;
//       session.user.phone = token.phone;
//       session.user.branches = token.branches;
//       session.user.roles = token.roles;
//       return session;
//     },
//   },
// };

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
