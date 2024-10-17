export { default } from "next-auth/middleware";

export const config = { 
  matcher: [
    "/",                       // Protege la ruta raíz
    "/users",                  // Protege /users
    "/users/:path*",           // Protege subrutas de /users como /users/64990c47-2f01-4100-acda-63f24afdfb0e
    "/roles",                  // Protege /roles
    "/roles/:path*",           // Protege subrutas de /roles
    "/branches",               // Protege /branches
    "/branches/:path*",        // Protege subrutas de /branches
    "/settings",               // Protege /settings
  ] 
};
