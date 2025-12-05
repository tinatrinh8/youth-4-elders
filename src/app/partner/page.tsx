'use client'

import Image from 'next/image'
import React, { useRef } from 'react'

export default function Partner() {
  const slowDownIntervals = useRef<Map<HTMLElement, NodeJS.Timeout>>(new Map())

  return (
    <main className="min-h-screen pb-20" style={{ background: 'var(--color-cream)', overflow: 'visible' }}>
      {/* Hero Section with Images Around Text */}
      <section 
        className="relative min-h-[200vh] flex items-center justify-center py-20"
        style={{ background: 'var(--color-cream)', overflow: 'visible' }}
      >
        {/* Sponsor Photos - 5 Images Total */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{ 
            zIndex: 1
          }}
        >
          {/* Top Left - Horizontal (teach.jpg) */}
          <div className="absolute" style={{ top: '11%', left: '3%' }}>
            <div className="relative w-64 h-48 md:w-80 md:h-60 lg:w-96 lg:h-72 rounded-lg overflow-hidden shadow-2xl" style={{ background: 'var(--color-cream)' }}>
              <Image src="/assets/sponsors/teach.jpg" alt="Intergenerational learning" fill className="object-cover" />
            </div>
          </div>
          
          {/* Top Right - Vertical (teach2.jpg) */}
          <div className="absolute" style={{ top: '5%', right: '3%' }}>
            <div className="relative w-48 h-64 md:w-60 md:h-80 lg:w-72 lg:h-96 rounded-lg overflow-hidden shadow-2xl" style={{ background: 'var(--color-cream)' }}>
              <Image src="/assets/sponsors/teach2.jpg" alt="Intergenerational connection" fill className="object-cover" />
            </div>
          </div>
          
          {/* Middle Left - Vertical (book.jpg) */}
          <div className="absolute" style={{ top: '55%', left: '0%', transform: 'translateY(-50%)' }}>
            <div className="relative w-48 h-64 md:w-60 md:h-80 lg:w-72 lg:h-96 rounded-lg overflow-hidden shadow-2xl" style={{ background: 'var(--color-cream)' }}>
              <Image src="/assets/sponsors/book.jpg" alt="Books and learning" fill className="object-cover" />
            </div>
          </div>
          
          {/* Middle Right - Vertical (phone.jpg) */}
          <div className="absolute" style={{ top: '45%', right: '20%', transform: 'translateY(-50%)' }}>
            <div className="relative w-48 h-64 md:w-60 md:h-80 lg:w-72 lg:h-96 rounded-lg overflow-hidden shadow-2xl" style={{ background: 'var(--color-cream)' }}>
              <Image src="/assets/sponsors/phone.jpg" alt="Technology and connection" fill className="object-cover" />
            </div>
          </div>
          
          {/* Bottom Center - Horizontal (old.jpg) */}
          <div className="absolute" style={{ bottom: '15%', left: '85%', transform: 'translateX(-50%)' }}>
            <div className="relative w-80 h-56 md:w-96 md:h-64 lg:w-[500px] lg:h-[350px] rounded-lg overflow-hidden shadow-2xl" style={{ background: 'var(--color-cream)' }}>
              <Image src="/assets/sponsors/old.jpg" alt="Elders with technology" fill className="object-cover" />
            </div>
          </div>
        </div>

        {/* Hero Content - Centered, Higher Up */}
        <div className="relative z-10 max-w-4xl mx-auto px-8 md:px-12 lg:px-16" style={{ marginTop: '-100vh' }}>
          <div className="text-center mb-8">
            <div 
              className="text-xs md:text-sm uppercase tracking-widest mb-4"
              style={{ 
                fontFamily: 'var(--font-kollektif)', 
                color: 'var(--color-brown-medium)',
                letterSpacing: '0.2em'
              }}
            >
              ( OUR SUPPORT )
            </div>
            <h1 
              className="text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-bold mb-8 leading-tight" 
              style={{ 
                fontFamily: 'var(--font-vintage-stylist)', 
                color: 'var(--color-brown-dark)'
              }}
            >
              Partners &<br />Sponsors
            </h1>
          </div>
          <p 
            className="text-sm md:text-base lg:text-lg max-w-2xl mx-auto leading-relaxed text-left" 
            style={{ 
              fontFamily: 'var(--font-leiko)', 
              color: 'var(--color-brown-medium)'
            }}
          >
            We wouldn&apos;t be able to do this without the generous support of our partners and sponsors. Their commitment to our mission enables us to grow our club and make a meaningful impact in our community.
          </p>
        </div>

        {/* Our Partner Section - Positioned at Bottom Left */}
        <div className="absolute bottom-16 left-16 md:left-24 lg:left-32 z-10 max-w-3xl" style={{ pointerEvents: 'auto' }}>
          {/* Text Content */}
          <div>
              {/* Title with Logo Next to It */}
              <div className="mb-5 relative" style={{ marginTop: '2rem' }}>
                <h2 
                  className="text-4xl md:text-5xl lg:text-6xl font-bold leading-none"
                  style={{ 
                    fontFamily: 'var(--font-vintage-stylist)', 
                    color: 'var(--color-brown-dark)'
                  }}
                >
                  Our
                </h2>
                <h2 
                  className="text-4xl md:text-5xl lg:text-6xl font-bold leading-none"
                  style={{ 
                    fontFamily: 'var(--font-vintage-stylist)', 
                    color: 'var(--color-brown-dark)',
                  
                  }}
                >
                  Partner
                </h2>
                {/* Logo - Positioned independently */}
                <div className="absolute w-40 h-40 md:w-52 md:h-52 lg:w-64 lg:h-64" style={{ 
                  left: '300px',
                  top: '-85px'
                }}>
                  <Image
                    src="/assets/sponsors/glebe.png"
                    alt="The Glebe Centre"
                    fill
                    className="object-contain"
                  />
                </div>
              </div>
              
              {/* Divider Line */}
              <div 
                className="w-20 h-0.5 mb-5"
                style={{ background: 'var(--color-brown-medium)' }}
              />
              
              {/* Body Paragraph */}
              <p 
                className="text-base md:text-lg leading-relaxed mb-6 max-w-2xl"
                style={{ 
                  fontFamily: 'var(--font-kollektif)', 
                  color: 'var(--color-brown-medium)'
                }}
              >
                And, as a community organization, ours is more than valuable. Our partnership experience is carefully crafted and regularly evaluated to ensure we make the absolute most of our time working together.
              </p>
              
              <a
                href="https://glebecentre.ca/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-6 py-3 rounded-full transition-all duration-300 hover:scale-105"
                style={{ 
                  background: 'var(--color-pink-medium)',
                  border: '2px solid var(--color-brown-dark)',
                  color: 'var(--color-cream)',
                  fontFamily: 'var(--font-kollektif)',
                  fontWeight: '600'
                }}
              >
                Visit Our Partner →
              </a>
            </div>
        </div>
      </section>

      {/* Sponsors Section - Normal Scroll */}
      <section className="relative z-20 pt-8 md:pt-12 pb-20 md:pb-32" style={{ background: 'var(--color-cream)' }}>
        <div className="max-w-7xl mx-auto px-8">
            {/* Main Card Container - Paper Pad */}
            <div 
              className="relative rounded-2xl p-8 md:p-12 shadow-2xl overflow-hidden"
              style={{ 
                background: 'var(--aura-secondary)',
                border: '4px solid var(--color-pink-medium)',
                boxShadow: '0 8px 24px rgba(100, 50, 27, 0.2)'
              }}
            >
              {/* Title Section */}
              <div className="text-center mb-12 md:mb-16 relative z-10 pt-8">
                <h2 
                  className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4"
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
                    color: 'var(--color-brown-dark)'
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
                      borderTop: '2px dashed var(--color-brown-dark)',
                      ['--swing-duration' as string]: '1s'
                    } as React.CSSProperties}
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
                className="absolute bottom-6 right-8 md:right-12 transform rotate-12 transition-all duration-300 hover:scale-110"
                style={{
                  width: '120px',
                  height: '70px',
                  background: 'linear-gradient(135deg, var(--color-pink-light) 0%, var(--color-cream) 100%)',
                  border: '3px dashed var(--color-pink-medium)',
                  borderRadius: '4px',
                  padding: '10px',
                  boxShadow: '0 4px 12px rgba(244, 142, 184, 0.3)',
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
                      color: 'var(--color-brown-dark)',
                      textShadow: '1px 1px 2px rgba(255, 255, 255, 0.5)'
                    }}
                  >
                    THANK YOU
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>
    </main>
  )
}

