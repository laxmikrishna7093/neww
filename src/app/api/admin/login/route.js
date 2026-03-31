import { signToken } from '@/lib/auth';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(req) {
  const { username, password } = await req.json();

  // ✅ Credentials now read from .env.local — not hardcoded
  const validUsername = process.env.ADMIN_USERNAME;
  const validPassword = process.env.ADMIN_PASSWORD;

  if (username !== validUsername || password !== validPassword) {
    return NextResponse.json({ error: 'Invalid username or password' }, { status: 401 });
  }

  const token = signToken({ role: 'admin', username });

  const cookieStore = await cookies();
  cookieStore.set('admin_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: 60 * 60 * 24,
  });

  return NextResponse.json({ success: true });
}