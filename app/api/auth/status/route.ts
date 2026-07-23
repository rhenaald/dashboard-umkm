import { NextRequest, NextResponse } from 'next/server';
import { verifySession } from '@/app/utils/auth';

export async function GET(request: NextRequest) {
  try {
    const session = request.cookies.get('admin_session')?.value;
    const isAuthenticated = verifySession(session);
    return NextResponse.json({ isAuthenticated });
  } catch (error) {
    console.error('Error checking auth status:', error);
    return NextResponse.json({ isAuthenticated: false }, { status: 500 });
  }
}
