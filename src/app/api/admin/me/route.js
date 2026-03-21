import { verifyToken } from '@/lib/auth';
import { NextResponse } from 'next/server';

export async function GET(req) {
  try {
    const token = req.cookies.get('admin_token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verifyToken(token);

    return NextResponse.json({ user: decoded });
  } catch {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }
}