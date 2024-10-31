// middleware.ts
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import { routeConfig } from '@/config/route.auth.config' // Importa tu configuración de rutas

export default withAuth(
  async function middleware(req) {
    const { pathname } = req.nextUrl;
    const token = req.nextauth?.token;

   
    if (pathname === '/login') {
      return NextResponse.next();
    }
    
    // Si no hay token (usuario deslogueado), redirigir al login
    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    // Buscar la ruta en la configuración
    const route = routeConfig.find(route => route.url === pathname);

    // Si la ruta no está protegida, permitir el acceso
    if (!route || route.authorization.length === 0) {
      return NextResponse.next();
    }


    // Verificar los roles del usuario
    const userRoles = token?.roles || [];

    // Comprobar si el usuario tiene algún rol autorizado
    const hasAccess = Array.isArray(userRoles) && userRoles.some((role) =>
      route.authorization.includes(role.normalizedName)
    );

    // Si no tiene acceso, redirigir a la página de "No autorizado"
    if (!hasAccess) {
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }

    // Si todo está correcto, permitir acceso
    return NextResponse.next();
  },
  {
    callbacks: {
      // Verificar que haya un token presente para autorizar
      authorized: ({ token }) => !!token,
    },
  }
);

// Configuración del matcher para proteger las rutas
export const config = {
  matcher: [
    "/",                       // Protege la ruta raíz
    "/users",                  // Protege /users
    "/users/:path*",           // Protege subrutas de /users
    "/roles",                  // Protege /roles
    "/roles/:path*",           // Protege subrutas de /roles
    "/branches",               // Protege /branches
    "/branches/:path*",        // Protege subrutas de /branches
    "/settings",               // Protege /settings, solo admin tiene acceso
  ],
};
