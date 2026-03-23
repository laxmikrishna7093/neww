// src/app/api/admin/employees/route.js
import { connectDB } from '@/lib/mongodb';
import { verifyToken } from '@/lib/auth';
import Employee from '@/models/Employee';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

/* ─── Auth helper ─── */
async function authCheck() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('admin_token')?.value;
    if (!token) return null;
    const decoded = verifyToken(token);
    return decoded || null;
  } catch { return null; }
}

/* ─── GET — list all employees ─── */
export async function GET() {
  try {
    const auth = await authCheck();
    if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await connectDB();
    const employees = await Employee.find().sort({ createdAt: -1 }).lean();
    return NextResponse.json(employees);
  } catch (err) {
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}

/* ─── POST — create employee ─── */
export async function POST(req) {
  try {
    const auth = await authCheck();
    if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await connectDB();
    const body = await req.json();

    if (!body.empCode?.trim())   return NextResponse.json({ error: 'Employee Code is required' }, { status: 400 });
    if (!body.firstName?.trim()) return NextResponse.json({ error: 'First Name is required' }, { status: 400 });

    const existing = await Employee.findOne({ empCode: String(body.empCode).trim() });
    if (existing) return NextResponse.json({ error: `Employee code "${body.empCode}" already exists` }, { status: 409 });

    const emp = await Employee.create({
      ...body,
      empCode:  String(body.empCode).trim(),
      salary:   Number(body.salary) || 0,
      name:     `${body.firstName} ${body.lastName || ''}`.trim(),
    });
    return NextResponse.json(emp, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}

/* ─── PUT — update employee ─── */
export async function PUT(req) {
  try {
    const auth = await authCheck();
    if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await connectDB();
    const body = await req.json();
    const { id, ...data } = body;

    if (!id) return NextResponse.json({ error: 'Employee ID is required' }, { status: 400 });

    // Never let empCode change on update
    delete data.empCode;

    if (data.firstName || data.lastName) {
      data.name = `${data.firstName || ''} ${data.lastName || ''}`.trim();
    }
    if (data.salary !== undefined) data.salary = Number(data.salary) || 0;

    const emp = await Employee.findByIdAndUpdate(id, data, { new: true });
    if (!emp) return NextResponse.json({ error: 'Employee not found' }, { status: 404 });

    return NextResponse.json(emp);
  } catch (err) {
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}

/* ─── DELETE — remove employee ─── */
export async function DELETE(req) {
  try {
    const auth = await authCheck();
    if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await connectDB();
    const { id } = await req.json();
    if (!id) return NextResponse.json({ error: 'Employee ID is required' }, { status: 400 });

    const emp = await Employee.findByIdAndDelete(id);
    if (!emp) return NextResponse.json({ error: 'Employee not found' }, { status: 404 });

    return NextResponse.json({ message: 'Employee deleted successfully' });
  } catch (err) {
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}