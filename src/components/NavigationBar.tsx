'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'

export default function NavigationBar() {
  const [hoveredDropdown, setHoveredDropdown] = useState<string | null>(null)
  const [isFixed, setIsFixed] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      // Nav bar becomes fixed when "Youth 4 Elders" text moves to top (scrollY >= 100)
      // On homepage, nav bar scrolls with page initially, then sticks when text reaches top
      const textMoveThreshold = 100 // Same threshold as in page.tsx for text movement
      const isHomePage = pathname === '/'
      
      if (isHomePage) {
        // On homepage: scroll with page until text reaches top, then fix
        setIsFixed(window.scrollY >= textMoveThreshold)
      } else {
        // On other pages: always fixed
        setIsFixed(true)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll() // Check initial state
    return () => window.removeEventListener('scroll', handleScroll)
  }, [pathname])

  const whoWeAreSubmenu = [
    { href: '/club-info', label: 'Club Info' },
    { href: '/partner', label: 'Partner Page' },
    { href: '/team', label: 'Meet the Team' },
  ]

  // On homepage, nav bar should scroll with page initially, then become fixed
  // On other pages, nav bar is always fixed
  const navPosition = pathname === '/' && !isFixed ? 'relative' : 'fixed'
  
  return (
    <nav 
      className="top-0 left-0 right-0 z-[100] py-6" 
      style={{
        background: 'transparent',
        position: navPosition
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-8 flex items-center justify-center gap-1 sm:gap-2 w-full">
        {/* Left Navigation Buttons - Connected together */}
        <div className="flex items-center flex-shrink-0">
          <Link 
            href="/"
            className="px-4 sm:px-6 py-2.5 text-white text-xs font-medium transition-colors hover:opacity-90 whitespace-nowrap rounded-l-full"
            style={{ background: '#9D7A6B' }}
          >
            <span>home</span>
          </Link>
          
          <div 
            className="relative"
            onMouseEnter={() => setHoveredDropdown('who-we-are')}
            onMouseLeave={() => setHoveredDropdown(null)}
          >
            <Link 
              href="/club-info"
              className="px-4 sm:px-6 py-2.5 text-white text-xs font-medium transition-colors hover:opacity-90 block whitespace-nowrap"
              style={{ background: '#9D7A6B' }}
            >
              <span>who we are</span>
            </Link>
            {/* Dropdown Menu */}
            {hoveredDropdown === 'who-we-are' && (
              <div 
                className="absolute top-full left-0 mt-2 w-48 rounded-lg shadow-xl border-2 z-[110]"
                style={{ 
                  background: '#F8F5ED', 
                  borderColor: '#F8B4CB' 
                }}
              >
                <div className="py-2">
                  {whoWeAreSubmenu.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="block px-4 py-2 text-sm transition-colors"
                      style={{ 
                        color: pathname === item.href ? '#F8B4CB' : '#8B6F5E',
                        background: pathname === item.href ? '#F8B4CB' : 'transparent'
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
            className="px-4 sm:px-6 py-2.5 text-white text-xs font-medium transition-colors hover:opacity-90 whitespace-nowrap rounded-r-full"
            style={{ background: '#9D7A6B' }}
          >
            <span>join us</span>
          </Link>
        </div>

        {/* Logo at center */}
        <div className="flex items-center justify-center flex-shrink-0">
          <Link href="/">
            <Image
              src="/images/Y4E_CLEAR.PNG"
              alt="Youth 4 Elders Logo"
              width={50}
              height={50}
              className="object-contain"
            />
          </Link>
        </div>

        {/* Right Navigation Buttons - Connected together */}
        <div className="flex items-center flex-shrink-0">
          <Link 
            href="/workshops"
            className="px-4 sm:px-6 py-2.5 text-white text-xs font-medium transition-colors hover:opacity-90 whitespace-nowrap rounded-l-full"
            style={{ background: '#9D7A6B' }}
          >
            <span>workshops</span>
          </Link>
          
          <Link 
            href="/events"
            className="px-4 sm:px-6 py-2.5 text-white text-xs font-medium transition-colors hover:opacity-90 whitespace-nowrap"
            style={{ background: '#9D7A6B' }}
          >
            <span>events</span>
          </Link>
          
          <Link 
            href="/contact"
            className="px-4 sm:px-6 py-2.5 text-white text-xs font-medium transition-colors hover:opacity-90 whitespace-nowrap rounded-r-full"
            style={{ background: '#9D7A6B' }}
          >
            <span>contact</span>
          </Link>
        </div>
      </div>
    </nav>
  )
}
