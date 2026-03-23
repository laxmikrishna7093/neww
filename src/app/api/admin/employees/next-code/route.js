// src/app/api/admin/employees/next-code/route.js
// Returns the next available employee code without incrementing
// Increments only when a new employee is actually saved (POST /employees)
import { connectDB } from '@/lib/mongodb';
import { verifyToken } from '@/lib/auth';
import Employee from '@/models/Employee';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

async function authCheck() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('admin_token')?.value;
    if (!token) return null;
    return verifyToken(token) || null;
  } catch { return null; }
}

export async function GET() {
  try {
    const auth = await authCheck();
    if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await connectDB();

    // Find the highest empCode number in DB
    const employees = await Employee.find({}, 'empCode').lean();
    let maxCode = 5000;
    for (const e of employees) {
      const num = parseInt(e.empCode, 10);
      if (!isNaN(num) && num > maxCode) maxCode = num;
    }
    const nextCode = String(maxCode + 1);
    return NextResponse.json({ nextCode });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}