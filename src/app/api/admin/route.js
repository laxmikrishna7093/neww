import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

async function getContactModel() {
  const mongoose = (await import('mongoose')).default;
  const URI = process.env.MONGODB_URI;
  if (!URI) throw new Error('MONGODB_URI not set');
  if (mongoose.connection.readyState !== 1) {
    await mongoose.connect(URI);
  }
  if (mongoose.models.Contact) return mongoose.models.Contact;
  const schema = new mongoose.Schema({
    name:        String,
    email:       String,
    phone:       String,
    jobType:     String,
    experience:  String,
    location:    String,
    message:     String,
    resumeName:  String,
    status:      { type: String, default: 'new' },
    submittedAt: { type: Date, default: Date.now },
  }, { timestamps: true });
  return mongoose.model('Contact', schema);
}

export async function GET() {
  try {
    const Contact  = await getContactModel();
    const contacts = await Contact.find().sort({ createdAt: -1 });
    console.log('✅ Contacts fetched:', contacts.length);
    return NextResponse.json(contacts);
  } catch (err) {
    console.error('❌ GET contacts error:', err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    const Contact       = await getContactModel();
    const { _id, status } = await req.json();
    const contact = await Contact.findByIdAndUpdate(
      _id, { status }, { new: true }
    );
    return NextResponse.json(contact);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const Contact  = await getContactModel();
    const { _id }  = await req.json();
    await Contact.findByIdAndDelete(_id);
    return NextResponse.json({ message: 'Deleted' });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}