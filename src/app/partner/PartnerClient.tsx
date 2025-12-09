'use client'

import Image from 'next/image'
import React, { useRef, useState, useEffect } from 'react'
import type { Entry } from 'contentful'
import type { PartnerSkeleton, SponsorSkeleton } from '@/types/partner'
import { documentToReactComponents } from '@contentful/rich-text-react-renderer'
import type { Document } from '@contentful/rich-text-types'

interface PartnerClientProps {
  partners: Entry<PartnerSkeleton>[]
  sponsors: Entry<SponsorSkeleton>[]
}

export default function PartnerClient({ partners, sponsors }: PartnerClientProps) {
  const [heroVisible, setHeroVisible] = useState(false)
  const [imagesVisible, setImagesVisible] = useState<boolean[]>([])
  const [partnerVisible, setPartnerVisible] = useState(false)
  const [sponsorsVisible, setSponsorsVisible] = useState(false)
  const [displayedPartners, setDisplayedPartners] = useState<Entry<PartnerSkeleton>[]>([])
  const heroRef = useRef<HTMLDivElement>(null)
  const partnerRef = useRef<HTMLDivElement>(null)
  const sponsorsRef = useRef<HTMLDivElement>(null)
  const imageRefs = useRef<(HTMLDivElement | null)[]>([])

  // Initialize with first partner if available, or show fallback
  useEffect(() => {
    if (partners.length > 0) {
      setDisplayedPartners([partners[0]])
    } else {
      // Show fallback hardcoded partner (The Glebe Centre) if no Contentful partners
      // This will be handled in the render section
      setDisplayedPartners([])
    }
  }, [partners])

  // Initialize image visibility array
  useEffect(() => {
    setImagesVisible(new Array(7).fill(false))
  }, [])

  // Hero content fade-in on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setHeroVisible(true)
    }, 200)
    return () => clearTimeout(timer)
  }, [])

  // Staggered image fade-in
  useEffect(() => {
    const timers = imageRefs.current.map((_, index) => 
      setTimeout(() => {
        setImagesVisible(prev => {
          const newArr = [...prev]
          newArr[index] = true
          return newArr
        })
      }, 400 + index * 150)
    )
    return () => timers.forEach(timer => clearTimeout(timer))
  }, [])

  // Scroll-triggered animations using IntersectionObserver
  useEffect(() => {
    const observerOptions = {
      threshold: 0.2,
      rootMargin: '0px'
    }

    const partnerElement = partnerRef.current
    const sponsorsElement = sponsorsRef.current

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          if (entry.target === partnerElement) {
            setPartnerVisible(true)
          } else if (entry.target === sponsorsElement) {
            setSponsorsVisible(true)
          }
        }
      })
    }, observerOptions)

    if (partnerElement) observer.observe(partnerElement)
    if (sponsorsElement) observer.observe(sponsorsElement)

    return () => {
      if (partnerElement) observer.unobserve(partnerElement)
      if (sponsorsElement) observer.unobserve(sponsorsElement)
    }
  }, [])

  // Infinite scroll for partners - add new partner when scrolling down
  useEffect(() => {
    if (partners.length === 0) return

    const handleScroll = () => {
      const scrollY = window.scrollY
      const windowHeight = window.innerHeight

      // Calculate how many partners should be visible based on scroll position
      // Each partner takes about 60rem of vertical space
      const partnersPerView = Math.ceil((scrollY + windowHeight * 2) / (60 * 16)) // 60rem = 60 * 16px
      const partnersToShow = Math.max(1, Math.min(partnersPerView, partners.length * 3)) // Show up to 3x the partners for infinite loop

      if (partnersToShow > displayedPartners.length) {
        const newPartners: Entry<PartnerSkeleton>[] = []
        for (let i = displayedPartners.length; i < partnersToShow; i++) {
          const partnerIndex = i % partners.length
          newPartners.push(partners[partnerIndex])
        }
        setDisplayedPartners(prev => [...prev, ...newPartners])
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll() // Initial check
    return () => window.removeEventListener('scroll', handleScroll)
  }, [partners, displayedPartners.length])

  // Parallax effect for images on scroll (only after they're visible)
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY
      imageRefs.current.forEach((ref, index) => {
        if (ref && imagesVisible[index]) {
          // Different parallax speeds for each image
          const speeds = [0.3, 0.5, 0.4, 0.6, 0.35, 0.45, 0.4]
          const speed = speeds[index] || 0.3
          const yPos = scrollY * speed
          
          // Combine base transform with parallax
          if (index === 3 || index === 4) {
            // For middle images, adjust the translateY(-50%) with parallax
            ref.style.transform = `translateY(calc(-50% + ${yPos}px)) scale(1)`
          } else if (index === 5) {
            // For bottom image, keep translateX and add parallax Y
            ref.style.transform = `translateX(-50%) translateY(${yPos}px) scale(1)`
          } else {
            // For top images (including iPad), just add parallax Y
            ref.style.transform = `translateY(${yPos}px) scale(1)`
          }
        }
      })
    }

    // Only add parallax after images are visible
    if (imagesVisible.some(v => v)) {
      window.addEventListener('scroll', handleScroll, { passive: true })
      return () => window.removeEventListener('scroll', handleScroll)
    }
  }, [imagesVisible])

  // Helper function to render partner description
  const renderDescription = (description: Document | string | null | undefined | unknown) => {
    if (!description) return null
    if (typeof description === 'string') {
      return <p>{description}</p>
    }
    // Check if it's a Contentful Document type
    if (typeof description === 'object' && description !== null && 'nodeType' in description && 'content' in description) {
      return documentToReactComponents(description as Document)
    }
    return null
  }

  // Get logo URL from Contentful asset
  const getLogoUrl = (asset: unknown): string | null => {
    if (!asset || typeof asset !== 'object') return null
    const assetObj = asset as { fields?: { file?: { url?: string } } }
    if (!assetObj.fields?.file?.url) return null
    return `https:${assetObj.fields.file.url}`
  }

  return (
    <main className="min-h-screen" style={{ background: 'var(--color-cream)', overflow: 'visible' }}>
      {/* Hero Section with Images Around Text */}
      <section 
        className="relative min-h-[200vh] flex items-center justify-center py-16 md:py-32 lg:py-40 xl:py-48"
        style={{ background: 'var(--color-cream)', overflow: 'visible', paddingLeft: '1rem', paddingRight: '1rem' }}
      >
        {/* Sponsor Photos - 5 Images Total */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{ 
            zIndex: 1,
            padding: '1rem'
          }}
        >
          {/* Near Top Left - Horizontal (cane.jpg) - Behind */}
          <div 
            ref={(el) => { imageRefs.current[0] = el }}
            className="absolute transition-all duration-1000 ease-out" 
            style={{ 
              top: '5%', 
              left: '12%', 
              opacity: imagesVisible[0] ? 0.8 : 0, 
              zIndex: 0,
              transform: imagesVisible[0] ? 'translateY(0) scale(1)' : 'translateY(30px) scale(0.9)'
            }}
          >
            <div className="relative w-56 h-40 md:w-72 md:h-52 lg:w-88 lg:h-64 rounded-lg overflow-hidden shadow-2xl animate-float" style={{ background: 'var(--color-cream)', border: '4px solid var(--color-pink-light)', animationDelay: '0s' }}>
              <Image src="/assets/sponsors/cane.jpg" alt="Accessibility and support" fill className="object-cover" />
            </div>
          </div>
          
          {/* Top Left - Horizontal (teach.jpg) - In Front */}
          <div 
            ref={(el) => { imageRefs.current[1] = el }}
            className="absolute transition-all duration-1000 ease-out" 
            style={{ 
              top: '18%', 
              left: '6%', 
              opacity: imagesVisible[1] ? 0.8 : 0, 
              zIndex: 1,
              transform: imagesVisible[1] ? 'translateY(0) scale(1)' : 'translateY(30px) scale(0.9)'
            }}
          >
            <div className="relative w-48 h-36 md:w-64 md:h-48 lg:w-80 lg:h-56 rounded-lg overflow-hidden shadow-2xl animate-float" style={{ background: 'var(--color-cream)', border: '4px solid var(--color-pink-light)', animationDelay: '0.5s' }}>
              <Image src="/assets/sponsors/teach.jpg" alt="Intergenerational learning" fill className="object-cover" />
            </div>
          </div>
          
          {/* Top Right - Vertical (teach2.jpg) */}
          <div 
            ref={(el) => { imageRefs.current[2] = el }}
            className="absolute transition-all duration-1000 ease-out" 
            style={{ 
              top: '7%', 
              right: '6%', 
              opacity: imagesVisible[2] ? 0.8 : 0,
              transform: imagesVisible[2] ? 'translateY(0) scale(1)' : 'translateY(30px) scale(0.9)'
            }}
          >
            <div className="relative w-48 h-64 md:w-60 md:h-80 lg:w-72 lg:h-96 rounded-lg overflow-hidden shadow-2xl animate-float" style={{ background: 'var(--color-cream)', border: '4px solid var(--color-pink-light)', animationDelay: '1s' }}>
              <Image src="/assets/sponsors/teach2.jpg" alt="Intergenerational connection" fill className="object-cover" />
            </div>
          </div>
          
          {/* Middle Left - Vertical (book.jpg) */}
          <div 
            ref={(el) => { imageRefs.current[3] = el }}
            className="absolute transition-all duration-1000 ease-out" 
            style={{ 
              top: '55%', 
              left: '2%', 
              transform: imagesVisible[3] ? 'translateY(-50%) scale(1)' : 'translateY(calc(-50% + 30px)) scale(0.9)', 
              opacity: imagesVisible[3] ? 0.8 : 0
            }}
          >
            <div className="relative w-48 h-64 md:w-60 md:h-80 lg:w-72 lg:h-96 rounded-lg overflow-hidden shadow-2xl animate-float" style={{ background: 'var(--color-cream)', border: '4px solid var(--color-pink-light)', animationDelay: '1.5s' }}>
              <Image src="/assets/sponsors/book.jpg" alt="Books and learning" fill className="object-cover" />
            </div>
          </div>
          
          {/* Middle Right - Vertical (phone.jpg) */}
          <div 
            ref={(el) => { imageRefs.current[4] = el }}
            className="absolute transition-all duration-1000 ease-out" 
            style={{ 
              top: '50%', 
              right: '22%', 
              transform: imagesVisible[4] ? 'translateY(-50%) scale(1)' : 'translateY(calc(-50% + 30px)) scale(0.9)', 
              opacity: imagesVisible[4] ? 0.8 : 0
            }}
          >
            <div className="relative w-48 h-64 md:w-60 md:h-80 lg:w-72 lg:h-96 rounded-lg overflow-hidden shadow-2xl animate-float" style={{ background: 'var(--color-cream)', border: '4px solid var(--color-pink-light)', animationDelay: '2s' }}>
              <Image src="/assets/sponsors/phone.jpg" alt="Technology and connection" fill className="object-cover" />
            </div>
          </div>
          
          {/* Bottom Center - Horizontal (old.jpg) */}
          <div 
            ref={(el) => { imageRefs.current[5] = el }}
            className="absolute transition-all duration-1000 ease-out" 
            style={{ 
              bottom: '12%', 
              left: '82%', 
              transform: imagesVisible[5] ? 'translateX(-50%) scale(1)' : 'translateX(calc(-50% + 30px)) scale(0.9)', 
              opacity: imagesVisible[5] ? 0.8 : 0
            }}
          >
            <div className="relative w-80 h-56 md:w-96 md:h-64 lg:w-[500px] lg:h-[350px] rounded-lg overflow-hidden shadow-2xl animate-float" style={{ background: 'var(--color-cream)', border: '4px solid var(--color-pink-light)', animationDelay: '2.5s' }}>
              <Image src="/assets/sponsors/old.jpg" alt="Elders with technology" fill className="object-cover" />
            </div>
          </div>
          
          {/* Bottom Left - Vertical (ipad.jpg) */}
          <div 
            ref={(el) => { imageRefs.current[6] = el }}
            className="absolute transition-all duration-1000 ease-out" 
            style={{ 
              bottom: '-5%', 
              left: '30%', 
              opacity: imagesVisible[6] ? 0.8 : 0, 
              zIndex: 2,
              transform: imagesVisible[6] ? 'translateY(0) scale(1)' : 'translateY(30px) scale(0.9)'
            }}
          >
            <div className="relative w-48 h-64 md:w-60 md:h-80 lg:w-72 lg:h-96 rounded-lg overflow-hidden shadow-2xl animate-float" style={{ background: 'var(--color-cream)', border: '4px solid var(--color-pink-light)', animationDelay: '3s' }}>
              <Image src="/assets/sponsors/ipad.jpg" alt="Technology and digital connection" fill className="object-cover" />
            </div>
          </div>
        </div>

        {/* Hero Content - Centered, Higher Up */}
        <div 
          ref={heroRef}
          className="relative z-10 max-w-4xl mx-auto px-8 md:px-1s2 lg:px-16 transition-all duration-1000 ease-out" 
          style={{ 
            marginTop: '-100vh',
            opacity: heroVisible ? 1 : 0,
            transform: heroVisible ? 'translateY(0)' : 'translateY(30px)'
          }}
        >
          <div className="text-center mb-8">
            <div 
              className="text-xs md:text-sm uppercase tracking-widest mb-4 transition-all duration-1000 ease-out"
              style={{ 
                fontFamily: 'var(--font-kollektif)', 
                color: 'var(--color-brown-medium)',
                letterSpacing: '0.2em',
                opacity: heroVisible ? 1 : 0,
                transform: heroVisible ? 'translateY(0)' : 'translateY(-10px)',
                transitionDelay: '200ms'
              }}
            >
              ( OUR SUPPORT )
            </div>
            <h1 
              className="text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-bold mb-8 leading-tight transition-all duration-1000 ease-out" 
              style={{ 
                fontFamily: 'var(--font-vintage-stylist)', 
                color: 'var(--color-brown-dark)',
                opacity: heroVisible ? 1 : 0,
                transform: heroVisible ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.95)',
                transitionDelay: '400ms'
              }}
            >
              Partners &<br />Sponsors
            </h1>
          </div>
          <p 
            className="text-sm md:text-base lg:text-lg max-w-2xl mx-auto leading-relaxed text-left transition-all duration-1000 ease-out" 
            style={{ 
              fontFamily: 'var(--font-leiko)', 
              color: 'var(--color-brown-medium)',
              opacity: heroVisible ? 1 : 0,
              transform: heroVisible ? 'translateY(0)' : 'translateY(20px)',
              transitionDelay: '600ms'
            }}
          >
            We wouldn&apos;t be able to do this without the generous support of our partners and sponsors. Their commitment to our mission enables us to grow our club and make a meaningful impact in our community.
          </p>
        </div>

        {/* Partners Section - Infinite Scroll with Alternating Positions */}
        <div className="absolute inset-0" style={{ zIndex: 2, pointerEvents: 'none' }}>
          <div className="relative" style={{ minHeight: `${Math.max(200, displayedPartners.length > 0 ? displayedPartners.length * 60 : 60)}vh` }}>
            {/* Show fallback partner if no Contentful partners */}
            {displayedPartners.length === 0 && partners.length === 0 ? (
              <div
                ref={partnerRef}
                className="absolute left-16 md:left-24 lg:left-32 z-10 max-w-3xl transition-all duration-1000 ease-out"
                style={{ 
                  top: '130vh',
                  pointerEvents: 'auto',
                  opacity: partnerVisible ? 1 : 0,
                  transform: partnerVisible ? 'translateX(0) translateY(0)' : 'translateX(-50px) translateY(30px)'
                }}
              >
                {/* Background Container for Readability */}
                <div 
                  className="rounded-2xl p-8 md:p-10 lg:p-12 shadow-2xl"
                  style={{
                    background: 'rgba(232, 213, 196, 0.9)',
                    border: '4px solid var(--color-brown-medium)',
                    boxShadow: '0 8px 24px rgba(100, 50, 27, 0.2)'
                  }}
                >
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
                          color: 'var(--color-brown-dark)'
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
                      We are proud to partner with The Glebe Centre, a cornerstone of care for older residents in Ottawa for over 130 years. Together, we bridge generations through meaningful connections, bringing together passionate students and caring elders. Our partnership includes technology assistance, workshops, and intergenerational programs that enrich the lives of both youth and seniors in our community, reflecting shared values of compassion, respect, and innovation.
                    </p>
                    
                    <a
                      href="https://glebecentre.ca/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block px-6 py-3 rounded-full transition-all duration-300 hover:scale-105"
                      style={{ 
                        background: 'var(--color-brown-medium)',
                        border: '2px solid var(--color-brown-dark)',
                        color: 'var(--color-cream)',
                        fontFamily: 'var(--font-kollektif)',
                        fontWeight: '600'
                      }}
                    >
                      Visit The Glebe Centre →
                    </a>
                  </div>
                </div>
              </div>
            ) : (
              displayedPartners.map((partner, index) => {
              const isLeft = index % 2 === 0
              const partnerData = partner.fields as PartnerSkeleton['fields']
              const logoUrl = getLogoUrl(partnerData.logo)
              const partnerName = String(partnerData.name || '')
              const websiteUrl = (partnerData.websiteUrl && typeof partnerData.websiteUrl === 'string') ? partnerData.websiteUrl : null
              const description = partnerData.description || null
              
              return (
                <div
                  key={`${partner.sys.id}-${index}`}
                  ref={index === displayedPartners.length - 1 ? partnerRef : null}
                  className={`absolute ${isLeft ? 'left-16 md:left-24 lg:left-32' : 'right-16 md:right-24 lg:right-32'} z-10 max-w-3xl transition-all duration-1000 ease-out`}
                  style={{ 
                    top: `${130 + index * 60}vh`,
                    pointerEvents: 'auto',
                    opacity: partnerVisible || index < displayedPartners.length - 1 ? 1 : 0,
                    transform: partnerVisible || index < displayedPartners.length - 1 
                      ? 'translateX(0) translateY(0)' 
                      : isLeft 
                        ? 'translateX(-50px) translateY(30px)' 
                        : 'translateX(50px) translateY(30px)'
                  }}
                >
                  {/* Background Container for Readability */}
                  <div 
                    className="rounded-2xl p-8 md:p-10 lg:p-12 shadow-2xl"
                    style={{
                      background: 'rgba(232, 213, 196, 0.9)',
                      border: '4px solid var(--color-brown-medium)',
                      boxShadow: '0 8px 24px rgba(100, 50, 27, 0.2)'
                    }}
                  >
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
                            color: 'var(--color-brown-dark)'
                          }}
                        >
                          Partner
                        </h2>
                        {/* Logo - Positioned independently */}
                        {logoUrl && (
                          <div className="absolute w-40 h-40 md:w-52 md:h-52 lg:w-64 lg:h-64" style={{ 
                            left: '300px',
                            top: '-85px'
                          }}>
                            <Image
                              src={logoUrl}
                              alt={partnerName || 'Partner logo'}
                              fill
                              className="object-contain"
                            />
                          </div>
                        )}
                      </div>
                      
                      {/* Divider Line */}
                      <div 
                        className="w-20 h-0.5 mb-5"
                        style={{ background: 'var(--color-brown-medium)' }}
                      />
                      
                      {/* Body Paragraph */}
                      <div 
                        className="text-base md:text-lg leading-relaxed mb-6 max-w-2xl"
                        style={{ 
                          fontFamily: 'var(--font-kollektif)', 
                          color: 'var(--color-brown-medium)'
                        }}
                      >
                        {renderDescription(description)}
                      </div>
                      
                      {websiteUrl && (
                        <a
                          href={websiteUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-block px-6 py-3 rounded-full transition-all duration-300 hover:scale-105"
                          style={{ 
                            background: 'var(--color-brown-medium)',
                            border: '2px solid var(--color-brown-dark)',
                            color: 'var(--color-cream)',
                            fontFamily: 'var(--font-kollektif)',
                            fontWeight: '600'
                          }}
                        >
                          Visit {partnerName} →
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              )
            })
            )}
          </div>
        </div>
      </section>

      {/* Sponsors Section - Redesigned with Visual Interest */}
      <section 
        ref={sponsorsRef}
        className="relative z-20 pt-24 md:pt-32 lg:pt-40 pb-32 md:pb-48 lg:pb-64 mt-40 md:mt-52 lg:mt-64 transition-all duration-1000 ease-out" 
        style={{ 
          background: 'var(--color-brown-medium)',
          opacity: sponsorsVisible ? 1 : 0,
          transform: sponsorsVisible ? 'translateY(0)' : 'translateY(50px)',
          position: 'relative'
        }}
      >
        {/* Decorative Pattern Overlay */}
        <div 
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, var(--color-cream) 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }}
        />

        {/* Decorative Top Border */}
        <div 
          className="absolute top-0 left-0 right-0 h-1"
          style={{ 
            background: 'linear-gradient(90deg, transparent, var(--color-pink-light), var(--color-pink-medium), var(--color-pink-light), transparent)'
          }}
        />

        <div className="max-w-7xl mx-auto px-8 relative z-10">
          {/* Title Section */}
          <div className="text-center mb-12 md:mb-16">
            <h2 
              className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold leading-tight mb-4 transition-all duration-1000 ease-out"
              style={{ 
                fontFamily: 'var(--font-vintage-stylist)', 
                color: 'var(--color-cream)',
                opacity: sponsorsVisible ? 1 : 0,
                transform: sponsorsVisible ? 'translateY(0) scale(1)' : 'translateY(30px) scale(0.95)',
                transitionDelay: '200ms'
              }}
            >
              Our Sponsors
            </h2>
            <p 
              className="text-base md:text-lg mx-auto whitespace-nowrap transition-all duration-1000 ease-out"
              style={{ 
                fontFamily: 'var(--font-kollektif)', 
                color: 'var(--color-cream)',
                opacity: sponsorsVisible ? 1 : 0,
                transform: sponsorsVisible ? 'translateY(0)' : 'translateY(20px)',
                transitionDelay: '400ms'
              }}
            >
              Thank you for your continued support and partnership in building meaningful connections
            </p>
          </div>

          {/* Sponsor Logos Grid with Cards - Dynamic from Contentful */}
          {sponsors.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 lg:gap-20 mb-20 md:mb-24">
              {sponsors.map((sponsor, index) => {
                const sponsorData = sponsor.fields as SponsorSkeleton['fields']
                const logoUrl = getLogoUrl(sponsorData.logo)
                const sponsorName = String(sponsorData.name || '')
                const sponsorWebsiteUrl = (sponsorData.websiteUrl && typeof sponsorData.websiteUrl === 'string') ? sponsorData.websiteUrl : null
                
                return (
                  <div
                    key={sponsor.sys.id}
                    className="flex items-center justify-center h-40 md:h-48 lg:h-56 p-6 md:p-8 rounded-2xl transition-all duration-500 ease-out hover:scale-105"
                    style={{
                      background: 'rgba(247, 240, 227, 0.1)',
                      border: '2px solid rgba(247, 240, 227, 0.2)',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                      opacity: sponsorsVisible ? 1 : 0,
                      transform: sponsorsVisible ? 'translateY(0) scale(1)' : 'translateY(30px) scale(0.9)',
                      transitionDelay: `${600 + index * 150}ms`
                    }}
                  >
                    {logoUrl ? (
                      <a
                        href={sponsorWebsiteUrl || '#'}
                        target={sponsorWebsiteUrl ? '_blank' : undefined}
                        rel={sponsorWebsiteUrl ? 'noopener noreferrer' : undefined}
                        className="relative w-full h-full sponsor-logo"
                        style={{ padding: '0.5rem' }}
                      >
                        <Image
                          src={logoUrl}
                          alt={sponsorName || 'Sponsor logo'}
                          fill
                          className="object-contain"
                          style={{ 
                            filter: 'brightness(0) invert(1)',
                            objectFit: 'contain'
                          }}
                        />
                      </a>
                    ) : (
                      <span
                        className="text-xl md:text-2xl font-bold"
                        style={{
                          fontFamily: 'var(--font-kollektif)',
                          color: 'var(--color-cream)'
                        }}
                      >
                        {sponsorName}
                      </span>
                    )}
                  </div>
                )
              })}
            </div>
          ) : (
            // Fallback to hardcoded sponsors if Contentful is empty
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 lg:gap-20 mb-20 md:mb-24">
              {[
                { name: 'UOTTAWA', image: '/assets/sponsors/uottawa.png' },
                { name: 'SPCO', image: '/assets/sponsors/SPCO.png' },
                { name: 'BRIDGEHEAD', image: '/assets/sponsors/bridgehead.png' },
                { name: 'MERRY DAIRY', image: '/assets/sponsors/merry dairy.png' },
              ].map((sponsor, index) => (
                <div
                  key={index}
                  className="flex items-center justify-center h-40 md:h-48 lg:h-56 p-6 md:p-8 rounded-2xl transition-all duration-500 ease-out hover:scale-105"
                  style={{
                    background: 'rgba(247, 240, 227, 0.1)',
                    border: '2px solid rgba(247, 240, 227, 0.2)',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                    opacity: sponsorsVisible ? 1 : 0,
                    transform: sponsorsVisible ? 'translateY(0) scale(1)' : 'translateY(30px) scale(0.9)',
                    transitionDelay: `${600 + index * 150}ms`
                  }}
                >
                  {sponsor.image ? (
                    <div 
                      className="relative w-full h-full sponsor-logo"
                      data-sponsor-index={index}
                      style={{ padding: '0.5rem' }}
                    >
                      <Image
                        src={sponsor.image}
                        alt={sponsor.name}
                        fill
                        className="object-contain"
                        style={{ 
                          filter: 'brightness(0) invert(1)',
                          objectFit: 'contain'
                        }}
                      />
                    </div>
                  ) : (
                    <span
                      className="text-xl md:text-2xl font-bold"
                      style={{
                        fontFamily: 'var(--font-kollektif)',
                        color: 'var(--color-cream)'
                      }}
                    >
                      {sponsor.name}
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Become a Partner - Compact Note Style */}
          <div className="mt-16 md:mt-20 pt-8 md:pt-10 border-t" style={{ borderColor: 'rgba(247, 240, 227, 0.2)' }}>
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 md:gap-6 px-4">
              <div className="flex-1 text-center md:text-left">
                <p 
                  className="text-sm md:text-base leading-relaxed"
                  style={{ 
                    fontFamily: 'var(--font-leiko)', 
                    color: 'var(--color-cream)',
                    opacity: 0.9
                  }}
                >
                  <span className="font-semibold uppercase" style={{ fontFamily: 'var(--font-freshwost), var(--font-kollektif), system-ui, Arial, sans-serif' }}>Become a Partner:</span> We&apos;re always looking for organizations and businesses that share our mission of bridging generations. Reach out to us to explore how we can work together.
                </p>
              </div>
              <a
                href="/contact"
                className="flex-shrink-0 px-6 py-3 rounded-full transition-all duration-300 hover:scale-105"
                style={{ 
                  background: 'var(--color-pink-medium)',
                  border: '2px solid var(--color-cream)',
                  color: 'var(--color-cream)',
                  fontFamily: 'var(--font-kollektif)',
                  fontWeight: '600',
                  fontSize: '0.875rem',
                  whiteSpace: 'nowrap'
                }}
              >
                Get in Touch →
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
