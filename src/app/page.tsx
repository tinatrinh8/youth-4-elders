'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'

export default function Home() {
  const [showModal, setShowModal] = useState(false)
  const [isClosing, setIsClosing] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })
  const parallaxSectionRef = useRef<HTMLElement>(null)
  const parallaxBgRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Show modal after 6 seconds on page load
    const timer = setTimeout(() => {
      setShowModal(true)
    }, 6000)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    // Position fixed background relative to section
    const updateBackgroundPosition = () => {
      if (parallaxSectionRef.current && parallaxBgRef.current) {
        const section = parallaxSectionRef.current
        const rect = section.getBoundingClientRect()
        
        // Set fixed position to match section's viewport position
        parallaxBgRef.current.style.top = `${rect.top}px`
        parallaxBgRef.current.style.left = `${rect.left}px`
        parallaxBgRef.current.style.width = `${rect.width}px`
        parallaxBgRef.current.style.height = `${rect.height}px`
      }
    }

    const handleScroll = () => {
      updateBackgroundPosition()
    }

    const handleResize = () => {
      updateBackgroundPosition()
    }

    window.addEventListener('scroll', handleScroll)
    window.addEventListener('resize', handleResize)
    updateBackgroundPosition() // Initial call
    
    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  useEffect(() => {
    // Set target date (30 days from now, or customize to a specific event date)
    const targetDate = new Date()
    targetDate.setDate(targetDate.getDate() + 30)
    
    const calculateTimeLeft = () => {
      const now = new Date().getTime()
      const difference = targetDate.getTime() - now
      
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000)
        })
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
      }
    }
    
    calculateTimeLeft()
    const interval = setInterval(calculateTimeLeft, 1000)
    
    return () => clearInterval(interval)
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
              We would like to see who is interested to join the Youth 4 Elders community! Add your email if you&apos;re interested in helping grow our club and connecting generations.
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

      {/* How to Get Involved Section */}
      <section ref={parallaxSectionRef} className="relative z-10 pt-32 md:pt-48 pb-20 md:pb-32 overflow-hidden" style={{ background: 'var(--color-cream)' }}>
        {/* Fixed Background Images - Parallax Effect */}
        <div ref={parallaxBgRef} className="absolute inset-0 pointer-events-none parallax-bg" style={{ zIndex: 0 }}>
          {/* Create a grid of small decorative images */}
          {Array.from({ length: 60 }).map((_, i) => {
            const images = ['/assets/flower.png', '/assets/flower2.png', '/assets/star.png', '/assets/swirl.png']
            const image = images[i % 4]
            const positions = [
              // Very top area (0-5%) - extend background upward, more spaced out
              { top: '0.5%', left: '12%' },
              { top: '1%', left: '35%' },
              { top: '0.8%', left: '58%' },
              { top: '1.2%', left: '82%' },
              { top: '2%', left: '8%' },
              { top: '2.5%', left: '48%' },
              { top: '3%', left: '72%' },
              { top: '3.5%', left: '25%' },
              { top: '4%', left: '65%' },
              { top: '4.5%', left: '88%' },
              { top: '5%', left: '18%' },
              // Top area (5-20%) - more spaced out
              { top: '6%', left: '42%' },
              { top: '7%', left: '75%' },
              { top: '8%', left: '15%' },
              { top: '9%', left: '58%' },
              { top: '11%', left: '32%' },
              { top: '12%', left: '68%' },
              { top: '13%', left: '12%' },
              { top: '14%', left: '52%' },
              { top: '15%', left: '88%' },
              { top: '16%', left: '28%' },
              { top: '17%', left: '65%' },
              { top: '18%', left: '8%' },
              { top: '19%', left: '45%' },
              { top: '20%', left: '82%' },
              // Upper middle area (20-35%)
              { top: '22%', left: '12%' },
              { top: '25%', left: '35%' },
              { top: '28%', left: '58%' },
              { top: '30%', left: '78%' },
              { top: '32%', left: '8%' },
              { top: '35%', left: '48%' },
              // Middle area (35-65%)
              { top: '38%', left: '22%' },
              { top: '42%', left: '45%' },
              { top: '45%', left: '68%' },
              { top: '48%', left: '15%' },
              { top: '52%', left: '38%' },
              { top: '55%', left: '62%' },
              { top: '58%', left: '8%' },
              { top: '62%', left: '52%' },
              { top: '65%', left: '78%' },
              // Lower middle area (65-80%)
              { top: '68%', left: '18%' },
              { top: '72%', left: '42%' },
              { top: '75%', left: '65%' },
              { top: '78%', left: '12%' },
              { top: '80%', left: '48%' },
              // Bottom area (80-95%) - heavily filled
              { top: '82%', left: '5%' },
              { top: '83%', left: '22%' },
              { top: '84%', left: '38%' },
              { top: '85%', left: '55%' },
              { top: '86%', left: '72%' },
              { top: '87%', left: '88%' },
              { top: '88%', left: '12%' },
              { top: '89%', left: '28%' },
              { top: '90%', left: '45%' },
              { top: '91%', left: '62%' },
              { top: '92%', left: '78%' },
              { top: '93%', left: '8%' },
              { top: '94%', left: '35%' },
              { top: '95%', left: '58%' },
              // Very bottom area (95-100%) - extend background downward
              { top: '95.5%', left: '15%' },
              { top: '96%', left: '32%' },
              { top: '96.5%', left: '48%' },
              { top: '97%', left: '65%' },
              { top: '97.5%', left: '82%' },
              { top: '98%', left: '8%' },
              { top: '98.5%', left: '25%' },
              { top: '99%', left: '42%' },
              { top: '99.2%', left: '58%' },
              { top: '99.5%', left: '75%' },
              { top: '99.8%', left: '92%' },
              { top: '98%', left: '55%' },
              { top: '99%', left: '88%' },
            ]
            const pos = positions[i] || { top: `${(i * 12) % 100}%`, left: `${(i * 17) % 100}%` }
            const sizes = ['w-12 h-12', 'w-16 h-16', 'w-14 h-14', 'w-10 h-10', 'w-18 h-18']
            const size = sizes[i % sizes.length]
            const opacity = 0.15 + (i % 3) * 0.05
            
            return (
              <div
                key={i}
                className="absolute"
                style={{
                  ...pos,
                  opacity: opacity,
                  transform: `rotate(${(i * 23) % 360}deg)`
                }}
              >
                <Image
                  src={image}
                  alt=""
                  width={100}
                  height={100}
                  className={size}
                />
              </div>
            )
          })}
        </div>

        {/* Content - Scrolls normally */}
        <div className="relative z-10 max-w-7xl mx-auto px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6" style={{ fontFamily: 'var(--font-vintage-stylist)', color: 'var(--color-brown-dark)' }}>
              Want to Get Involved?
            </h2>
            <p className="text-lg md:text-xl mb-8 leading-relaxed" style={{ fontFamily: 'var(--font-leiko)', color: 'var(--color-brown-medium)' }}>
              Want to become a member? Connect with passionate students and caring elders as we build meaningful relationships that bring generations together.
            </p>
            <div className="flex justify-center items-center">
              <a
                href="/join-us"
                className="px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
                style={{
                  background: 'var(--color-pink-medium)',
                  color: 'white',
                  fontFamily: 'var(--font-kollektif)',
                  border: '2px solid transparent'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#D85A8F'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'transparent'
                }}
              >
                LEARN MORE
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Events Section */}
      <section className="relative z-10 py-32 md:py-48 lg:py-64 overflow-hidden" style={{ background: 'var(--color-brown-dark)' }}>
        {/* Large Background Text - Scrolling */}
        <div className="absolute inset-0 flex items-start pointer-events-none overflow-hidden" style={{ top: '10%' }}>
          {/* Scrolling Text Container - Left to Right */}
          <div className="flex whitespace-nowrap animate-scroll-text" style={{ width: '200%' }}>
            <h2 
              className="text-9xl md:text-[11rem] lg:text-[14rem] xl:text-[16rem] font-bold opacity-20 px-8"
              style={{ 
                fontFamily: 'var(--font-vintage-stylist)', 
                color: 'var(--color-cream)',
                display: 'inline-block'
              }}
            >
              Our Events
            </h2>
            <h2 
              className="text-9xl md:text-[11rem] lg:text-[14rem] xl:text-[16rem] font-bold opacity-20 px-8"
              style={{ 
                fontFamily: 'var(--font-vintage-stylist)', 
                color: 'var(--color-cream)',
                display: 'inline-block'
              }}
            >
              Our Events
            </h2>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-8 relative z-10">
          {/* Event Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-16 md:mb-20">
            {/* Event Card 1 */}
            <div 
              className="relative rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              style={{ 
                background: 'var(--color-cream)',
                minHeight: '300px'
              }}
            >
              <div className="h-48 bg-gradient-to-br from-pink-200 to-pink-300 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ background: 'var(--color-pink-medium)' }}>
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <p className="text-sm font-semibold" style={{ fontFamily: 'var(--font-kollektif)', color: 'var(--color-brown-dark)' }}>
                    Upcoming Event
                  </p>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2" style={{ fontFamily: 'var(--font-vintage-stylist)', color: 'var(--color-brown-dark)' }}>
                  Workshop Series
                </h3>
                <p className="text-sm leading-relaxed" style={{ fontFamily: 'var(--font-kollektif)', color: 'var(--color-brown-medium)' }}>
                  Join us for our monthly intergenerational workshops connecting students and elders.
                </p>
              </div>
            </div>

            {/* Event Card 2 */}
            <div 
              className="relative rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              style={{ 
                background: 'var(--color-cream)',
                minHeight: '300px'
              }}
            >
              <div className="h-48 bg-gradient-to-br from-pink-300 to-pink-400 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ background: 'var(--color-pink-light)' }}>
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <p className="text-sm font-semibold" style={{ fontFamily: 'var(--font-kollektif)', color: 'var(--color-brown-dark)' }}>
                    Past Event
                  </p>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2" style={{ fontFamily: 'var(--font-vintage-stylist)', color: 'var(--color-brown-dark)' }}>
                  Community Gathering
                </h3>
                <p className="text-sm leading-relaxed" style={{ fontFamily: 'var(--font-kollektif)', color: 'var(--color-brown-medium)' }}>
                  A successful event bringing together students and elders for meaningful conversations.
                </p>
              </div>
            </div>

            {/* Event Card 3 */}
            <div 
              className="relative rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              style={{ 
                background: 'var(--color-cream)',
                minHeight: '300px'
              }}
            >
              <div className="h-48 bg-gradient-to-br from-pink-200 to-pink-300 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ background: 'var(--color-pink-medium)' }}>
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="text-sm font-semibold" style={{ fontFamily: 'var(--font-kollektif)', color: 'var(--color-brown-dark)' }}>
                    Upcoming Event
                  </p>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2" style={{ fontFamily: 'var(--font-vintage-stylist)', color: 'var(--color-brown-dark)' }}>
                  Volunteer Day
                </h3>
                <p className="text-sm leading-relaxed" style={{ fontFamily: 'var(--font-kollektif)', color: 'var(--color-brown-medium)' }}>
                  Join us for a day of volunteering and community service activities.
                </p>
              </div>
            </div>
          </div>

          {/* Bottom Section - Categories and View More */}
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
            <div>
              <p className="text-base md:text-lg mb-3" style={{ fontFamily: 'var(--font-kollektif)', color: 'var(--color-cream)' }}>
                Event Types
              </p>
              <p className="text-2xl md:text-3xl font-bold" style={{ fontFamily: 'var(--font-vintage-stylist)', color: 'var(--color-cream)' }}>
                Workshops / Community / Volunteering / Social
              </p>
            </div>
            <a
              href="/events"
              className="group font-semibold text-lg transition-all duration-300 flex items-center gap-2 relative"
              style={{
                color: 'var(--color-cream)',
                fontFamily: 'var(--font-kollektif)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = 'var(--color-pink-medium)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'var(--color-cream)'
              }}
            >
              <span>VIEW MORE</span>
              <svg 
                className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-2" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              {/* Animated underline on hover */}
              <span 
                className="absolute bottom-0 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full"
                style={{ background: 'var(--color-pink-medium)' }}
              />
            </a>
          </div>
        </div>
      </section>

      {/* Countdown Timer - Overlapping between brown and cream sections */}
      <div className="relative z-20 -mt-16 md:-mt-24 mb-16 md:mb-24">
        <div 
          className="max-w-3xl mx-auto px-8 md:px-12 py-12 md:py-16 rounded-2xl shadow-2xl text-center"
          style={{
            background: 'var(--color-brown-dark)',
            border: '1px solid rgba(247, 240, 227, 0.2)'
          }}
        >
          {/* Large Days Display */}
          <div className="flex items-center justify-center gap-0 mb-6">
            {/* Left Panel - V indentations on right (inner) edge */}
            <div 
              className="px-10 md:px-14 py-12 md:py-16 relative"
              style={{
                background: 'var(--color-cream)',
                clipPath: 'polygon(0% 8%, 0% 0%, 100% 0%, 100% 15%, 88% 50%, 100% 85%, 100% 100%, 0% 100%, 0% 92%)',
                borderRadius: '20px 0 0 20px',
                minWidth: '120px',
                minHeight: '140px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: '-12%'
              }}
            >
              <div 
                className="text-6xl md:text-7xl lg:text-8xl font-bold"
                style={{
                  fontFamily: 'var(--font-kollektif)',
                  color: 'var(--color-brown-dark)'
                }}
              >
                {String(timeLeft.days).padStart(2, '0')[0]}
              </div>
            </div>
            {/* Right Panel - V indentations on left (inner) edge */}
            <div 
              className="px-10 md:px-14 py-12 md:py-16 relative"
              style={{
                background: 'var(--color-cream)',
                clipPath: 'polygon(0% 0%, 0% 15%, 12% 50%, 0% 85%, 0% 100%, 100% 100%, 100% 92%, 100% 8%, 100% 0%)',
                borderRadius: '0 20px 20px 0',
                minWidth: '120px',
                minHeight: '140px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginLeft: '-12%'
              }}
            >
              <div 
                className="text-6xl md:text-7xl lg:text-8xl font-bold"
                style={{
                  fontFamily: 'var(--font-kollektif)',
                  color: 'var(--color-brown-dark)'
                }}
              >
                {String(timeLeft.days).padStart(2, '0')[1]}
              </div>
            </div>
          </div>

          {/* Text Below */}
          <div className="space-y-2">
            <p 
              className="text-base md:text-lg"
              style={{
                fontFamily: 'var(--font-kollektif)',
                color: 'var(--color-cream)'
              }}
            >
              DAYS LEFT UNTIL
            </p>
            <p 
              className="text-xl md:text-2xl font-bold"
              style={{
                fontFamily: 'var(--font-vintage-stylist)',
                color: 'var(--color-cream)'
              }}
            >
              NEXT EVENT
            </p>
          </div>
        </div>
      </div>

    </div>
  )
}
