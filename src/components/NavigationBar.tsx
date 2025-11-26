'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'

export default function NavigationBar() {
  const [hoveredDropdown, setHoveredDropdown] = useState<string | null>(null)
  const [isVisible, setIsVisible] = useState(true)
  const lastScrollY = useRef(0)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      
      // Text position animation completes around scrollY = 100
      // Only enable hide/show AFTER text has fully reached its final position
      // Add a buffer (150px) to ensure animation is fully complete
      const textAnimationComplete = currentScrollY >= 150
      
      if (textAnimationComplete) {
        // Text has fully reached its position, now enable hide/show behavior
        if (currentScrollY < lastScrollY.current) {
          // Scrolling up - show nav bar
          setIsVisible(true)
        } else if (currentScrollY > lastScrollY.current && currentScrollY > 200) {
          // Scrolling down and past threshold - hide nav bar
          setIsVisible(false)
        }
      } else {
        // Before text animation is complete, always show
        setIsVisible(true)
      }
      
      // Always show at the very top
      if (currentScrollY < 10) {
        setIsVisible(true)
      }
      
      lastScrollY.current = currentScrollY
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const whoWeAreSubmenu = [
    { href: '/club-info', label: 'Club Info' },
    { href: '/partner', label: 'Partner Page' },
    { href: '/team', label: 'Meet the Team' },
  ]
  
  return (
    <nav 
      className="fixed top-0 left-0 right-0 z-[100] py-6 transition-transform duration-300 ease-in-out"
      style={{
        background: '#F8F5ED',
        transform: isVisible ? 'translateY(0)' : 'translateY(-100%)',
        willChange: 'transform'
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
