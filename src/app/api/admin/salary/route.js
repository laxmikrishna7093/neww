// src/app/api/admin/salary/route.js
import { connectDB }   from '@/lib/mongodb';
import { verifyToken } from '@/lib/auth';
import Salary          from '@/models/Salary';
import Employee        from '@/models/Employee';
import { NextResponse } from 'next/server';
import { cookies }     from 'next/headers';

async function authCheck() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('admin_token')?.value;
    if (!token) return null;
    return verifyToken(token) || null;
  } catch { return null; }
}

/* ─── GET ─── */
export async function GET(req) {
  try {
    const auth = await authCheck();
    if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    await connectDB();

    const { searchParams } = new URL(req.url);
    const employeeId = searchParams.get('employeeId');
    const query = employeeId ? { employeeId } : {};

    const salaries = await Salary.find(query)
      .populate('employeeId', 'firstName lastName empCode department position photoUrl salary doj')
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(salaries);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

/* ─── POST — save payslip permanently ─── */
export async function POST(req) {
  try {
    const auth = await authCheck();
    if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    await connectDB();

    const body = await req.json();
    const { employeeId, month, year, uan, pf, esi, totalDays, workedDays } = body;

    if (!employeeId) return NextResponse.json({ error: 'Employee ID required' }, { status: 400 });
    if (!month)      return NextResponse.json({ error: 'Month required' },       { status: 400 });
    if (!year)       return NextResponse.json({ error: 'Year required' },        { status: 400 });

    const emp = await Employee.findById(employeeId).lean();
    if (!emp) return NextResponse.json({ error: 'Employee not found' }, { status: 404 });

    const basicSalary = parseFloat(emp.salary) || 0;
    const tDays       = parseInt(totalDays)     || 30;
    const wDays       = parseInt(workedDays)    || tDays;

    // Salary based on worked days
    const perDay      = tDays > 0 ? basicSalary / tDays : 0;
    const earnedSal   = Math.round(perDay * wDays * 100) / 100;

    const pfAmt       = parseFloat(pf)  || 0;
    const esiAmt      = parseFloat(esi) || 0;
    const totalDed    = pfAmt + esiAmt;
    const netSalary   = Math.round((earnedSal - totalDed) * 100) / 100;

    // Upsert — update if exists, create if not
    const salary = await Salary.findOneAndUpdate(
      { employeeId, month, year },
      {
        employeeId,
        empCode:  emp.empCode,
        month, year, uan,
        basicSalary: earnedSal, // store earned (not full basic)
        totalDays: tDays, workedDays: wDays,
        pf: pfAmt, esi: esiAmt,
        totalDed, netSalary,
        generatedAt: new Date(),
      },
      { upsert: true, new: true }
    );

    return NextResponse.json({ success: true, salary }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

/* ─── DELETE ─── */
export async function DELETE(req) {
  try {
    const auth = await authCheck();
    if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    await connectDB();
    const { id } = await req.json();
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });
    await Salary.findByIdAndDelete(id);
    return NextResponse.json({ message: 'Deleted' });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}