'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

export default function LoadingSpinner({ message = 'Loading...' }: { message?: string }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const content = (
    <div
      className="loading-spinner-overlay"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="loading-spinner-center">
        {/* Spinning circle — smaller on phone, mid on tablet, full on desktop */}
        <div className="loading-spinner-ring relative mb-5 h-11 w-11 md:mb-6 md:h-14 md:w-14 lg:mb-8 lg:h-16 lg:w-16">
          <div
            className="absolute inset-0 rounded-full border-[3px] border-solid md:border-4"
            style={{
              borderColor: 'var(--color-olive)',
              borderTopColor: 'transparent',
              borderRightColor: 'transparent',
              animation: 'spin 1s linear infinite',
            }}
          />
          <div
            className="absolute inset-[18%] rounded-full border-2 border-solid md:border-[3px]"
            style={{
              borderColor: 'var(--color-olive-light)',
              borderTopColor: 'transparent',
              borderRightColor: 'transparent',
              animation: 'spin 0.8s linear infinite reverse',
            }}
          />
        </div>

        <p
          className="text-base font-semibold leading-snug md:text-xl lg:text-2xl"
          style={{
            fontFamily: 'var(--font-leiko)',
            color: 'var(--color-olive-light)',
          }}
        >
          {message}
        </p>
      </div>
    </div>
  )

  if (!mounted) {
    // SSR / first paint: still render fixed overlay so layout stays centered
    return content
  }

  return createPortal(content, document.body)
}
