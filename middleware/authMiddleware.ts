import { NextResponse } from 'next/server';
import { isAuthenticated } from '../utils/auth';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  const user = isAuthenticated(req);
  console.log('user', user);

  if (!user) {
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/profile/:path*'],
};