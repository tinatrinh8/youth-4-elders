const THEME_BY_PATH: Record<string, string> = {
  '/join-us': '#62202F',
  '/events/upcoming': '#6f6509',
  '/events/past': '#bbb47b',
  '/team': '#F8DAD4',
}

export function isAppleTouchDevice(): boolean {
  if (typeof navigator === 'undefined') return false
  const ua = navigator.userAgent
  const iPad =
    /iPad/.test(ua) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
  return /iPhone|iPod/.test(ua) || iPad
}

export function getBrowserThemeColor(pathname: string): string {
  if (pathname.startsWith('/events/past/gallery/')) return '#62202F'
  if (pathname.startsWith('/events/past/') && pathname !== '/events/past') return '#62202F'

  return THEME_BY_PATH[pathname] ?? '#FBF7E8'
}

export function syncBrowserThemeColor(pathname: string) {
  if (!isAppleTouchDevice()) return

  const color = getBrowserThemeColor(pathname)

  let meta = document.querySelector('meta[name="theme-color"]')
  if (!meta) {
    meta = document.createElement('meta')
    meta.setAttribute('name', 'theme-color')
    document.head.appendChild(meta)
  }
  meta.setAttribute('content', color)
}
