// middleware.ts
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import { routeConfig } from '@/config/route.auth.config';

export default withAuth(
  async function middleware(req) {
    const { pathname } = req.nextUrl;
    const token = req.nextauth?.token;

    if (pathname === '/login') {
      return NextResponse.next();
    }

    // Si no hay token, redirigir al login
    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    // Buscar la ruta correspondiente (maneja rutas con :path*)
    const route = routeConfig.find(route => {
      if (!route || !route.url) return false;
      if (route.url.includes(":path*")) {
        const base = route.url.replace('/:path*', '').replace(/\/$/, '');
        return pathname.startsWith(base);
      }
      return route.url.replace(/\/$/, '') === pathname.replace(/\/$/, '');
    });

    if (!route) return NextResponse.next();
    if (route.authorization.length === 0) return NextResponse.next();

    // Verificar permisos
    const userRoles = token?.roles || [];
    const hasAccess = Array.isArray(userRoles) && userRoles.some(role =>
      route.authorization.includes(role.normalizedName)
    );

    if (!hasAccess) {
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

// Configuración del matcher manual
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
    "/course-branch/:path*",

    "/enrollments",
    "/enrollments/:path*",

    "/attendances",

    "/courses",
    "/courses/:path*",

    "/promotions",
    "/promotions/:path*",

    "/schedules",

    "/holidays",
    "/holidays/:path*",

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

    "/accounts-receivable",
    "/accounts-receivable/:path*",

    "/cash-boxes",
    "/cash-boxes/:path*",

    "/api/:path*"
  ]
};
