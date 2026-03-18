// src/app/api/admin/contacts/route.js
import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Contact from '@/models/Contact';

export const runtime = 'nodejs';

// GET — fetch all contacts sorted newest first
export async function GET() {
  try {
    await connectDB();
    const contacts = await Contact.find({}).sort({ createdAt: -1 }).lean();
    return NextResponse.json(contacts);
  } catch (err) {
    console.error('❌ GET contacts error:', err.message);
    return NextResponse.json(
      { error: 'Failed to fetch contacts' },
      { status: 500 }
    );
  }
}

// PUT — update contact status
export async function PUT(request) {
  try {
    await connectDB();
    const body = await request.json();
    const { _id, status } = body;

    if (!_id || !status) {
      return NextResponse.json(
        { error: 'Missing _id or status' },
        { status: 400 }
      );
    }

    const updated = await Contact.findByIdAndUpdate(
      _id,
      { status },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json(
        { error: 'Contact not found' },
        { status: 404 }
      );
    }

    console.log('✅ Contact status updated:', _id, '→', status);
    return NextResponse.json({ success: true, contact: updated });
  } catch (err) {
    console.error('❌ PUT contact error:', err.message);
    return NextResponse.json(
      { error: 'Failed to update contact' },
      { status: 500 }
    );
  }
}

// DELETE — remove a contact
export async function DELETE(request) {
  try {
    await connectDB();
    const body = await request.json();
    const { _id } = body;

    if (!_id) {
      return NextResponse.json(
        { error: 'Missing _id' },
        { status: 400 }
      );
    }

    const deleted = await Contact.findByIdAndDelete(_id);

    if (!deleted) {
      return NextResponse.json(
        { error: 'Contact not found' },
        { status: 404 }
      );
    }

    console.log('✅ Contact deleted:', _id);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('❌ DELETE contact error:', err.message);
    return NextResponse.json(
      { error: 'Failed to delete contact' },
      { status: 500 }
    );
  }
}