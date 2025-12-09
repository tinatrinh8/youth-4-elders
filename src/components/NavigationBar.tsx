'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'

export default function NavigationBar() {
  const [hoveredDropdown, setHoveredDropdown] = useState<string | null>(null)
  const [isClosing, setIsClosing] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [mobileDropdownOpen, setMobileDropdownOpen] = useState(false)
  const pathname = usePathname()
  const isJoinUsPage = pathname === '/join-us'
  
  // Set page background behind nav - no animation when leaving join-us page
  useEffect(() => {
    if (!isJoinUsPage) {
      // When leaving join-us page or on other pages
      // Set background immediately without transition
      document.body.style.background = 'var(--color-cream)'
      document.documentElement.style.background = 'var(--color-cream)'
      // Remove transition for instant change
      document.body.style.transition = 'none'
      document.documentElement.style.transition = 'none'
    }
    // Note: join-us page manages its own background with animation
  }, [isJoinUsPage])

  const whoWeAreSubmenu = [
    { href: '/club-info', label: 'Club Info' },
    { href: '/partner', label: 'Partner Page' },
    { href: '/team', label: 'Meet the Team' },
  ]
  
  return (
    <nav 
      className="relative z-[100] py-2 md:py-3 nav-mobile-margins"
      style={{
        background: 'var(--color-brown-dark)',
        borderRadius: '9999px',
        border: 'none',
        marginLeft: '96px',
        marginRight: '96px',
        marginTop: '40px',
        marginBottom: '16px',
        boxShadow: '0 4px 12px rgba(100, 50, 27, 0.15)'
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-8 flex items-center justify-between w-full">
        {/* Logo on the left */}
        <div className="flex items-center flex-shrink-0">
          <Link href="/" className="flex items-center">
            <Image
              src="/images/Y4E_CLEAR.PNG"
              alt="Youth 4 Elders Logo"
              width={40}
              height={40}
              className="object-contain mr-2"
            />
            <span 
              className="text-xl md:text-2xl font-bold italic"
              style={{ 
                fontFamily: 'var(--font-vintage-stylist)', 
                color: 'var(--color-cream)'
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
            color: 'var(--color-cream)',
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
            className="text-sm md:text-base font-medium transition-all duration-200 whitespace-nowrap px-3 py-2"
            style={{ 
              color: 'var(--color-cream)',
              fontFamily: 'var(--font-kollektif)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = 'var(--color-brown-medium)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'var(--color-cream)'
            }}
          >
            Home
          </Link>
          
          <div 
            className="relative"
            onMouseEnter={() => {
              setIsClosing(false)
              setHoveredDropdown('who-we-are')
            }}
            onMouseLeave={() => {
              if (hoveredDropdown === 'who-we-are') {
                setIsClosing(true)
                setTimeout(() => {
                  setHoveredDropdown(null)
                  setIsClosing(false)
                }, 300) // Match animation duration
              }
            }}
          >
            <div 
              className="text-sm md:text-base font-medium transition-all duration-200 whitespace-nowrap px-3 py-2 flex items-center gap-1 cursor-pointer"
              style={{ 
                color: hoveredDropdown === 'who-we-are' ? 'var(--color-brown-medium)' : 'var(--color-cream)',
                fontFamily: 'var(--font-kollektif)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = 'var(--color-brown-medium)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'var(--color-cream)'
              }}
            >
              Who We Are
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
            {/* Invisible bridge to prevent gap issues */}
            {(hoveredDropdown === 'who-we-are' || isClosing) && (
              <div 
                className="absolute top-full left-0 right-0 h-2 z-[109]"
                style={{ marginTop: '-2px' }}
                onMouseEnter={() => {
                  setIsClosing(false)
                  setHoveredDropdown('who-we-are')
                }}
              />
            )}
            {/* Dropdown Menu */}
            {(hoveredDropdown === 'who-we-are' || isClosing) && (
              <div 
                className="absolute top-full left-0 w-56 rounded-2xl shadow-xl z-[110] overflow-hidden"
                style={{ 
                  background: 'var(--color-cream)', 
                  border: '1px solid var(--color-brown-medium)',
                  boxShadow: '0 8px 24px rgba(100, 50, 27, 0.2)',
                  marginTop: '8px',
                  animation: isClosing ? 'dropdownRollIn 0.3s ease-in' : 'dropdownRollOut 0.3s ease-out',
                  transformOrigin: 'top'
                }}
                onMouseEnter={() => {
                  setIsClosing(false)
                  setHoveredDropdown('who-we-are')
                }}
              >
                <div className="py-2">
                  {whoWeAreSubmenu.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="block px-4 py-3 text-sm transition-all duration-200"
                      style={{ 
                        color: 'var(--color-brown-medium)',
                        fontFamily: 'var(--font-kollektif)',
                        background: 'transparent'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(152, 90, 64, 0.1)'
                        e.currentTarget.style.color = 'var(--color-brown-dark)'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'transparent'
                        e.currentTarget.style.color = 'var(--color-brown-medium)'
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
            className="text-sm md:text-base font-medium transition-all duration-200 whitespace-nowrap px-3 py-2"
            style={{ 
              color: 'var(--color-cream)',
              fontFamily: 'var(--font-kollektif)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = 'var(--color-brown-medium)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'var(--color-cream)'
            }}
          >
            Get Involved
          </Link>
          
          <Link 
            href="/events"
            className="text-sm md:text-base font-medium transition-all duration-200 whitespace-nowrap px-3 py-2"
            style={{ 
              color: 'var(--color-cream)',
              fontFamily: 'var(--font-kollektif)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = 'var(--color-brown-medium)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'var(--color-cream)'
            }}
          >
            Events
          </Link>
          
          <Link 
            href="/contact"
            className="text-sm md:text-base font-medium transition-all duration-200 whitespace-nowrap px-3 py-2"
            style={{ 
              color: 'var(--color-cream)',
              fontFamily: 'var(--font-kollektif)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = 'var(--color-brown-medium)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'var(--color-cream)'
            }}
          >
            Contact
          </Link>
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
            background: 'var(--color-brown-dark)',
            boxShadow: '-4px 0 24px rgba(0, 0, 0, 0.3)'
          }}
        >
          <div className="flex flex-col h-full p-6 overflow-y-auto">
            {/* Mobile Menu Header */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center">
                <Image
                  src="/images/Y4E_CLEAR.PNG"
                  alt="Youth 4 Elders Logo"
                  width={32}
                  height={32}
                  className="object-contain mr-2"
                />
                <span 
                  className="text-lg font-bold italic"
                  style={{ 
                    fontFamily: 'var(--font-vintage-stylist)', 
                    color: 'var(--color-cream)'
                  }}
                >
                  Youth 4 Elders
                </span>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full"
                style={{ color: 'var(--color-cream)' }}
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
                  color: 'var(--color-cream)',
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
                    color: 'var(--color-cream)',
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
                          color: 'var(--color-cream)',
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
                  color: 'var(--color-cream)',
                  fontFamily: 'var(--font-kollektif)',
                  background: 'transparent'
                }}
                onClick={() => setMobileMenuOpen(false)}
              >
                Get Involved
              </Link>
              
              <Link 
                href="/events"
                className="text-base font-medium px-4 py-3 rounded-lg transition-all duration-200"
                style={{ 
                  color: 'var(--color-cream)',
                  fontFamily: 'var(--font-kollektif)',
                  background: 'transparent'
                }}
                onClick={() => setMobileMenuOpen(false)}
              >
                Events
              </Link>
              
              <Link 
                href="/contact"
                className="text-base font-medium px-4 py-3 rounded-lg transition-all duration-200"
                style={{ 
                  color: 'var(--color-cream)',
                  fontFamily: 'var(--font-kollektif)',
                  background: 'transparent'
                }}
                onClick={() => setMobileMenuOpen(false)}
              >
                Contact
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
