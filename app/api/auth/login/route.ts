import { NextResponse } from 'next/server';
import { getAdminByUsername } from '@/app/utils/db';
import crypto from 'crypto';

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json({ error: 'Username dan password wajib diisi.' }, { status: 400 });
    }

    const admin = await getAdminByUsername(username);

    if (!admin) {
      return NextResponse.json({ error: 'Username atau password salah.' }, { status: 401 });
    }

    const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');

    if (admin.password !== hashedPassword) {
      return NextResponse.json({ error: 'Username atau password salah.' }, { status: 401 });
    }

    const response = NextResponse.json({ success: true, message: 'Berhasil masuk.' });
    
    // Set admin_session HttpOnly cookie
    response.cookies.set({
      name: 'admin_session',
      value: 'authenticated',
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
