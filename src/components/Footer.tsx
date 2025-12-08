'use client'

import Link from 'next/link'
import Image from 'next/image'

export default function Footer() {
  return (
    <footer className="mt-auto relative" style={{ background: 'var(--color-brown-dark)' }}>
      <div className="max-w-7xl mx-auto px-8 py-16 md:py-20">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16 mb-12">
          {/* Left Side - Call to Action */}
          <div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6" style={{ fontFamily: 'var(--font-vintage-stylist)', color: 'var(--color-cream)' }}>
              Ready to Make a Difference?
            </h2>
          </div>

          {/* Right Side - Quick Links */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 md:gap-12">
            {/* Get Around Section */}
            <div>
              <h3 className="text-sm font-black uppercase tracking-wider mb-4" style={{ fontFamily: 'var(--font-leiko)', color: 'var(--color-cream)' }}>
                GET AROUND
              </h3>
              <ul className="space-y-3">
                <li>
                  <Link
                    href="/"
                    className="text-base italic transition-all duration-300"
                    style={{ fontFamily: 'var(--font-leiko)', color: 'var(--color-cream)', opacity: 0.9 }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.opacity = '1'
                      e.currentTarget.style.color = 'var(--color-pink-medium)'
                      e.currentTarget.style.transform = 'translateX(4px)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.opacity = '0.9'
                      e.currentTarget.style.color = 'var(--color-cream)'
                      e.currentTarget.style.transform = 'translateX(0)'
                    }}
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    href="/club-info"
                    className="text-base italic transition-all duration-300"
                    style={{ fontFamily: 'var(--font-leiko)', color: 'var(--color-cream)', opacity: 0.9 }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.opacity = '1'
                      e.currentTarget.style.color = 'var(--color-pink-medium)'
                      e.currentTarget.style.transform = 'translateX(4px)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.opacity = '0.9'
                      e.currentTarget.style.color = 'var(--color-cream)'
                      e.currentTarget.style.transform = 'translateX(0)'
                    }}
                  >
                    Club Info
                  </Link>
                </li>
                <li>
                  <Link
                    href="/events"
                    className="text-base italic transition-all duration-300"
                    style={{ fontFamily: 'var(--font-leiko)', color: 'var(--color-cream)', opacity: 0.9 }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.opacity = '1'
                      e.currentTarget.style.color = 'var(--color-pink-medium)'
                      e.currentTarget.style.transform = 'translateX(4px)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.opacity = '0.9'
                      e.currentTarget.style.color = 'var(--color-cream)'
                      e.currentTarget.style.transform = 'translateX(0)'
                    }}
                  >
                    Events
                  </Link>
                </li>
                <li>
                  <Link
                    href="/join-us"
                    className="text-base italic transition-all duration-300"
                    style={{ fontFamily: 'var(--font-leiko)', color: 'var(--color-cream)', opacity: 0.9 }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.opacity = '1'
                      e.currentTarget.style.color = 'var(--color-pink-medium)'
                      e.currentTarget.style.transform = 'translateX(4px)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.opacity = '0.9'
                      e.currentTarget.style.color = 'var(--color-cream)'
                      e.currentTarget.style.transform = 'translateX(0)'
                    }}
                  >
                    Get Involved
                  </Link>
                </li>
              </ul>
            </div>

            {/* Connect Section */}
            <div>
              <h3 className="text-sm font-black uppercase tracking-wider mb-4" style={{ fontFamily: 'var(--font-leiko)', color: 'var(--color-cream)' }}>
                CONNECT
              </h3>
              <ul className="space-y-3">
                <li>
                  <a
                    href="https://www.instagram.com/youth4elders/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-base italic transition-all duration-300"
                    style={{ fontFamily: 'var(--font-leiko)', color: 'var(--color-cream)', opacity: 0.9 }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.opacity = '1'
                      e.currentTarget.style.color = 'var(--color-pink-medium)'
                      e.currentTarget.style.transform = 'translateX(4px)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.opacity = '0.9'
                      e.currentTarget.style.color = 'var(--color-cream)'
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
                    className="text-base italic transition-all duration-300"
                    style={{ fontFamily: 'var(--font-leiko)', color: 'var(--color-cream)', opacity: 0.9 }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.opacity = '1'
                      e.currentTarget.style.color = 'var(--color-pink-medium)'
                      e.currentTarget.style.transform = 'translateX(4px)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.opacity = '0.9'
                      e.currentTarget.style.color = 'var(--color-cream)'
                      e.currentTarget.style.transform = 'translateX(0)'
                    }}
                  >
                    LinkedIn
                  </a>
                </li>
                <li>
                  <a
                    href="mailto:youth4elders@gmail.com"
                    className="text-base italic transition-all duration-300"
                    style={{ fontFamily: 'var(--font-leiko)', color: 'var(--color-cream)', opacity: 0.9 }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.opacity = '1'
                      e.currentTarget.style.color = 'var(--color-pink-medium)'
                      e.currentTarget.style.transform = 'translateX(4px)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.opacity = '0.9'
                      e.currentTarget.style.color = 'var(--color-cream)'
                      e.currentTarget.style.transform = 'translateX(0)'
                    }}
                  >
                    Email
                  </a>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="text-base italic transition-all duration-300"
                    style={{ fontFamily: 'var(--font-leiko)', color: 'var(--color-cream)', opacity: 0.9 }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.opacity = '1'
                      e.currentTarget.style.color = 'var(--color-pink-medium)'
                      e.currentTarget.style.transform = 'translateX(4px)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.opacity = '0.9'
                      e.currentTarget.style.color = 'var(--color-cream)'
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
        <div className="pt-8 border-t" style={{ borderColor: 'rgba(247, 240, 227, 0.2)' }}>
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Copyright */}
            <div className="text-center md:text-left">
              <p className="text-sm" style={{ fontFamily: 'var(--font-kollektif)', color: 'var(--color-cream)', opacity: 0.8 }}>
                © 2025 Youth 4 Elders. All rights reserved.
              </p>
            </div>

            {/* Logo */}
            <div className="flex-shrink-0">
              <Image
                src="/images/Y4E_OFFICIAL.PNG"
                alt="Youth 4 Elders Logo"
                width={80}
                height={80}
                className="object-contain opacity-80 hover:opacity-100 transition-opacity duration-300"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Scroll to Top Button */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-8 right-8 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-lg z-50"
        style={{
          background: 'var(--color-brown-dark)',
          border: '2px solid var(--color-cream)',
          color: 'var(--color-cream)'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'var(--color-pink-medium)'
          e.currentTarget.style.borderColor = 'var(--color-pink-medium)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'var(--color-brown-dark)'
          e.currentTarget.style.borderColor = 'var(--color-cream)'
        }}
        aria-label="Scroll to top"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      </button>
    </footer>
  )
}

