import { NextRequest, NextResponse } from 'next/server';
import Mailgun from 'mailgun.js';
import FormData from 'form-data';

export async function POST(request: NextRequest) {
  try {
    const { name, email, subject, message } = await request.json();

    // Initialize Mailgun
    const mailgun = new Mailgun(FormData);
    const mg = mailgun.client({
      username: 'api',
      key: process.env.MAILGUN_API_KEY!,
    });

    // Email content
    const emailData = {
      from: `Aruba Clean Beaches <${process.env.MAILGUN_FROM_EMAIL}>`,
      to: [process.env.MAILGUN_TO_EMAIL!],
      subject: `New Contact Form Submission: ${subject} - ${name}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject/Reason:</strong> ${subject}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
        <hr>
        <p><em>This message was sent from the Aruba Clean Beaches contact form.</em></p>
      `,
    };

    // Send email
    await mg.messages.create(process.env.MAILGUN_DOMAIN!, emailData);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    );
  }
}
