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
  } catch { 
    return null; 
  }
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
    console.error('GET /api/admin/employees error:', err);
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

    if (!body.empCode?.trim()) return NextResponse.json({ error: 'Employee Code is required' }, { status: 400 });
    if (!body.firstName?.trim()) return NextResponse.json({ error: 'First Name is required' }, { status: 400 });

    const existing = await Employee.findOne({ empCode: String(body.empCode).trim() });
    if (existing) return NextResponse.json({ error: `Employee code "${body.empCode}" already exists` }, { status: 409 });

    const emp = await Employee.create({
      empCode:          String(body.empCode).trim(),
      firstName:        body.firstName,
      lastName:         body.lastName         || '',
      name:             `${body.firstName} ${body.lastName || ''}`.trim(),
      email:            body.email            || '',
      phone:            body.phone            || '',
      department:       body.department       || '',
      position:         body.position         || '',
      salary:           Number(body.salary)   || 0,
      reportingManager: body.reportingManager || '',
      employmentType:   body.employmentType   || 'Full Time',
      doj:              body.doj              || '',
      status:           body.status           || 'Existing',
      letterStatus:     body.letterStatus     || 'Pending',
      gender:           body.gender           || '',
      bloodGroup:       body.bloodGroup       || '',
      photoUrl:         body.photoUrl         || '',
      panCard:          body.panCard          || '',
      aadhaar:          body.aadhaar          || '',
      spouseOrGuardian: body.spouseOrGuardian || '',
      aadhaarNumber:    body.aadhaarNumber    || '',
      emergencyContact: body.emergencyContact || '',
      emergencyPhone:   body.emergencyPhone   || '',
      nomineeName:      body.nomineeName      || '',
      nomineeRelation:  body.nomineeRelation  || '',
      uanNumber:        body.uanNumber        || '',
      bankName:         body.bankName         || '',
      accountNumber:    body.accountNumber    || '',
      ifscCode:         body.ifscCode         || '',
      addressLine1:     body.addressLine1     || '',
      addressLine2:     body.addressLine2     || '',
      city:             body.city             || '',
      state:            body.state            || '',
      pincode:          body.pincode          || '',
    });

    console.log('Employee created:', emp.empCode);
    return NextResponse.json(emp, { status: 201 });
  } catch (err) {
    console.error('POST /api/admin/employees error:', err);
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
    const { id } = body;

    if (!id) return NextResponse.json({ error: 'Employee ID is required' }, { status: 400 });

    const updateData = {
      firstName:        body.firstName,
      lastName:         body.lastName,
      name:             `${body.firstName || ''} ${body.lastName || ''}`.trim(),
      email:            body.email            || '',
      phone:            body.phone            || '',
      department:       body.department       || '',
      position:         body.position         || '',
      salary:           Number(body.salary)   || 0,
      reportingManager: body.reportingManager || '',
      employmentType:   body.employmentType   || 'Full Time',
      doj:              body.doj              || '',
      gender:           body.gender           || '',
      bloodGroup:       body.bloodGroup       || '',
      spouseOrGuardian: body.spouseOrGuardian || '',
      aadhaarNumber:    body.aadhaarNumber    || '',
      emergencyContact: body.emergencyContact || '',
      emergencyPhone:   body.emergencyPhone   || '',
      nomineeName:      body.nomineeName      || '',
      nomineeRelation:  body.nomineeRelation  || '',
      uanNumber:        body.uanNumber        || '',
      bankName:         body.bankName         || '',
      accountNumber:    body.accountNumber    || '',
      ifscCode:         body.ifscCode         || '',
      addressLine1:     body.addressLine1     || '',
      addressLine2:     body.addressLine2     || '',
      city:             body.city             || '',
      state:            body.state            || '',
      pincode:          body.pincode          || '',
    };

    if (body.photoUrl) updateData.photoUrl = body.photoUrl;
    if (body.panCard) updateData.panCard = body.panCard;
    if (body.aadhaar) updateData.aadhaar = body.aadhaar;

    const emp = await Employee.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
    if (!emp) return NextResponse.json({ error: 'Employee not found' }, { status: 404 });

    console.log('Employee updated:', emp.empCode);
    return NextResponse.json(emp);
  } catch (err) {
    console.error('PUT /api/admin/employees error:', err);
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

    console.log('Employee deleted:', emp.empCode);
    return NextResponse.json({ message: 'Employee deleted successfully' });
  } catch (err) {
    console.error('DELETE /api/admin/employees error:', err);
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}