'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'

export default function Home() {
  const [showModal, setShowModal] = useState(false)
  const [isClosing, setIsClosing] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const slowDownIntervals = useRef<Map<HTMLElement, NodeJS.Timeout>>(new Map())

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
      setShowSuccess(false)
      setIsClosing(false)
    }, 400) // Match animation duration (fadeOut is 0.4s)
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // Handle form submission here
    // TODO: Send email to backend
    // const formData = new FormData(e.currentTarget)
    // const email = formData.get('email')
    
    // Show success message (user must click outside to close)
    setShowSuccess(true)
  }

  return (
    <div className="min-h-screen">
      {/* Launch Signup Modal */}
      {(showModal && !showSuccess) || (isClosing && !showSuccess) ? (
        <div 
          className={`fixed inset-0 z-[200] flex items-center justify-center p-4 backdrop-blur-md ${isClosing ? 'animate-fadeOut' : 'animate-fadeIn'}`}
          style={{ background: 'rgba(244, 142, 184, 0.6)' }}
        >
          <div 
            className={`relative max-w-md w-full rounded-lg p-8 shadow-2xl ${isClosing ? 'animate-fadeOut' : 'animate-popup'}`}
            style={{ 
              background: 'var(--color-cream)',
              border: '2px solid var(--color-brown-dark)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Headline */}
            <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ fontFamily: 'var(--font-vintage-stylist)', color: 'var(--color-brown-dark)' }}>
              Help Us Grow Our Club
            </h2>

            {/* Body Text */}
            <p className="text-base md:text-lg mb-6 leading-relaxed" style={{ fontFamily: 'var(--font-leiko)', color: 'var(--color-brown-dark)' }}>
              We&apos;re doing a head count of interested individuals who want to join Youth 4 Elders! Add your email if you&apos;re interested in helping grow our club and connecting generations.
            </p>

            {/* Email Form */}
            <form onSubmit={handleSubmit}>
              <div className="flex gap-2">
                <input
                  type="email"
                  name="email"
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
      ) : null}

      {/* Success Modal */}
      {(showModal && showSuccess) || (isClosing && showSuccess) ? (
        <div 
          className={`fixed inset-0 z-[200] flex items-center justify-center p-4 backdrop-blur-md ${isClosing ? 'animate-fadeOut' : 'animate-fadeIn'}`}
          style={{ background: 'rgba(244, 142, 184, 0.6)' }}
          onClick={handleClose}
        >
          <div 
            className={`relative max-w-md w-full rounded-lg p-8 shadow-2xl ${isClosing ? 'animate-fadeOut' : 'animate-popup'}`}
            style={{ 
              background: 'var(--color-cream)',
              border: '2px solid var(--color-brown-dark)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Success Icon */}
            <div className="flex justify-center mb-6">
              <div 
                className="w-20 h-20 rounded-full flex items-center justify-center"
                style={{ background: 'var(--color-pink-medium)' }}
              >
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>

            {/* Success Message */}
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center" style={{ fontFamily: 'var(--font-vintage-stylist)', color: 'var(--color-brown-dark)' }}>
              Thanks for Signing Up!
            </h2>

            <p className="text-base md:text-lg mb-6 leading-relaxed text-center" style={{ fontFamily: 'var(--font-leiko)', color: 'var(--color-brown-dark)' }}>
              We hope to see you soon! We&apos;ll be in touch with updates about Youth 4 Elders and upcoming events.
            </p>
          </div>
        </div>
      ) : null}
      
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
            ... is now live !
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

      {/* Sponsors Section - Tear-Off Pad Design */}
      <section className="relative z-10 py-20 md:py-32" style={{ background: 'var(--color-cream)' }}>
        <div className="max-w-7xl mx-auto px-8">
          {/* Main Card Container - Paper Pad */}
          <div 
            className="relative rounded-2xl p-8 md:p-12 shadow-2xl"
            style={{ 
              background: 'var(--color-pink-light)',
              border: '4px solid var(--color-pink-medium)',
              boxShadow: '0 8px 24px rgba(100, 50, 27, 0.2)'
            }}
          >
            {/* Title Section */}
            <div className="text-center mb-12 md:mb-16 relative z-10 pt-8">
              <h2 
                className="text-5xl md:text-7xl lg:text-8xl font-bold leading-tight mb-4"
                style={{ 
                  fontFamily: 'var(--font-vintage-stylist)', 
                  color: 'var(--color-brown-dark)'
                }}
              >
                Our Sponsors
              </h2>
              <p 
                className="text-base md:text-lg"
                style={{ 
                  fontFamily: 'var(--font-kollektif)', 
                  color: 'var(--color-brown-medium)'
                }}
              >
                Thank you for your continued support and partnership in building meaningful connections
              </p>
            </div>

            {/* Tear-Off Strips Container */}
            <div className="relative flex items-stretch justify-center gap-0 mt-16" style={{ minHeight: '350px' }}>
              {/* Individual Sponsor Strips - Background Layer (invisible, just for layout) */}
              {[
                { width: '20%' },
                { width: '20%' },
                { width: '20%' },
                { width: '20%' },
                { width: '20%' },
              ].map((sponsor, index) => (
                <div
                  key={index}
                  className="relative"
                  style={{
                    width: sponsor.width,
                    minWidth: '100px',
                    height: '100%',
                    zIndex: 1
                  }}
                />
              ))}

              {/* Individual Brown Torn-Off Blocks for Each Sponsor */}
              {[
                { name: 'UOTTAWA', left: '0%', image: '/assets/sponsors/uottawa.png' },
                { name: 'DOORS OPEN ONTARIO', left: '20%', image: '/assets/sponsors/doors open ontario.png' },
                { name: 'LOCAL PARTNERS', left: '40%' },
                { name: 'STUDENT UNION', left: '60%' },
                { name: 'VOLUNTEER CENTER', left: '80%' },
              ].map((sponsor, index) => {
                const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
                  const element = e.currentTarget
                  // Clear any existing interval
                  const existingInterval = slowDownIntervals.current.get(element)
                  if (existingInterval) clearInterval(existingInterval)
                  
                  let duration = 1
                  const interval = setInterval(() => {
                    duration += 0.2
                    element.style.setProperty('--swing-duration', `${duration}s`)
                    if (duration >= 3) {
                      clearInterval(interval)
                      slowDownIntervals.current.delete(element)
                      element.style.animationPlayState = 'paused'
                    }
                  }, 50)
                  slowDownIntervals.current.set(element, interval)
                }

                const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
                  const element = e.currentTarget
                  // Clear any existing slowdown interval
                  const existingInterval = slowDownIntervals.current.get(element)
                  if (existingInterval) {
                    clearInterval(existingInterval)
                    slowDownIntervals.current.delete(element)
                  }
                  element.style.animationPlayState = 'running'
                  element.style.setProperty('--swing-duration', '1s')
                }

              return (
                <div
                  key={index}
                  className="absolute torn-edge-bottom paper-swing"
                  style={{
                    left: sponsor.left,
                    width: '20%',
                    height: '85%',
                    background: 'var(--color-brown-medium)',
                    zIndex: 10,
                    boxShadow: '0 4px 8px rgba(100, 50, 27, 0.3)',
                    borderLeft: index > 0 ? '2px dashed var(--color-brown-dark)' : 'none',
                    borderRight: index < 4 ? '2px dashed var(--color-brown-dark)' : 'none',
                    borderTop: '2px dashed var(--color-brown-dark)'
                  }}
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                >
                  <div
                    className="absolute inset-0 flex items-center justify-center"
                    style={{
                      transform: 'rotate(-90deg)',
                      transformOrigin: 'center',
                      width: '100%',
                      height: '100%'
                    }}
                  >
                    {sponsor.image ? (
                      <div style={{ 
                        width: sponsor.name === 'UOTTAWA' ? '100%' : '90%', 
                        height: sponsor.name === 'UOTTAWA' ? '100%' : '88%', 
                        position: 'relative' 
                      }}>
                        <Image
                          src={sponsor.image}
                          alt={sponsor.name}
                          fill
                          className="object-contain"
                          style={{ filter: 'brightness(0) invert(1)' }}
                        />
                      </div>
                    ) : (
                      <span
                        className="text-xs md:text-sm font-bold tracking-wider whitespace-nowrap"
                        style={{
                          fontFamily: 'var(--font-kollektif)',
                          color: 'var(--color-cream)'
                        }}
                      >
                        {sponsor.name}
                      </span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

            {/* Torn-Off "THANK YOU" Piece */}
            <div
              className="absolute bottom-6 right-8 md:right-12 transform rotate-12"
              style={{
                width: '120px',
                height: '70px',
                background: 'var(--color-cream)',
                border: '2px dashed var(--color-brown-medium)',
                borderRadius: '4px',
                padding: '10px',
                boxShadow: '0 4px 12px rgba(100, 50, 27, 0.25)',
                zIndex: 15,
                clipPath: 'polygon(0 0, 100% 0, 100% 85%, 95% 100%, 0 100%)' // Torn edge effect
              }}
            >
              <div
                className="h-full flex items-center justify-center"
                style={{
                  transform: 'rotate(-12deg)'
                }}
              >
                <span
                  className="text-xs font-bold"
                  style={{
                    fontFamily: 'var(--font-kollektif)',
                    color: 'var(--color-brown-dark)'
                  }}
                >
                  THANK YOU
                </span>
              </div>
            </div>
          </div>
          </div>
        </section>

    </div>
  )
}
