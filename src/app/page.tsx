'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
// import { getFeatureHighlights } from '@/lib/contentful' // Not used directly, fetched via API
import type { FeatureHighlightSkeleton } from '@/types/featureHighlights'
import type { Entry } from 'contentful'

export default function Home() {
  const [scrollY, setScrollY] = useState(0)
  const [featureHighlights, setFeatureHighlights] = useState<Entry<FeatureHighlightSkeleton, undefined, string>[]>([])

  useEffect(() => {
    // Fetch data from API route
    fetch('/api/feature-highlights')
      .then(response => response.json())
      .then((highlights) => {
        console.log('Fetched highlights:', highlights)
        console.log('Highlights length:', highlights.length)
        setFeatureHighlights(highlights)
      })
      .catch((error) => {
        console.warn('Failed to fetch feature highlights:', error)
        setFeatureHighlights([])
      })

    // Scroll event listener for position tracking
    // Text stays visible at bottom - no hide/show logic needed here
    // Nav bar has its own hide/show logic in NavigationBar component
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      setScrollY(currentScrollY)
    }
    
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const sortedHighlights = [...featureHighlights].sort((a, b) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const orderA = (a.fields as any).order ?? 0
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const orderB = (b.fields as any).order ?? 0
    return (orderA as number) - (orderB as number)
  })

  // Text position animation threshold
  const positionAnimationThreshold = 100
  
  // Text stays at bottom like a watermark - it does NOT hide/show
  // Only the nav bar hides/shows, the text always stays visible at bottom
  const heroStyle = {
    // Start perfectly centered, move to bottom of screen on scroll
    top: scrollY < positionAnimationThreshold
      ? '50%' // Perfectly centered when at top
      : 'auto', // Auto top when at bottom
    bottom: scrollY < positionAnimationThreshold
      ? 'auto' // No bottom when centered
      : '24px', // Sticky at bottom with padding (watermark position)
    left: '50%',
    transform: scrollY < positionAnimationThreshold
      ? 'translate(-50%, -50%)' // Centered transform
      : 'translate(-50%, 0)', // Bottom position - always visible
    fontSize: scrollY < positionAnimationThreshold
      ? `clamp(4rem, 12vw, 8rem)` // Large when centered
      : '16px', // Smaller text when at bottom (watermark size)
    transition: 'all 0.3s ease-in-out',
    willChange: 'transform',
    opacity: 1 // Always visible - never fades out
  }


  return (
    <div className="min-h-screen">
      
      {/* Hero Section - Text moves from center to underneath logo on scroll */}
      <section className="relative h-[200vh] overflow-hidden pt-24" style={{
        background: '#F8F5ED'
      }}>
        {/* HERO CONTENT: Starts centered, moves to underneath logo on scroll */}
        <div 
          className="fixed z-40 font-bold italic transition-all duration-700 ease-in-out whitespace-nowrap"
          style={{
            ...heroStyle,
            fontFamily: 'var(--font-playfair)',
            pointerEvents: 'none',
            color: '#F8B4CB'
          }}
        >
          Youth 4 Elders
        </div>
        
      </section>

      {/* Main Header Section - Large image on left, content on right */}
      <section className="relative z-10 py-20" style={{ background: '#FFF0F5' }}>
        <div className="max-w-7xl mx-auto px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left side - Image placeholder (you can add an actual image later) */}
            <div className="relative">
              <div className="bg-gradient-to-br from-[#F8B4CB] to-[#F7D78B] rounded-3xl aspect-[4/5] flex items-center justify-center shadow-2xl">
                <div className="text-center p-8">
                  <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <svg className="w-16 h-16" style={{ color: '#8B6F5E' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <p className="font-medium" style={{ color: '#8B6F5E' }}>Community Connection</p>
                </div>
              </div>
              {/* Badge overlay */}
              <div className="absolute -bottom-6 -right-6 text-white rounded-full px-6 py-3 shadow-xl" style={{ background: '#9D7A6B' }}>
                <p className="font-bold text-sm">JOIN YOUTH 4 ELDERS</p>
              </div>
            </div>

            {/* Right side - Headline and content */}
            <div className="space-y-8">
              <h1 className="text-5xl md:text-7xl font-bold leading-tight" style={{ fontFamily: 'var(--font-playfair)', color: '#6B5D4F' }}>
                The Largest Student-Led Intergenerational Club at uOttawa
        </h1>
              
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold" style={{ fontFamily: 'var(--font-playfair)', color: '#8B6F5E' }}>
                  WELCOME TO THE HEART OF THE COMMUNITY
                </h2>
                <p className="text-lg leading-relaxed" style={{ fontFamily: 'var(--font-raleway)', color: '#9D7A6B' }}>
                  Youth 4 Elders brings together passionate students, caring elders, and meaningful connections—all in one welcoming, supportive space. Come experience the joy of bridging generations and making a positive impact in your community.
                </p>
              </div>

              <Link
                href="/events"
                className="inline-block text-white px-8 py-4 rounded-full font-semibold text-lg transition-colors shadow-lg hover:shadow-xl"
                style={{ fontFamily: 'var(--font-raleway)', background: '#8B6F5E' }}
              >
                VIEW UPCOMING EVENTS
              </Link>
            </div>
          </div>

          {/* Footer text */}
          <div className="mt-16 pt-8 border-t-2 text-center" style={{ borderColor: '#9D7A6B' }}>
            <p className="text-sm font-semibold text-white uppercase tracking-wide" style={{ 
              fontFamily: 'var(--font-raleway)',
              background: '#8B6F5E',
              padding: '12px 0',
              marginTop: '-1px'
            }}>
              RUN BY A COMMITTEE OF PASSIONATE STUDENTS & COMMUNITY MEMBERS
            </p>
          </div>
        </div>
      </section>

      {/* Brown/Warm Band Section - Who We Are & Our Mission */}
      <section className="relative z-10 py-20" style={{ background: '#8B6F5E' }}>
        <div className="max-w-7xl mx-auto px-8">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Who We Are Box */}
            <div className="rounded-2xl p-10 shadow-xl" style={{ background: '#F8F5ED' }}>
              <h3 className="text-3xl font-bold mb-6" style={{ fontFamily: 'var(--font-playfair)', color: '#6B5D4F' }}>
                Who We Are
              </h3>
              <p className="leading-relaxed text-lg" style={{ fontFamily: 'var(--font-raleway)', color: '#9D7A6B' }}>
                Youth 4 Elders is a community-driven initiative proudly run by a passionate committee of uOttawa students and community members. We aim to create a space for meaningful connections, shared experiences, and intergenerational learning.
              </p>
            </div>

            {/* Our Mission Box */}
            <div className="rounded-2xl p-10 shadow-xl" style={{ background: '#F8F5ED' }}>
              <h3 className="text-3xl font-bold mb-6" style={{ fontFamily: 'var(--font-playfair)', color: '#6B5D4F' }}>
                Our Mission
              </h3>
              <p className="leading-relaxed text-lg" style={{ fontFamily: 'var(--font-raleway)', color: '#9D7A6B' }}>
                To connect our community through meaningful intergenerational relationships while fostering empathy, understanding, and shared experiences between youth and elders.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Ways to Get Involved Section - 2x2 Grid */}
      <section className="relative z-10 py-20">
        <div className="max-w-7xl mx-auto px-8">
          <h2 className="text-5xl md:text-6xl font-bold text-center mb-16" style={{ fontFamily: 'var(--font-playfair)', color: '#6B5D4F' }}>
            Ways to Get Involved
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Become a Volunteer */}
            <div className="rounded-2xl p-10 shadow-xl hover:shadow-2xl transition-shadow" style={{ background: '#F8F5ED' }}>
              <div className="w-16 h-16 rounded-lg flex items-center justify-center mb-6" style={{ background: '#F8B4CB' }}>
                <svg className="w-8 h-8" style={{ color: '#8B6F5E' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4" style={{ fontFamily: 'var(--font-playfair)', color: '#7A5C5C' }}>
                Become a Volunteer
              </h3>
              <p className="leading-relaxed mb-4" style={{ fontFamily: 'var(--font-raleway)', color: '#9D7A6B' }}>
                Join us in organizing workshops, assisting with events, or simply spending quality time with our elder community members.
              </p>
              <div className="flex gap-4 text-sm font-semibold" style={{ color: '#A68B7D' }}>
                <span>FLEXIBLE HRS</span>
                <span>•</span>
                <span>FAMILY FRIENDLY</span>
              </div>
            </div>

            {/* Host/Sponsor an Event */}
            <div className="rounded-2xl p-10 shadow-xl hover:shadow-2xl transition-shadow" style={{ background: '#F8F5ED' }}>
              <div className="w-16 h-16 rounded-lg flex items-center justify-center mb-6" style={{ background: '#F0C8B9' }}>
                <svg className="w-8 h-8" style={{ color: '#9D7A6B' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4" style={{ fontFamily: 'var(--font-playfair)', color: '#8B6F5E' }}>
                Host/Sponsor an Event
              </h3>
              <p className="leading-relaxed mb-4" style={{ fontFamily: 'var(--font-raleway)', color: '#A68B7D' }}>
                Partner with us to host workshops, community gatherings, or special events that bring generations together.
              </p>
              <div className="flex gap-4 text-sm font-semibold" style={{ color: '#B89A8A' }}>
                <span>PRIVATE EVENTS</span>
                <span>•</span>
                <span>INDOOR OR OUTDOOR</span>
              </div>
            </div>

            {/* Attend Workshops */}
            <div className="rounded-2xl p-10 shadow-xl hover:shadow-2xl transition-shadow" style={{ background: '#F8F5ED' }}>
              <div className="w-16 h-16 rounded-lg flex items-center justify-center mb-6" style={{ background: '#F7D78B' }}>
                <svg className="w-8 h-8" style={{ color: '#7A5C5C' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4" style={{ fontFamily: 'var(--font-playfair)', color: '#6B5D4F' }}>
                Attend Workshops
              </h3>
              <p className="leading-relaxed mb-4" style={{ fontFamily: 'var(--font-raleway)', color: '#9D7A6B' }}>
                Participate in our intergenerational workshops, storytelling sessions, and community activities that create meaningful connections.
              </p>
              <div className="flex gap-4 text-sm font-semibold" style={{ color: '#A68B7D' }}>
                <span>FREE TO ATTEND</span>
                <span>•</span>
                <span>EVERY WEEK</span>
              </div>
            </div>

            {/* Join as a Member */}
            <div className="rounded-2xl p-10 shadow-xl hover:shadow-2xl transition-shadow" style={{ background: '#F8F5ED' }}>
              <div className="w-16 h-16 rounded-lg flex items-center justify-center mb-6" style={{ background: '#F8B4CB' }}>
                <svg className="w-8 h-8" style={{ color: '#8B6F5E' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4" style={{ fontFamily: 'var(--font-playfair)', color: '#7A5C5C' }}>
                Join as a Member
        </h3>
              <p className="leading-relaxed mb-4" style={{ fontFamily: 'var(--font-raleway)', color: '#9D7A6B' }}>
                Become an official member of Youth 4 Elders and help shape our community initiatives and programs.
              </p>
              <div className="flex gap-4 text-sm font-semibold" style={{ color: '#A68B7D' }}>
                <span>NO FEE</span>
                <span>•</span>
                <span>OPEN TO ALL</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Highlights Section */}
      <section className="relative z-10 py-20">
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-bold mb-4" style={{ fontFamily: 'var(--font-playfair)', color: '#6B5D4F' }}>
              FROM IDEA TO IMPACT
            </h2>
            <p className="text-2xl" style={{ fontFamily: 'var(--font-playfair)', color: '#F8B4CB' }}>Our Journey</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sortedHighlights.length > 0 ? sortedHighlights.map((highlight, index) => {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              const f = highlight.fields as any
              const imageUrl: string | undefined = f.image?.fields?.file?.url
              const imageAlt: string =
                f.image?.fields?.description || (f.title as string) || 'Feature image'

              return (
                <div key={highlight.sys.id} className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden">
                  <div className="relative">
                    {imageUrl ? (
                      <div className="aspect-video w-full overflow-hidden">
                        <Image
                          src={`https:${imageUrl}`}
                          alt={imageAlt}
                          width={400}
                          height={300}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    ) : (
                      <div className="aspect-video w-full bg-gradient-to-br from-pink-100 to-orange-100 flex items-center justify-center">
                        <div className="text-center">
                          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-md">
                            <svg
                              className="w-8 h-8 text-pink-600"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M4 7h16M4 12h16M4 17h16"
                              />
                            </svg>
                          </div>
                          <p className="font-medium text-pink-600">Highlight</p>
                        </div>
                      </div>
                    )}
                    <div className="absolute top-4 left-4 backdrop-blur-sm rounded-full w-8 h-8 flex items-center justify-center" style={{ background: '#F8F5ED' }}>
                      <span className="text-sm font-bold" style={{ color: '#8B6F5E' }}>{index + 1}</span>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <h4 className="text-xl font-bold mb-3" style={{ fontFamily: 'var(--font-playfair)', color: '#8B6F5E' }}>
                      {f.title as string}
                    </h4>
                    <p className="leading-relaxed" style={{ fontFamily: 'var(--font-raleway)', color: '#9D7A6B' }}>
                      {typeof f.description === 'string'
                        ? f.description
                        : 'Creating meaningful connections through shared experiences between generations.'}
                    </p>
                  </div>
                </div>
              )
            }) : (
              <div className="col-span-full text-center py-16">
                <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6" style={{ background: '#F0C8B9' }}>
                  <svg className="w-10 h-10" style={{ color: '#7A5C5C' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h4 className="text-xl font-semibold mb-2" style={{ fontFamily: 'var(--font-playfair)', color: '#8B6F5E' }}>Loading Highlights</h4>
                <p style={{ fontFamily: 'var(--font-raleway)', color: '#9D7A6B' }}>We&apos;re preparing our journey highlights for you...</p>
          </div>
            )}
          </div>
          </div>
        </section>


    </div>
  )
}