import { NextRequest, NextResponse } from 'next/server';
import { getAdminByUsername } from '@/app/utils/db';
import { verifyPassword, signSession } from '@/app/utils/auth';

// Simple in-memory rate limiting map
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const LIMIT = 5; // Max 5 login attempts
const WINDOW_MS = 60 * 1000; // 1 minute window

export async function POST(request: NextRequest) {
  try {
    // Get client IP address
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim() || 
               request.headers.get('x-real-ip') || 
               '127.0.0.1';

    const now = Date.now();
    const limitRecord = rateLimitMap.get(ip);

    if (limitRecord) {
      if (now > limitRecord.resetTime) {
        // Reset window if expired
        rateLimitMap.set(ip, { count: 1, resetTime: now + WINDOW_MS });
      } else if (limitRecord.count >= LIMIT) {
        // Limit exceeded
        return NextResponse.json(
          { error: 'Terlalu banyak percobaan masuk. Silakan coba lagi dalam 1 menit.' },
          { status: 429 }
        );
      } else {
        limitRecord.count++;
      }
    } else {
      rateLimitMap.set(ip, { count: 1, resetTime: now + WINDOW_MS });
    }

    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json({ error: 'Username dan password wajib diisi.' }, { status: 400 });
    }

    const admin = await getAdminByUsername(username);

    if (!admin) {
      return NextResponse.json({ error: 'Username atau password salah.' }, { status: 401 });
    }

    if (!verifyPassword(password, admin.password)) {
      return NextResponse.json({ error: 'Username atau password salah.' }, { status: 401 });
    }

    // Reset rate limit on successful login
    rateLimitMap.delete(ip);

    const response = NextResponse.json({ success: true, message: 'Berhasil masuk.' });
    
    // Generate secure signed session token
    const token = signSession(username);

    // Set admin_session HttpOnly cookie
    response.cookies.set({
      name: 'admin_session',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24, // 24 hours
      path: '/'
    });

    return response;
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Terjadi kesalahan server.' }, { status: 500 });
  }
}
