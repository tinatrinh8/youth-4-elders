export function isAppleTouchDevice(): boolean {
  if (typeof navigator === 'undefined') return false
  const ua = navigator.userAgent
  const iPad =
    /iPad/.test(ua) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
  return /iPhone|iPod/.test(ua) || iPad
}

/** Body classes used for page-specific CSS (background sync manages these). */
export const PAGE_BODY_CLASSES = [
  'home-page-active',
  'join-us-page',
  'upcoming-events-page',
  'past-events-page',
  'team-page',
  'contact-page',
  'partner-page',
  'club-info-page',
] as const

export function getPageBodyClass(pathname: string): (typeof PAGE_BODY_CLASSES)[number] | null {
  if (pathname === '/') return 'home-page-active'
  if (pathname === '/join-us') return 'join-us-page'
  if (pathname === '/events/upcoming') return 'upcoming-events-page'
  if (pathname === '/events/past') return 'past-events-page'
  if (pathname === '/team') return 'team-page'
  if (pathname === '/contact') return 'contact-page'
  if (pathname === '/partner') return 'partner-page'
  if (pathname === '/club-info') return 'club-info-page'
  return null
}

export function getPageBackgroundForPath(pathname: string): string {
  if (pathname === '/join-us') return 'var(--color-brown-dark)'
  if (pathname === '/events/upcoming') return 'var(--color-olive)'
  if (pathname === '/events/past') return 'var(--color-olive-light)'
  if (pathname.startsWith('/events/past/gallery/')) return 'var(--color-brown-dark)'
  if (pathname === '/preview') return 'var(--color-brown-dark)'
  if (pathname === '/team') return 'var(--color-pink-light)'
  return 'var(--color-cream)'
}

export function setPageBackground(color: string, withTransition = false) {
  const root = document.documentElement
  const siteRoot = document.getElementById('site-root')
  const touchSafari = isAppleTouchDevice()

  const transition = withTransition ? 'background 0.8s ease-in-out' : 'none'

  root.style.setProperty('--page-background', color)

  if (siteRoot) {
    siteRoot.style.transition = transition
    siteRoot.style.background = color
  }

  if (touchSafari) {
    root.style.transition = 'none'
    document.body.style.transition = 'none'
    root.style.background = ''
    document.body.style.background = ''
    return
  }

  root.style.transition = transition
  document.body.style.transition = transition
  root.style.background = color
  document.body.style.background = color
}

export function syncPageBackground(pathname: string, withTransition: boolean) {
  const pageClass = getPageBodyClass(pathname)

  for (const cls of PAGE_BODY_CLASSES) {
    document.body.classList.remove(cls)
  }
  if (pageClass) {
    document.body.classList.add(pageClass)
  }

  setPageBackground(getPageBackgroundForPath(pathname), withTransition)
}
