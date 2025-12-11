'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'

export default function ClubInfo() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <main className="min-h-screen" style={{ background: 'var(--color-cream)' }}>
      
      <div 
        style={{
          position: 'relative',
          height: '200vh', 
          zIndex: 2
        }}
      >
        <section 
          className="relative"
          style={{
            position: 'sticky', 
            top: 0,
            height: '80vh',
            zIndex: 2,          
            display: 'flex',
            alignItems: 'center',
            background: 'var(--color-cream)', 
          }}
        >
          <div className="max-w-7xl mx-auto px-8 w-full flex items-center pt-[100px] pb-[1rem]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 lg:gap-10 w-full">
              
              {/* Left Column - Photo */}
              <div 
                className="relative w-full flex items-center transition-all duration-1000"
                style={{
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible ? 'translateX(0)' : 'translateX(-30px)',
                  transitionDelay: '200ms'
                }}
              >
                <div className="relative w-full h-[50vh] md:h-[55vh] rounded-lg overflow-hidden" style={{ boxShadow: '0 8px 24px rgba(100, 50, 27, 0.15)' }}>
                  <div className="w-full h-full flex items-center justify-center" style={{ background: 'rgba(152, 90, 64, 0.1)' }}>
                    <p style={{ fontFamily: 'var(--font-leiko)', color: 'var(--color-brown-medium)', fontSize: '1.25rem', textAlign: 'center', padding: '2rem' }}>
                      [Club Photo Placeholder]
                    </p>
                  </div>
                </div>
              </div>

            {/* Right Column - About Us Text */}
            <div 
              className="flex items-center transition-all duration-1000 w-full"
              style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateX(0)' : 'translateX(30px)',
                transitionDelay: '400ms'
              }}
            >
              <div className="w-full">
                <h1 
                  className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold mb-4 md:mb-5 leading-tight"
                  style={{ 
                    fontFamily: 'var(--font-vintage-stylist)', 
                    color: 'var(--color-brown-dark)'
                  }}
                >
                  We&apos;re Not Just a Club.<br />We&apos;re Your Community Partners.
        </h1>
                
                <div 
                  className="w-16 h-0.5 mb-4 md:mb-5"
                  style={{ background: 'var(--color-brown-dark)' }}
                />

                <div className="space-y-3 md:space-y-4">
                  <p 
                    className="text-sm md:text-base leading-relaxed"
                    style={{ 
                      fontFamily: 'var(--font-leiko)', 
                      color: 'var(--color-brown-dark)',
                      opacity: 0.9
                    }}
                  >
                    Youth 4 Elders was born from that hard-to-pinpoint, yet monumental, moment where passion meets clear purpose - the realization that bridging generations could create something truly meaningful for our community.
                  </p>
                  <p 
                    className="text-sm md:text-base leading-relaxed"
                    style={{ 
                      fontFamily: 'var(--font-leiko)', 
                      color: 'var(--color-brown-dark)',
                      opacity: 0.9
                    }}
                  >
                    Our club is dedicated to redefining what&apos;s possible for intergenerational connections. We&apos;ve witnessed the life-changing impact of bringing youth and elders together, and we&apos;re committed to helping our community revel in meaningful relationships, one workshop, one story, one connection at a time.
                  </p>
                </div>
              </div>
            </div>
            </div>
          </div>
        </section>

        <section 
          className="py-16 md:py-24"
          style={{ 
            position: 'absolute', 
            top: '100vh',
            left: 0,
            right: 0,
            width: '100%',
            height: '100vh',
            background: 'var(--color-pink-light)',
            zIndex: 3,
            pointerEvents: 'auto'
          }}
        >
          <div className="max-w-7xl mx-auto px-8">
            <div className="text-center mb-12 md:mb-16">
              <p 
                className="text-sm md:text-base uppercase tracking-widest mb-4"
                style={{ 
                  fontFamily: 'var(--font-kollektif)', 
                  color: 'var(--color-brown-dark)',
                  letterSpacing: '0.2em'
                }}
              >
                Small Team, Big Impact
              </p>
              <h2 
                className="text-3xl md:text-5xl lg:text-6xl font-bold italic mb-6"
                style={{ 
                  fontFamily: 'var(--font-vintage-stylist)', 
                  color: 'var(--color-brown-dark)'
                }}
              >
                The Founders
              </h2>
            </div>

            {/* Founders Photo */}
            <div className="max-w-3xl mx-auto mb-16">
              <div 
                className="relative w-full h-[400px] md:h-[500px] rounded-2xl overflow-hidden"
                style={{ 
                  boxShadow: '0 8px 24px rgba(100, 50, 27, 0.15)'
                }}
              >
                <div className="w-full h-full flex items-center justify-center" style={{ background: 'rgba(152, 90, 64, 0.1)' }}>
                  <p style={{ fontFamily: 'var(--font-leiko)', color: 'var(--color-brown-medium)', fontSize: '1.25rem' }}>
                    [Founders Photo Placeholder - Photo of both founders together]
                  </p>
                </div>
              </div>
            </div>

            {/* Story of Formation */}
            <div className="max-w-4xl mx-auto pt-16 border-t" style={{ borderColor: 'rgba(152, 90, 64, 0.2)' }}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
                <div>
                  <p 
                    className="text-xs md:text-sm uppercase tracking-widest mb-4"
                    style={{ 
                      fontFamily: 'var(--font-kollektif)', 
                      color: 'var(--color-pink-dark)',
                      letterSpacing: '0.2em'
                    }}
                  >
                    IT&apos;S ALL IN OUR NAME
                  </p>
                  <p 
                    className="text-2xl md:text-3xl lg:text-4xl leading-tight mb-6"
                    style={{ 
                      fontFamily: 'var(--font-vintage-stylist)', 
                      color: 'var(--color-brown-dark)'
                    }}
                  >
                    Youth 4 Elders represents our commitment to bringing together two generations that have so much to offer each other.
                  </p>
                </div>
                <div>
                  <p 
                    className="text-base md:text-lg leading-relaxed mb-4"
                    style={{ 
                      fontFamily: 'var(--font-leiko)', 
                      color: 'var(--color-brown-dark)'
                    }}
                  >
                    We founded Youth 4 Elders with a simple yet powerful vision: to bridge the generational gap through meaningful connections, shared experiences, and mutual learning. What started as an idea between two friends has grown into a vibrant community of students and elders working together to create positive change.
                  </p>
                  <p 
                    className="text-base md:text-lg leading-relaxed"
                    style={{ 
                      fontFamily: 'var(--font-leiko)', 
                      color: 'var(--color-brown-dark)'
                    }}
                  >
                    Through workshops, technology assistance, storytelling sessions, and intergenerational events, we&apos;ve created a space where wisdom meets innovation, and where every interaction enriches both generations.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <section 
        className="py-16 md:py-24"
        style={{
          position: 'relative',
          zIndex: 4,
          background: 'var(--color-pink-light)'
        }}
      >
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center mb-16 md:mb-20">
            <p 
              className="text-xs md:text-sm uppercase tracking-widest mb-4"
              style={{ 
                fontFamily: 'var(--font-kollektif)', 
                color: 'var(--color-brown-dark)',
                letterSpacing: '0.2em'
              }}
            >
              INTRODUCTION
            </p>
            <h2 
              className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 max-w-4xl mx-auto leading-tight"
              style={{ 
                fontFamily: 'var(--font-vintage-stylist)', 
                color: 'var(--color-brown-dark)'
              }}
            >
              We consider every touchpoint, how our club shows up in the community, and how we can connect generations.
            </h2>
          </div>

          {/* Three Column Layout */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {/* Column 1: How the Club Works */}
            <div>
              <h3 
                className="text-xl md:text-2xl font-bold mb-4"
                style={{ 
                  fontFamily: 'var(--font-vintage-stylist)', 
                  color: 'var(--color-brown-dark)'
                }}
              >
                How the Club Works
              </h3>
              <p 
                className="text-base leading-relaxed"
                style={{ 
                  fontFamily: 'var(--font-leiko)', 
                  color: 'var(--color-brown-dark)'
                }}
              >
                Our club operates through a combination of executive leadership and community volunteers. We organize regular workshops, events, and activities that bring youth and elders together. From technology assistance sessions to craft fairs, every program is designed to foster meaningful connections and mutual learning.
              </p>
            </div>

            {/* Column 2: What We Do */}
            <div>
              <h3 
                className="text-xl md:text-2xl font-bold mb-4"
                style={{ 
                  fontFamily: 'var(--font-vintage-stylist)', 
                  color: 'var(--color-brown-dark)'
                }}
              >
                What We Do
              </h3>
              <p 
                className="text-base leading-relaxed"
                style={{ 
                  fontFamily: 'var(--font-leiko)', 
                  color: 'var(--color-brown-dark)'
                }}
              >
                We organize a variety of intergenerational activities including technology help sessions, storytelling workshops, craft fairs, and community events. Our programs are designed to be accessible, engaging, and beneficial for both youth participants and elder community members.
              </p>
            </div>

            {/* Column 3: Mission */}
            <div>
              <h3 
                className="text-xl md:text-2xl font-bold mb-4"
                style={{ 
                  fontFamily: 'var(--font-vintage-stylist)', 
                  color: 'var(--color-brown-dark)'
                }}
              >
                Our Mission
              </h3>
              <p 
                className="text-base leading-relaxed"
                style={{ 
                  fontFamily: 'var(--font-leiko)', 
                  color: 'var(--color-brown-dark)'
                }}
              >
                We value the same things: compassion, respect, and innovation. Our mission is to bridge generational gaps by creating opportunities for meaningful connections, shared learning, and mutual support that enriches the lives of both youth and elders in our community.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}