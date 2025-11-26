'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

type NavItem = { href: string; label: string }

const LINKS: NavItem[] = [
  { href: '/', label: 'Home' },
  { href: '/club-info', label: 'Club Info' },
  { href: '/blog', label: 'Blog' },
  { href: '/workshops', label: 'Workshops' },
  { href: '/team', label: 'Team' },
  { href: '/contact', label: 'Contact' },
]

export default function TopNav() {
  const [isHovered, setIsHovered] = useState(false)
  const pathname = usePathname()

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200/50 shadow-sm">
      <div className="max-w-7xl mx-auto px-6">
        {/* Top bar - always visible */}
        <div className="h-16 flex items-center justify-end">
          {/* Menu button with dropdown - hover trigger */}
          <div 
            className="relative"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <button 
              className="text-gray-700 hover:text-gray-900 transition-colors font-medium px-4 py-2 rounded-lg hover:bg-gray-50"
              style={{ fontFamily: 'var(--font-raleway)' }}
            >
              Menu
            </button>

            {/* Dropdown menu - appears on hover with dropdown effect */}
            {isHovered && (
              <div 
                className="absolute right-0 top-full mt-2 w-[90vw] max-w-5xl bg-white/98 backdrop-blur-lg shadow-2xl rounded-2xl border border-gray-200/50 overflow-hidden"
                style={{
                  animation: 'dropdownFadeIn 0.3s ease-out',
                  transformOrigin: 'top right'
                }}
              >
                <div className="py-12 px-8">
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                    {LINKS.map(({ href, label }) => {
                      const active = href === pathname
                      return (
                        <Link
                          key={href}
                          href={href}
                          className={`
                            group relative p-8 rounded-2xl transition-all duration-300 transform
                            ${active 
                              ? 'bg-gradient-to-br from-pink-100 to-pink-50 text-pink-700 shadow-lg scale-105' 
                              : 'bg-gray-50 text-gray-700 hover:bg-gradient-to-br hover:from-pink-50 hover:to-pink-100 hover:text-pink-600 hover:shadow-xl hover:scale-105'
                            }
                          `}
                          style={{ 
                            borderRadius: '30px 30px 30px 30px / 20px 20px 20px 20px'
                          }}
                        >
                          <div className="text-center">
                            <div className={`
                              text-3xl font-bold mb-3 transition-transform duration-300
                              ${active ? 'scale-110' : 'group-hover:scale-110'}
                            `} style={{ fontFamily: 'var(--font-playfair)' }}>
                              {label}
                            </div>
                            {active && (
                              <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 w-12 h-1.5 bg-pink-600 rounded-full"></div>
                            )}
                          </div>
                        </Link>
                      )
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

