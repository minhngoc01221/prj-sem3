import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Admin routes that need authentication
  if (pathname.startsWith('/admin') && pathname !== '/admin' && pathname !== '/login-admin') {
    const adminToken = request.cookies.get('admin_token');

    if (!adminToken) {
      const loginUrl = new URL('/login-admin', request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Redirect logged in admin away from login page
  if (pathname === '/login-admin') {
    const adminToken = request.cookies.get('admin_token');

    if (adminToken) {
      const adminUrl = new URL('/admin', request.url);
      return NextResponse.redirect(adminUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/login-admin'],
};
