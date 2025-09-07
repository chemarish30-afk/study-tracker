import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('jwt')?.value;

  // Protected routes that require authentication
  const protectedRoutes = ['/dashboard', '/welcome', '/onboarding', '/courses', '/profile'];

  // Check if the current path is a protected route
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

  // If accessing a protected route without a token, redirect to sign-in
  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }

  // If accessing sign-in/sign-up with a token, redirect to dashboard
  if ((pathname === '/sign-in' || pathname === '/sign-up') && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // If accessing root with a token, redirect to dashboard
  if (pathname === '/' && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};

