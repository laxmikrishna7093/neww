import { connectDB } from '@/lib/mongodb';
import Admin from '@/models/Admin';
import { NextResponse } from 'next/server';

export async function GET() {
  await connectDB();

  // Check if admin already exists
  const existing = await Admin.findOne({ username: 'admin' });
  if (existing) {
    return NextResponse.json({ message: 'Admin already exists!' });
  }

  // Create admin with plain password
  await Admin.create({ username: 'admin', password: 'admin123' });
  return NextResponse.json({ message: 'Admin created! Username: admin | Password: admin123' });
}