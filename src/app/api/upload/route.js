import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export const runtime = 'nodejs';

export async function POST(req) {
  try {
    console.log('📤 Upload API called');

    const formData = await req.formData();
    const file = formData.get('file');
    const type = formData.get('type') || 'misc';

    console.log('File:', file?.name, 'Type:', type);

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File too large. Max 5MB allowed.' },
        { status: 400 }
      );
    }

    const bytes  = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create upload directory
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', type);
    await mkdir(uploadDir, { recursive: true });

    // Create unique filename
    const timestamp = Date.now();
    const safeName  = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
    const filename  = `${timestamp}-${safeName}`;
    const filepath  = path.join(uploadDir, filename);

    // Save file
    await writeFile(filepath, buffer);

    const publicPath = `/uploads/${type}/${filename}`;
    console.log('✅ File saved:', publicPath);

    return NextResponse.json({
      success: true,
      path: publicPath,
      filename: filename,
    });

  } catch (error) {
    console.error('❌ Upload error:', error.message);
    return NextResponse.json(
      { error: error.message || 'Upload failed' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ message: 'Upload API is working ✅' });
}