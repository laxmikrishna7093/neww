import { connectDB } from '@/lib/mongodb';
import { verifyToken } from '@/lib/auth';
import Employee from '@/models/Employee';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

function authCheck() {
  const token = cookies().get('admin_token')?.value;
  return verifyToken(token);
}

export async function GET() {
  if (!authCheck()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  await connectDB();
  const employees = await Employee.find().sort({ createdAt: -1 });
  return NextResponse.json(employees);
}

export async function POST(req) {
  if (!authCheck()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  await connectDB();
  const body = await req.json();
  const emp = await Employee.create(body);
  return NextResponse.json(emp, { status: 201 });
}

export async function PUT(req) {
  if (!authCheck()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  await connectDB();
  const { id, ...data } = await req.json();
  const emp = await Employee.findByIdAndUpdate(id, data, { new: true });
  return NextResponse.json(emp);
}

export async function DELETE(req) {
  if (!authCheck()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  await connectDB();
  const { id } = await req.json();
  await Employee.findByIdAndDelete(id);
  return NextResponse.json({ message: 'Deleted' });
}