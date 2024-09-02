import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { isAuthenticated } from '@/utils/auth';

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
  matcher: ['/', '/chats', ],
};