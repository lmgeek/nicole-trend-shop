import { NextRequest, NextResponse } from 'next/server';
import { getAuthCookie } from './lib/auth';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith('/admin')) {
    if (pathname === '/admin/login') {
      const auth = await getAuthCookie();
      if (auth) {
        return NextResponse.redirect(new URL('/admin', request.url));
      }
      return NextResponse.next();
    }

    const auth = await getAuthCookie();
    if (!auth) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    try {
      const { verifyToken } = await import('./lib/auth');
      verifyToken(auth.token);
    } catch {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
