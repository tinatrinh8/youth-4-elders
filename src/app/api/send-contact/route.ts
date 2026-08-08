import { Resend } from 'resend'
import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'

const CONTACT_EMAIL = 'youth4elders.uottawa@gmail.com'
const OLIVE = '#6f6509'
const BROWN = '#62202F'
const CREAM = '#FBF7E8'
const PINK = '#F8DAD4'

const SERVICE_LABELS: Record<string, string> = {
  volunteer: 'Volunteering',
  partnership: 'Partnership',
  events: 'Events & programs',
  membership: 'Membership',
  donations: 'Donations & support',
  media: 'Media & press',
  collaboration: 'Collaboration & projects',
  general: 'General inquiry',
  other: 'Other',
}

function isValidEmail(value: string) {
  const email = value.trim()
  if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) return false
  if (email.includes('..')) return false
  const [local, domain] = email.split('@')
  if (!local || !domain) return false
  if (local.startsWith('.') || local.endsWith('.')) return false
  if (domain.startsWith('-') || domain.endsWith('-') || domain.startsWith('.') || domain.endsWith('.')) return false
  return true
}

function isValidPhone(value: string) {
  return /^\d+$/.test(value.trim())
}

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
    const firstName = String(body.firstName ?? '').trim()
    const lastName = String(body.lastName ?? '').trim()
    const company = String(body.company ?? '').trim()
    const email = String(body.email ?? '').trim()
    const phone = String(body.phone ?? '').trim()
    const service = String(body.service ?? '').trim()
    const message = String(body.projectDescription ?? body.message ?? '').trim()

    if (!firstName || !lastName || !email || !message) {
      return NextResponse.json(
        { error: 'Please fill in your name, email, and message.' },
        { status: 400 }
      )
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address' },
        { status: 400 }
      )
    }

    if (phone && !isValidPhone(phone)) {
      return NextResponse.json(
        { error: 'Please enter a valid phone number' },
        { status: 400 }
      )
    }

    const recipientEmail =
      process.env.CONTACT_EMAIL || process.env.JOIN_EMAIL || process.env.IDEA_EMAIL || CONTACT_EMAIL
    const fromEmail =
      process.env.RESEND_FROM_EMAIL || 'Y4E <onboarding@resend.dev>'

    const fullName = `${firstName} ${lastName}`.trim()
    const safeName = escapeHtml(fullName)
    const safeCompany = escapeHtml(company)
    const safeEmail = escapeHtml(email)
    const safePhone = escapeHtml(phone)
    const safeMessage = escapeHtml(message)
    const serviceLabel = SERVICE_LABELS[service] || ''

    const detailRow = (label: string, value: string) =>
      value
        ? `
          <tr>
            <td style="padding:10px 0;width:140px;vertical-align:top;font-family:Helvetica,Arial,sans-serif;font-size:12px;letter-spacing:0.08em;text-transform:uppercase;color:${OLIVE};">
              ${escapeHtml(label)}
            </td>
            <td style="padding:10px 0;font-family:Georgia,'Times New Roman',serif;font-size:16px;color:${BROWN};">
              ${escapeHtml(value)}
            </td>
          </tr>`
        : ''

    const fromLine = company ? `${fullName} · ${company}` : fullName
    const subject = company
      ? `Y4E inquiry — ${company} (${fullName})`
      : `Y4E inquiry — ${fullName}`

    const resend = new Resend(apiKey)
    const { error } = await resend.emails.send({
      from: fromEmail,
      to: [recipientEmail],
      replyTo: email,
      subject,
      html: `
        <div style="margin:0;padding:28px 16px;background:#ffffff;">
          <div style="max-width:600px;margin:0 auto;border:1px solid ${BROWN};overflow:hidden;">
            <div style="background:${BROWN};padding:28px 32px;">
              <p style="margin:0 0 8px;font-family:Helvetica,Arial,sans-serif;font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:${PINK};">
                Youth 4 Elders · Inquiry
              </p>
              <h1 style="margin:0;font-family:Georgia,'Times New Roman',serif;font-size:26px;font-weight:400;line-height:1.3;color:${CREAM};">
                New message from ${safeName}
              </h1>
              ${
                company
                  ? `<p style="margin:10px 0 0;font-family:Helvetica,Arial,sans-serif;font-size:14px;color:${PINK};">${safeCompany}</p>`
                  : ''
              }
            </div>
            <div style="padding:28px 32px 8px;background:#ffffff;">
              <p style="margin:0 0 20px;font-family:Georgia,'Times New Roman',serif;font-size:15px;line-height:1.6;color:${BROWN};">
                This came through the website contact form. Please review and reply promptly — this may be a partner, sponsor, or community inquiry.
              </p>
              <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse;border-top:1px solid ${PINK};border-bottom:1px solid ${PINK};margin:0 0 24px;">
                ${detailRow('From', fromLine)}
                ${detailRow('Email', email)}
                ${detailRow('Phone', phone)}
                ${detailRow('Regarding', serviceLabel)}
              </table>
              <p style="margin:0 0 10px;font-family:Helvetica,Arial,sans-serif;font-size:12px;letter-spacing:0.08em;text-transform:uppercase;color:${OLIVE};">
                Message
              </p>
              <p style="margin:0 0 24px;font-family:Georgia,'Times New Roman',serif;font-size:16px;line-height:1.7;color:${BROWN};white-space:pre-wrap;word-break:break-word;">
                ${safeMessage}
              </p>
            </div>
            <div style="padding:0 32px 28px;background:#ffffff;">
              <p style="margin:0;padding:14px 16px;background:${CREAM};font-family:Helvetica,Arial,sans-serif;font-size:13px;line-height:1.6;color:${BROWN};">
                Reply to this email to reach <strong>${safeName}</strong>${company ? ` at ${safeCompany}` : ''} (${safeEmail}).
              </p>
            </div>
          </div>
        </div>
      `,
    })

    if (error) {
      console.error('Resend contact error:', error)
      return NextResponse.json(
        { error: 'Failed to send email' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { success: true, message: 'Message sent successfully!' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error sending contact email:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
