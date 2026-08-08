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
  const isPastEvents = pathname === '/events/past' || pathname.startsWith('/events/past/')
  const isPastGallery = pathname.startsWith('/events/past/gallery/')
  const isTeam = pathname === '/team'
  const isContact = pathname === '/contact'
  const footerBackground = isPastGallery
    ? 'var(--color-brown-dark)'
    : isPastEvents
    ? 'var(--color-olive)'
    : isUpcomingEvents
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
  const footerTextColor = isPastEvents || isUpcomingEvents
    ? 'var(--color-cream)'
    : isPartner
      ? 'var(--color-olive-light)'
      : isJoinUs || isClubInfo
        ? 'var(--color-brown-dark)'
        : 'var(--color-cream)'
  const footerHoverColor = isPastEvents || isUpcomingEvents
    ? '#351219'
    : isPartner
      ? 'var(--color-cream)'
      : isJoinUs || isClubInfo
        ? '#351219'
        : 'var(--color-olive)'
  const footerBorderColor = isPastGallery
    ? 'rgba(251, 247, 232, 0.2)'
    : isPastEvents
    ? 'rgba(251, 247, 232, 0.25)'
    : isUpcomingEvents
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
    if (isPastGallery) return
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
  }, [isPastGallery])

  if (isPastGallery) return null

  const scale = 1 + 1.4 * (1 - scrollProgress)
  const transition = 'transform 0.28s ease-out'

  return (
    <footer ref={footerRef} className={`mt-auto relative ${isPartner ? 'z-40 overflow-hidden' : 'overflow-visible'}`} style={{ background: footerBackground }}>
      {isPartner && (
        <div className="relative z-10 w-full h-1" style={{ background: 'var(--color-brown-dark)' }} aria-hidden />
      )}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 pt-10 pb-8 md:py-7 lg:py-20 overflow-visible">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-5 lg:gap-16 mb-8 md:mb-5 lg:mb-12 overflow-visible">
          {/* Left Side - Call to Action */}
          <div className="overflow-visible min-w-0">
            <h2
              className="text-xl sm:text-2xl md:text-3xl lg:text-5xl xl:text-6xl font-bold mb-4 md:mb-3 lg:mb-6 origin-left whitespace-nowrap md:whitespace-normal"
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
          <div className="grid grid-cols-2 gap-4 sm:gap-6 md:gap-8 lg:gap-12">
            {/* Get Around Section - centered on mobile */}
            <div className="text-center md:text-left">
              <h3 className="text-xs md:text-sm font-black uppercase tracking-wider mb-2 md:mb-2.5 lg:mb-4" style={{ fontFamily: 'var(--font-leiko)', color: footerTextColor }}>
                GET AROUND
              </h3>
              <ul className="space-y-2 md:space-y-2 lg:space-y-3">
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
              <h3 className="text-xs md:text-sm font-black uppercase tracking-wider mb-2 md:mb-2.5 lg:mb-4" style={{ fontFamily: 'var(--font-leiko)', color: footerTextColor }}>
                CONNECT
              </h3>
              <ul className="space-y-2 md:space-y-2 lg:space-y-3">
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
        <div className="pt-6 md:pt-3 lg:pt-8 border-t" style={{ borderColor: footerBorderColor }}>
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-5 lg:gap-6">
            {/* Copyright */}
            <div className="text-center md:text-left">
              <p className="text-xs md:text-sm" style={{ fontFamily: 'var(--font-kollektif)', color: footerTextColor, opacity: 0.8 }}>
                © 2025 Youth 4 Elders. All rights reserved.
              </p>
            </div>

            {/* Logo */}
            <div className="flex-shrink-0">
              <Image
                src={
                  isPartner
                    ? '/images/Y4E_LOGO_TEXT_OLIVE_LIGHT.png'
                    : isHome || isTeam || isUpcomingEvents || isPastEvents || isContact
                      ? '/images/Y4E_LOGO_TEXT_CREAM.png'
                      : '/images/Y4E_LOGO_TEXT.png'
                }
                alt="Youth 4 Elders Logo"
                width={60}
                height={60}
                className="object-contain w-14 h-14 md:w-16 md:h-16 lg:w-20 lg:h-20"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Scroll to Top Button */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className={`fixed z-50 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-lg ${
          isUpcomingEvents
            ? 'hidden md:flex bottom-8 right-8 h-12 w-12'
            : isPastEvents
              ? 'bottom-8 right-4 h-9 w-9 md:bottom-8 md:right-8 md:h-12 md:w-12'
              : 'bottom-8 right-8 h-12 w-12'
        }`}
        style={{
          background: 'var(--color-brown-dark)',
          border: '2px solid var(--color-cream)',
          color: 'var(--color-cream)',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'var(--color-olive-light)'
          e.currentTarget.style.borderColor = 'var(--color-olive-light)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'var(--color-brown-dark)'
          e.currentTarget.style.borderColor = 'var(--color-cream)'
        }}
        aria-label="Scroll to top"
      >
        <svg
          className={
            isUpcomingEvents || isPastEvents
              ? 'h-4 w-4 md:h-6 md:w-6'
              : 'h-6 w-6'
          }
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      </button>
    </footer>
  )
}

