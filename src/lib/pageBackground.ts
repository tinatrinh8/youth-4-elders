export function setPageBackground(color: string, withTransition = false) {
  const root = document.documentElement
  const siteRoot = document.getElementById('site-root')

  if (withTransition) {
    root.style.transition = 'background 0.8s ease-in-out'
    if (siteRoot) siteRoot.style.transition = 'background 0.8s ease-in-out'
  } else {
    root.style.transition = 'none'
    if (siteRoot) siteRoot.style.transition = 'none'
  }

  root.style.setProperty('--page-background', color)
  root.style.background = color
  document.body.style.background = color
  if (siteRoot) siteRoot.style.background = color
}

export function clearPageBackground() {
  const root = document.documentElement
  const siteRoot = document.getElementById('site-root')
  root.style.removeProperty('--page-background')
  root.style.background = ''
  document.body.style.background = ''
  if (siteRoot) siteRoot.style.background = ''
}
