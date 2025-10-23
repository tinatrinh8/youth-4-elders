'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { getFeatureHighlights } from '@/lib/contentful'
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

    // Scroll event listener
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const sortedHighlights = [...featureHighlights].sort((a, b) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const orderA = (a.fields as any).order ?? 0
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const orderB = (b.fields as any).order ?? 0
    return (orderA as number) - (orderB as number)
  })

  // Calculate the fade out/zoom effect based on scrollY
  const contentScale = Math.max(1, 1 + scrollY * 0.01) // Faster zoom to get text off screen quicker
  const contentOpacity = Math.max(0, 1 - scrollY * 0.002) // Faster fade out to disappear sooner

  // Calculate the position of the following sections (they appear once the Hero scroll is finished)
  // We'll use the scroll position relative to the end of the Hero section (HERO_SCROLL_DISTANCE)

  // Calculate smooth gradient colors based on scroll position - keeping baby colors but changing order/flow
  const getGradientStyle = () => {
    const progress = Math.max(0, Math.min(1, (scrollY - 500) / 3000))
    
    // Smooth rotation of gradient direction
    const angle = 135 + (progress * 180)
    
    // Original baby colors
    const pink = 'rgb(255, 192, 203)'    // Baby pink
    const orange = 'rgb(255, 220, 177)'  // Baby orange  
    const yellow = 'rgb(255, 255, 224)'  // Baby yellow
    
    // Smooth color mixing using sine waves for organic transitions
    const pinkMix = 0.5 + 0.5 * Math.sin(progress * Math.PI * 2)
    const orangeMix = 0.5 + 0.5 * Math.sin(progress * Math.PI * 2 + Math.PI * 2/3)
    const yellowMix = 0.5 + 0.5 * Math.sin(progress * Math.PI * 2 + Math.PI * 4/3)
    
    // Create smooth color transitions by mixing the colors
    const color1 = `rgb(${255}, ${192 + (220-192) * pinkMix}, ${203 + (177-203) * pinkMix})`
    const color2 = `rgb(${255}, ${220 + (255-220) * orangeMix}, ${177 + (224-177) * orangeMix})`
    const color3 = `rgb(${255}, ${255 + (192-255) * yellowMix}, ${224 + (203-224) * yellowMix})`
    
    return {
      background: `linear-gradient(${angle}deg, ${color1}, ${color2}, ${color3})`
    }
  }

  return (
    <div className="min-h-screen">
      
      {/* Dynamic Gradient Background */}
      <div 
        className="fixed inset-0 z-0 transition-all duration-1000 ease-out"
        style={{
          ...getGradientStyle(),
          opacity: Math.max(0, Math.min(1, (scrollY - 500) / 800))
        }}
      ></div>
      
      {/* Hero Section with Zoom Effect */}
      {/* Set minimum height to 100vh so the fixed content can center itself, but the spacer handles the scroll. */}
      <section className="relative h-screen overflow-hidden">
        
        {/* AURA BUBBLES - Animated aura effect (assuming you have a CSS file defining .aura-bubble classes) */}
        <div className="absolute inset-0">
          <div className="aura-bubble aura-bubble-1"></div>
          <div className="aura-bubble aura-bubble-2"></div>
          <div className="aura-bubble aura-bubble-3"></div>
          </div>
        
        
        {/* HERO CONTENT: Zooms until it goes off-screen */}
        <div 
          className="fixed top-1/2 left-1/2 z-10 max-w-4xl text-center px-6"
          style={{
            transform: `translate(-50%, -50%) scale(${contentScale})`,
            opacity: contentOpacity
          }}
        >
          <h2 className="text-5xl lg:text-7xl font-bold text-gray-900 mb-8 leading-tight whitespace-nowrap" style={{ fontFamily: 'Sora, sans-serif' }}>
            Youth4Elders is{' '}
            <span className="bg-gradient-to-r from-pink-600 via-orange-600 to-yellow-600 bg-clip-text text-transparent">
              now live!
            </span>
        </h2>
          <p className="text-lg md:text-xl font-medium mb-8 text-gray-700 max-w-3xl mx-auto leading-relaxed" style={{ fontFamily: 'Geist, sans-serif' }}>
            We empower youth to support and uplift the elder community through workshops,
            stories, and shared moments.
          </p>
        </div>
      </section>

       {/* 🛑 SPACER ELEMENT: FIXES THE BUNCHING ISSUE 🛑 */}
       {/* This element reserves the space that the fixed Hero content would have taken */}
       <div style={{ height: '200vh' }} aria-hidden="true" />


       {/* About Section - Only appears after hero text is completely gone */}
       <section 
         className="py-32 px-6 relative z-10" 
         style={{ 
           marginTop: '-100vh',
           opacity: Math.max(0, Math.min(1, (scrollY - 1000) / 200)) // Content appears after text is gone
         }}
       >
        <div className="max-w-4xl mx-auto">
          <h3 className="text-4xl md:text-6xl font-bold text-gray-900 mb-12 text-center" style={{ fontFamily: 'Sora, sans-serif' }}>
            Welcome to uOttawa&apos;s Youth 4 Elders!
        </h3>
              <div className="space-y-6 text-lg md:text-xl text-gray-800 leading-relaxed" style={{ fontFamily: 'Inter, sans-serif' }}>
            <p>
              Youth 4 Elders is now live at the University of Ottawa — and we
              couldn&apos;t be more excited to start this journey with all of you.
            </p>
            <p>Our club is dedicated to:</p>
            <ul className="list-disc list-inside space-y-4 italic text-gray-700 max-w-3xl mx-auto text-lg">
              <li>Connecting young volunteers with elderly community members</li>
              <li>Bridging generations through workshops and shared experiences</li>
              <li>Promoting empathy, kindness, and lifelong learning</li>
            </ul>
            <blockquote className="border-l-4 border-pink-400 pl-6 italic text-gray-700 text-center max-w-3xl mx-auto mt-8 text-xl">
              &ldquo;We believe meaningful impact starts with meaningful connection.&rdquo;
            </blockquote>
          </div>
        </div>
      </section>

      {/* Spacer between sections */}
      <div className="py-20" aria-hidden="true" />

        {/* Feature Highlights - Now scrolls normally */}
        <section 
          className="py-40 px-6 relative z-20"
          style={{
            opacity: Math.max(0, Math.min(1, (scrollY - 1500) / 200)) // Appears after About section
          }}
        >
        <div className="max-w-6xl mx-auto">
          <h3 className="text-4xl md:text-6xl font-bold text-gray-900 mb-16 text-center" style={{ fontFamily: 'Sora, sans-serif' }}>
            FROM IDEA TO IMPACT
            <span className="block text-2xl md:text-3xl text-pink-600 mt-4" style={{ fontFamily: 'Geist, sans-serif' }}>Our Journey</span>
          </h3>

          <div className="flex gap-8 overflow-x-auto md:overflow-visible no-scrollbar justify-center">
            {sortedHighlights.length > 0 ? sortedHighlights.map((highlight, index) => {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              const f = highlight.fields as any
              const imageUrl: string | undefined = f.image?.fields?.file?.url
              const imageAlt: string =
                f.image?.fields?.description || (f.title as string) || 'Feature image'

              return (
                <div key={highlight.sys.id} className="group w-80 flex-shrink-0">
                  <div className="text-lg font-medium text-gray-500 mb-4 text-center">
                    {String(index + 1).padStart(2, '0')}
                  </div>

                  <div className="bg-gradient-to-br from-pink-200 to-orange-200 rounded-lg overflow-hidden mb-4 group-hover:shadow-xl transition-shadow">
                    {imageUrl ? (
                      <div className="w-full flex items-center justify-center bg-gray-100">
                        <Image
                          src={`https:${imageUrl}`}
                          alt={imageAlt}
                          width={400}
                          height={300}
                          className="w-full h-auto object-cover"
                          style={{ maxHeight: 300 }}
                        />
                      </div>
                    ) : (
                      <div className="aspect-[3/4] w-full h-full flex items-center justify-center">
                        <div className="text-center">
                          <div className="w-16 h-16 bg-white/80 rounded-full flex items-center justify-center mx-auto mb-3">
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
                  </div>

                  <h4 className="text-2xl font-bold text-gray-900 mb-4 text-center" style={{ fontFamily: 'Sora, sans-serif' }}>
                    {f.title as string}
                  </h4>
                      <p className="text-gray-700 text-base leading-relaxed text-center" style={{ fontFamily: 'Inter, sans-serif' }}>
                    {typeof f.description === 'string'
                      ? f.description
                      : 'Creating meaningful connections through shared experiences between generations.'}
                  </p>
                </div>
              )
            }) : (
              <div className="w-full text-center py-8">
                <div className="text-gray-500 mb-4">No feature highlights found. Check console for details.</div>
                <div className="text-sm text-gray-400">
                  Debug info: sortedHighlights.length = {sortedHighlights.length}
                </div>
              </div>
            )}
          </div>
          </div>
        </section>

      {/* Spacer between sections */}
      <div className="py-20" aria-hidden="true" />

        {/* Blog CTA */}
        <section 
          className="py-40 px-6 relative z-20 mb-30"
          style={{
            opacity: Math.max(0, Math.min(1, (scrollY - 2200) / 200)) // Appears after Feature Highlights
          }}
        >
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-4xl md:text-6xl font-bold text-gray-900 mb-8" style={{ fontFamily: 'Sora, sans-serif' }}>
            Catch Up With the Club
          </h3>
              <p className="text-xl md:text-2xl text-gray-800 mb-12 leading-relaxed max-w-4xl mx-auto" style={{ fontFamily: 'Inter, sans-serif' }}>
            Curious about what we&apos;ve been working on? Check out our latest blog posts for stories
            from our workshops, community reflections, and behind-the-scenes moments with our team.
          </p>
          <Link
            href="/blog"
            className="inline-block px-12 py-6 bg-black text-white rounded-full hover:bg-gray-800 transition-colors font-bold text-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            Read the Blog
          </Link>
        </div>
      </section>


    </div>
  )
}