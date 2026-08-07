import { Resend } from 'resend'
import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'

const JOIN_EMAIL = 'youth4elders.uottawa@gmail.com'
const MAX_RESUME_BYTES = 8 * 1024 * 1024 // 8 MB
const ALLOWED_RESUME_TYPES = new Set([
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
])
const ALLOWED_RESUME_EXTS = ['.pdf', '.doc', '.docx']

/** Site palette (from globals.css) — inlined for email clients */
const COLORS = {
  brownDark: '#62202F',
  cream: '#FBF7E8',
  olive: '#6f6509',
  oliveLight: '#bbb47b',
  pinkMedium: '#F5D0C6',
} as const

/** Two fonts only: Georgia (titles) + Helvetica/Arial stack (body, closest to Kollektif) */
const FONT_DISPLAY = "Georgia, 'Times New Roman', serif"
const FONT_BODY = "Helvetica, 'Helvetica Neue', Arial, sans-serif"

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

/** Question on top, answer underneath — both flush left */
function fieldBlock(question: string, value: string) {
  const display = value.trim() ? escapeHtml(value.trim()) : '—'
  return `
    <div style="margin: 0 0 18px; padding: 0 0 18px; border-bottom: 1px solid ${COLORS.pinkMedium}; text-align: left;">
      <p style="margin: 0 0 8px; padding: 0; text-align: left; font-family: ${FONT_BODY}; font-size: 11px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: ${COLORS.olive};">
        ${escapeHtml(question)}
      </p>
      <p style="margin: 0; padding: 0; text-align: left; font-family: ${FONT_BODY}; font-size: 15px; line-height: 1.65; color: ${COLORS.brownDark}; white-space: pre-wrap; word-break: break-word;">
        ${display}
      </p>
    </div>
  `
}

function hasAllowedResumeExtension(filename: string) {
  const lower = filename.toLowerCase()
  return ALLOWED_RESUME_EXTS.some(ext => lower.endsWith(ext))
}

