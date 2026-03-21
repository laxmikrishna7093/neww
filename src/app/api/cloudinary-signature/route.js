// src/app/api/cloudinary-signature/route.js
import { NextResponse } from 'next/server'
import { v2 as cloudinary } from 'cloudinary'
import { cookies } from 'next/headers'
import { verifyToken } from '@/lib/auth'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function POST(req) {
  try {
    // Auth check — same as your employees route
    const cookieStore = await cookies()
    const token = cookieStore.get('admin_token')?.value
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const decoded = verifyToken(token)
    if (!decoded) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { folder, public_id } = await req.json()

    const timestamp = Math.round(Date.now() / 1000)

    const paramsToSign = { timestamp, folder: folder || 'employees' }
    if (public_id) paramsToSign.public_id = public_id

    const signature = cloudinary.utils.api_sign_request(
      paramsToSign,
      process.env.CLOUDINARY_API_SECRET
    )

    return NextResponse.json({
      signature,
      timestamp,
      api_key:    process.env.CLOUDINARY_API_KEY,
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      folder:     paramsToSign.folder,
      public_id:  paramsToSign.public_id,
    })
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}