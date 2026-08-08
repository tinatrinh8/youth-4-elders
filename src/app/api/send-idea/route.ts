import { Resend } from 'resend'
import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'

const IDEA_EMAIL = 'youth4elders.uottawa@gmail.com'
const OLIVE = '#6f6509'
const BROWN = '#62202F'
const PINK = '#F8DAD4'

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

export async function POST(request: NextRequest) {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    return NextResponse.json(
      { error: 'Email service is not configured. Add RESEND_API_KEY to your environment.' },
      { status: 503 }
    )
  }

  try {
    const body = await request.json()
    const name = String(body.name ?? '').trim()
    const email = String(body.email ?? '').trim()
    const message = String(body.message ?? '').trim()

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      )
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address' },
        { status: 400 }
      )
    }

    const recipientEmail =
      process.env.IDEA_EMAIL || process.env.JOIN_EMAIL || process.env.CONTACT_EMAIL || IDEA_EMAIL
    const fromEmail =
      process.env.RESEND_FROM_EMAIL || 'Y4E <onboarding@resend.dev>'

    const safeName = escapeHtml(name)
    const safeEmail = escapeHtml(email)
    const safeMessage = escapeHtml(message)

    const resend = new Resend(apiKey)
    const { error } = await resend.emails.send({
      from: fromEmail,
      to: [recipientEmail],
      replyTo: email,
      subject: `Y4E idea from ${name}`,
      html: `
        <div style="margin:0;padding:32px 16px;background:#ffffff;">
          <div style="max-width:560px;margin:0 auto;font-family:Georgia,'Times New Roman',serif;color:${BROWN};">
            <p style="margin:0 0 8px;font-family:Helvetica,Arial,sans-serif;font-size:12px;letter-spacing:0.14em;text-transform:uppercase;color:${OLIVE};">
              Y4E · Ideas Welcome
            </p>
            <h1 style="margin:0 0 20px;font-size:28px;line-height:1.2;color:${BROWN};">
              Hey team — ${safeName} just dropped an idea
            </h1>
            <p style="margin:0 0 18px;font-size:16px;line-height:1.6;">
              It came through the website. Here’s what they wrote:
            </p>
            <div style="margin:0 0 22px;padding:18px 20px;background:${PINK};border-left:4px solid ${OLIVE};border-radius:12px;">
              <p style="margin:0;font-size:16px;line-height:1.7;white-space:pre-wrap;word-break:break-word;">
                ${safeMessage}
              </p>
            </div>
            <p style="margin:0;font-family:Helvetica,Arial,sans-serif;font-size:14px;line-height:1.6;color:${OLIVE};">
              Hit reply to talk with ${safeName} at ${safeEmail}.
            </p>
          </div>
        </div>
      `,
    })

    if (error) {
      console.error('Resend error:', error)
      return NextResponse.json(
        { error: 'Failed to send email' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { success: true, message: 'Idea submitted successfully!' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error sending email:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
