'use client'

import { useLayoutEffect } from 'react'
import { usePathname } from 'next/navigation'
import { isAppleTouchDevice, syncBrowserThemeColor } from '@/lib/browserTheme'

export default function BrowserChromeSync() {
  const pathname = usePathname()

  useLayoutEffect(() => {
    if (!isAppleTouchDevice()) return
    syncBrowserThemeColor(pathname)
  }, [pathname])

  return null
}
