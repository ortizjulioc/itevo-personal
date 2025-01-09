// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
//   const { cookies } = request
//   const sessionCookie = cookies.get('sessionId')?.value

//   if (!sessionCookie) {
//     // Redirige a la página de login
//     return NextResponse.redirect(new URL('/login', request.url))
//   }

//   // Puedes agregar otras validaciones (p.ej., JWT) aquí
//   // ...

//   // Deja pasar la solicitud si todo está OK
//   return NextResponse.next()
console.log('middleware')
}

export const config = {
  matcher: ['/:path*', '/api/:path*'],
}
