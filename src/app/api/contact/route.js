import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request) {
  try {
    const formData = await request.formData();

    const name       = formData.get('name')       || '';
    const email      = formData.get('email')      || '';
    const phone      = formData.get('phone')      || '';
    const jobType    = formData.get('jobType')    || '';
    const experience = formData.get('experience') || '';
    const location   = formData.get('location')   || '';
    const message    = formData.get('message')    || '';
    const resumeFile = formData.get('resume');

    if (!name || !email || !phone || !jobType || !location) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields.' },
        { status: 400 }
      );
    }

    const attachments = [];
    if (resumeFile && resumeFile.size > 0) {
      const buffer = Buffer.from(await resumeFile.arrayBuffer());
      attachments.push({ filename: resumeFile.name, content: buffer });
    }

    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.verify();

    // Email to admin
    await transporter.sendMail({
      from: `"Nachi Consultation" <${process.env.EMAIL_USER}>`,
      to: process.env.ADMIN_EMAIL,
      replyTo: email,
      subject: `New Job Application — ${jobType} from ${name}`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
          <div style="background:#12312C;padding:24px 32px">
            <h2 style="color:#FF9700;margin:0;font-size:22px">New Job Application</h2>
            <p style="color:rgba(255,255,255,0.6);margin:4px 0 0;font-size:13px">Nachi Consultation — Recruitment Portal</p>
          </div>
          <div style="padding:28px 32px;background:#fff;border-left:4px solid #FF9700">
            <table style="width:100%;border-collapse:collapse;font-size:14px">
              <tr style="border-bottom:1px solid #eee">
                <td style="padding:10px 0;color:#888;width:140px">Full Name</td>
                <td style="padding:10px 0;color:#31383E;font-weight:600">${name}</td>
              </tr>
              <tr style="border-bottom:1px solid #eee">
                <td style="padding:10px 0;color:#888">Phone</td>
                <td style="padding:10px 0;color:#31383E;font-weight:600">${phone}</td>
              </tr>
              <tr style="border-bottom:1px solid #eee">
                <td style="padding:10px 0;color:#888">Email</td>
                <td style="padding:10px 0;color:#31383E;font-weight:600">${email}</td>
              </tr>
              <tr style="border-bottom:1px solid #eee">
                <td style="padding:10px 0;color:#888">Job Type</td>
                <td style="padding:10px 0;color:#FF9700;font-weight:700">${jobType}</td>
              </tr>
              <tr style="border-bottom:1px solid #eee">
                <td style="padding:10px 0;color:#888">Experience</td>
                <td style="padding:10px 0;color:#31383E">${experience || 'Not specified'}</td>
              </tr>
              <tr style="border-bottom:1px solid #eee">
                <td style="padding:10px 0;color:#888">Preferred Location</td>
                <td style="padding:10px 0;color:#31383E">${location}</td>
              </tr>
              ${message ? `
              <tr>
                <td style="padding:10px 0;color:#888;vertical-align:top">Message</td>
                <td style="padding:10px 0;color:#31383E;line-height:1.6">${message}</td>
              </tr>` : ''}
            </table>
          </div>
          ${resumeFile && resumeFile.size > 0 ? `
          <div style="padding:14px 32px;background:#FEFFF1;border-left:4px solid #00685F">
            <p style="margin:0;font-size:13px;color:#00685F;font-weight:600">📎 Resume attached: ${resumeFile.name}</p>
          </div>` : ''}
          <div style="padding:16px 32px;background:#f5f5f5;font-size:12px;color:#aaa;text-align:center">
            Nachi Consultation · 34/145, 1st Line Saradha Colony, Guntur – 522002
          </div>
        </div>
      `,
      attachments,
    });

    // Auto-reply to applicant
    await transporter.sendMail({
      from: `"Nachi Consultation" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `We received your application — ${jobType}`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
          <div style="background:#12312C;padding:24px 32px">
            <h2 style="color:#FF9700;margin:0;font-size:22px">Application Received ✅</h2>
          </div>
          <div style="padding:28px 32px;background:#fff">
            <p style="color:#31383E;font-size:15px">Hi <strong>${name}</strong>,</p>
            <p style="color:#555;line-height:1.75;font-size:14px">
              Thank you for applying for <strong>${jobType}</strong> at Nachi Consultation.
              Our recruitment team has received your application and will get back to you
              at <strong>${phone}</strong> within <strong>24–48 hours</strong>.
            </p>
            <p style="color:#555;line-height:1.75;font-size:14px">
              In the meantime, feel free to reach us on WhatsApp:<br/>
              <a href="https://wa.me/916305650469" style="color:#25D366;font-weight:600">+91 63056 50469</a>
            </p>
          </div>
          <div style="padding:16px 32px;background:#f5f5f5;font-size:12px;color:#aaa;text-align:center">
            Nachi Consultation · Guntur, Andhra Pradesh · nagalakshmiakurathi.ak@gmail.com
          </div>
        </div>
      `,
    });

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Contact route error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Server error. Please try again.' },
      { status: 500 }
    );
  }
}