'use client'

import { useEffect, useState, ReactNode } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Image from 'next/image' // <-- ADDED THIS IMPORT

type NavItem = { href: string; label: string; icon: ReactNode }

const ICON = {
  home: (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 11.5l9-7 9 7M5 10.5V20a1 1 0 001 1h12a1 1 0 001-1v-9.5" />
    </svg>
  ),
  info: (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8h.01M11 12h1v4m8-2a8 8 0 11-16 0 8 8 0 0116 0z" />
    </svg>
  ),
  blog: (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 6h8M8 10h8M8 14h5M4 5a2 2 0 012-2h12a2 2 0 012 2v14l-4-2-4 2-4-2-4 2V5z" />
    </svg>
  ),
  workshop: (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5v14M4 4h16v16H4z" />
    </svg>
  ),
  team: (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path strokeLinecap="round" strokeLinejoin="round" d="M16 11a4 4 0 10-8 0m-3 8a7 7 0 0114 0" />
    </svg>
  ),
  contact: (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 8V6a2 2 0 00-2-2H5a2 2 0 00-2 2v2m18 0v10a2 2 0 01-2 2H5a2 2 0 01-2-2V8m18 0l-8 5-8-5" />
    </svg>
  ),
}

const LINKS: NavItem[] = [
  { href: '/', label: 'Home', icon: ICON.home },
  { href: '/club-info', label: 'Club Info', icon: ICON.info },
  { href: '/blog', label: 'Blog', icon: ICON.blog },
  { href: '/workshops', label: 'Workshops', icon: ICON.workshop },
  { href: '/team', label: 'Team', icon: ICON.team },
  { href: '/contact', label: 'Contact', icon: ICON.contact },
]

export default function MenuBar() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const toggleMenu = () => setOpen(!open)

  // Close the menu when navigating to a new page
  useEffect(() => setOpen(false), [pathname])

  // Prevent background scrolling when menu is open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
        document.body.style.overflow = ''
    }
  }, [open])

  return (
    <>
      {/* 1. Universal menu toggle button (Styled for a circular, minimal look) */}
      {!open && (
        <button
          onClick={toggleMenu}
          className="fixed top-4 left-4 z-50 
                     w-11 h-11 flex items-center justify-center 
                     rounded-full border border-gray-300/50 
                     bg-white/70 text-gray-800 shadow-md backdrop-blur-sm 
                     hover:bg-white hover:shadow-lg hover:scale-105
                     transition-all duration-200 ease-out"
          aria-label="Toggle menu"
        >
          {/* Menu Icon (Hamburger) */}
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      )}
      
      {/* 4. Sticky Top-Right Icon */}
      <div 
        className={[
            'fixed top-4 right-4 z-50', 
            // Hide the icon when the menu is open to prevent visual clutter
            open ? 'opacity-0 pointer-events-none' : 'opacity-100',
            'transition-opacity duration-300'
        ].join(' ')}
      >
        {/* We use a div instead of a button since it's just branding/decoration */}
        <div className="w-11 h-11 rounded-full overflow-hidden shadow-md">
            <Image 
                src="/images/Y4E_CLEAR.PNG" 
                alt="Youth 4 Elders Club Logo/Icon" 
                width={44} // 44px = w-11
                height={44} // 44px = h-11
                className="w-full h-full object-cover"
            />
        </div>
      </div>
      {/* --- */}


      {/* 2. Full-screen Overlay/Backdrop (Works on ALL screens when menu is open) */}
      {open && (
        <button
          onClick={toggleMenu}
          aria-label="Close menu"
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[4px]"
        />
      )}

      {/* 3. Sidebar (FIXED and overlaying content) */}
      <aside
        className={[
          'fixed top-0 left-0 z-50 h-full w-72',
          'bg-white/90 backdrop-blur-xl border-r border-white/50 shadow-2xl',
          'bg-gradient-to-b from-pink-50/70 via-white/70 to-orange-50/70',
          'transition-transform duration-300',
          open ? 'translate-x-0' : '-translate-x-full',
        ].join(' ')}
      >
        {/* Sidebar Header/Logo */}
        <div className="p-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              {/* Close button */}
              <button 
                onClick={toggleMenu}
                aria-label="Close sidebar"
                className="w-8 h-8 flex items-center justify-center rounded-full text-gray-500 hover:text-gray-700 transition"
              >
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
              </button>
              <div className="leading-tight">
                <h1 className="text-sm font-semibold tracking-wide text-gray-900">
                  YOUTH 4 ELDERS
                </h1>
                <p className="text-xs text-gray-500">uOttawa</p>
              </div>
            </div>
        </div>
        
        {/* Navigation Links */}
        <nav className="px-4 py-6">
          <ul className="space-y-1 list-none">
            {LINKS.map(({ href, label, icon }) => {
              const active = href === pathname
              return (
                <li key={href}>
                  <Link
                    href={href}
                    className={[
                      'no-underline flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition-all',
                      active
                        ? 'bg-white shadow-sm ring-1 ring-pink-200/70 text-pink-700'
                        : 'text-gray-700 hover:bg-white/80 hover:shadow-sm',
                    ].join(' ')}
                    onClick={toggleMenu} // Always close menu after clicking a link
                  >
                    <span
                      className={[
                        'inline-flex h-7 w-7 items-center justify-center rounded-lg',
                        active
                          ? 'bg-pink-100 text-pink-700'
                          : 'bg-white/70 text-gray-700',
                      ].join(' ')}
                    >
                      {icon}
                    </span>
                    {label}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>
      </aside>
    </>
  )
}

