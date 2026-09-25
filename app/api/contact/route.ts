import { NextRequest, NextResponse } from 'next/server';

// Contact form endpoint (logs submissions, ready for email service integration)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, company, phone, subject, message } = body;

    // Validation
    if (!name || !email || !company || !phone || !subject || !message) {
      return NextResponse.json(
        { error: 'Semua field harus diisi' },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Email tidak valid' },
        { status: 400 }
      );
    }

    // Log the contact message (in production, send actual email)
    console.log('Contact Form Submission:', {
      name,
      email,
      company,
      phone,
      subject,
      message,
      timestamp: new Date().toISOString(),
    });

    // In production, you would integrate with:
    // - Nodemailer (for self-hosted email)
    // - SendGrid, Mailgun, or AWS SES (for managed email services)
    // - Or store in database and set up email notification workflow

    // For now, just log and return success
    return NextResponse.json(
      { success: true, message: 'Pesan berhasil dikirim' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Contact API Error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat memproses pesan' },
      { status: 500 }
    );
  }
}
