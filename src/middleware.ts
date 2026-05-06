// ==========================================
// Middleware — Route Protection by Role
// ==========================================
// Note: Next.js middleware runs on Edge Runtime.
// We can't use jsonwebtoken here, so we decode the JWT manually.

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

function decodeJWTPayload(token: string): { userId: string; role: string; name: string } | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const payload = JSON.parse(atob(parts[1]));
    return payload;
  } catch {
    return null;
  }
}

export function middleware(request: NextRequest) {
  const token = request.cookies.get('eduadapt_token')?.value;
  const { pathname } = request.nextUrl;

  // Public routes — no auth required
  const isPublicPage = ['/', '/login', '/register'].includes(pathname) || pathname.startsWith('/courses');
  const isApiPublic = pathname.startsWith('/api/auth') || pathname === '/api/courses' || pathname === '/api/seed' || /^\/api\/courses\/[^/]+$/.test(pathname);
  const isStaticAsset = pathname.startsWith('/_next') || pathname.includes('.');

  if (isStaticAsset || isPublicPage || isApiPublic) {
    return NextResponse.next();
  }

  // Check for token on protected routes
  if (!token) {
    if (pathname.startsWith('/api/')) {
      return NextResponse.json({ success: false, error: 'Authentication required' }, { status: 401 });
    }
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Decode token (lightweight — full verification happens in API routes)
  const payload = decodeJWTPayload(token);
  if (!payload) {
    if (pathname.startsWith('/api/')) {
      return NextResponse.json({ success: false, error: 'Invalid token' }, { status: 401 });
    }
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Role-based route protection for page routes
  if (pathname.startsWith('/student') && payload.role !== 'student') {
    return NextResponse.redirect(new URL(`/${payload.role}/dashboard`, request.url));
  }
  if (pathname.startsWith('/instructor') && payload.role !== 'instructor') {
    return NextResponse.redirect(new URL(`/${payload.role}/dashboard`, request.url));
  }
  if (pathname.startsWith('/admin') && payload.role !== 'admin') {
    return NextResponse.redirect(new URL(`/${payload.role}/dashboard`, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.svg$|.*\\.jpg$).*)',
  ],
};
