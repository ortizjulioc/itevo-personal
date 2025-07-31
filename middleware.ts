// middleware.ts
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import { routeConfig } from '@/config/route.auth.config' // Importa tu configuración de rutas

export default withAuth(
  async function middleware(req, res) {
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
    "/", // Inicio
  
    "/users",
    "/users/:path*",
  
    "/roles",
    "/roles/:path*",
  
    "/branches",
    "/branches/:path*",
  
    "/settings",
    "/settings/:path*",
  
    "/teachers",
    "/teachers/:path*",
  
    "/students",
    "/students/:path*",
  
    "/course-branch",
  
    "/enrollments",
  
    "/attendances",
  
    "/courses",
  
    "/promotions",
  
    "/schedules",
  
    "/holidays",
  
    "/invoices",
    "/invoices/:path*",
  
    "/bills",
    "/bills/:path*",
  
    "/cash-registers",
    "/cash-registers/:path*",
  
    "/products",
    "/products/:path*",
  
    "/ncfranges",
    "/ncfranges/:path*",
  
    // Si en algún momento quieres proteger también las rutas de API:
    // "/api/:path*",
  ]
  
};
