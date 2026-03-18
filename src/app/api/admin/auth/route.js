import { connectDB } from '@/lib/mongodb';
import { signToken } from '@/lib/auth';
import Admin from '@/models/Admin';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    // 1. Parse body safely
    let body;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }

    const { username, password } = body;

    // 2. Validate inputs
    if (!username || !password) {
      return NextResponse.json({ error: 'Username and password required' }, { status: 400 });
    }

    // 3. Connect DB
    await connectDB();

    // 4. Find admin
    const admin = await Admin.findOne({ username });
    if (!admin) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // 5. Check password
    if (admin.password !== password) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // 6. Sign token
    const token = signToken({ id: admin._id, username: admin.username });

    // 7. Set cookie and return
    const res = NextResponse.json({ message: 'Login successful' }, { status: 200 });
    res.cookies.set('admin_token', token, {
      httpOnly: true,
      maxAge: 86400,
      path: '/',
    });
    return res;

  } catch (err) {
    console.error('Login error:', err);
    return NextResponse.json({ error: 'Server error: ' + err.message }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    const res = NextResponse.json({ message: 'Logged out' }, { status: 200 });
    res.cookies.set('admin_token', '', { maxAge: 0, path: '/' });
    return res;
  } catch (err) {
    return NextResponse.json({ error: 'Logout failed' }, { status: 500 });
  }
}