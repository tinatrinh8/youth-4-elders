'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect, useLayoutEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { usePathname } from 'next/navigation'

export default function NavigationBar() {
  const [hoveredDropdown, setHoveredDropdown] = useState<string | null>(null)
  const [closingDropdown, setClosingDropdown] = useState<string | null>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [mobileDropdownOpen, setMobileDropdownOpen] = useState(false)
  const [mobileEventsOpen, setMobileEventsOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [isTablet, setIsTablet] = useState(false)
  const [menuViewport, setMenuViewport] = useState({ top: 0, height: 0 })
  const [memorySheetOpen, setMemorySheetOpen] = useState(false)
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const tapNavRef = useRef(false)
  const whoWeAreDropdownRef = useRef<HTMLDivElement>(null)
  const eventsDropdownRef = useRef<HTMLDivElement>(null)

  const isTapNav = () => {
    if (typeof window === 'undefined') return false
    if (!window.matchMedia('(min-width: 768px)').matches) return false
    const noHover = window.matchMedia('(hover: none)').matches
    const coarse = window.matchMedia('(pointer: coarse)').matches
    const iPad =
      /iPad/.test(navigator.userAgent) ||
      (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
    return noHover || coarse || iPad
  }
  const pathname = usePathname()
  const isJoinUsPage = pathname === '/join-us'
  const isHomePage = pathname === '/'
  const isContactPage = pathname === '/contact'
  const isClubInfoPage = pathname === '/club-info'
  const isPartnerPage = pathname === '/partner'
  const isUpcomingEventsPage = pathname === '/events/upcoming'
  const isPastGalleryPage = pathname.startsWith('/events/past/gallery/') && !memorySheetOpen
  const isPastEventsPage = pathname === '/events/past' || memorySheetOpen
  const isTeamPage = pathname === '/team'

  useLayoutEffect(() => {
    const sync = () => setMemorySheetOpen(document.body.classList.contains('past-gallery-sheet-open'))
    sync()
    const mo = new MutationObserver(sync)
    mo.observe(document.body, { attributes: true, attributeFilter: ['class'] })
    return () => mo.disconnect()
  }, [pathname])

  // Determine navbar color scheme based on page
  const getNavbarColors = () => {
    if (isJoinUsPage) {
      // Join-us (Get Involved) page: Pink
      return {
        background: 'var(--color-pink-medium)',
        text: 'var(--color-brown-dark)',
        border: 'none',
        hover: 'rgba(98, 32, 47, 0.85)',
        shadow: 'rgba(98, 32, 47, 0.2)',
        mobileBackground: 'var(--color-pink-medium)',
        mobileBorder: 'none',
        dropdownBackground: 'var(--color-cream)',
        dropdownBorder: 'var(--color-brown-dark)',
        dropdownText: 'var(--color-brown-dark)',
        dropdownHover: 'rgba(98, 32, 47, 0.08)',
        dropdownHoverText: 'var(--color-brown-dark)'
      }
    } else if (isContactPage) {
      // Contact page: Pink option
      return {
        background: 'var(--color-pink-medium)',
        text: 'var(--color-brown-dark)',
        border: 'none',
        hover: 'rgba(98, 32, 47, 0.85)',
        shadow: 'rgba(98, 32, 47, 0.2)',
        mobileBackground: 'var(--color-pink-medium)',
        mobileBorder: 'none',
        dropdownBackground: 'var(--color-cream)',
        dropdownBorder: 'var(--color-brown-dark)',
        dropdownText: 'var(--color-brown-dark)',
        dropdownHover: 'rgba(98, 32, 47, 0.08)',
        dropdownHoverText: 'var(--color-brown-dark)'
      }
    } else if (isClubInfoPage) {
      // Club info: Pink panther background with merlot text + pink gradient at bottom
      return {
        background: 'linear-gradient(to bottom, var(--color-pink-medium) 0%, var(--color-pink-medium) 55%, var(--color-pink-light) 100%)',
        text: 'var(--color-brown-dark)',
        border: 'none',
        hover: 'rgba(98, 32, 47, 0.85)',
        shadow: 'rgba(98, 32, 47, 0.2)',
        mobileBackground: 'var(--color-pink-medium)',
        mobileBorder: 'none',
        dropdownBackground: 'var(--color-cream)',
        dropdownBorder: 'var(--color-brown-dark)',
        dropdownText: 'var(--color-brown-dark)',
        dropdownHover: 'rgba(98, 32, 47, 0.08)',
        dropdownHoverText: 'var(--color-brown-dark)'
      }
    } else if (isPartnerPage) {
      // Partner page: Chartreuse + olive tones + cream
      return {
        background: 'var(--color-olive)',
        text: 'var(--color-cream)',
        border: 'none',
        hover: 'var(--color-olive-light)',
        shadow: 'rgba(111, 101, 9, 0.25)',
        mobileBackground: 'var(--color-olive)',
        mobileBorder: 'none',
        dropdownBackground: 'var(--color-cream)',
        dropdownBorder: 'var(--color-olive-light)',
        dropdownText: 'var(--color-olive)',
        dropdownHover: 'rgba(201, 218, 168, 0.35)',
        dropdownHoverText: 'var(--color-olive)'
      }
    } else if (isHomePage) {
      // Homepage: Brown background with brown accents
      return {
        background: 'var(--color-brown-dark)',
        text: 'var(--color-cream)',
        border: 'none',
        hover: 'rgba(234, 212, 196, 0.65)', // Light brown/cream for hover (slightly darker)
        shadow: 'rgba(73, 47, 30, 0.15)',
        mobileBackground: 'var(--color-brown-dark)',
        mobileBorder: 'none',
        dropdownBackground: 'var(--color-cream)',
        dropdownBorder: 'var(--color-brown-dark)',
        dropdownText: 'var(--color-brown-dark)',
        dropdownHover: 'rgba(73, 47, 30, 0.1)',
        dropdownHoverText: 'var(--color-brown-dark)'
      }
    } else if (isUpcomingEventsPage || isPastEventsPage) {
      // Events pages: cream bar + merlot text (upcoming = olive, past = olive-light)
      return {
        background: 'var(--color-cream)',
        text: 'var(--color-brown-dark)',
        border: 'var(--color-brown-dark)',
        hover: 'rgba(98, 32, 47, 0.85)',
        shadow: 'rgba(98, 32, 47, 0.18)',
        mobileBackground: 'var(--color-cream)',
        mobileBorder: 'var(--color-brown-dark)',
        dropdownBackground: 'var(--color-cream)',
        dropdownBorder: 'var(--color-brown-dark)',
        dropdownText: 'var(--color-brown-dark)',
        dropdownHover: 'rgba(98, 32, 47, 0.08)',
        dropdownHoverText: 'var(--color-brown-dark)'
      }
    } else {
      // All other pages: Brown background with brown accents (default)
      return {
        background: 'var(--color-brown-dark)',
        text: 'var(--color-cream)',
        border: 'none',
        hover: 'rgba(234, 212, 196, 0.65)', // Light brown/cream for hover (slightly darker)
        shadow: 'rgba(73, 47, 30, 0.15)',
        mobileBackground: 'var(--color-brown-dark)',
        mobileBorder: 'none',
        dropdownBackground: 'var(--color-cream)',
        dropdownBorder: 'var(--color-brown-dark)',
        dropdownText: 'var(--color-brown-dark)',
        dropdownHover: 'rgba(73, 47, 30, 0.1)',
        dropdownHoverText: 'var(--color-brown-dark)'
      }
    }
  }

  const navColors = getNavbarColors()

  // Set page background behind nav
  useEffect(() => {
    // join-us, upcoming, past, and club gallery pages manage their own background
    if (isJoinUsPage || isUpcomingEventsPage || isPastEventsPage || isPastGalleryPage) return

    document.body.style.background = 'var(--color-cream)'
    document.documentElement.style.background = 'var(--color-cream)'
    document.body.style.transition = 'none'
    document.documentElement.style.transition = 'none'
  }, [isJoinUsPage, isUpcomingEventsPage, isPastEventsPage, isPastGalleryPage])

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const updateTapNav = () => {
      const tap = isTapNav()
      tapNavRef.current = tap
      setIsTablet(tap)
    }
    updateTapNav()
    window.addEventListener('resize', updateTapNav)
    return () => window.removeEventListener('resize', updateTapNav)
  }, [])

  useEffect(() => {
    if (!mobileMenuOpen) {
      setMobileDropdownOpen(false)
      setMobileEventsOpen(false)
      return
    }
    const updateViewport = () => {
      setMenuViewport({
        top: window.scrollY,
        height: window.innerHeight,
      })
    }
    updateViewport()
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('resize', updateViewport)
    return () => {
      document.body.style.overflow = prevOverflow
      window.removeEventListener('resize', updateViewport)
    }
  }, [mobileMenuOpen])

  useEffect(() => {
    setMobileMenuOpen(false)
    setHoveredDropdown(null)
    setClosingDropdown(null)
  }, [pathname])

  const openNavDropdown = (id: string) => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current)
      closeTimeoutRef.current = null
    }
    setClosingDropdown(null)
    setHoveredDropdown(id)
  }

  const closeNavDropdown = (id: string) => {
    if (hoveredDropdown !== id) return
    setClosingDropdown(id)
    closeTimeoutRef.current = setTimeout(() => {
      setHoveredDropdown(null)
      setClosingDropdown(null)
      closeTimeoutRef.current = null
    }, 300)
  }

  const toggleTabletDropdown = (id: string) => {
    if (hoveredDropdown === id) {
      closeNavDropdown(id)
      return
    }
    openNavDropdown(id)
  }

  useEffect(() => {
    if (!isTablet || !hoveredDropdown) return
    const openId = hoveredDropdown
    const onDocClick = (event: MouseEvent) => {
      const target = event.target as Node
      if (whoWeAreDropdownRef.current?.contains(target) || eventsDropdownRef.current?.contains(target)) return
      setClosingDropdown(openId)
      closeTimeoutRef.current = setTimeout(() => {
        setHoveredDropdown(null)
        setClosingDropdown(null)
        closeTimeoutRef.current = null
      }, 300)
    }
    const attachId = window.setTimeout(() => {
      document.addEventListener('click', onDocClick)
    }, 0)
    return () => {
      window.clearTimeout(attachId)
      document.removeEventListener('click', onDocClick)
    }
  }, [isTablet, hoveredDropdown])

  const whoWeAreSubmenu = [
    { href: '/club-info', label: 'Club Info' },
    { href: '/partner', label: 'Partner Page' },
    { href: '/team', label: 'Meet the Team' },
  ]
  const eventsSubmenu = [
    { href: '/events/upcoming', label: 'Upcoming Events' },
    { href: '/events/past', label: 'Past Events' }
  ]

  if (isPastGalleryPage) return null

  return (
    <>
    <nav 
      className="relative z-[100] overflow-visible py-2 md:py-3 nav-mobile-margins"
      style={{
        background: navColors.background,
        borderRadius: '9999px',
        border: '2px solid transparent',
        borderColor: navColors.border !== 'none' ? navColors.border : 'transparent',
        marginLeft: '96px',
        marginRight: '96px',
        marginTop: '40px',
        marginBottom: '16px',
        boxShadow: `0 4px 12px ${navColors.shadow}`,
        transition: 'background 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease',
        boxSizing: 'border-box'
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-5 lg:px-8 flex items-center justify-between w-full">
        {/* Logo on the left */}
        <div className="flex items-center flex-shrink-0">
          <Link href="/" className="flex items-center">
            <span
              className="mr-1.5 lg:mr-2 flex items-center justify-center flex-shrink-0 w-8 h-8 lg:w-10 lg:h-10"
              style={
                isHomePage || isPartnerPage || isTeamPage
                  ? {
                      background: 'var(--color-cream)',
                      borderRadius: '9999px',
                      padding: 4,
                    }
                  : isClubInfoPage || isJoinUsPage || isUpcomingEventsPage || isPastEventsPage || isContactPage
                    ? {
                        background: 'var(--color-brown-dark)',
                        borderRadius: '9999px',
                        padding: 4,
                      }
                    : undefined
              }
            >
              <Image
                src={
                  isClubInfoPage || isJoinUsPage || isContactPage
                    ? '/images/Y4E_LOGO_TEXT_PINK.png'
                    : isPartnerPage
                      ? '/images/Y4E_LOGO_TEXT_OLIVE.png'
                      : isUpcomingEventsPage || isPastEventsPage
                        ? '/images/Y4E_LOGO_TEXT_CREAM.png'
                        : '/images/Y4E_LOGO_TEXT.png'
                }
                alt="Youth 4 Elders Logo"
                width={40}
                height={40}
                className="object-contain w-full h-full"
              />
            </span>
            <span 
              className="text-xl lg:text-2xl font-bold italic"
              style={{ 
                fontFamily: 'var(--font-vintage-stylist)', 
                color: navColors.text,
                transition: 'color 0.3s ease'
              }}
            >
              Youth 4 Elders
            </span>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden flex items-center justify-center w-10 h-10 rounded-full transition-all duration-200"
          style={{
            color: navColors.text,
            background: mobileMenuOpen ? 'rgba(255, 255, 255, 0.1)' : 'transparent'
          }}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>

        {/* Desktop Navigation links */}
        <div className="hidden md:flex min-w-0 items-center gap-2 lg:gap-8 relative">
          <Link 
            href="/"
            className="text-sm lg:text-base font-medium whitespace-nowrap px-1.5 py-1.5 lg:px-3 lg:py-2"
            style={{ 
              color: navColors.text,
              fontFamily: 'var(--font-kollektif)',
              transition: 'color 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = navColors.hover
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = navColors.text
            }}
          >
            Home
          </Link>
          
          <div 
            ref={whoWeAreDropdownRef}
            className="relative"
            onMouseEnter={() => {
              if (tapNavRef.current) return
              openNavDropdown('who-we-are')
            }}
            onMouseLeave={() => {
              if (tapNavRef.current) return
              closeNavDropdown('who-we-are')
            }}
          >
            <button
              type="button"
              className="text-sm lg:text-base font-medium whitespace-nowrap px-1.5 py-1.5 lg:px-3 lg:py-2 flex items-center gap-1 cursor-pointer"
              style={{ 
                color: hoveredDropdown === 'who-we-are' ? navColors.hover : navColors.text,
                fontFamily: 'var(--font-kollektif)',
                transition: 'color 0.3s ease',
                background: 'transparent',
                border: 'none'
              }}
              aria-expanded={hoveredDropdown === 'who-we-are'}
              onClick={() => {
                if (!tapNavRef.current) return
                toggleTabletDropdown('who-we-are')
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = navColors.hover
              }}
              onMouseLeave={(e) => {
                if (hoveredDropdown === 'who-we-are') return
                e.currentTarget.style.color = navColors.text
              }}
            >
              Who We Are
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {/* Invisible bridge to prevent gap issues */}
            {hoveredDropdown === 'who-we-are' && !tapNavRef.current && (
              <div 
                className="absolute top-full left-0 right-0 h-10 z-[109]"
                style={{ marginTop: 0 }}
                onMouseEnter={() => openNavDropdown('who-we-are')}
              />
            )}
            {/* Dropdown Menu */}
            {(hoveredDropdown === 'who-we-are' || closingDropdown === 'who-we-are') && (
              <div 
                className="absolute top-full left-0 w-56 rounded-2xl shadow-xl z-[110] overflow-hidden"
                style={{ 
                  background: navColors.dropdownBackground || 'var(--color-cream)', 
                  border: `1px solid ${navColors.dropdownBorder || 'var(--color-brown-dark)'}`,
                  boxShadow: `0 8px 24px ${navColors.shadow}`,
                  marginTop: '8px',
                  animation: closingDropdown === 'who-we-are' ? 'dropdownRollIn 0.3s ease-in' : 'dropdownRollOut 0.3s ease-out',
                  transformOrigin: 'top'
                }}
                onMouseEnter={() => {
                  if (tapNavRef.current) return
                  openNavDropdown('who-we-are')
                }}
              >
                <div className="py-2">
                  {whoWeAreSubmenu.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="block px-4 py-3 text-sm"
                      style={{ 
                        color: navColors.dropdownText || 'var(--color-brown-dark)',
                        fontFamily: 'var(--font-kollektif)',
                        background: 'transparent',
                        transition: 'background 0.3s ease, color 0.3s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = navColors.dropdownHover || 'rgba(73, 47, 30, 0.1)'
                        e.currentTarget.style.color = navColors.dropdownHoverText || navColors.dropdownText || 'var(--color-brown-dark)'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'transparent'
                        e.currentTarget.style.color = navColors.dropdownText || 'var(--color-brown-dark)'
                      }}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <Link 
            href="/join-us"
            className="text-sm lg:text-base font-medium whitespace-nowrap px-1.5 py-1.5 lg:px-3 lg:py-2"
            style={{ 
              color: navColors.text,
              fontFamily: 'var(--font-kollektif)',
              transition: 'color 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = navColors.hover
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = navColors.text
            }}
          >
            Get Involved
          </Link>
          
          <div 
            ref={eventsDropdownRef}
            className="relative"
            onMouseEnter={() => {
              if (tapNavRef.current) return
              openNavDropdown('events')
            }}
            onMouseLeave={() => {
              if (tapNavRef.current) return
              closeNavDropdown('events')
            }}
          >
            <button
              type="button"
              className="text-sm lg:text-base font-medium whitespace-nowrap px-1.5 py-1.5 lg:px-3 lg:py-2 flex items-center gap-1 cursor-pointer"
              style={{ 
                color: hoveredDropdown === 'events' ? navColors.hover : navColors.text,
                fontFamily: 'var(--font-kollektif)',
                transition: 'color 0.3s ease',
                background: 'transparent',
                border: 'none'
              }}
              aria-expanded={hoveredDropdown === 'events'}
              onClick={() => {
                if (!tapNavRef.current) return
                toggleTabletDropdown('events')
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = navColors.hover
              }}
              onMouseLeave={(e) => {
                if (hoveredDropdown === 'events') return
                e.currentTarget.style.color = navColors.text
              }}
            >
              Events
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {/* Invisible bridge to prevent gap issues */}
            {hoveredDropdown === 'events' && !tapNavRef.current && (
              <div 
                className="absolute top-full left-0 right-0 h-10 z-[109]"
                style={{ marginTop: 0 }}
                onMouseEnter={() => openNavDropdown('events')}
              />
            )}
            {/* Dropdown Menu */}
            {(hoveredDropdown === 'events' || closingDropdown === 'events') && (
              <div 
                className="absolute top-full right-0 left-auto xl:left-0 xl:right-auto w-48 rounded-2xl shadow-xl z-[110] overflow-hidden"
                style={{ 
                  background: navColors.dropdownBackground || 'var(--color-cream)', 
                  border: `1px solid ${navColors.dropdownBorder || 'var(--color-brown-dark)'}`,
                  boxShadow: `0 8px 24px ${navColors.shadow}`,
                  marginTop: '8px',
                  animation: closingDropdown === 'events' ? 'dropdownRollIn 0.3s ease-in' : 'dropdownRollOut 0.3s ease-out',
                  transformOrigin: 'top'
                }}
                onMouseEnter={() => {
                  if (tapNavRef.current) return
                  openNavDropdown('events')
                }}
              >
                <div className="py-2">
                  <Link
                    href="/events/upcoming"
                    className="block px-4 py-3 text-sm"
                    style={{ 
                      color: navColors.dropdownText || 'var(--color-brown-dark)',
                      fontFamily: 'var(--font-kollektif)',
                      background: 'transparent',
                      transition: 'background 0.3s ease, color 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = navColors.dropdownHover || 'rgba(73, 47, 30, 0.1)'
                      e.currentTarget.style.color = navColors.dropdownHoverText || navColors.dropdownText || 'var(--color-brown-dark)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'transparent'
                      e.currentTarget.style.color = navColors.dropdownText || 'var(--color-brown-dark)'
                    }}
                  >
                    Upcoming Events
                  </Link>
                  <Link
                    href="/events/past"
                    className="block px-4 py-3 text-sm"
                    style={{ 
                      color: navColors.dropdownText || 'var(--color-brown-dark)',
                      fontFamily: 'var(--font-kollektif)',
                      background: 'transparent',
                      transition: 'background 0.3s ease, color 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = navColors.dropdownHover || 'rgba(73, 47, 30, 0.1)'
                      e.currentTarget.style.color = navColors.dropdownHoverText || navColors.dropdownText || 'var(--color-brown-dark)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'transparent'
                      e.currentTarget.style.color = navColors.dropdownText || 'var(--color-brown-dark)'
                    }}
                  >
                    Past Events
                  </Link>
                </div>
              </div>
            )}
          </div>
          
          <Link 
            href="/contact"
            className="text-sm lg:text-base font-medium whitespace-nowrap px-1.5 py-1.5 lg:px-3 lg:py-2"
            style={{ 
              color: navColors.text,
              fontFamily: 'var(--font-kollektif)',
              transition: 'color 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = navColors.hover
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = navColors.text
            }}
          >
            Contact
          </Link>
        </div>
      </div>
    </nav>
      {mounted && createPortal(
        <>
          {mobileMenuOpen && (
            <div
              className="md:hidden absolute left-0 right-0 z-[400] bg-black/50"
              style={{ top: menuViewport.top, height: menuViewport.height }}
              onClick={() => setMobileMenuOpen(false)}
            />
          )}
          <div
            className={`md:hidden absolute right-0 z-[401] w-80 max-w-[85vw] transition-transform duration-500 ease-in-out ${
              mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
            }`}
            style={{
              top: menuViewport.top,
              height: menuViewport.height,
              background: navColors.mobileBackground,
              boxShadow: mobileMenuOpen ? `-4px 0 24px ${navColors.shadow}` : 'none',
              border: navColors.mobileBorder !== 'none' ? `2px solid ${navColors.mobileBorder}` : 'none',
              pointerEvents: mobileMenuOpen ? 'auto' : 'none',
            }}
            aria-hidden={!mobileMenuOpen}
          >
            <div className="flex h-full flex-col overflow-y-auto p-6">
              <div className="mb-8 flex items-center justify-between">
                <div className="flex items-center">
                  <span
                    className="mr-2 flex h-8 w-8 shrink-0 items-center justify-center"
                    style={
                      isHomePage || isPartnerPage || isTeamPage
                        ? { background: 'var(--color-cream)', borderRadius: '9999px', padding: 3 }
                        : isClubInfoPage || isJoinUsPage || isUpcomingEventsPage || isPastEventsPage || isContactPage
                          ? { background: 'var(--color-brown-dark)', borderRadius: '9999px', padding: 3 }
                          : undefined
                    }
                  >
                    <Image
                      src={
                        isClubInfoPage || isJoinUsPage || isContactPage
                          ? '/images/Y4E_LOGO_TEXT_PINK.png'
                          : isPartnerPage
                            ? '/images/Y4E_LOGO_TEXT_OLIVE.png'
                            : isUpcomingEventsPage || isPastEventsPage
                              ? '/images/Y4E_LOGO_TEXT_CREAM.png'
                              : '/images/Y4E_LOGO_TEXT.png'
                      }
                      alt="Youth 4 Elders Logo"
                      width={32}
                      height={32}
                      className="h-full w-full object-contain"
                    />
                  </span>
                  <span
                    className="text-lg font-bold italic"
                    style={{ fontFamily: 'var(--font-vintage-stylist)', color: navColors.text }}
                  >
                    Youth 4 Elders
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex h-8 w-8 items-center justify-center rounded-full"
                  style={{ color: navColors.text }}
                  aria-label="Close menu"
                >
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="flex flex-col gap-2">
                <Link
                  href="/"
                  className="rounded-lg px-4 py-3 text-base font-medium"
                  style={{ color: navColors.text, fontFamily: 'var(--font-kollektif)', background: 'transparent' }}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Home
                </Link>

                <div className="flex flex-col">
                  <button
                    type="button"
                    onClick={() => setMobileDropdownOpen(!mobileDropdownOpen)}
                    className="flex items-center justify-between rounded-lg px-4 py-3 text-base font-medium"
                    style={{ color: navColors.text, fontFamily: 'var(--font-kollektif)', background: 'transparent' }}
                  >
                    <span>Who We Are</span>
                    <svg
                      className={`h-4 w-4 transition-transform duration-200 ${mobileDropdownOpen ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  <div
                    className="overflow-hidden transition-all duration-300 ease-in-out"
                    style={{ maxHeight: mobileDropdownOpen ? '500px' : '0', opacity: mobileDropdownOpen ? 1 : 0 }}
                  >
                    <div className="ml-4 mt-2 flex flex-col gap-1">
                      {whoWeAreSubmenu.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          className="px-4 py-2 text-sm"
                          style={{ color: navColors.text, fontFamily: 'var(--font-kollektif)', background: 'transparent' }}
                          onClick={() => {
                            setMobileMenuOpen(false)
                            setMobileDropdownOpen(false)
                          }}
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>

                <Link
                  href="/join-us"
                  className="rounded-lg px-4 py-3 text-base font-medium"
                  style={{ color: navColors.text, fontFamily: 'var(--font-kollektif)', background: 'transparent' }}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Get Involved
                </Link>

                <div className="flex flex-col">
                  <button
                    type="button"
                    onClick={() => setMobileEventsOpen(!mobileEventsOpen)}
                    className="flex items-center justify-between rounded-lg px-4 py-3 text-base font-medium"
                    style={{ color: navColors.text, fontFamily: 'var(--font-kollektif)', background: 'transparent' }}
                  >
                    <span>Events</span>
                    <svg
                      className={`h-4 w-4 transition-transform duration-200 ${mobileEventsOpen ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  <div
                    className="overflow-hidden transition-all duration-300 ease-in-out"
                    style={{ maxHeight: mobileEventsOpen ? '500px' : '0', opacity: mobileEventsOpen ? 1 : 0 }}
                  >
                    <div className="ml-4 mt-2 flex flex-col gap-1">
                      {eventsSubmenu.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          className="px-4 py-2 text-sm"
                          style={{ color: navColors.text, fontFamily: 'var(--font-kollektif)', background: 'transparent' }}
                          onClick={() => {
                            setMobileMenuOpen(false)
                            setMobileEventsOpen(false)
                          }}
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>

                <Link
                  href="/contact"
                  className="rounded-lg px-4 py-3 text-base font-medium"
                  style={{ color: navColors.text, fontFamily: 'var(--font-kollektif)', background: 'transparent' }}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Contact
                </Link>
              </div>
            </div>
          </div>
        </>,
        document.getElementById('site-root') ?? document.body
      )}
    </>
  )
}
