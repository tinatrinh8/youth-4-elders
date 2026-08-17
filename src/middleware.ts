import { NextRequest, NextResponse } from 'next/server'
import {
  SITE_GATE_COOKIE,
  SITE_GATE_PATH,
  isSiteGateEnabled,
  siteGateToken,
  tokensMatch,
} from '@/lib/siteGate'

function withLockHeader(request: NextRequest) {
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-y4e-lock-page', '1')
  return NextResponse.next({ request: { headers: requestHeaders } })
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const password = process.env.SITE_PASSWORD?.trim()

  if (!isSiteGateEnabled() || !password) {
    if (pathname === SITE_GATE_PATH) {
      return NextResponse.redirect(new URL('/', request.url))
    }
    return NextResponse.next()
  }

  const expected = await siteGateToken(password)
  const token = request.cookies.get(SITE_GATE_COOKIE)?.value ?? ''
  const unlocked = Boolean(token) && tokensMatch(token, expected)

  if (unlocked) {
    if (pathname === SITE_GATE_PATH) {
      return NextResponse.redirect(new URL('/', request.url))
    }
    return NextResponse.next()
  }

  if (pathname === SITE_GATE_PATH) {
    return withLockHeader(request)
  }

  if (pathname.startsWith('/api/site-gate')) {
    return NextResponse.next()
  }

  const unlockUrl = request.nextUrl.clone()
  unlockUrl.pathname = SITE_GATE_PATH
  unlockUrl.search = ''
  return NextResponse.redirect(unlockUrl)
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|images/|fonts/|assets/|icons/|robots.txt).*)',
  ],
}
