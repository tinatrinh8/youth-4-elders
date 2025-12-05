'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'

export default function NavigationBar() {
  const [hoveredDropdown, setHoveredDropdown] = useState<string | null>(null)
  const [isClosing, setIsClosing] = useState(false)

  const whoWeAreSubmenu = [
    { href: '/club-info', label: 'Club Info' },
    { href: '/partner', label: 'Partner Page' },
    { href: '/team', label: 'Meet the Team' },
  ]
  
  return (
    <nav 
      className="relative z-[100] py-2 md:py-3"
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

        {/* Navigation links on the right */}
        <div className="flex items-center gap-6 md:gap-8 relative">
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
            Join Us
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
      </div>
    </nav>
  )
}
