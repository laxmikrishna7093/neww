import { connectDB } from '@/lib/mongodb';
import { verifyToken } from '@/lib/auth';
import Salary from '@/models/Salary';
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
  const salaries = await Salary.find().populate('employeeId', 'name email department');
  return NextResponse.json(salaries);
}

export async function POST(req) {
  if (!authCheck()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  await connectDB();
  const body = await req.json();
  body.netSalary = (body.basicSalary || 0) + (body.allowances || 0) - (body.deductions || 0);
  const salary = await Salary.create(body);
  return NextResponse.json(salary, { status: 201 });
}