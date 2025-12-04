'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

export default function Home() {
  const [showModal, setShowModal] = useState(false)
  const [isClosing, setIsClosing] = useState(false)

  useEffect(() => {
    // Show modal after 6 seconds on page load
    const timer = setTimeout(() => {
      setShowModal(true)
    }, 6000)
    return () => clearTimeout(timer)
  }, [])

  const handleClose = () => {
    setIsClosing(true)
    setTimeout(() => {
      setShowModal(false)
      setIsClosing(false)
    }, 400) // Match animation duration
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // Handle form submission here
    handleClose()
  }

  return (
    <div className="min-h-screen">
      {/* Launch Signup Modal */}
      {showModal && (
        <div 
          className={`fixed inset-0 z-[200] flex items-center justify-center p-4 backdrop-blur-md ${isClosing ? 'animate-fadeOut' : 'animate-fadeIn'}`}
          style={{ background: 'rgba(244, 142, 184, 0.6)' }}
          onClick={handleClose}
        >
          <div 
            className={`relative max-w-md w-full rounded-lg p-8 shadow-2xl ${isClosing ? 'animate-popout' : 'animate-popup'}`}
            style={{ 
              background: 'var(--color-cream)',
              border: '2px solid var(--color-brown-dark)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Headline */}
            <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ fontFamily: 'var(--font-vintage-stylist)', color: 'var(--color-brown-dark)' }}>
              Intergenerational
              <br />
              connections for youth
              <br />
              and elders
            </h2>

            {/* Body Text */}
            <p className="text-base md:text-lg mb-6 leading-relaxed" style={{ fontFamily: 'var(--font-leiko)', color: 'var(--color-brown-dark)' }}>
              Youth 4 Elders brings together passionate students, caring elders, and meaningful connections—all in one welcoming, supportive space. Come experience the joy of bridging generations and making a positive impact in your community.
            </p>

            {/* Email Form */}
            <form onSubmit={handleSubmit}>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="you@email.com"
                  required
                  className="flex-1 px-4 py-3 rounded-lg border-2 focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-200"
                  style={{ 
                    borderColor: 'var(--color-brown-dark)',
                    fontFamily: 'var(--font-kollektif)',
                    background: 'white'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = 'var(--color-pink-medium)'
                    e.target.style.boxShadow = '0 0 0 3px rgba(244, 142, 184, 0.1)'
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'var(--color-brown-dark)'
                    e.target.style.boxShadow = 'none'
                  }}
                />
                <button
                  type="submit"
                  className="w-12 h-12 rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-110"
                  style={{ 
                    background: 'var(--color-brown-dark)',
                    color: 'white'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'var(--color-pink-medium)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'var(--color-brown-dark)'
                  }}
                  aria-label="Submit"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
          </div>
            </form>

            {/* No Thanks Link */}
            <button
              onClick={handleClose}
              className="mt-4 text-sm transition-colors duration-200 hover:opacity-70 w-full text-center"
              style={{ 
                fontFamily: 'var(--font-kollektif)', 
                color: 'var(--color-brown-dark)',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                textDecoration: 'underline'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = 'var(--color-pink-medium)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'var(--color-brown-dark)'
              }}
            >
              Maybe Another Time :)
            </button>
          </div>
          </div>
        )}
      
      {/* Hero Section - Large Text Overlay Style */}
      <section 
        className="relative overflow-hidden" 
        style={{ 
          background: 'transparent',
          height: '120vh',
          minHeight: '120vh',
          borderTop: 'none',
          borderLeft: 'none',
          borderRight: 'none',
          borderBottom: 'none',
          borderRadius: '0',
          marginLeft: '0',
          marginRight: '0',
          marginTop: '0',
          paddingTop: '0',
          padding: '0'
        }}
      >
        {/* Background Image */}
        <div className="absolute inset-0 w-full h-full" style={{ 
          borderRadius: '24px',
          overflow: 'hidden',
          marginLeft: '16px',
          marginRight: '16px',
          marginTop: '40px',
          marginBottom: '80px',
          width: 'calc(100% - 32px)',
          height: 'calc(100% - 120px)',
          top: '0'
        }}>
          <Image
            src="/assets/header.jpg"
            alt="Youth 4 Elders"
            fill
            className="object-cover"
            priority
            style={{ objectPosition: 'center bottom' }}
          />
          {/* Overlay for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-transparent" />
        </div>

        {/* Large Marketing Text - Upper Right */}
        <div className="absolute top-20 right-8 md:right-12 z-20 max-w-lg text-right">
          <p className="text-lg md:text-xl lg:text-2xl font-bold leading-tight tracking-tight" style={{ 
            fontFamily: 'var(--font-leiko)', 
            color: '#985A40',
            textShadow: '2px 2px 4px rgba(0,0,0,0.1)'
          }}>
            we create meaningful
            connections that bridge
            generations for better
          </p>
        </div>

        {/* Large Elegant Script "Youth 4 Elders" - Overlaying the images */}
        <div className="absolute bottom-0 left-0 right-0 z-30 pointer-events-none" style={{ marginBottom: '-60px' }}>
          <h1 
            className="text-[10rem] md:text-[12rem] lg:text-[16rem] font-bold italic leading-none"
            style={{ 
              fontFamily: 'var(--font-vintage-stylist)', 
              color: '#985A40',
              textShadow: '2px 2px 8px rgba(0,0,0,0.1)',
              mixBlendMode: 'normal',
              opacity: 1
            }}
          >
            Youth 4 Elders
          </h1>
        </div>

      </section>

      {/* "Nothing great is built alone" Section with Role Tags */}
      <section className="relative z-10 py-32 md:py-48" style={{ background: '#985A40' }}>
        <div className="max-w-7xl mx-auto px-8">
          {/* Main Headline with Role Tags */}
          <div className="relative text-center mb-20 md:mb-28">
            {/* Role Tags positioned around headline */}
            <div className="absolute -top-4 left-0 md:left-8 animate-float" style={{ animationDelay: '0s' }}>
              <span className="px-3 py-1 rounded-full text-sm font-medium border-2" style={{ 
                borderColor: 'var(--color-pink-medium)', 
                color: 'var(--color-cream)',
                fontFamily: 'var(--font-kollektif)',
                background: 'var(--color-pink-light)'
              }}>
                <span style={{ color: 'var(--color-pink-medium)' }}>+</span> VOLUNTEER
              </span>
            </div>
            <div className="absolute -bottom-4 left-0 md:left-8 animate-float" style={{ animationDelay: '0.5s' }}>
              <span className="px-3 py-1 rounded-full text-sm font-medium border-2" style={{ 
                borderColor: 'var(--color-pink-medium)', 
                color: 'var(--color-cream)',
                fontFamily: 'var(--font-lato)',
                background: 'var(--color-pink-light)'
              }}>
                <span style={{ color: 'var(--color-pink-medium)' }}>+</span> WORKSHOPS
              </span>
            </div>
            <div className="absolute -bottom-4 right-0 md:right-8 animate-float" style={{ animationDelay: '1s' }}>
              <span className="px-3 py-1 rounded-full text-sm font-medium border-2" style={{ 
                borderColor: 'var(--color-pink-medium)', 
                color: 'var(--color-cream)',
                fontFamily: 'var(--font-lato)',
                background: 'var(--color-pink-light)'
              }}>
                <span style={{ color: 'var(--color-pink-medium)' }}>+</span> EVENTS
              </span>
            </div>
            <div className="absolute -top-4 right-0 md:right-8 animate-float" style={{ animationDelay: '1.5s' }}>
              <span className="px-3 py-1 rounded-full text-sm font-medium border-2" style={{ 
                borderColor: 'var(--color-pink-medium)', 
                color: 'var(--color-cream)',
                fontFamily: 'var(--font-lato)',
                background: 'var(--color-pink-light)'
              }}>
                <span style={{ color: 'var(--color-pink-medium)' }}>+</span> COMMUNITY
              </span>
            </div>
            <div className="absolute top-1/2 -right-8 md:-right-12 transform -translate-y-1/2 animate-float" style={{ animationDelay: '2s' }}>
              <span className="px-3 py-1 rounded-full text-sm font-medium border-2" style={{ 
                borderColor: 'var(--color-pink-medium)', 
                color: 'var(--color-cream)',
                fontFamily: 'var(--font-lato)',
                background: 'var(--color-pink-light)'
              }}>
                <span style={{ color: 'var(--color-pink-medium)' }}>+</span> CONNECTIONS
              </span>
            </div>

            <h2 className="text-6xl md:text-8xl lg:text-9xl font-bold mb-12" style={{ fontFamily: 'var(--font-vintage-stylist)', color: 'var(--color-cream)' }}>
              Nothing great is built alone.
        </h2>
          </div>

          {/* Description */}
          <p className="text-xl md:text-2xl lg:text-3xl max-w-5xl mx-auto leading-relaxed text-left md:text-center" style={{ fontFamily: 'var(--font-kollektif)', color: 'var(--color-cream)' }}>
            A student-led club dedicated to bridging the gap between elders and youth in a fast-moving society. Created by passionate uOttawa students and community members, Youth 4 Elders connects generations through volunteering, workshops, and meaningful relationships.
          </p>
        </div>
      </section>

      {/* Call-to-Action Section */}
      <section className="relative z-10 py-20 md:py-28" style={{ background: 'var(--color-cream)' }}>
        <div className="max-w-4xl mx-auto px-8 text-center">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6" style={{ fontFamily: 'var(--font-vintage-stylist)', color: 'var(--color-brown-dark)' }}>
            Ready to Make a Difference?
          </h2>
          <p className="text-lg md:text-xl mb-10 leading-relaxed" style={{ fontFamily: 'var(--font-leiko)', color: 'var(--color-brown-medium)' }}>
            Join our community of passionate students and caring elders. Together, we&apos;re building meaningful connections that bridge generations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href="/join-us"
              className="px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
              style={{
                background: 'var(--color-pink-medium)',
                color: 'white',
                fontFamily: 'var(--font-kollektif)'
              }}
            >
              Join Us Today
            </a>
            <a
              href="/events"
              className="px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 hover:scale-105 border-2"
              style={{
                borderColor: 'var(--color-brown-dark)',
                color: 'var(--color-brown-dark)',
                fontFamily: 'var(--font-kollektif)',
                background: 'transparent'
              }}
            >
              View Upcoming Events
            </a>
          </div>
        </div>
      </section>

      {/* Sponsors Section */}
      <section className="relative z-10 py-20 md:py-28" style={{ background: 'var(--color-brown-dark)' }}>
        <div className="max-w-7xl mx-auto px-8">
          {/* Main Headline */}
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6" style={{ fontFamily: 'var(--font-vintage-stylist)', color: 'var(--color-pink-medium)' }}>
              SPECIAL THANKS TO OUR SPONSORS
            </h2>
          </div>

          {/* Sponsor Logos Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
            {/* Sponsor 1 */}
            <div className="flex flex-col items-center text-center p-6 md:p-8 rounded-lg hover:bg-opacity-10 transition-all duration-300" style={{ background: 'rgba(237, 162, 195, 0.05)' }}>
              <div className="w-16 h-16 md:w-20 md:h-20 mb-6 flex items-center justify-center rounded-full" style={{ background: 'rgba(244, 142, 184, 0.2)' }}>
                <svg className="w-8 h-8 md:w-10 md:h-10" style={{ color: 'var(--color-pink-medium)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="text-lg md:text-xl font-bold mb-3" style={{ fontFamily: 'var(--font-vintage-ligatures)', color: 'var(--color-pink-medium)' }}>
                uOttawa
              </h3>
            </div>

            {/* Sponsor 2 */}
            <div className="flex flex-col items-center text-center p-6 md:p-8 rounded-lg hover:bg-opacity-10 transition-all duration-300" style={{ background: 'rgba(237, 162, 195, 0.05)' }}>
              <div className="w-16 h-16 md:w-20 md:h-20 mb-6 flex items-center justify-center rounded-full" style={{ background: 'rgba(244, 142, 184, 0.2)' }}>
                <svg className="w-8 h-8 md:w-10 md:h-10" style={{ color: 'var(--color-pink-medium)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-lg md:text-xl font-bold mb-3" style={{ fontFamily: 'var(--font-playfair)', color: 'var(--color-pink-medium)' }}>
                Community Foundation
              </h3>
                  </div>

            {/* Sponsor 3 */}
            <div className="flex flex-col items-center text-center p-6 md:p-8 rounded-lg hover:bg-opacity-10 transition-all duration-300" style={{ background: 'rgba(237, 162, 195, 0.05)' }}>
              <div className="w-16 h-16 md:w-20 md:h-20 mb-6 flex items-center justify-center rounded-full" style={{ background: 'rgba(244, 142, 184, 0.2)' }}>
                <svg className="w-8 h-8 md:w-10 md:h-10" style={{ color: 'var(--color-pink-medium)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                </div>
              <h3 className="text-lg md:text-xl font-bold mb-3" style={{ fontFamily: 'var(--font-playfair)', color: 'var(--color-pink-medium)' }}>
                Local Partners
              </h3>
          </div>

            {/* Sponsor 4 */}
            <div className="flex flex-col items-center text-center p-6 md:p-8 rounded-lg hover:bg-opacity-10 transition-all duration-300" style={{ background: 'rgba(237, 162, 195, 0.05)' }}>
              <div className="w-16 h-16 md:w-20 md:h-20 mb-6 flex items-center justify-center rounded-full" style={{ background: 'rgba(244, 142, 184, 0.2)' }}>
                <svg className="w-8 h-8 md:w-10 md:h-10" style={{ color: 'var(--color-pink-medium)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h3 className="text-lg md:text-xl font-bold mb-3" style={{ fontFamily: 'var(--font-playfair)', color: 'var(--color-pink-medium)' }}>
                Student Union
          </h3>
            </div>
          </div>
          </div>
        </section>

    </div>
  )
}
