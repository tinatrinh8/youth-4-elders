'use client'

import { useLayoutEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { syncPageBackground } from '@/lib/pageBackground'

export default function PageBackgroundSync() {
  const pathname = usePathname()
  const hasMountedRef = useRef(false)

  useLayoutEffect(() => {
    syncPageBackground(pathname, hasMountedRef.current)
    hasMountedRef.current = true
  }, [pathname])

  return null
}
