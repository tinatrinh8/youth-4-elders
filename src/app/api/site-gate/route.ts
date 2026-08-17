import { NextRequest, NextResponse } from 'next/server'
import {
  SITE_GATE_COOKIE,
  isSiteGateEnabled,
  siteGateToken,
  tokensMatch,
} from '@/lib/siteGate'

export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  const password = process.env.SITE_PASSWORD?.trim()
  if (!isSiteGateEnabled() || !password) {
    return NextResponse.json({ error: 'Preview lock is off.' }, { status: 400 })
  }

  let given = ''
  try {
    const body = await request.json()
    given = String(body.password ?? '')
  } catch {
    return NextResponse.json({ error: 'Please enter the password.' }, { status: 400 })
  }

  const expected = await siteGateToken(password)
  const received = await siteGateToken(given)
  if (!tokensMatch(expected, received)) {
    return NextResponse.json({ error: 'That’s not the right password.' }, { status: 401 })
  }

  const response = NextResponse.json({ ok: true })
  response.cookies.set(SITE_GATE_COOKIE, expected, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 14,
    secure: process.env.NODE_ENV === 'production',
  })
  return response
}
