import { NextRequest, NextResponse } from 'next/server';

const COOKIE_NAME = 'nicole_auth';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const cookie = request.cookies.get(COOKIE_NAME);
  const hasAuth = !!cookie && cookie.value.length > 10;

  if (pathname === '/admin/login') {
    if (hasAuth) {
      return NextResponse.redirect(new URL('/admin', request.url));
    }
    return NextResponse.next();
  }

  if (pathname.startsWith('/admin')) {
    if (!hasAuth) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
