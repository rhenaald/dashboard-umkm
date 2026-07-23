import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifySession } from './app/utils/auth';

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect /admin and /monitoring routes
  if (pathname.startsWith('/admin') || pathname.startsWith('/monitoring')) {
    const session = request.cookies.get('admin_session')?.value;
    if (!session || !verifySession(session)) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('from', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Protect API mutation endpoints for /api/umkm
  if (pathname.startsWith('/api/umkm')) {
    const method = request.method;
    if (method === 'POST' || method === 'PUT' || method === 'DELETE') {
      const session = request.cookies.get('admin_session')?.value;
      if (!session || !verifySession(session)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/monitoring/:path*',
    '/api/umkm/:path*',
  ],
};
