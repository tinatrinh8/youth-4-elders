'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useState, useRef, useEffect } from 'react'

const SCROLL_RANGE_PX = 420

export default function Footer() {
  const pathname = usePathname()
  const isHome = pathname === '/'
  const isClubInfo = pathname === '/club-info'
  const isPartner = pathname === '/partner'
  const isJoinUs = pathname === '/join-us'
  const isUpcomingEvents = pathname === '/events/upcoming'
  const footerBackground = isUpcomingEvents
    ? 'var(--color-olive-light)'
    : isPartner
      ? 'var(--color-olive)'
      : isJoinUs
        ? 'var(--color-pink-medium)'
        : isClubInfo
          ? 'var(--color-pink-medium)'
          : isHome
            ? 'var(--color-brown-dark)'
            : 'var(--color-brown-dark)'
  const footerTextColor = isUpcomingEvents
    ? 'var(--color-cream)'
    : isPartner
      ? 'var(--color-olive-light)'
      : isJoinUs || isClubInfo
        ? 'var(--color-brown-dark)'
        : 'var(--color-cream)'
  const footerHoverColor = isUpcomingEvents
    ? '#351219'
    : isPartner
      ? 'var(--color-cream)'
      : isJoinUs || isClubInfo
        ? '#351219'
        : 'var(--color-olive)'
  const footerBorderColor = isUpcomingEvents
    ? 'rgba(251, 247, 232, 0.35)'
    : isPartner
      ? 'rgba(251, 247, 232, 0.25)'
      : isJoinUs || isClubInfo
        ? 'rgba(98, 32, 47, 0.2)'
        : isHome
          ? 'rgba(247, 240, 227, 0.2)'
          : 'rgba(247, 240, 227, 0.2)'

  const footerRef = useRef<HTMLElement>(null)
  const [scrollProgress, setScrollProgress] = useState(1)

  useEffect(() => {
    const footer = footerRef.current
    if (!footer) return

    const update = () => {
      const rect = footer.getBoundingClientRect()
      const vh = window.innerHeight
      const progress = Math.max(0, Math.min(1, (vh - rect.top) / SCROLL_RANGE_PX))
      setScrollProgress(progress)
    }

    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [])

  const scale = 1 + 1.4 * (1 - scrollProgress)
  const transition = 'transform 0.28s ease-out'

  return (
    <footer ref={footerRef} className="mt-auto relative overflow-visible" style={{ background: footerBackground }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 pt-10 pb-8 md:py-16 lg:py-20 overflow-visible">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 lg:gap-16 mb-8 md:mb-12 overflow-visible">
          {/* Left Side - Call to Action */}
          <div className="overflow-visible min-w-0">
            <h2
              className="text-xl sm:text-2xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 md:mb-6 origin-left whitespace-nowrap md:whitespace-normal"
              style={{
                fontFamily: 'var(--font-vintage-stylist)',
                color: footerTextColor,
                transform: `scale(${scale})`,
                transformOrigin: 'left top',
                transition,
              }}
            >
              Ready to Make a Difference?
            </h2>
          </div>

          {/* Right Side - Quick Links: two columns on all screens, tighter on mobile */}
          <div className="grid grid-cols-2 gap-4 sm:gap-6 md:gap-12">
            {/* Get Around Section - centered on mobile */}
            <div className="text-center md:text-left">
              <h3 className="text-xs md:text-sm font-black uppercase tracking-wider mb-2 md:mb-4" style={{ fontFamily: 'var(--font-leiko)', color: footerTextColor }}>
                GET AROUND
              </h3>
              <ul className="space-y-2 md:space-y-3">
                <li>
                  <Link
                    href="/"
                    className="text-sm md:text-base italic transition-all duration-300"
                    style={{ fontFamily: 'var(--font-leiko)', color: footerTextColor, opacity: 0.9 }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.opacity = '1'
                      e.currentTarget.style.color = footerHoverColor
                      e.currentTarget.style.transform = 'translateX(4px)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.opacity = '0.9'
                      e.currentTarget.style.color = footerTextColor
                      e.currentTarget.style.transform = 'translateX(0)'
                    }}
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    href="/club-info"
                    className="text-sm md:text-base italic transition-all duration-300"
                    style={{ fontFamily: 'var(--font-leiko)', color: footerTextColor, opacity: 0.9 }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.opacity = '1'
                      e.currentTarget.style.color = footerHoverColor
                      e.currentTarget.style.transform = 'translateX(4px)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.opacity = '0.9'
                      e.currentTarget.style.color = footerTextColor
                      e.currentTarget.style.transform = 'translateX(0)'
                    }}
                  >
                    Club Info
                  </Link>
                </li>
                <li>
                  <Link
                    href="/events/upcoming"
                    className="text-sm md:text-base italic transition-all duration-300"
                    style={{ fontFamily: 'var(--font-leiko)', color: footerTextColor, opacity: 0.9 }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.opacity = '1'
                      e.currentTarget.style.color = footerHoverColor
                      e.currentTarget.style.transform = 'translateX(4px)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.opacity = '0.9'
                      e.currentTarget.style.color = footerTextColor
                      e.currentTarget.style.transform = 'translateX(0)'
                    }}
                  >
                    Events
                  </Link>
                </li>
                <li>
                  <Link
                    href="/join-us"
                    className="text-sm md:text-base italic transition-all duration-300"
                    style={{ fontFamily: 'var(--font-leiko)', color: footerTextColor, opacity: 0.9 }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.opacity = '1'
                      e.currentTarget.style.color = footerHoverColor
                      e.currentTarget.style.transform = 'translateX(4px)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.opacity = '0.9'
                      e.currentTarget.style.color = footerTextColor
                      e.currentTarget.style.transform = 'translateX(0)'
                    }}
                  >
                    Get Involved
                  </Link>
                </li>
              </ul>
            </div>

            {/* Connect Section - centered on mobile only, left-aligned on desktop */}
            <div className="text-center md:text-left">
              <h3 className="text-xs md:text-sm font-black uppercase tracking-wider mb-2 md:mb-4" style={{ fontFamily: 'var(--font-leiko)', color: footerTextColor }}>
                CONNECT
              </h3>
              <ul className="space-y-2 md:space-y-3">
                <li>
                  <a
                    href="https://www.instagram.com/youth4elders/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm md:text-base italic transition-all duration-300"
                    style={{ fontFamily: 'var(--font-leiko)', color: footerTextColor, opacity: 0.9 }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.opacity = '1'
                      e.currentTarget.style.color = footerHoverColor
                      e.currentTarget.style.transform = 'translateX(4px)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.opacity = '0.9'
                      e.currentTarget.style.color = footerTextColor
                      e.currentTarget.style.transform = 'translateX(0)'
                    }}
                  >
                    Instagram
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.linkedin.com/company/youth4elders/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm md:text-base italic transition-all duration-300"
                    style={{ fontFamily: 'var(--font-leiko)', color: footerTextColor, opacity: 0.9 }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.opacity = '1'
                      e.currentTarget.style.color = footerHoverColor
                      e.currentTarget.style.transform = 'translateX(4px)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.opacity = '0.9'
                      e.currentTarget.style.color = footerTextColor
                      e.currentTarget.style.transform = 'translateX(0)'
                    }}
                  >
                    LinkedIn
                  </a>
                </li>
                <li>
                  <a
                    href="mailto:youth4elders@gmail.com"
                    className="text-sm md:text-base italic transition-all duration-300"
                    style={{ fontFamily: 'var(--font-leiko)', color: footerTextColor, opacity: 0.9 }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.opacity = '1'
                      e.currentTarget.style.color = footerHoverColor
                      e.currentTarget.style.transform = 'translateX(4px)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.opacity = '0.9'
                      e.currentTarget.style.color = footerTextColor
                      e.currentTarget.style.transform = 'translateX(0)'
                    }}
                  >
                    Email
                  </a>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="text-sm md:text-base italic transition-all duration-300"
                    style={{ fontFamily: 'var(--font-leiko)', color: footerTextColor, opacity: 0.9 }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.opacity = '1'
                      e.currentTarget.style.color = footerHoverColor
                      e.currentTarget.style.transform = 'translateX(4px)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.opacity = '0.9'
                      e.currentTarget.style.color = footerTextColor
                      e.currentTarget.style.transform = 'translateX(0)'
                    }}
                  >
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Footer Bottom - Copyright and Logo */}
        <div className="pt-6 md:pt-8 border-t" style={{ borderColor: footerBorderColor }}>
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-6">
            {/* Copyright */}
            <div className="text-center md:text-left">
              <p className="text-xs md:text-sm" style={{ fontFamily: 'var(--font-kollektif)', color: footerTextColor, opacity: 0.8 }}>
                © 2025 Youth 4 Elders. All rights reserved.
              </p>
            </div>

            {/* Logo */}
            <div className="flex-shrink-0">
              <Image
                src="/images/Y4E_OFFICIAL.PNG"
                alt="Youth 4 Elders Logo"
                width={80}
                height={80}
                className="object-contain opacity-80 hover:opacity-100 transition-opacity duration-300 w-14 h-14 md:w-20 md:h-20"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Scroll to Top Button */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-8 right-8 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-lg z-50"
        style={{
          background: 'var(--color-brown-dark)',
          border: '2px solid var(--color-cream)',
          color: 'var(--color-cream)'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'var(--color-olive)'
          e.currentTarget.style.borderColor = 'var(--color-olive)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'var(--color-brown-dark)'
          e.currentTarget.style.borderColor = 'var(--color-cream)'
        }}
        aria-label="Scroll to top"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      </button>
    </footer>
  )
}

