export const SITE_GATE_COOKIE = 'y4e_site_gate'
export const SITE_GATE_PATH = '/preview'

export function isSiteGateEnabled() {
  return Boolean(process.env.SITE_PASSWORD?.trim())
}

export async function siteGateToken(password: string) {
  const data = new TextEncoder().encode(`y4e-preview:${password}`)
  const hash = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(hash))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('')
}

export function tokensMatch(a: string, b: string) {
  if (a.length !== b.length) return false
  let mismatch = 0
  for (let i = 0; i < a.length; i += 1) {
    mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i)
  }
  return mismatch === 0
}
