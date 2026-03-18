// src/app/api/contact/route.js
import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Contact from '@/models/Contact';

export const runtime = 'nodejs';

export async function POST(request) {
  try {
    console.log('📩 Contact form submitted!');

    const formData = await request.formData();

    const name       = formData.get('name')       || '';
    const email      = formData.get('email')      || '';
    const phone      = formData.get('phone')      || '';
    const jobType    = formData.get('jobType')     || '';
    const experience = formData.get('experience')  || '';
    const location   = formData.get('location')    || '';
    const message    = formData.get('message')     || '';
    const resumeFile = formData.get('resume');

    console.log('📋 Data:', { name, email, phone, jobType, location });

    if (!name || !email || !phone || !jobType || !location) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields.' },
        { status: 400 }
      );
    }

    // ── Save to MongoDB ──────────────────────────────────
    try {
      await connectDB();

      const saved = await Contact.create({
        name,
        email,
        phone,
        jobType,
        experience,
        location,
        message,
        resumeName: resumeFile?.name || '',
        status:     'new',
      });

      console.log('✅ Saved to MongoDB! ID:', saved._id);
    } catch (dbErr) {
      console.error('❌ MongoDB Error:', dbErr.message);
      // Don't return error — still try to send email
    }

    // ── Send Email ───────────────────────────────────────
    try {
      if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
        const nodemailer = (await import('nodemailer')).default;

        const transporter = nodemailer.createTransport({
          host: 'smtp.gmail.com',
          port: 587,
          secure: false,
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
          },
        });

        const attachments = [];
        if (resumeFile && resumeFile.size > 0) {
          const buffer = Buffer.from(await resumeFile.arrayBuffer());
          attachments.push({ filename: resumeFile.name, content: buffer });
        }

        const now = new Date().toLocaleString('en-IN', {
          timeZone: 'Asia/Kolkata',
          day: 'numeric', month: 'short', year: 'numeric',
          hour: '2-digit', minute: '2-digit',
        });

        // Admin email
        await transporter.sendMail({
          from:    `"Nachi Consultation" <${process.env.EMAIL_USER}>`,
          to:      process.env.ADMIN_EMAIL || process.env.EMAIL_USER,
          replyTo: email,
          subject: `New Job Application — ${jobType} from ${name}`,
          html: `
            <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
              <div style="background:#12312C;padding:24px 32px">
                <h2 style="color:#FF9700;margin:0">New Job Application</h2>
                <p style="color:rgba(255,255,255,0.5);margin:6px 0 0;font-size:12px">
                  Received: ${now}
                </p>
              </div>
              <div style="padding:28px 32px;background:#fff;border-left:4px solid #FF9700">
                <table style="width:100%;border-collapse:collapse;font-size:14px">
                  <tr style="border-bottom:1px solid #eee">
                    <td style="padding:10px 0;color:#888;width:140px">Full Name</td>
                    <td style="font-weight:600;color:#31383E">${name}</td>
                  </tr>
                  <tr style="border-bottom:1px solid #eee">
                    <td style="padding:10px 0;color:#888">Phone</td>
                    <td style="font-weight:600;color:#31383E">${phone}</td>
                  </tr>
                  <tr style="border-bottom:1px solid #eee">
                    <td style="padding:10px 0;color:#888">Email</td>
                    <td style="color:#31383E">${email}</td>
                  </tr>
                  <tr style="border-bottom:1px solid #eee">
                    <td style="padding:10px 0;color:#888">Job Type</td>
                    <td style="color:#FF9700;font-weight:700">${jobType}</td>
                  </tr>
                  <tr style="border-bottom:1px solid #eee">
                    <td style="padding:10px 0;color:#888">Experience</td>
                    <td style="color:#31383E">${experience || 'Not specified'}</td>
                  </tr>
                  <tr style="border-bottom:1px solid #eee">
                    <td style="padding:10px 0;color:#888">Location</td>
                    <td style="color:#31383E">${location}</td>
                  </tr>
                  ${message ? `
                  <tr>
                    <td style="padding:10px 0;color:#888;vertical-align:top">Message</td>
                    <td style="color:#31383E;line-height:1.6">${message}</td>
                  </tr>` : ''}
                </table>
              </div>
              ${resumeFile?.name ? `
              <div style="padding:12px 32px;background:#f0fdf4;border-left:4px solid #10b981">
                <p style="margin:0;font-size:13px;color:#16a34a;font-weight:600">
                  📎 Resume attached: ${resumeFile.name}
                </p>
              </div>` : ''}
            </div>
          `,
          attachments,
        });

        // Confirmation to applicant
        await transporter.sendMail({
          from:    `"Nachi Consultation" <${process.env.EMAIL_USER}>`,
          to:      email,
          subject: `Application Received — ${jobType}`,
          html: `
            <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
              <div style="background:#12312C;padding:24px 32px">
                <h2 style="color:#FF9700;margin:0">Application Received ✅</h2>
              </div>
              <div style="padding:28px 32px;background:#fff">
                <p style="color:#31383E;font-size:15px">Hi <strong>${name}</strong>,</p>
                <p style="color:#555;line-height:1.75;font-size:14px">
                  Thank you for applying for <strong>${jobType}</strong>.
                  Our team will contact you at <strong>${phone}</strong> within 24–48 hours.
                </p>
              </div>
            </div>
          `,
        });

        console.log('✅ Emails sent!');
      }
    } catch (emailErr) {
      console.error('❌ Email error:', emailErr.message);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('❌ MAIN ERROR:', error.message);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ message: 'Contact API working ✅' });
}