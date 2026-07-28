'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'

export default function NavigationBar() {
  const [hoveredDropdown, setHoveredDropdown] = useState<string | null>(null)
  const [closingDropdown, setClosingDropdown] = useState<string | null>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [mobileDropdownOpen, setMobileDropdownOpen] = useState(false)
  const [mobileEventsOpen, setMobileEventsOpen] = useState(false)
  const [language, setLanguage] = useState<'en' | 'fr'>('en')
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const pathname = usePathname()
  const isJoinUsPage = pathname === '/join-us'
  const isHomePage = pathname === '/'
  const isContactPage = pathname === '/contact'
  const isClubInfoPage = pathname === '/club-info'
  const isPartnerPage = pathname === '/partner'
  const isUpcomingEventsPage = pathname === '/events/upcoming'
  const isPastGalleryPage = pathname.startsWith('/events/past/') && pathname !== '/events/past'
  const isPastEventsPage = pathname === '/events/past'
  const isTeamPage = pathname === '/team'

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

  // Load language preference from localStorage
  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as 'en' | 'fr' | null
    if (savedLanguage) {
      setLanguage(savedLanguage)
    }
  }, [])

  // Save language preference to localStorage
  const handleLanguageChange = (lang: 'en' | 'fr') => {
    setLanguage(lang)
    localStorage.setItem('language', lang)
    // Clear any pending close timeout
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current)
      closeTimeoutRef.current = null
    }
    setClosingDropdown('language')
    closeTimeoutRef.current = setTimeout(() => {
      setHoveredDropdown(null)
      setClosingDropdown(null)
      closeTimeoutRef.current = null
    }, 300)
    // Translation implementation will be added later
  }
  
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
    if (!mobileMenuOpen) {
      setMobileDropdownOpen(false)
      setMobileEventsOpen(false)
    }
  }, [mobileMenuOpen])

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
    <nav 
      className="relative z-[100] py-2 md:py-3 nav-mobile-margins"
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
      <div className="max-w-7xl mx-auto px-4 sm:px-8 flex items-center justify-between w-full">
        {/* Logo on the left */}
        <div className="flex items-center flex-shrink-0">
          <Link href="/" className="flex items-center">
            <span
              className="mr-2 flex items-center justify-center flex-shrink-0 w-10 h-10"
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
              className="text-xl md:text-2xl font-bold italic"
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
        <div className="hidden md:flex items-center gap-6 md:gap-8 relative">
          <Link 
            href="/"
            className="text-sm md:text-base font-medium whitespace-nowrap px-3 py-2"
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
            className="relative"
            onMouseEnter={() => {
              // Clear any pending close timeout
              if (closeTimeoutRef.current) {
                clearTimeout(closeTimeoutRef.current)
                closeTimeoutRef.current = null
              }
              // Immediately close any other dropdown
              if (hoveredDropdown && hoveredDropdown !== 'who-we-are') {
                setClosingDropdown(null)
                setHoveredDropdown(null)
              }
              setClosingDropdown(null)
              setHoveredDropdown('who-we-are')
            }}
            onMouseLeave={() => {
              if (hoveredDropdown === 'who-we-are') {
                setClosingDropdown('who-we-are')
                closeTimeoutRef.current = setTimeout(() => {
                  setHoveredDropdown(null)
                  setClosingDropdown(null)
                  closeTimeoutRef.current = null
                }, 300) // Match animation duration
              }
            }}
          >
            <div 
              className="text-sm md:text-base font-medium whitespace-nowrap px-3 py-2 flex items-center gap-1 cursor-pointer"
              style={{ 
                color: hoveredDropdown === 'who-we-are' ? navColors.hover : navColors.text,
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
              Who We Are
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
            {/* Invisible bridge to prevent gap issues */}
            {hoveredDropdown === 'who-we-are' && (
              <div 
                className="absolute top-full left-0 right-0 h-10 z-[109]"
                style={{ marginTop: 0 }}
                onMouseEnter={() => {
                  if (closeTimeoutRef.current) {
                    clearTimeout(closeTimeoutRef.current)
                    closeTimeoutRef.current = null
                  }
                  setClosingDropdown(null)
                  setHoveredDropdown('who-we-are')
                }}
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
                  if (closeTimeoutRef.current) {
                    clearTimeout(closeTimeoutRef.current)
                    closeTimeoutRef.current = null
                  }
                  setClosingDropdown(null)
                  setHoveredDropdown('who-we-are')
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
            className="text-sm md:text-base font-medium whitespace-nowrap px-3 py-2"
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
            className="relative"
            onMouseEnter={() => {
              // Clear any pending close timeout
              if (closeTimeoutRef.current) {
                clearTimeout(closeTimeoutRef.current)
                closeTimeoutRef.current = null
              }
              // Immediately close any other dropdown
              if (hoveredDropdown && hoveredDropdown !== 'events') {
                setClosingDropdown(null)
                setHoveredDropdown(null)
              }
              setClosingDropdown(null)
              setHoveredDropdown('events')
            }}
            onMouseLeave={() => {
              if (hoveredDropdown === 'events') {
                setClosingDropdown('events')
                closeTimeoutRef.current = setTimeout(() => {
                  setHoveredDropdown(null)
                  setClosingDropdown(null)
                  closeTimeoutRef.current = null
                }, 300) // Match animation duration
              }
            }}
          >
            <div 
              className="text-sm md:text-base font-medium whitespace-nowrap px-3 py-2 flex items-center gap-1 cursor-pointer"
              style={{ 
                color: hoveredDropdown === 'events' ? navColors.hover : navColors.text,
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
              Events
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
            {/* Invisible bridge to prevent gap issues */}
            {hoveredDropdown === 'events' && (
              <div 
                className="absolute top-full left-0 right-0 h-10 z-[109]"
                style={{ marginTop: 0 }}
                onMouseEnter={() => {
                  if (closeTimeoutRef.current) {
                    clearTimeout(closeTimeoutRef.current)
                    closeTimeoutRef.current = null
                  }
                  setClosingDropdown(null)
                  setHoveredDropdown('events')
                }}
              />
            )}
            {/* Dropdown Menu */}
            {(hoveredDropdown === 'events' || closingDropdown === 'events') && (
              <div 
                className="absolute top-full left-0 w-48 rounded-2xl shadow-xl z-[110] overflow-hidden"
                style={{ 
                  background: navColors.dropdownBackground || 'var(--color-cream)', 
                  border: `1px solid ${navColors.dropdownBorder || 'var(--color-brown-dark)'}`,
                  boxShadow: `0 8px 24px ${navColors.shadow}`,
                  marginTop: '8px',
                  animation: closingDropdown === 'events' ? 'dropdownRollIn 0.3s ease-in' : 'dropdownRollOut 0.3s ease-out',
                  transformOrigin: 'top'
                }}
                onMouseEnter={() => {
                  if (closeTimeoutRef.current) {
                    clearTimeout(closeTimeoutRef.current)
                    closeTimeoutRef.current = null
                  }
                  setClosingDropdown(null)
                  setHoveredDropdown('events')
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
            className="text-sm md:text-base font-medium whitespace-nowrap px-3 py-2"
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

          {/* Language Switcher */}
          <div 
            className="relative ml-2"
            onMouseEnter={() => {
              // Clear any pending close timeout
              if (closeTimeoutRef.current) {
                clearTimeout(closeTimeoutRef.current)
                closeTimeoutRef.current = null
              }
              // Immediately close any other dropdown
              if (hoveredDropdown && hoveredDropdown !== 'language') {
                setClosingDropdown(null)
                setHoveredDropdown(null)
              }
              setClosingDropdown(null)
              setHoveredDropdown('language')
            }}
            onMouseLeave={() => {
              if (hoveredDropdown === 'language') {
                setClosingDropdown('language')
                closeTimeoutRef.current = setTimeout(() => {
                  setHoveredDropdown(null)
                  setClosingDropdown(null)
                  closeTimeoutRef.current = null
                }, 300) // Match animation duration
              }
            }}
          >
            <div 
              className="text-sm md:text-base font-medium whitespace-nowrap px-3 py-2 flex items-center gap-1 cursor-pointer"
              style={{ 
                color: hoveredDropdown === 'language' ? navColors.hover : navColors.text,
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
              {language === 'en' ? 'EN' : 'FR'}
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
            {/* Invisible bridge to prevent gap issues */}
            {hoveredDropdown === 'language' && (
              <div 
                className="absolute top-full left-0 right-0 h-10 z-[109]"
                style={{ marginTop: 0 }}
                onMouseEnter={() => {
                  if (closeTimeoutRef.current) {
                    clearTimeout(closeTimeoutRef.current)
                    closeTimeoutRef.current = null
                  }
                  setClosingDropdown(null)
                  setHoveredDropdown('language')
                }}
              />
            )}
            {/* Dropdown Menu */}
            {(hoveredDropdown === 'language' || closingDropdown === 'language') && (
              <div 
                className="absolute top-full left-0 w-40 rounded-2xl shadow-xl z-[110] overflow-hidden"
                style={{ 
                  background: navColors.dropdownBackground || 'var(--color-cream)', 
                  border: `1px solid ${navColors.dropdownBorder || 'var(--color-brown-dark)'}`,
                  boxShadow: `0 8px 24px ${navColors.shadow}`,
                  marginTop: '8px',
                  animation: closingDropdown === 'language' ? 'dropdownRollIn 0.3s ease-in' : 'dropdownRollOut 0.3s ease-out',
                  transformOrigin: 'top'
                }}
                onMouseEnter={() => {
                  if (closeTimeoutRef.current) {
                    clearTimeout(closeTimeoutRef.current)
                    closeTimeoutRef.current = null
                  }
                  setClosingDropdown(null)
                  setHoveredDropdown('language')
                }}
              >
                <div className="py-2">
                  <button
                    onClick={() => handleLanguageChange('en')}
                    className="block w-full text-left px-4 py-3 text-sm"
                    style={{ 
                      color: navColors.dropdownText || 'var(--color-brown-dark)',
                      fontFamily: 'var(--font-kollektif)',
                      background: language === 'en' ? (navColors.dropdownHover || 'rgba(73, 47, 30, 0.1)') : 'transparent',
                      transition: 'background 0.3s ease, color 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = navColors.dropdownHover || 'rgba(73, 47, 30, 0.1)'
                      e.currentTarget.style.color = navColors.dropdownHoverText || navColors.dropdownText || 'var(--color-brown-dark)'
                    }}
                    onMouseLeave={(e) => {
                      if (language !== 'en') {
                        e.currentTarget.style.background = 'transparent'
                        e.currentTarget.style.color = navColors.dropdownText || 'var(--color-brown-dark)'
                      }
                    }}
                  >
                    English
                  </button>
                  <button
                    onClick={() => handleLanguageChange('fr')}
                    className="block w-full text-left px-4 py-3 text-sm"
                    style={{ 
                      color: navColors.dropdownText || 'var(--color-brown-dark)',
                      fontFamily: 'var(--font-kollektif)',
                      background: language === 'fr' ? (navColors.dropdownHover || 'rgba(73, 47, 30, 0.1)') : 'transparent',
                      transition: 'background 0.3s ease, color 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = navColors.dropdownHover || 'rgba(73, 47, 30, 0.1)'
                      e.currentTarget.style.color = navColors.dropdownHoverText || navColors.dropdownText || 'var(--color-brown-dark)'
                    }}
                    onMouseLeave={(e) => {
                      if (language !== 'fr') {
                        e.currentTarget.style.background = 'transparent'
                        e.currentTarget.style.color = navColors.dropdownText || 'var(--color-brown-dark)'
                      }
                    }}
                  >
                    Français
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        {mobileMenuOpen && (
          <div 
            className="md:hidden fixed inset-0 z-[200] bg-black bg-opacity-50"
            style={{
              transition: 'opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
              animation: 'fadeIn 0.5s ease-in-out'
            }}
            onClick={() => setMobileMenuOpen(false)}
          />
        )}

        {/* Mobile Menu */}
        <div 
          className={`md:hidden fixed top-0 right-0 h-full w-80 max-w-[85vw] z-[201] transition-transform duration-500 ease-in-out ${
            mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
          style={{
            background: navColors.mobileBackground,
            boxShadow: `-4px 0 24px ${navColors.shadow}`,
            border: navColors.mobileBorder !== 'none' ? `2px solid ${navColors.mobileBorder}` : 'none'
          }}
        >
          <div className="flex flex-col h-full p-6 overflow-y-auto">
            {/* Mobile Menu Header */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center">
                <span
                  className="mr-2 flex items-center justify-center flex-shrink-0 w-8 h-8"
                  style={
                    isHomePage || isPartnerPage || isTeamPage
                      ? {
                          background: 'var(--color-cream)',
                          borderRadius: '9999px',
                          padding: 3,
                        }
                      : isClubInfoPage || isJoinUsPage || isUpcomingEventsPage || isPastEventsPage || isContactPage
                        ? {
                            background: 'var(--color-brown-dark)',
                            borderRadius: '9999px',
                            padding: 3,
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
                    width={32}
                    height={32}
                    className="object-contain w-full h-full"
                  />
                </span>
                <span 
                  className="text-lg font-bold italic"
                  style={{ 
                    fontFamily: 'var(--font-vintage-stylist)', 
                    color: navColors.text
                  }}
                >
                  Youth 4 Elders
                </span>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full"
                style={{ color: navColors.text }}
                aria-label="Close menu"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Mobile Navigation Links */}
            <div className="flex flex-col gap-2">
              <Link 
                href="/"
                className="text-base font-medium px-4 py-3 rounded-lg transition-all duration-200"
                style={{ 
                  color: navColors.text,
                  fontFamily: 'var(--font-kollektif)',
                  background: 'transparent'
                }}
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>
              
              <div className="flex flex-col">
                <button
                  onClick={() => setMobileDropdownOpen(!mobileDropdownOpen)}
                  className="text-base font-medium px-4 py-3 rounded-lg transition-all duration-200 flex items-center justify-between"
                  style={{ 
                    color: navColors.text,
                    fontFamily: 'var(--font-kollektif)',
                    background: 'transparent'
                  }}
                >
                  <span>Who We Are</span>
                  <svg 
                    className={`w-4 h-4 transition-transform duration-200 ${mobileDropdownOpen ? 'rotate-180' : ''}`}
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div 
                  className="overflow-hidden transition-all duration-300 ease-in-out"
                  style={{
                    maxHeight: mobileDropdownOpen ? '500px' : '0',
                    opacity: mobileDropdownOpen ? 1 : 0
                  }}
                >
                  <div className="ml-4 mt-2 flex flex-col gap-1">
                    {whoWeAreSubmenu.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="text-sm px-4 py-2 transition-all duration-200"
                        style={{ 
                          color: navColors.text,
                          fontFamily: 'var(--font-kollektif)',
                          background: 'transparent'
                        }}
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
                className="text-base font-medium px-4 py-3 rounded-lg transition-all duration-200"
                style={{ 
                  color: navColors.text,
                  fontFamily: 'var(--font-kollektif)',
                  background: 'transparent'
                }}
                onClick={() => setMobileMenuOpen(false)}
              >
                Get Involved
              </Link>
              
              <div className="flex flex-col">
                <button
                  onClick={() => setMobileEventsOpen(!mobileEventsOpen)}
                  className="text-base font-medium px-4 py-3 rounded-lg transition-all duration-200 flex items-center justify-between"
                  style={{ 
                    color: navColors.text,
                    fontFamily: 'var(--font-kollektif)',
                    background: 'transparent'
                  }}
                >
                  <span>Events</span>
                  <svg 
                    className={`w-4 h-4 transition-transform duration-200 ${mobileEventsOpen ? 'rotate-180' : ''}`}
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div 
                  className="overflow-hidden transition-all duration-300 ease-in-out"
                  style={{
                    maxHeight: mobileEventsOpen ? '500px' : '0',
                    opacity: mobileEventsOpen ? 1 : 0
                  }}
                >
                  <div className="ml-4 mt-2 flex flex-col gap-1">
                    {eventsSubmenu.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="text-sm px-4 py-2 transition-all duration-200"
                        style={{ 
                          color: navColors.text,
                          fontFamily: 'var(--font-kollektif)',
                          background: 'transparent'
                        }}
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
                className="text-base font-medium px-4 py-3 rounded-lg transition-all duration-200"
                style={{ 
                  color: navColors.text,
                  fontFamily: 'var(--font-kollektif)',
                  background: 'transparent'
                }}
                onClick={() => setMobileMenuOpen(false)}
              >
                Contact
              </Link>

              {/* Mobile Language Switcher */}
              <div className="border-t border-opacity-20 mt-2 pt-2" style={{ borderColor: navColors.text }}>
                <div className="px-4 py-2 text-sm font-medium" style={{ 
                  color: navColors.text,
                  fontFamily: 'var(--font-kollektif)',
                  opacity: 0.8
                }}>
                  Language
                </div>
                <button
                  onClick={() => handleLanguageChange('en')}
                  className="w-full text-left px-4 py-2 text-base rounded-lg transition-colors"
                  style={{
                    fontFamily: 'var(--font-kollektif)',
                    color: navColors.text,
                    background: language === 'en' ? 'rgba(255, 255, 255, 0.15)' : 'transparent',
                    opacity: language === 'en' ? 1 : 0.7
                  }}
                  onMouseEnter={(e) => {
                    if (language !== 'en') {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'
                      e.currentTarget.style.opacity = '1'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (language !== 'en') {
                      e.currentTarget.style.background = 'transparent'
                      e.currentTarget.style.opacity = '0.7'
                    }
                  }}
                >
                  English
                </button>
                <button
                  onClick={() => handleLanguageChange('fr')}
                  className="w-full text-left px-4 py-2 text-base rounded-lg transition-colors"
                  style={{
                    fontFamily: 'var(--font-kollektif)',
                    color: navColors.text,
                    background: language === 'fr' ? 'rgba(255, 255, 255, 0.15)' : 'transparent',
                    opacity: language === 'fr' ? 1 : 0.7
                  }}
                  onMouseEnter={(e) => {
                    if (language !== 'fr') {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'
                      e.currentTarget.style.opacity = '1'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (language !== 'fr') {
                      e.currentTarget.style.background = 'transparent'
                      e.currentTarget.style.opacity = '0.7'
                    }
                  }}
                >
                  Français
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
