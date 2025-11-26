'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { 
    label: 'Who We Are',
    submenu: [
      { href: '/club-info', label: 'Club Info' },
      { href: '/partner', label: 'Partner Page' },
      { href: '/team', label: 'Meet the Team' },
    ]
  },
  { href: '/join-us', label: 'Join Us' },
  { href: '/events', label: 'Upcoming Events' },
  { href: '/workshops', label: 'Workshops' },
  { href: '/contact', label: 'Contact' },
]

export default function MenuButton() {
  const [isMenuHovered, setIsMenuHovered] = useState(false)
  const [isClosing, setIsClosing] = useState(false)
  const [hoveredSubmenu, setHoveredSubmenu] = useState<string | null>(null)
  const pathname = usePathname()

  // Handle smooth fade-out animation
  useEffect(() => {
    if (!isMenuHovered) {
      // Start closing animation
      setIsClosing(true)
      // Remove from DOM after animation completes
      const timer = setTimeout(() => {
        setIsClosing(false)
      }, 400) // Slightly longer than animation duration
      return () => clearTimeout(timer)
    } else {
      // If menu is hovered again, cancel closing
      setIsClosing(false)
    }
  }, [isMenuHovered])

  const handleMenuClose = () => {
    setIsMenuHovered(false)
  }

  const showMenu = isMenuHovered || isClosing

  return (
    <>
      {/* Menu Button - Small circular icon in top right */}
      <div 
        className="fixed top-4 right-6 z-[101]"
        onMouseEnter={() => setIsMenuHovered(true)}
      >
        <button 
          className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 shadow-md hover:shadow-lg"
          style={{ 
            background: '#9D7A6B',
            color: '#F8F5ED'
          }}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round">
            <path d="M3 6h18M3 12h18M3 18h18"/>
          </svg>
        </button>
      </div>

      {/* Dropdown menu - appears on hover, opens from top down */}
      {showMenu && (
        <>
          {/* Backdrop overlay - closes menu when hovered */}
          <div 
            className="fixed inset-0 bg-black/10 backdrop-blur-sm z-40"
            style={{
              animation: isClosing ? 'dropdownFadeOut 0.3s ease-out forwards' : 'dropdownFadeIn 0.3s ease-out',
              opacity: isClosing ? 0 : 1
            }}
            onMouseEnter={handleMenuClose}
          />
          
          {/* Dropdown menu content - opens from top of screen */}
          <div 
            className="fixed top-0 left-0 right-0 backdrop-blur-lg shadow-2xl border-b-2 z-50"
            style={{
              background: '#F8F5ED',
              borderColor: '#F8B4CB',
              animation: isClosing ? 'dropdownFadeOut 0.3s ease-out forwards' : 'dropdownFadeIn 0.3s ease-out',
              transformOrigin: 'top center',
              overflow: 'visible',
              opacity: isClosing ? 0 : 1,
              transform: isClosing ? 'translateY(-20px)' : 'translateY(0)'
            }}
            onMouseEnter={() => {
              setIsMenuHovered(true)
              setIsClosing(false)
            }}
            onMouseLeave={handleMenuClose}
          >
            <div className="w-full px-12 py-16" style={{ overflow: 'visible' }}>
              {/* Menu Header */}
              <div className="mb-12 text-center">
                <h2 className="text-3xl md:text-4xl font-bold mb-2" style={{ fontFamily: 'var(--font-playfair)', color: '#6B5D4F' }}>
                  Navigation
                </h2>
                <p className="text-base" style={{ fontFamily: 'var(--font-raleway)', color: '#9D7A6B' }}>
                  Explore our site
                </p>
              </div>

              {/* Main Navigation - Horizontal Layout spread out */}
              <div className="flex items-center justify-between gap-6 overflow-visible pb-20 hide-scrollbar w-full" style={{ overflow: 'visible' }}>
                {NAV_LINKS.map((item) => {
                  const hasSubmenu = 'submenu' in item
                  const isActive = !hasSubmenu && item.href === pathname
                  const isSubmenuActive = hasSubmenu && item.submenu?.some(sub => sub.href === pathname)
                  const isHovered = hoveredSubmenu === item.label

                  return (
                    <div
                      key={item.label}
                      className="relative flex-shrink-0"
                      onMouseEnter={() => hasSubmenu && setHoveredSubmenu(item.label)}
                      onMouseLeave={() => hasSubmenu && setHoveredSubmenu(null)}
                    >
                      {hasSubmenu ? (
                        <div
                          className="group relative cursor-pointer whitespace-nowrap flex-1 min-w-fit"
                        >
                          {/* Pink vertical bar background */}
                          <div className={`
                            absolute left-0 top-0 bottom-0 w-2 rounded-full transition-all duration-300
                            ${isSubmenuActive || isHovered
                              ? 'bg-[#F8B4CB]' 
                              : 'bg-[#F0C8B9]/50 group-hover:bg-[#F8B4CB]'
                            }
                          `} style={{ marginLeft: '-8px' }}></div>
                          
                          <div className="flex items-center gap-3 px-4 py-3">
                            <div className={`
                              text-xl md:text-2xl font-bold transition-all duration-300
                              ${isSubmenuActive || isHovered
                                ? 'text-[#F8B4CB]' 
                                : 'text-[#8B6F5E] group-hover:text-[#F8B4CB]'
                              }
                            `} style={{ fontFamily: 'var(--font-playfair)' }}>
                              {item.label}
                            </div>
                            {isSubmenuActive && (
                              <div className="absolute bottom-0 left-0 right-0 h-1 rounded-full" style={{ background: '#F8B4CB' }}></div>
                            )}
                            <svg 
                              className={`w-5 h-5 transition-all duration-300 ${isHovered ? 'rotate-90' : ''}`}
                              style={{ color: isHovered ? '#F8B4CB' : '#7A5C5C' }} 
                              fill="none" 
                              stroke="currentColor" 
                              viewBox="0 0 24 24"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </div>
                          
                          {/* Submenu Dropdown */}
                          {isHovered && item.submenu && (
                            <div 
                              className="absolute left-0 top-full mt-2 w-64 rounded-xl shadow-2xl border-2 z-[60] p-4"
                              style={{
                                background: '#F8F5ED',
                                borderColor: '#F8B4CB',
                                animation: 'dropdownFadeIn 0.2s ease-out',
                                transformOrigin: 'top center',
                                marginTop: '8px',
                                position: 'absolute',
                                top: '100%',
                                left: '0'
                              }}
                              onMouseEnter={() => {
                                setHoveredSubmenu(item.label)
                                setIsMenuHovered(true)
                              }}
                              onMouseLeave={() => setHoveredSubmenu(null)}
                            >
                              <div className="space-y-2">
                                {item.submenu.map((subItem) => {
                                  const subActive = subItem.href === pathname
                                  return (
                                    <Link
                                      key={subItem.href}
                                      href={subItem.href}
                                      className={`
                                        block p-4 rounded-lg transition-all duration-200
                                        ${subActive
                                          ? 'font-semibold'
                                          : ''
                                        }
                                      `}
                                      style={{
                                        background: subActive ? '#F8B4CB' : 'transparent',
                                        color: subActive ? '#F8F5ED' : '#9D7A6B'
                                      }}
                                      onMouseEnter={(e) => {
                                        if (!subActive) {
                                          e.currentTarget.style.background = '#F0C8B9'
                                          e.currentTarget.style.color = '#7A5C5C'
                                        }
                                      }}
                                      onMouseLeave={(e) => {
                                        if (!subActive) {
                                          e.currentTarget.style.background = 'transparent'
                                          e.currentTarget.style.color = '#9D7A6B'
                                        }
                                      }}
                                    >
                                      {subItem.label}
                                    </Link>
                                  )
                                })}
                              </div>
                            </div>
                          )}
                        </div>
                      ) : (
                        <Link
                          href={item.href}
                          className="group relative cursor-pointer whitespace-nowrap flex-1 min-w-fit"
                        >
                              {/* Pink vertical bar background */}
                              <div className={`
                                absolute left-0 top-0 bottom-0 w-2 rounded-full transition-all duration-300
                                ${isActive
                                  ? 'bg-[#F8B4CB]' 
                                  : 'bg-[#F0C8B9]/50 group-hover:bg-[#F8B4CB]'
                                }
                              `} style={{ marginLeft: '-8px' }}></div>
                          
                          <div className="flex items-center gap-3 px-4 py-3 relative">
                                <div className={`
                                  text-xl md:text-2xl font-bold transition-all duration-300
                                  ${isActive
                                    ? 'text-[#F8B4CB]' 
                                    : 'text-[#8B6F5E] group-hover:text-[#F8B4CB]'
                                  }
                                `} style={{ fontFamily: 'var(--font-playfair)' }}>
                                  {item.label}
                                </div>
                                {isActive && (
                                  <div className="absolute bottom-0 left-0 right-0 h-1 rounded-full" style={{ background: '#F8B4CB' }}></div>
                                )}
                                <svg className="w-5 h-5 transition-colors flex-shrink-0" style={{ color: '#9D7A6B' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </div>
                        </Link>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  )
}

