'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
// Types for future Contentful integration
// import type { Entry } from 'contentful'
// import type { ClubUpdateSkeleton } from '@/types/clubUpdates'

// Helper type for rendering (simplified from Contentful entry)
interface ClubUpdate {
  id: string
  title: string
  description: string
  icon: string
  type: 'highlight' | 'standard' // 'highlight' uses pink styling, 'standard' uses brown
  hasCountdown?: boolean // Only highlight pink if countdown is attached
}

export default function Home() {
  const [showModal, setShowModal] = useState(false)
  const [isClosing, setIsClosing] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })
  const [visibleElements, setVisibleElements] = useState<Set<string>>(new Set())
  const [heroImageLoaded, setHeroImageLoaded] = useState(false)
  const [heroBgRadius, setHeroBgRadius] = useState(24)
  const heroSectionRef = useRef<HTMLElement>(null)
  const parallaxSectionRef = useRef<HTMLElement>(null)
  const parallaxBgRef = useRef<HTMLDivElement>(null)
  const countdownBoxRef = useRef<HTMLDivElement>(null)
  const countdownShadowRef = useRef<HTMLDivElement>(null)

  // Club updates - can be populated from Contentful
  // When updates are added or removed, the section will automatically adjust
  // TODO: Replace this with Contentful data fetching
  // Example: const clubUpdates = homepageData?.clubUpdates?.map(entry => ({
  //   id: entry.sys.id,
  //   title: entry.fields.title,
  //   description: entry.fields.description,
  //   icon: entry.fields.icon || '📢',
  //   type: entry.fields.type || 'standard'
  // })) || []
  
  const clubUpdates: ClubUpdate[] = [
    {
      id: '1',
      title: 'Website Now Live!',
      description: 'Our new website is here! Explore our events, learn about our mission, and discover how you can get involved.',
      icon: '✨',
      type: 'highlight',
      hasCountdown: false
    },
    {
      id: '2',
      title: 'Upcoming Event: Spikeball Event',
      description: 'Join us for our upcoming Spikeball event on January 15, 2026! Check the countdown to see how many days are left.',
      icon: '🎾',
      type: 'highlight',
      hasCountdown: true // This one has the countdown, so it should be pink
    },
    {
      id: '3',
      title: 'Tech Literacy at Glebe',
      description: 'Our tech literacy workshop series has started again at The Glebe Centre as of January 16.',
      icon: '💻',
      type: 'standard',
      hasCountdown: false
    }
  ]

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
        const footer = document.querySelector('footer')

        let height = rect.height
        if (footer) {
          const footerRect = footer.getBoundingClientRect()
          height = Math.max(height, footerRect.bottom - rect.top)
        }

        parallaxBgRef.current.style.top = `${rect.top}px`
        parallaxBgRef.current.style.left = `${rect.left}px`
        parallaxBgRef.current.style.width = `${rect.width}px`
        parallaxBgRef.current.style.height = `${height}px`
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

  // Hero background
  useEffect(() => {
    const updateHeroRadius = () => {
      if (!heroSectionRef.current || typeof window === 'undefined') return
      const rect = heroSectionRef.current.getBoundingClientRect()
      const windowHeight = window.innerHeight
      const windowWidth = window.innerWidth
      const scrollProgress = Math.max(0, Math.min(1, -rect.top / (windowHeight * 0.5)))
      const maxRadius = Math.round(windowWidth * 0.5)
      const radius = 24 + Math.round(scrollProgress * maxRadius)
      setHeroBgRadius(radius)
    }
    window.addEventListener('scroll', updateHeroRadius)
    window.addEventListener('resize', updateHeroRadius)
    updateHeroRadius()
    return () => {
      window.removeEventListener('scroll', updateHeroRadius)
      window.removeEventListener('resize', updateHeroRadius)
    }
  }, [])

  useEffect(() => {
    // Set target date to January 15, 2026 for Spikeball Event
    const targetDate = new Date(2026, 0, 15, 0, 0, 0) // January 15, 2026 at midnight
    
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

  useEffect(() => {
    // Sync shadow box height with main box
    const syncHeights = () => {
      if (countdownBoxRef.current && countdownShadowRef.current) {
        countdownShadowRef.current.style.height = `${countdownBoxRef.current.offsetHeight}px`
      }
    }
    
    syncHeights()
    window.addEventListener('resize', syncHeights)
    
    return () => window.removeEventListener('resize', syncHeights)
  }, [timeLeft])

  // Intersection Observer for scroll animations
  useEffect(() => {
    // Trigger hero animations immediately on load with different speeds
    // Background image - fastest (appears first)
    // Image - appears first
    setTimeout(() => {
      setVisibleElements((prev) => new Set(prev).add('hero-bg'))
    }, 100)
    
    // "Youth 4 Elders" and "is now live" are triggered by hero image onLoad (see Image below)

    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const elementId = entry.target.getAttribute('data-animate-id')
          if (elementId) {
            setVisibleElements((prev) => new Set(prev).add(elementId))
          }
        }
      })
    }, observerOptions)

    // Observe all elements with data-animate-id (except hero elements which animate on load)
    const animatedElements = document.querySelectorAll('[data-animate-id]:not([data-animate-id^="hero-"])')
    animatedElements.forEach((el) => observer.observe(el))

    return () => {
      animatedElements.forEach((el) => observer.unobserve(el))
      observer.disconnect()
    }
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
          style={{ background: 'rgba(98, 32, 47, 0.7)' }}
        >
          <div 
            className={`relative max-w-md w-full rounded-lg p-8 shadow-2xl ${isClosing ? 'animate-fadeOut' : 'animate-popup'}`}
            style={{ 
              background: 'var(--color-cream)',
              border: '2px solid var(--color-olive)'
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
                    e.target.style.borderColor = 'var(--color-olive)'
                    e.target.style.boxShadow = '0 0 0 3px rgba(201, 218, 168, 0.35)'
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
                    background: 'var(--color-olive)',
                    color: 'var(--color-brown-dark)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'var(--color-brown-dark)'
                    e.currentTarget.style.color = 'var(--color-cream)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'var(--color-olive)'
                    e.currentTarget.style.color = 'var(--color-brown-dark)'
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
                e.currentTarget.style.color = 'var(--color-brown-medium)'
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
          style={{ background: 'rgba(98, 32, 47, 0.7)' }}
          onClick={handleClose}
        >
          <div 
            className={`relative max-w-md w-full rounded-lg p-8 shadow-2xl ${isClosing ? 'animate-fadeOut' : 'animate-popup'}`}
            style={{ 
              background: 'var(--color-cream)',
              border: '2px solid var(--color-olive)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Success Icon */}
            <div className="flex justify-center mb-6">
              <div 
                className="w-20 h-20 rounded-full flex items-center justify-center"
                style={{ background: 'var(--color-olive)' }}
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
        ref={heroSectionRef}
        className="relative"
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
          padding: '0',
          overflow: 'visible'
        }}
      >
        {/* Background Image */}
        <div
          className="absolute inset-0 w-full h-full"
          style={{
            borderRadius: `${heroBgRadius}px`,
            overflow: 'hidden',
            marginLeft: '16px',
            marginRight: '16px',
            marginTop: '40px',
            marginBottom: '80px',
            width: 'calc(100% - 32px)',
            height: 'calc(100% - 120px)',
            top: '0',
            opacity: visibleElements.has('hero-bg') ? 1 : 0,
            transition: 'opacity 0.6s ease-out, border-radius 1.1s ease-out'
          }}
          data-animate-id="hero-bg"
        >
          <Image
            src="/assets/header.jpg"
            alt="Youth 4 Elders"
            fill
            className="object-cover"
            priority
            style={{ objectPosition: 'center bottom' }}
            onLoad={() => {
              setHeroImageLoaded(true)
              // "is now live" starts after Youth 4 Elders animation finishes (~3 words: 0.28s*2 + 1s duration = ~1.6s)
              setTimeout(() => {
                setVisibleElements((prev) => new Set(prev).add('hero-marketing'))
              }, 1800)
            }}
          />
          {/* Overlay for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-transparent" />
        </div>

        {/* Large Marketing Text - Upper Right (slow fade-in after image loads) */}
        <div 
          className="absolute top-20 right-8 md:right-12 z-20 max-w-lg text-right"
          style={{
            opacity: visibleElements.has('hero-marketing') ? 1 : 0,
            transform: visibleElements.has('hero-marketing') ? 'translateX(0)' : 'translateX(60px)',
            transition: 'opacity 1.2s ease-out, transform 1.2s ease-out'
          }}
          data-animate-id="hero-marketing"
        >
          <p className="text-lg md:text-xl lg:text-2xl font-bold leading-tight tracking-tight" style={{ 
            fontFamily: 'var(--font-leiko)', 
            color: 'var(--color-olive)',
            textShadow: '2px 2px 4px rgba(0,0,0,0.1)'
          }}>
            ... is now live !
          </p>
        </div>

        {/* Large Elegant Script "Youth 4 Elders" - word-by-word fade-in-up-from-blur after image loads */}
        <div 
          className="absolute bottom-0 left-0 right-0 z-50 pointer-events-none"
          style={{ marginBottom: '-60px', overflow: 'visible' }}
        >
          <h1 
            className="text-[10rem] md:text-[12rem] lg:text-[16rem] font-bold italic leading-none"
            style={{ 
              fontFamily: 'var(--font-vintage-stylist)', 
              color: 'var(--color-olive)',
              mixBlendMode: 'normal',
              position: 'relative',
              zIndex: 50,
              textShadow: 'none'
            }}
          >
            {['Youth', '4', 'Elders'].map((word, i) => (
              <span
                key={i}
                className={heroImageLoaded ? 'word-fade-in-up-blur-slow' : ''}
                style={{
                  display: 'inline-block',
                  animationDelay: heroImageLoaded ? `${i * 0.28}s` : undefined,
                  opacity: heroImageLoaded ? undefined : 0,
                }}
              >
                {word}{i < 2 ? '\u00A0' : ''}
              </span>
            ))}
          </h1>
        </div>

      </section>

      {/* "Nothing great is built alone" Section */}
      <section className="relative z-10 py-32 md:py-48" style={{ background: 'var(--color-olive)' }}>
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center mb-20 md:mb-28">
            <h2
              className="text-6xl md:text-8xl lg:text-9xl font-bold mb-12"
              style={{ fontFamily: 'var(--font-vintage-stylist)', color: 'var(--color-olive-light)' }}
              data-animate-id="mission-headline"
            >
              {['Nothing', 'great', 'is', 'built', 'alone.'].map((word, i) => (
                <span
                  key={i}
                  className={visibleElements.has('mission-headline') ? 'word-fade-in-up-blur' : ''}
                  style={{
                    animationDelay: visibleElements.has('mission-headline') ? `${i * 0.12}s` : undefined,
                    opacity: visibleElements.has('mission-headline') ? undefined : 0,
                  }}
                >
                  {word}{i < 4 ? '\u00A0' : ''}
                </span>
              ))}
            </h2>
          </div>

          {/* Description */}
          <p 
            className={`text-xl md:text-2xl lg:text-3xl max-w-5xl mx-auto leading-relaxed text-left md:text-center animate-on-scroll fade ${visibleElements.has('mission-description') ? 'visible' : ''}`}
            style={{ fontFamily: 'var(--font-kollektif)', color: 'var(--color-olive-light)' }}
            data-animate-id="mission-description"
          >
            A student-led club dedicated to bridging the gap between elders and youth in a fast-moving society. Created by passionate uOttawa students and community members, Youth 4 Elders connects generations through volunteering, workshops, and meaningful relationships.
          </p>
        </div>
      </section>

      {/* Current Club Updates and Countdown Section - Connected to Events */}
      <section className="relative z-20 pt-20 md:pt-24 pb-28 md:pb-32" style={{ background: 'var(--color-cream)' }}>
        <div className="max-w-6xl mx-auto px-8 md:px-10">
        <h3
          className="text-4xl md:text-5xl lg:text-6xl font-bold mb-10 text-left"
          style={{ fontFamily: 'var(--font-vintage-stylist)', color: 'var(--color-brown-dark)' }}
          data-animate-id="club-updates-heading"
        >
          {['Current', 'Club'].map((word, wi) => (
            <span key={wi}>
              <span
                className={visibleElements.has('club-updates-heading') ? 'word-fade-in-up-blur' : ''}
                style={{
                  display: 'inline-block',
                  animationDelay: visibleElements.has('club-updates-heading') ? `${wi * 0.45}s` : undefined,
                  opacity: visibleElements.has('club-updates-heading') ? undefined : 0,
                }}
              >
                {word}
              </span>
              {wi < 1 ? '\u00A0' : '\u00A0'}
            </span>
          ))}
          <span style={{ fontFamily: 'var(--font-leiko)', fontStyle: 'italic' }}>
            {'Updates'.split('').map((letter, i) => (
              <span
                key={i}
                className={visibleElements.has('club-updates-heading') ? 'word-fade-in-up-blur' : ''}
                style={{
                  display: 'inline-block',
                  animationDelay: visibleElements.has('club-updates-heading') ? `${1.05 + i * 0.055}s` : undefined,
                  opacity: visibleElements.has('club-updates-heading') ? undefined : 0,
                }}
              >
                {letter}
              </span>
            ))}
          </span>
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 lg:gap-28 items-start">
            {/* Left Side - Current Club Updates */}
            <div className="flex flex-col justify-center items-start lg:items-start order-2 lg:order-1">
              {/* Dynamic Updates Container - Automatically adjusts height based on number of updates */}
              <div className="w-full max-w-lg space-y-8 mb-8">
                {clubUpdates.map((update, index) => (
                  <div 
                    key={update.id}
                    className={`p-6 rounded-lg animate-on-scroll slide-up ${visibleElements.has(`club-update-${update.id}`) ? 'visible' : ''}`}
                    data-animate-id={`club-update-${update.id}`}
                    style={{
                      transitionDelay: `${index * 0.1}s`,
                      background: update.hasCountdown 
                        ? 'rgba(251, 247, 232, 0.85)' 
                        : 'rgba(251, 247, 232, 0.7)',
                      border: update.hasCountdown
                        ? '2px solid var(--color-brown-dark)'
                        : '2px solid var(--color-brown-dark)'
                    }}
                  >
                    <div className="flex items-start gap-3 mb-2">
                      <div 
                        className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm"
                        style={{
                          background: 'var(--color-brown-dark)',
                          color: 'var(--color-cream)',
                          fontFamily: 'var(--font-kollektif)'
                        }}
                      >
                        {update.icon}
                      </div>
                      <div className="flex-1">
                        <h4 className="text-lg font-bold mb-1" style={{ fontFamily: 'var(--font-kollektif)', color: 'var(--color-brown-dark)' }}>
                          {update.title}
                        </h4>
                        <p className="text-base leading-relaxed" style={{ fontFamily: 'var(--font-kollektif)', color: 'var(--color-brown-dark)', opacity: 0.9 }}>
                          {update.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Side - Countdown Timer */}
            <div 
              className={`flex justify-center lg:justify-end order-1 lg:order-2 mt-6 md:mt-8 animate-on-scroll scale self-start ${visibleElements.has('countdown-timer') ? 'visible' : ''}`}
              data-animate-id="countdown-timer"
            >
              <div className="relative">
                {/* Shadow Box Layer - Full opacity, offset */}
                <div 
                  ref={countdownShadowRef}
                  className="absolute max-w-md px-10 md:px-16 text-center"
                style={{
                    background: 'var(--color-brown-dark)',
                    borderRadius: '60px',
                    top: '12px',
                    left: 'calc(50% + 8px)',
                    transform: 'translateX(-50%)',
                    width: '100%',
                    maxWidth: '28rem',
                    paddingTop: '5.5rem',
                    paddingBottom: '5.5rem',
                    minHeight: '520px',
                    opacity: 1,
                    zIndex: 0
                  }}
                />
                <div 
                  ref={countdownBoxRef}
                  className="mx-auto px-10 md:px-16 text-center relative z-10"
                  style={{
                    background: 'var(--color-cream)',
                    borderRadius: '60px',
                    border: '2px solid var(--color-brown-dark)',
                    boxShadow: '0 8px 32px rgba(98, 32, 47, 0.25)',
                    paddingTop: '4.5rem',
                    paddingBottom: '4.5rem',
                    minHeight: '520px',
                    width: '100%',
                    maxWidth: '100rem',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: '2rem'
                  }}
                >
                {timeLeft.days > 0 ? (
                  <>
                    {/* Single Cream Block with Number */}
                    <div className="mb-8 flex justify-center">
                      <div 
                        className="rounded-3xl px-12 md:px-16 py-10 md:py-14 flex items-center justify-center relative"
                        style={{
                          background: 'var(--color-brown-dark)',
                          minWidth: '140px',
                          minHeight: '200px',
                          boxShadow: '0 4px 16px rgba(98, 32, 47, 0.2)'
                        }}
                      >
                        <div 
                          className="text-7xl md:text-8xl lg:text-9xl font-bold relative z-10 animate-pulse-subtle"
                          style={{
                            fontFamily: 'var(--font-kollektif)',
                            color: 'var(--color-cream)'
                          }}
                        >
                          {timeLeft.days}
                        </div>
                        {/* Flip clock divider line */}
                        <div 
                          className="absolute left-0 right-0 z-20"
                          style={{
                            top: '50%',
                            height: '2px',
                            background: 'var(--color-brown-dark)',
                            transform: 'translateY(-50%)'
                          }}
                />
                </div>
          </div>

                    {/* Text Below */}
                    <div className="space-y-1">
                      <p 
                        className="text-sm md:text-base uppercase tracking-wider"
                        style={{
                          fontFamily: 'var(--font-kollektif)',
                          color: 'var(--color-brown-dark)',
                          letterSpacing: '0.1em'
                        }}
                      >
                        DAYS LEFT UNTIL
                      </p>
                      <p 
                        className="text-xl md:text-2xl lg:text-3xl font-bold"
                        style={{
                          fontFamily: 'var(--font-vintage-stylist)',
                          color: 'var(--color-brown-dark)'
                        }}
                      >
                        SPIKEBALL EVENT
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    {/* Today's Event Message */}
                    <div className="mb-8 flex justify-center">
                      <div 
                        className="rounded-3xl px-8 md:px-12 py-10 md:py-14 flex items-center justify-center"
                        style={{
                          background: 'var(--color-brown-dark)',
                          minWidth: '140px',
                          minHeight: '190px',
                          boxShadow: '0 4px 16px rgba(98, 32, 47, 0.2)'
                        }}
                      >
                        <div 
                          className="text-4xl md:text-5xl lg:text-6xl font-bold text-center"
                style={{
                  fontFamily: 'var(--font-kollektif)',
                            color: 'var(--color-cream)'
                          }}
                        >
                          TODAY
                        </div>
                      </div>
                    </div>

                    {/* Text Below */}
                    <div className="space-y-1">
                      <p 
                        className="text-xl md:text-2xl lg:text-3xl font-bold"
                        style={{
                          fontFamily: 'var(--font-vintage-stylist)',
                          color: 'var(--color-brown-dark)'
                        }}
                      >
                        Today is the
                      </p>
                      <p 
                        className="text-2xl md:text-3xl lg:text-4xl font-bold"
                        style={{
                          fontFamily: 'var(--font-vintage-stylist)',
                          color: 'var(--color-brown-dark)'
                        }}
                      >
                        Spikeball Event
                      </p>
                    </div>
                  </>
                )}
                </div>
              </div>
            </div>
          </div>
          {/* Quote box moved below updates */}
          <div
            className={`relative rounded-2xl p-5 md:p-8 mt-12 md:mt-16 max-w-4xl mx-auto animate-on-scroll slide-up ${visibleElements.has('impact-quote') ? 'visible' : ''}`}
            data-animate-id="impact-quote"
            style={{
              background: 'var(--color-olive)',
              border: '2px dashed var(--color-olive-light)',
              boxShadow: '0 4px 16px rgba(251, 247, 232, 0.3)'
            }}
          >
            {/* Decorative quote mark - top left */}
            <div 
              className="absolute top-1 left-3 md:left-4 text-4xl md:text-5xl opacity-25"
              style={{ 
                fontFamily: 'var(--font-vintage-stylist)',
                color: 'var(--color-olive-light)',
                lineHeight: 1
              }}
            >
              &ldquo;
            </div>
            {/* Decorative quote mark - bottom right */}
            <div 
              className="absolute bottom-1 right-3 md:right-4 text-4xl md:text-5xl opacity-25"
              style={{ 
                fontFamily: 'var(--font-vintage-stylist)',
                color: 'var(--color-olive-light)',
                lineHeight: 1,
                transform: 'rotate(180deg)'
              }}
            >
              &ldquo;
            </div>
            <p 
              className="text-xl md:text-2xl lg:text-3xl font-bold leading-relaxed text-center relative z-10 px-4"
              style={{ 
                fontFamily: 'var(--font-leiko)',
                color: 'var(--color-olive-light)',
                fontStyle: 'italic'
              }}
            >
              Bridging generations, one connection at a time.
            </p>
          </div>
        </div>
      </section>

      {/* Events Section */}
      <section className="relative z-10 py-32 md:py-48 lg:py-64 overflow-hidden" style={{ background: 'var(--color-pink-medium)' }}>
        {/* Large Background Text - Scrolling */}
        <div className="absolute inset-0 flex items-start pointer-events-none overflow-hidden" style={{ top: '10%' }}>
          {/* Scrolling Text Container - Left to Right */}
          <div className="flex whitespace-nowrap animate-scroll-text" style={{ width: '200%' }}>
            <h2 
              className="text-9xl md:text-[11rem] lg:text-[14rem] xl:text-[16rem] font-bold opacity-20 px-8"
              style={{ 
                fontFamily: 'var(--font-vintage-stylist)', 
                color: 'var(--color-brown-dark)',
                display: 'inline-block'
              }}
            >
              Our Events
            </h2>
            <h2 
              className="text-9xl md:text-[11rem] lg:text-[14rem] xl:text-[16rem] font-bold opacity-20 px-8"
              style={{ 
                fontFamily: 'var(--font-vintage-stylist)', 
                color: 'var(--color-brown-dark)',
                display: 'inline-block'
              }}
            >
              Our Events
            </h2>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-8 relative z-10 -mt-2 md:mt-2 lg:mt-4">
          {/* Event Cards Grid */}
          <div className="flex flex-col md:flex-row gap-2 md:gap-3 mb-16 md:mb-20" style={{ minHeight: '500px', overflowX: 'hidden' }}>
            {/* Event Card 1 - Left Card */}
            <div 
              className={`relative overflow-hidden transition-all duration-500 ease-out cursor-pointer flex-shrink-0 group animate-on-scroll slide-left ${visibleElements.has('event-card-1') ? 'visible' : ''}`}
              data-animate-id="event-card-1"
              style={{ 
                background: 'var(--color-cream)',
                minHeight: '500px',
                width: '100%',
                flexBasis: '33.333%'
              }}
              onMouseEnter={(e) => {
                const container = e.currentTarget.parentElement
                if (container) {
                  e.currentTarget.style.flexBasis = '50%'
                  e.currentTarget.style.zIndex = '20'
                  e.currentTarget.style.boxShadow = '0 30px 80px rgba(0, 0, 0, 0.4)'
                  // Make other two cards smaller and equal size
                  const siblings = Array.from(container.children) as HTMLElement[]
                  siblings.forEach((sibling) => {
                    if (sibling !== e.currentTarget) {
                      sibling.style.flexBasis = '25%'
                      sibling.style.transition = 'flex-basis 500ms ease-out'
                    }
                  })
                  // Show date and description
                  const textContainer = e.currentTarget.querySelector('.event-details') as HTMLElement
                  if (textContainer) {
                    textContainer.style.maxHeight = '120px'
                    textContainer.style.opacity = '1'
                  }
                }
              }}
              onMouseLeave={(e) => {
                const container = e.currentTarget.parentElement
                if (container) {
                  e.currentTarget.style.flexBasis = '33.333%'
                  e.currentTarget.style.zIndex = '1'
                  e.currentTarget.style.boxShadow = 'none'
                  // Reset other cards to equal size
                  const siblings = Array.from(container.children) as HTMLElement[]
                  siblings.forEach((sibling) => {
                    if (sibling !== e.currentTarget) {
                      sibling.style.flexBasis = '33.333%'
                    }
                  })
                  // Hide date and description
                  const textContainer = e.currentTarget.querySelector('.event-details') as HTMLElement
                  if (textContainer) {
                    textContainer.style.maxHeight = '0'
                    textContainer.style.opacity = '0'
                  }
                }
              }}
            >
              <div className="relative h-full w-full min-h-[500px] overflow-hidden">
                <Image
                  src="/assets/workshop series.jpg"
                  alt="Workshop Series"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>
              <div className="absolute bottom-0 left-0 right-0 group-hover:pb-8 transition-all duration-500" style={{ background: 'var(--color-brown-dark)', padding: '1.5rem' }}>
                <h3 className="text-xl font-bold mb-1" style={{ fontFamily: 'var(--font-kollektif)', color: 'var(--color-pink-medium)' }}>
                  Workshop Series
                </h3>
                <div className="event-details overflow-hidden transition-all duration-500 ease-out" style={{ maxHeight: '0', opacity: '0' }}>
                  <p className="text-sm mb-2" style={{ fontFamily: 'var(--font-kollektif)', color: 'var(--color-pink-medium)' }}>
                    Started again Jan 16
                  </p>
                  <p className="text-xs leading-relaxed" style={{ fontFamily: 'var(--font-kollektif)', color: 'var(--color-pink-medium)' }}>
                    A 6-week weekly workshop series teaching and helping with technology. Now running at The Glebe Centre.
                  </p>
                </div>
              </div>
            </div>

            {/* Event Card 2 - Middle Card */}
            <div 
              className={`relative overflow-hidden transition-all duration-500 ease-out cursor-pointer flex-shrink-0 group animate-on-scroll slide-up ${visibleElements.has('event-card-2') ? 'visible' : ''}`}
              data-animate-id="event-card-2"
              style={{ 
                background: 'var(--color-cream)',
                minHeight: '500px',
                width: '100%',
                flexBasis: '33.333%'
              }}
              onMouseEnter={(e) => {
                const container = e.currentTarget.parentElement
                if (container) {
                  e.currentTarget.style.flexBasis = '50%'
                  e.currentTarget.style.zIndex = '20'
                  e.currentTarget.style.boxShadow = '0 30px 80px rgba(0, 0, 0, 0.4)'
                  // Make left and right cards smaller and equal size
                  const siblings = Array.from(container.children) as HTMLElement[]
                  siblings.forEach((sibling) => {
                    if (sibling !== e.currentTarget) {
                      sibling.style.flexBasis = '25%'
                      sibling.style.transition = 'flex-basis 500ms ease-out'
                    }
                  })
                  // Show date and description
                  const textContainer = e.currentTarget.querySelector('.event-details') as HTMLElement
                  if (textContainer) {
                    textContainer.style.maxHeight = '120px'
                    textContainer.style.opacity = '1'
                  }
                }
              }}
              onMouseLeave={(e) => {
                const container = e.currentTarget.parentElement
                if (container) {
                  e.currentTarget.style.flexBasis = '33.333%'
                  e.currentTarget.style.zIndex = '1'
                  e.currentTarget.style.boxShadow = 'none'
                  // Reset other cards to equal size
                  const siblings = Array.from(container.children) as HTMLElement[]
                  siblings.forEach((sibling) => {
                    if (sibling !== e.currentTarget) {
                      sibling.style.flexBasis = '33.333%'
                    }
                  })
                  // Hide date and description
                  const textContainer = e.currentTarget.querySelector('.event-details') as HTMLElement
                  if (textContainer) {
                    textContainer.style.maxHeight = '0'
                    textContainer.style.opacity = '0'
                  }
                }
              }}
            >
              <div className="relative h-full w-full min-h-[500px] overflow-hidden">
                <Image
                  src="/assets/club fair.jpg"
                  alt="Club Fair at uOttawa UCU"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>
              <div className="absolute bottom-0 left-0 right-0 group-hover:pb-8 transition-all duration-500" style={{ background: 'var(--color-brown-dark)', padding: '1.5rem' }}>
                <h3 className="text-xl font-bold mb-1" style={{ fontFamily: 'var(--font-kollektif)', color: 'var(--color-pink-medium)' }}>
                  School Club Fair
                </h3>
                <div className="event-details overflow-hidden transition-all duration-500 ease-out" style={{ maxHeight: '0', opacity: '0' }}>
                  <p className="text-sm mb-2" style={{ fontFamily: 'var(--font-kollektif)', color: 'var(--color-pink-medium)' }}>
                    Sept 3rd, 2025
                  </p>
                  <p className="text-xs leading-relaxed" style={{ fontFamily: 'var(--font-kollektif)', color: 'var(--color-pink-medium)' }}>
                    At the beginning of the school year, we joined the club fair to connect with students and share our mission.
                  </p>
                </div>
              </div>
            </div>

            {/* Event Card 3 - Right Card */}
            <div 
              className={`relative overflow-hidden transition-all duration-500 ease-out cursor-pointer flex-shrink-0 group animate-on-scroll slide-right ${visibleElements.has('event-card-3') ? 'visible' : ''}`}
              data-animate-id="event-card-3"
              style={{ 
                background: 'var(--color-cream)',
                minHeight: '500px',
                width: '100%',
                flexBasis: '33.333%'
              }}
              onMouseEnter={(e) => {
                const container = e.currentTarget.parentElement
                if (container) {
                  e.currentTarget.style.flexBasis = '50%'
                  e.currentTarget.style.zIndex = '20'
                  e.currentTarget.style.boxShadow = '0 30px 80px rgba(0, 0, 0, 0.4)'
                  // Make other two cards smaller and equal size
                  const siblings = Array.from(container.children) as HTMLElement[]
                  siblings.forEach((sibling) => {
                    if (sibling !== e.currentTarget) {
                      sibling.style.flexBasis = '25%'
                      sibling.style.transition = 'flex-basis 500ms ease-out'
                    }
                  })
                  // Show date and description
                  const textContainer = e.currentTarget.querySelector('.event-details') as HTMLElement
                  if (textContainer) {
                    textContainer.style.maxHeight = '120px'
                    textContainer.style.opacity = '1'
                  }
                }
              }}
              onMouseLeave={(e) => {
                const container = e.currentTarget.parentElement
                if (container) {
                  e.currentTarget.style.flexBasis = '33.333%'
                  e.currentTarget.style.zIndex = '1'
                  e.currentTarget.style.boxShadow = 'none'
                  // Reset other cards to equal size
                  const siblings = Array.from(container.children) as HTMLElement[]
                  siblings.forEach((sibling) => {
                    if (sibling !== e.currentTarget) {
                      sibling.style.flexBasis = '33.333%'
                    }
                  })
                  // Hide date and description
                  const textContainer = e.currentTarget.querySelector('.event-details') as HTMLElement
                  if (textContainer) {
                    textContainer.style.maxHeight = '0'
                    textContainer.style.opacity = '0'
                  }
                }
              }}
            >
              <div className="relative h-full w-full min-h-[500px] overflow-hidden">
                <Image
                  src="/assets/sip.jpg"
                  alt="Sips, Samples, Social"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>
              <div className="absolute bottom-0 left-0 right-0 group-hover:pb-8 transition-all duration-500" style={{ background: 'var(--color-brown-dark)', padding: '1.5rem' }}>
                <h3 className="text-xl font-bold mb-1" style={{ fontFamily: 'var(--font-kollektif)', color: 'var(--color-pink-medium)' }}>
                  Sips, Samples, Social
                </h3>
                <div className="event-details overflow-hidden transition-all duration-500 ease-out" style={{ maxHeight: '0', opacity: '0' }}>
                  <p className="text-sm mb-2" style={{ fontFamily: 'var(--font-kollektif)', color: 'var(--color-pink-medium)' }}>
                    Nov 10th, 2025
                  </p>
                  <p className="text-xs leading-relaxed" style={{ fontFamily: 'var(--font-kollektif)', color: 'var(--color-pink-medium)' }}>
                    Sample delicious goodies from our favourite local vendors at Abbotsford Seniors Centre.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Section - Categories and View More */}
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
            <div 
              className={`animate-on-scroll slide-left ${visibleElements.has('event-types') ? 'visible' : ''}`}
              data-animate-id="event-types"
            >
              <p className="text-base md:text-lg mb-3" style={{ fontFamily: 'var(--font-kollektif)', color: 'var(--color-brown-dark)' }}>
                Event Types
              </p>
              <p className="text-2xl md:text-3xl font-bold" style={{ fontFamily: 'var(--font-vintage-stylist)', color: 'var(--color-brown-dark)' }}>
                Workshops / Community / Volunteering / Social
              </p>
            </div>
            <a
              href="/events"
              className={`group font-semibold text-lg transition-all duration-300 flex items-center gap-2 relative animate-on-scroll slide-right ${visibleElements.has('event-view-more') ? 'visible' : ''}`}
              data-animate-id="event-view-more"
              style={{
                color: 'var(--color-brown-dark)',
                fontFamily: 'var(--font-kollektif)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = 'var(--color-brown-dark)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'var(--color-brown-dark)'
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
                style={{ background: 'var(--color-brown-dark)' }}
              />
            </a>
          </div>
          </div>
        </section>

      {/* How to Get Involved Section */}
      <section ref={parallaxSectionRef} className="relative z-10 pt-20 md:pt-28 pb-14 md:pb-20 overflow-hidden" style={{ background: 'var(--color-cream)' }}>
        {/* Fixed Background Images - Parallax Effect */}
        <div ref={parallaxBgRef} className="absolute inset-0 pointer-events-none parallax-bg overflow-visible" style={{ zIndex: 0 }}>
          {/* Wider spread: scale container so images extend further left/right */}
          <div className="absolute inset-0 origin-center" style={{ transform: 'scale(1.45)', left: '-22.5%', top: 0, width: '145%', height: '100%' }}>
          {Array.from({ length: 60 }).map((_, i) => {
            const images = ['/assets/star.png', '/assets/swirl.png']
            const image = images[i % 2]
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

            // Apply green filter to swirl images only (they appear orange/yellow)
            const isSwirl = image.includes('swirl')
            const filterStyle = isSwirl ? { filter: 'hue-rotate(80deg) saturate(1.2) brightness(0.9)' } : {}

              return (
              <div
                key={i}
                className="absolute"
                  style={{
                  ...pos,
                  opacity: opacity,
                  transform: `rotate(${(i * 23) % 360}deg)`,
                  ...filterStyle
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
                    </div>

        {/* Content - Scrolls normally; paragraph left, heading + button right */}
        <div className="relative z-10 max-w-7xl mx-auto px-8 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <p
            className={`text-lg md:text-xl lg:text-2xl leading-relaxed animate-on-scroll fade text-left order-2 lg:order-1 ${visibleElements.has('get-involved-description') ? 'visible' : ''}`}
            style={{ fontFamily: 'var(--font-leiko)', color: 'var(--color-olive)', opacity: 0.92 }}
            data-animate-id="get-involved-description"
          >
            Want to become a member? Connect with passionate students and caring elders as we build meaningful relationships that bring generations together.
          </p>
          <div className="max-w-3xl text-right order-1 lg:order-2 lg:ml-auto">
            <h2
              className="text-4xl md:text-5xl lg:text-6xl font-bold leading-[0.95] tracking-tight"
              style={{ color: 'var(--color-olive)', fontFamily: 'var(--font-kollektif)' }}
              data-animate-id="get-involved-heading"
            >
              <span className="block">
                {['Want', 'to', 'Get'].map((word, i) => (
                  <span key={i}>
                    <span
                      className={visibleElements.has('get-involved-heading') ? 'word-fade-in-up-blur' : ''}
                      style={{
                        display: 'inline-block',
                        animationDelay: visibleElements.has('get-involved-heading') ? `${i * 0.12}s` : undefined,
                        opacity: visibleElements.has('get-involved-heading') ? undefined : 0,
                      }}
                    >
                      {word}
                    </span>
                    {i < 2 ? '\u00A0' : ''}
                  </span>
                ))}
              </span>
              <span className="block text-6xl md:text-7xl lg:text-8xl font-bold italic leading-[0.90] tracking-tight mt-[-0.2em] ml-[0.18em] md:ml-[0.24em]" style={{ fontFamily: 'var(--font-vintage-stylist)' }}>
                <span
                  className={visibleElements.has('get-involved-heading') ? 'word-fade-in-up-blur' : ''}
                  style={{
                    display: 'inline-block',
                    animationDelay: visibleElements.has('get-involved-heading') ? '0.36s' : undefined,
                    opacity: visibleElements.has('get-involved-heading') ? undefined : 0,
                  }}
                >
                  Involved?
                </span>
              </span>
            </h2>
            <div
              className={`mt-6 animate-on-scroll scale ${visibleElements.has('get-involved-button') ? 'visible' : ''}`}
              data-animate-id="get-involved-button"
            >
              <a
                href="/join-us"
                className="inline-block px-6 py-3 rounded-lg font-semibold text-sm md:text-base uppercase tracking-widest transition-all duration-300 hover:scale-[1.02]"
                style={{
                  background: 'var(--color-olive)',
                  color: 'var(--color-olive-light)',
                  fontFamily: 'var(--font-kollektif)',
                }}
                onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) => {
                  e.currentTarget.style.background = 'var(--color-olive-dark)'
                  e.currentTarget.style.color = 'var(--color-cream)'
                }}
                onMouseLeave={(e: React.MouseEvent<HTMLAnchorElement>) => {
                  e.currentTarget.style.background = 'var(--color-olive)'
                  e.currentTarget.style.color = 'var(--color-olive-light)'
                }}
              >
                Learn more
              </a>
            </div>
            {/* Quick socials */}
            <div className="mt-8 flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <span className="text-sm font-semibold uppercase tracking-wider" style={{ fontFamily: 'var(--font-kollektif)', color: 'var(--color-olive)' }}>
                Follow us
              </span>
              <div className="flex gap-3">
                <a
                  href="https://www.instagram.com/youth4elders/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full flex items-center justify-center transition-all hover:opacity-80 hover:scale-105"
                  style={{ background: 'var(--color-olive)', color: 'var(--color-cream)' }}
                  aria-label="Instagram"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
                <a
                  href="https://www.linkedin.com/company/youth4elders/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full flex items-center justify-center transition-all hover:opacity-80 hover:scale-105"
                  style={{ background: 'var(--color-olive)', color: 'var(--color-cream)' }}
                  aria-label="LinkedIn"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>


    </div>
  )
}
