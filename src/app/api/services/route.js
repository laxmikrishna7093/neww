// src/app/api/admin/services/route.js
import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Service from '@/models/Service';

export const runtime = 'nodejs';

// GET — fetch all services
export async function GET() {
  try {
    await connectDB();
    const services = await Service.find({}).sort({ createdAt: 1 }).lean();
    return NextResponse.json(services);
  } catch (err) {
    console.error('❌ GET services error:', err.message);
    return NextResponse.json(
      { error: 'Failed to fetch services' },
      { status: 500 }
    );
  }
}

// POST — create new service
export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();

    if (!body.title || !body.tag) {
      return NextResponse.json(
        { error: 'Title and Tag are required' },
        { status: 400 }
      );
    }

    const service = await Service.create({
      title:       body.title,
      tagline:     body.tagline     || '',
      tag:         body.tag,
      accent:      body.accent      || '#1B4332',
      accentLight: body.accentLight || '#6EE7B7',
      photo:       body.photo       || '',
      stat:        body.stat        || '',
      statLabel:   body.statLabel   || '',
      desc:        body.desc        || '',
      features:    body.features    || [],
    });

    console.log('✅ Service created:', service.title, service._id);
    return NextResponse.json({ success: true, service });
  } catch (err) {
    console.error('❌ POST service error:', err.message);
    return NextResponse.json(
      { error: 'Failed to create service' },
      { status: 500 }
    );
  }
}

// PUT — update existing service
export async function PUT(request) {
  try {
    await connectDB();
    const body    = await request.json();
    const { _id, ...updateData } = body;

    if (!_id) {
      return NextResponse.json(
        { error: 'Missing _id' },
        { status: 400 }
      );
    }

    const updated = await Service.findByIdAndUpdate(
      _id,
      {
        title:       updateData.title,
        tagline:     updateData.tagline,
        tag:         updateData.tag,
        accent:      updateData.accent,
        accentLight: updateData.accentLight,
        photo:       updateData.photo,
        stat:        updateData.stat,
        statLabel:   updateData.statLabel,
        desc:        updateData.desc,
        features:    updateData.features,
      },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return NextResponse.json(
        { error: 'Service not found' },
        { status: 404 }
      );
    }

    console.log('✅ Service updated:', updated.title);
    return NextResponse.json({ success: true, service: updated });
  } catch (err) {
    console.error('❌ PUT service error:', err.message);
    return NextResponse.json(
      { error: 'Failed to update service' },
      { status: 500 }
    );
  }
}

// DELETE — remove a service
export async function DELETE(request) {
  try {
    await connectDB();
    const body  = await request.json();
    const { _id } = body;

    if (!_id) {
      return NextResponse.json(
        { error: 'Missing _id' },
        { status: 400 }
      );
    }

    const deleted = await Service.findByIdAndDelete(_id);

    if (!deleted) {
      return NextResponse.json(
        { error: 'Service not found' },
        { status: 404 }
      );
    }

    console.log('✅ Service deleted:', deleted.title, _id);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('❌ DELETE service error:', err.message);
    return NextResponse.json(
      { error: 'Failed to delete service' },
      { status: 500 }
    );
  }
}