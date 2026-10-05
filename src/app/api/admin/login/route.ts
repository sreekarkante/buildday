import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { signAdminToken } from '@/lib/adminSession';
import { checkRateLimit } from '@/lib/rate-limit';

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    const { allowed } = checkRateLimit(`admin-login-${ip}`, 5, 60 * 1000);
    
    if (!allowed) {
      return NextResponse.json({ success: false, message: 'Too many attempts.' }, { status: 429 });
    }

    // Small delay to deter brute forcing
    await new Promise((resolve) => setTimeout(resolve, 500));

    const body = await request.json();
    const providedPassword = body.password || '';
    const adminPassword = process.env.ADMIN_PASSWORD || '';

    // Prevent login if no password is configured on the server
    if (!adminPassword) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    // Hash both sides to ensure equal length for timingSafeEqual
    const providedHash = crypto.createHash('sha256').update(providedPassword).digest();
    const expectedHash = crypto.createHash('sha256').update(adminPassword).digest();

    if (!crypto.timingSafeEqual(providedHash, expectedHash)) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const token = signAdminToken();
    if (!token) {
      return NextResponse.json({ success: false, message: 'Server configuration error' }, { status: 500 });
    }

    const response = NextResponse.json({ success: true });
    response.cookies.set('admin_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 28800, // 8 hours
    });

    return response;
  } catch (error) {
    console.error('Login error', error);
    return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
  }
}
