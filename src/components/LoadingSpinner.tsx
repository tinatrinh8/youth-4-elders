'use client'

export default function LoadingSpinner({ message = 'Loading...' }: { message?: string }) {
  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center px-6"
      style={{
        background: 'var(--color-cream)',
      }}
    >
      <div className="flex w-full max-w-xs flex-col items-center text-center md:max-w-sm">
        {/* Spinning circle — smaller on phone, mid on tablet, full on desktop */}
        <div className="relative mb-5 h-11 w-11 md:mb-6 md:h-14 md:w-14 lg:mb-8 lg:h-16 lg:w-16">
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
}
