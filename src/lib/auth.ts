// ==========================================
// JWT Authentication Helpers
// ==========================================

import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { JWTPayload, UserRole } from '@/types';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-change-in-production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';
const COOKIE_NAME = 'eduadapt_token';

// Sign a new JWT token
export function signToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  } as jwt.SignOptions);
}

// Verify and decode a JWT token
export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  } catch {
    return null;
  }
}

// Set JWT in httpOnly cookie
export async function setAuthCookie(payload: JWTPayload): Promise<string> {
  const token = signToken(payload);
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60, // 7 days
    path: '/',
  });
  return token;
}

// Remove auth cookie
export async function removeAuthCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

// Get current user from cookie
export async function getCurrentUser(): Promise<JWTPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyToken(token);
}

// Check if user has the required role
export async function checkAuth(requiredRole?: UserRole): Promise<JWTPayload | null> {
  const user = await getCurrentUser();
  if (!user) return null;
  if (requiredRole && user.role !== requiredRole) return null;
  return user;
}

// Get token from request headers (for API routes)
export function getTokenFromRequest(request: Request): string | null {
  const cookieHeader = request.headers.get('cookie');
  if (!cookieHeader) return null;
  
  const cookies = cookieHeader.split(';').reduce((acc, cookie) => {
    const [key, value] = cookie.trim().split('=');
    acc[key] = value;
    return acc;
  }, {} as Record<string, string>);
  
  return cookies[COOKIE_NAME] || null;
}

// Verify auth from request object (for API route handlers)
export function verifyAuthFromRequest(request: Request): JWTPayload | null {
  const token = getTokenFromRequest(request);
  if (!token) return null;
  return verifyToken(token);
}