export async function POST(request: NextRequest) {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    return NextResponse.json(
      { error: 'Email service is not configured. Add RESEND_API_KEY to your environment.' },
      { status: 503 }
    )
  }

  const resend = new Resend(apiKey)

  try {
    const form = await request.formData()

    const name = String(form.get('name') ?? '').trim()
    const email = String(form.get('email') ?? '').trim()
    const schoolStatus = String(form.get('schoolStatus') ?? '').trim()
    const schoolName = String(form.get('schoolName') ?? '').trim()
    const program = String(form.get('program') ?? '').trim()
    const year = String(form.get('year') ?? '').trim()
    const schoolSituation = String(form.get('schoolSituation') ?? '').trim()
    const schoolSituationOther = String(form.get('schoolSituationOther') ?? '').trim()
    const whyJoin = String(form.get('whyJoin') ?? '').trim()
    const howHeard = String(form.get('howHeard') ?? '').trim()
    const experience = String(form.get('experience') ?? '').trim()
    const linkedinUrl = String(form.get('linkedinUrl') ?? '').trim()
    const experienceOutline = String(form.get('experienceOutline') ?? '') === 'true'
    const experienceResume = String(form.get('experienceResume') ?? '') === 'true'
    const resume = form.get('resume')

    if (!name || !email || !whyJoin) {
      return NextResponse.json(
        { error: 'Name, email, and reason for joining are required.' },
        { status: 400 }
      )
    }

    if (schoolStatus !== 'in-school' && schoolStatus !== 'not-in-school') {
      return NextResponse.json(
        { error: 'Please tell us if you are currently in school.' },
        { status: 400 }
      )
    }

    if (schoolStatus === 'in-school' && !schoolName) {
      return NextResponse.json(
        { error: 'Please enter your university or college.' },
        { status: 400 }
      )
    }

    if (schoolStatus === 'not-in-school') {
      if (!schoolSituation) {
        return NextResponse.json(
          { error: 'Please select what best describes you.' },
          { status: 400 }
        )
      }
      if (schoolSituation === 'Other' && !schoolSituationOther) {
        return NextResponse.json(
          { error: 'Please tell us a bit more about your situation.' },
          { status: 400 }
        )
      }
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 })
    }

    if (!experienceOutline && !experienceResume) {
      return NextResponse.json(
        { error: 'Please outline experience or upload a resume.' },
        { status: 400 }
      )
    }

    if (experienceOutline && !experience) {
      return NextResponse.json(
        { error: 'Please outline your relevant experience.' },
        { status: 400 }
      )
    }

    let attachment:
      | {
          filename: string
          content: Buffer
          contentType?: string
        }
      | undefined

    if (experienceResume) {
      if (!(resume instanceof File) || resume.size === 0) {
        return NextResponse.json({ error: 'Please upload a resume file.' }, { status: 400 })
      }

      if (resume.size > MAX_RESUME_BYTES) {
        return NextResponse.json(
          { error: 'Resume must be 8 MB or smaller.' },
          { status: 400 }
        )
      }

      const typeOk =
        ALLOWED_RESUME_TYPES.has(resume.type) || hasAllowedResumeExtension(resume.name)
      if (!typeOk) {
        return NextResponse.json(
          { error: 'Resume must be a PDF or DOC/DOCX file.' },
          { status: 400 }
        )
      }

      const bytes = Buffer.from(await resume.arrayBuffer())
      attachment = {
        filename: resume.name || 'resume.pdf',
        content: bytes,
        contentType: resume.type || undefined,
      }
    }

    const recipientEmail =
      process.env.JOIN_EMAIL || process.env.CONTACT_EMAIL || JOIN_EMAIL
    const fromEmail =
      process.env.RESEND_FROM_EMAIL || 'Youth 4 Elders <onboarding@resend.dev>'

    const schoolStatusLabel =
      schoolStatus === 'in-school'
        ? "Yes, I'm in school"
        : schoolStatus === 'not-in-school'
          ? "No, I'm not currently in school"
          : '—'

    const schoolSituationDisplay =
      schoolSituation === 'Other'
        ? schoolSituationOther || 'Other'
        : schoolSituation

    const experienceMethod = experienceResume
      ? 'Uploaded resume'
      : experienceOutline
        ? 'Written outline'
        : '—'

    const experienceDetail = experienceResume
      ? attachment
        ? `Resume uploaded: ${attachment.filename}`
        : 'Resume uploaded'
      : experience

    const submittedAt = new Date().toLocaleString('en-CA', {
      timeZone: 'America/Toronto',
      dateStyle: 'full',
      timeStyle: 'short',
    })

    const { error } = await resend.emails.send({
      from: fromEmail,
      to: [recipientEmail],
      replyTo: email,
      subject: `General Member Application - ${name}`,
      attachments: attachment ? [attachment] : undefined,
      html: `
        <div style="margin: 0; padding: 28px 16px; background: #ffffff;">
          <div style="font-family: ${FONT_BODY}; max-width: 600px; margin: 0 auto; background: ${COLORS.cream}; border: 2px solid ${COLORS.brownDark}; border-radius: 16px; overflow: hidden; text-align: left;">
            <div style="background: ${COLORS.brownDark}; color: ${COLORS.cream}; padding: 28px 28px 24px; text-align: left;">
              <p style="margin: 0 0 10px; font-family: ${FONT_BODY}; font-size: 11px; letter-spacing: 0.18em; text-transform: uppercase; color: ${COLORS.oliveLight}; text-align: left;">
                Youth 4 Elders
              </p>
              <h1 style="margin: 0; font-family: ${FONT_DISPLAY}; font-size: 28px; font-weight: 400; line-height: 1.25; color: ${COLORS.cream}; text-align: left;">
                New General Member Application
              </h1>
            </div>

            <div style="padding: 24px 28px 8px; background: ${COLORS.cream}; text-align: left;">
              <p style="margin: 0 0 22px; padding: 0; font-family: ${FONT_BODY}; font-size: 13px; color: ${COLORS.olive}; text-align: left;">
                Submitted ${escapeHtml(submittedAt)}
                ${attachment ? ` · File attached: <strong style="color: ${COLORS.brownDark};">${escapeHtml(attachment.filename)}</strong>` : ''}
              </p>

              ${fieldBlock("What's your full name?", name)}
              ${fieldBlock("What's your email address?", email)}
              ${fieldBlock('Are you currently in school?', schoolStatusLabel)}
              ${
                schoolStatus === 'in-school'
                  ? `${fieldBlock('What university or college are you attending?', schoolName)}${fieldBlock("What's your program or field of study?", program)}${fieldBlock('What year are you in?', year)}`
                  : fieldBlock('What best describes you?', schoolSituationDisplay)
              }
              ${fieldBlock('How did you hear about us?', howHeard)}
              ${fieldBlock('Why do you want to join Youth 4 Elders?', whyJoin)}
              ${fieldBlock('How did they share experience?', experienceMethod)}
              ${
                experienceResume || experience
                  ? fieldBlock(
                      experienceResume ? 'Resume / experience' : 'Outline your relevant experience',
                      experienceDetail
                    )
                  : ''
              }
              ${fieldBlock('LinkedIn profile (optional)', linkedinUrl)}
            </div>

            <div style="padding: 8px 28px 28px; background: ${COLORS.cream}; text-align: left;">
              <div style="padding: 14px 16px; background: ${COLORS.pinkMedium}; border-radius: 10px; text-align: left;">
                <p style="margin: 0; padding: 0; font-family: ${FONT_BODY}; font-size: 13px; line-height: 1.5; color: ${COLORS.brownDark}; text-align: left;">
                  Reply to this email to respond to <strong>${escapeHtml(name)}</strong>.
                </p>
              </div>
            </div>
          </div>
        </div>
      `,
      text: [
        'New General Member Application',
        '',
        `Submitted: ${submittedAt}`,
        '',
        `What's your full name?`,
        name,
        '',
        `What's your email address?`,
        email,
        '',
        `Are you currently in school?`,
        schoolStatusLabel,
        '',
        schoolStatus === 'in-school'
          ? `What university or college are you attending?\n${schoolName || '—'}\n\nWhat's your program or field of study?\n${program || '—'}\n\nWhat year are you in?\n${year || '—'}`
          : `What best describes you?\n${schoolSituationDisplay || '—'}`,
        '',
        `How did you hear about us?`,
        howHeard || '—',
        '',
        `Why do you want to join Youth 4 Elders?`,
        whyJoin,
        '',
        `How did they share experience?`,
        experienceMethod,
        '',
        experienceResume || experience
          ? `${experienceResume ? 'Resume / experience' : 'Outline your relevant experience'}\n${experienceDetail || '—'}\n`
          : '',
        `LinkedIn profile (optional)`,
        linkedinUrl || '—',
      ]
        .filter(Boolean)
        .join('\n'),
    })

    if (error) {
      console.error('Resend join-us error:', error)
      return NextResponse.json({ error: 'Failed to send application email.' }, { status: 500 })
    }

    return NextResponse.json(
      { success: true, message: 'Application submitted successfully.' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error submitting join-us form:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
