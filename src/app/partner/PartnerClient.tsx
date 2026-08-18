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

type FloatPos = {
  top?: string
  left?: string
  right?: string
  bottom?: string
  width: string
}

/**
 * Floating hero photos — edit the `tablet` fields to move/size each image (768–1023px).
 * Values are CSS (e.g. '4%', '3rem', '14rem'). Leave unused sides undefined.
 */
const FLOATING_PHOTOS = [
  {
    key: 'sign',
    src: '/assets/sponsors/sign.JPG',
    alt: 'Collaboration and signing',
    width: 2268,
    height: 1815,
    delay: '0s',
    zIndex: 0,
    parallax: 'y' as const,
    mobile: { top: '1%', left: '3%', width: '10rem' },
    tablet: { top: '2%', left: '3%', width: '16rem' },
    desktop: { top: '5%', left: '12%', width: '24rem' },
  },
  {
    key: 'cake',
    src: '/assets/sponsors/cake.JPG',
    alt: 'Thank you students celebration',
    width: 3769,
    height: 3767,
    delay: '0.5s',
    zIndex: 1,
    parallax: 'y' as const,
    mobile: { top: '37%', left: '10%', width: '8rem' },
    tablet: { top: '10%', left: '10%', width: '14rem' },
    desktop: { top: '18%', left: '6%', width: '20rem' },
  },
  {
    key: 'bouquet',
    src: '/assets/sponsors/bouquet.JPG',
    alt: 'Flowers and celebration',
    width: 5712,
    height: 4284,
    delay: '1s',
    zIndex: 1,
    parallax: 'y' as const,
    mobile: { top: '7%', right: '2%', width: '8rem' },
    tablet: { top: '5%', right: '3%', width: '14rem' },
    desktop: { top: '7%', right: '6%', width: '18rem' },
  },
  {
    key: 'flower',
    src: '/assets/sponsors/flower.JPG',
    alt: 'Youth with bouquets',
    width: 3019,
    height: 2265,
    delay: '1.5s',
    zIndex: 1,
    parallax: 'yCenter' as const,
    mobile: { top: '50%', left: '40%', width: '8rem' },
    tablet: { top: '50%', left: '20%', width: '15rem' },
    desktop: { top: '70%', left: '35%', width: '18rem' },
  },
  {
    key: 'elderhome',
    src: '/assets/sponsors/elderhome.JPG',
    alt: 'Community event at Abbotsford House',
    width: 2268,
    height: 3024,
    delay: '2s',
    zIndex: 1,
    parallax: 'yCenter' as const,
    mobile: { top: '68%', right: '2%', width: '9rem' },
    tablet: { top: '37%', right: '15%', width: '16rem' },
    desktop: { top: '52%', right: '20%', width: '24rem' },
  },
  {
    key: 'win',
    src: '/assets/sponsors/win.JPG',
    alt: 'Team and community',
    width: 4297,
    height: 3223,
    delay: '2.5s',
    zIndex: 1,
    parallax: 'xCenter' as const,
    mobile: { bottom: '2%', left: '65%', width: '10rem' },
    tablet: { bottom: '30%', left: '77%', width: '14rem' },
    desktop: { bottom: '12%', left: '85%', width: '24rem' },
  },
  {
    key: 'teach',
    src: '/assets/sponsors/teach.JPG',
    alt: 'Intergenerational learning and collaboration',
    width: 3000,
    height: 2250,
    delay: '3s',
    zIndex: 2,
    parallax: 'y' as const,
    mobile: { top: '70%', left: '2%', width: '9rem' },
    tablet: { bottom: '50%', left: '10%', width: '15rem' },
    desktop: { bottom: '30%', left: '3%', width: '24rem' },
  },
] as const

type PartnerBoxPos = {
  topVh: number
  left: string
  /** Use 'auto' when the card is left-anchored with an explicit width */
  right: string
  /** Use 'auto' on mobile so left+right stretch the card full width */
  width: string
  /** tablet: 'center' — desktop stays left/right alternating */
  align: 'left' | 'center' | 'stretch'
}

/**
 * Our Partner card — edit `tablet` to float / size (768–1023px).
 * topVh / left / right / width / align.
 */
const PARTNER_BOX: { mobile: PartnerBoxPos; tablet: PartnerBoxPos; desktop: PartnerBoxPos } = {
  mobile: { topVh: 95, left: '1rem', right: '1rem', width: 'auto', align: 'stretch' },
  // Smaller, left, lower — floats over photos until the pink sponsors band
  tablet: { topVh: 132, left: '1.5rem', right: 'auto', width: 'min(78vw, 36rem)', align: 'left' },
  desktop: { topVh: 115, left: '8rem', right: 'auto', width: 'min(100%, 48rem)', align: 'left' },
}

function partnerBoxAnim(
  visible: boolean,
  isLeft = true
): Pick<React.CSSProperties, 'opacity' | 'transform' | 'pointerEvents'> {
  return {
    pointerEvents: 'auto',
    opacity: visible ? 1 : 0,
    transform: visible
      ? 'translateX(0) translateY(0)'
      : isLeft
        ? 'translateX(-50px) translateY(30px)'
        : 'translateX(50px) translateY(30px)',
  }
}

/** Horizontal position via CSS (md/lg) so tablet is never stuck with desktop width. */
const PARTNER_CARD_POS =
  'left-4 right-4 md:left-6 md:right-auto md:w-[min(78vw,36rem)] lg:left-32 lg:right-auto lg:w-[min(100%,48rem)]'

function pickBreakpoint<T extends { mobile: unknown; tablet: unknown; desktop: unknown }>(
  config: T,
  viewportW: number
): T['mobile'] | T['tablet'] | T['desktop'] {
  // Don't treat 0 as desktop — that applied a 48rem box and shoved it off to the right on tablet
  if (viewportW >= 1024) return config.desktop
  if (viewportW >= 768 || viewportW === 0) return config.tablet
  return config.mobile
}

function pickFloatPos(
  photo: (typeof FLOATING_PHOTOS)[number],
  viewportW: number
): FloatPos {
  return pickBreakpoint(photo, viewportW) as FloatPos
}

function floatEnterTransform(parallax: (typeof FLOATING_PHOTOS)[number]['parallax'], visible: boolean) {
  if (parallax === 'yCenter') {
    return visible ? 'translateY(-50%) scale(1)' : 'translateY(calc(-50% + 30px)) scale(0.9)'
  }
  if (parallax === 'xCenter') {
    return visible ? 'translateX(-50%) scale(1)' : 'translateX(calc(-50% + 30px)) scale(0.9)'
  }
  return visible ? 'translateY(0) scale(1)' : 'translateY(30px) scale(0.9)'
}

export default function PartnerClient({ partners, sponsors }: PartnerClientProps) {
  const [heroVisible, setHeroVisible] = useState(false)
  const [imagesVisible, setImagesVisible] = useState<boolean[]>([])
  const [partnerVisible, setPartnerVisible] = useState(false)
  const [sponsorsVisible, setSponsorsVisible] = useState(false)
  const [displayedPartners, setDisplayedPartners] = useState<Entry<PartnerSkeleton>[]>([])
  const [viewportW, setViewportW] = useState(0)
  const heroRef = useRef<HTMLDivElement>(null)
  const partnerRef = useRef<HTMLDivElement>(null)
  const sponsorsRef = useRef<HTMLDivElement>(null)
  const imageRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const sync = () => setViewportW(window.innerWidth)
    sync()
    window.addEventListener('resize', sync)
    return () => window.removeEventListener('resize', sync)
  }, [])

  useEffect(() => {
    document.body.classList.add('partner-page')
    return () => document.body.classList.remove('partner-page')
  }, [])

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
    setImagesVisible(new Array(FLOATING_PHOTOS.length).fill(false))
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

  // Scroll-triggered animations — re-bind when partner card mounts/updates
  useEffect(() => {
    const partnerElement = partnerRef.current
    const sponsorsElement = sponsorsRef.current

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return
          if (entry.target === partnerElement) {
            setPartnerVisible(true)
          } else if (entry.target === sponsorsElement) {
            setSponsorsVisible(true)
          }
        })
      },
      { threshold: 0.15, rootMargin: '0px 0px -8% 0px' }
    )

    if (partnerElement) observer.observe(partnerElement)
    if (sponsorsElement) observer.observe(sponsorsElement)

    return () => observer.disconnect()
  }, [displayedPartners.length, partners.length])

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
          const speeds = [0.3, 0.5, 0.4, 0.6, 0.35, 0.45, 0.4]
          const speed = speeds[index] || 0.3
          const yPos = scrollY * speed
          const mode = FLOATING_PHOTOS[index]?.parallax ?? 'y'

          if (mode === 'yCenter') {
            ref.style.transform = `translateY(calc(-50% + ${yPos}px)) scale(1)`
          } else if (mode === 'xCenter') {
            ref.style.transform = `translateX(-50%) translateY(${yPos}px) scale(1)`
          } else {
            ref.style.transform = `translateY(${yPos}px) scale(1)`
          }
        }
      })
    }

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

  const partnerBox = pickBreakpoint(PARTNER_BOX, viewportW)

  return (
    <main className="min-h-screen partner-page-tablet-lock" style={{ background: 'var(--color-cream)' }}>
      {/* Hero Section with Images Around Text */}
      <section 
        className="relative min-h-[160vh] md:min-h-[210vh] lg:min-h-[200vh] flex items-center justify-center py-16 md:py-24 lg:py-40 xl:py-48"
        style={{ background: 'var(--color-cream)', paddingLeft: '1rem', paddingRight: '1rem' }}
      >
        {/* Photos extend into the cream gap; pink sponsors (z-20) is the cutoff */}
        <div 
          className="partner-float-layer absolute inset-0 -bottom-16 md:-bottom-48 lg:bottom-0 pointer-events-none overflow-hidden lg:overflow-visible"
          style={{ 
            zIndex: 1,
            padding: '1rem'
          }}
        >
          {FLOATING_PHOTOS.map((photo, index) => {
            const pos = pickFloatPos(photo, viewportW)
            const visible = Boolean(imagesVisible[index])
            return (
              <div
                key={photo.key}
                ref={(el) => { imageRefs.current[index] = el }}
                className="absolute transition-all duration-1000 ease-out"
                style={{
                  top: pos.top,
                  left: pos.left,
                  right: pos.right,
                  bottom: pos.bottom,
                  opacity: visible ? 0.8 : 0,
                  zIndex: photo.zIndex,
                  transform: floatEnterTransform(photo.parallax, visible),
                }}
              >
                <div
                  className="relative rounded-lg overflow-hidden shadow-2xl animate-float border-4 inline-block"
                  style={{
                    width: pos.width,
                    borderColor: 'var(--color-olive-light)',
                    animationDelay: photo.delay,
                  }}
                >
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    width={photo.width}
                    height={photo.height}
                    className="block w-full h-auto"
                  />
                </div>
              </div>
            )
          })}
        </div>

        {/* Hero Content - Centered, Higher Up */}
        <div 
          ref={heroRef}
          className="relative z-10 max-w-4xl mx-auto px-8 md:px-16 lg:px-16 transition-all duration-1000 ease-out -mt-[70vh] md:-mt-[110vh] lg:-mt-[100vh]" 
          style={{ 
            opacity: heroVisible ? 1 : 0,
            transform: heroVisible ? 'translateY(0)' : 'translateY(30px)'
          }}
        >
          <div className="text-center mb-8">
            <div 
              className="text-xs md:text-sm uppercase tracking-widest mb-4 transition-all duration-1000 ease-out"
              style={{ 
                fontFamily: 'var(--font-kollektif)', 
                color: 'var(--color-brown-dark)',
                letterSpacing: '0.2em',
                opacity: heroVisible ? 1 : 0,
                transform: heroVisible ? 'translateY(0)' : 'translateY(-10px)',
                transitionDelay: '200ms'
              }}
            >
              ( OUR SUPPORT )
            </div>
            <h1 
              className="text-4xl md:text-5xl lg:text-7xl xl:text-8xl font-bold mb-6 md:mb-7 lg:mb-8 leading-tight transition-all duration-1000 ease-out" 
              style={{ 
                fontFamily: 'var(--font-vintage-stylist)', 
                color: 'var(--color-olive)',
                opacity: heroVisible ? 1 : 0,
                transform: heroVisible ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.95)',
                transitionDelay: '400ms'
              }}
            >
              Partners &<br />Sponsors
            </h1>
          </div>
          <p 
            className="text-sm md:text-base lg:text-lg max-w-xl md:max-w-lg lg:max-w-2xl mx-auto leading-relaxed text-center transition-all duration-1000 ease-out" 
            style={{ 
              fontFamily: 'var(--font-leiko)', 
              color: 'var(--color-brown-dark)',
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
                className={`absolute z-10 transition-[opacity,transform] duration-1000 ease-out ${PARTNER_CARD_POS}`}
                style={{
                  top: `${partnerBox.topVh}vh`,
                  ...partnerBoxAnim(partnerVisible, true),
                }}
              >
                <div 
                  className="rounded-2xl p-3.5 md:p-5 lg:p-12 shadow-2xl"
                  style={{
                      background: 'var(--color-olive)',
                      border: '3px solid var(--color-olive-light)',
                      boxShadow: '0 8px 24px rgba(111, 101, 9, 0.25)'
                    }}
                  >
                    <div>
                      <div className="mb-2 md:mb-4 flex items-center justify-between gap-3 md:gap-5 mt-1 md:mt-2 lg:mt-8 relative">
                        <div className="min-w-0">
                          <h2 
                            className="text-2xl md:text-5xl lg:text-6xl font-bold leading-none"
                            style={{ 
                              fontFamily: 'var(--font-vintage-stylist)', 
                              color: 'var(--color-olive-light)'
                            }}
                          >
                            Our
                          </h2>
                          <h2 
                            className="text-2xl md:text-5xl lg:text-6xl font-bold leading-none"
                            style={{ 
                              fontFamily: 'var(--font-vintage-stylist)', 
                              color: 'var(--color-olive-light)'
                            }}
                          >
                            Partner
                          </h2>
                        </div>
                      <div className="relative w-14 h-14 md:w-36 md:h-36 lg:w-64 lg:h-64 flex-shrink-0 lg:absolute lg:left-[300px] lg:top-[-85px]">
                        <Image
                          src="/assets/sponsors/glebe.png"
                          alt="The Glebe Centre"
                          fill
                          className="object-contain"
                        />
                      </div>
                    </div>
                    
                    <div 
                      className="w-16 md:w-16 lg:w-20 h-0.5 mb-2.5 md:mb-5"
                      style={{ background: 'var(--color-olive-light)' }}
                    />
                    
                    <p 
                      className="text-xs md:text-base lg:text-lg leading-snug md:leading-relaxed mb-3 md:mb-5 lg:mb-6 max-w-2xl"
                      style={{ 
                        fontFamily: 'var(--font-kollektif)', 
                        color: 'var(--color-olive-light)'
                      }}
                    >
                      We are proud to partner with The Glebe Centre, a cornerstone of care for older residents in Ottawa for over 130 years. Together, we bridge generations through meaningful connections, bringing together passionate students and caring elders. Our partnership includes technology assistance, workshops, and intergenerational programs that enrich the lives of both youth and seniors in our community, reflecting shared values of compassion, respect, and innovation.
                    </p>
                    
                    <div className="flex justify-start">
                      <a
                        href="https://glebecentre.ca/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center px-4 py-2 md:px-6 md:py-2.5 lg:px-6 lg:py-3 rounded-full transition-all duration-300 hover:scale-105 text-xs md:text-sm lg:text-base whitespace-nowrap"
                        style={{ 
                          background: 'var(--color-olive-light)',
                          border: '2px solid var(--color-olive-light)',
                          color: 'var(--color-cream)',
                          fontFamily: 'var(--font-kollektif)',
                          fontWeight: '600'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.color = 'var(--color-olive-light)'
                          e.currentTarget.style.background = 'var(--color-cream)'
                          e.currentTarget.style.borderColor = 'var(--color-olive-light)'
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.color = 'var(--color-cream)'
                          e.currentTarget.style.background = 'var(--color-olive-light)'
                          e.currentTarget.style.borderColor = 'var(--color-olive-light)'
                        }}
                      >
                        Visit The Glebe Centre →
                      </a>
                    </div>
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
                  className={`absolute z-10 transition-[opacity,transform] duration-1000 ease-out ${
                    isLeft
                      ? PARTNER_CARD_POS
                      : 'left-4 right-4 md:left-6 md:right-auto md:w-[min(78vw,36rem)] lg:left-auto lg:right-32 lg:w-[min(100%,48rem)]'
                  }`}
                  style={{
                    top: `${partnerBox.topVh + index * 55}vh`,
                    ...partnerBoxAnim(
                      partnerVisible || index < displayedPartners.length - 1,
                      isLeft
                    ),
                  }}
                >
                  <div 
                    className="rounded-2xl p-3.5 md:p-5 lg:p-12 shadow-2xl"
                    style={{
                      background: 'var(--color-olive)',
                      border: '3px solid var(--color-olive-light)',
                      boxShadow: '0 8px 24px rgba(111, 101, 9, 0.25)'
                    }}
                  >
                    <div>
                      <div className="mb-2 md:mb-4 flex items-center justify-between gap-3 md:gap-5 mt-1 md:mt-2 lg:mt-8 relative">
                        <div className="min-w-0">
                          <h2 
                            className="text-2xl md:text-5xl lg:text-6xl font-bold leading-none"
                            style={{ 
                              fontFamily: 'var(--font-vintage-stylist)', 
                              color: 'var(--color-pink-medium)'
                            }}
                          >
                            Our
                          </h2>
                          <h2 
                            className="text-2xl md:text-5xl lg:text-6xl font-bold leading-none"
                            style={{ 
                              fontFamily: 'var(--font-vintage-stylist)', 
                              color: 'var(--color-pink-medium)'
                            }}
                          >
                            Partner
                          </h2>
                        </div>
                        {logoUrl && (
                          <div className="relative w-14 h-14 md:w-36 md:h-36 lg:w-64 lg:h-64 flex-shrink-0 lg:absolute lg:left-[300px] lg:top-[-85px]">
                            <Image
                              src={logoUrl}
                              alt={partnerName || 'Partner logo'}
                              fill
                              className="object-contain"
                            />
                          </div>
                        )}
                      </div>
                      
                      <div 
                        className="w-16 md:w-16 lg:w-20 h-0.5 mb-2.5 md:mb-5"
                        style={{ background: 'var(--color-pink-medium)' }}
                      />
                      
                      <div 
                        className="text-xs md:text-base lg:text-lg leading-snug md:leading-relaxed mb-3 md:mb-5 lg:mb-6 max-w-2xl"
                        style={{ 
                          fontFamily: 'var(--font-kollektif)', 
                          color: 'var(--color-cream)'
                        }}
                      >
                        {renderDescription(description)}
                      </div>
                      
                      {websiteUrl && (
                        <div className="flex justify-start">
                          <a
                            href={websiteUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center px-4 py-2 md:px-6 md:py-2.5 lg:px-6 lg:py-3 rounded-full transition-all duration-300 hover:scale-105 text-xs md:text-sm lg:text-base whitespace-nowrap"
                            style={{ 
                              background: 'var(--color-olive-light)',
                              border: '2px solid var(--color-cream)',
                              color: 'var(--color-cream)',
                              fontFamily: 'var(--font-kollektif)',
                              fontWeight: '600'
                            }}
                          >
                            Visit {partnerName} →
                          </a>
                        </div>
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
        className="relative z-20 pt-16 md:pt-20 lg:pt-32 pb-20 md:pb-28 lg:pb-48 mt-16 md:mt-48 lg:mt-52 overflow-hidden"
        style={{ 
          background: 'var(--color-pink-medium)',
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

        {/* Decorative Top Border - Green */}
        <div 
          className="absolute top-0 left-0 right-0 h-1"
          style={{
            background: 'var(--color-brown-dark)'
          }}
        />

        <div className="max-w-7xl mx-auto px-8 relative z-10">
          {/* Title Section */}
          <div className="text-center mb-8 md:mb-10 lg:mb-16">
            <h2 
              className="text-4xl md:text-5xl lg:text-7xl xl:text-8xl font-bold leading-tight mb-3 md:mb-4 transition-all duration-1000 ease-out"
              style={{ 
                fontFamily: 'var(--font-vintage-stylist)', 
                color: 'var(--color-brown-dark)',
                opacity: sponsorsVisible ? 1 : 0,
                transform: sponsorsVisible ? 'translateY(0) scale(1)' : 'translateY(30px) scale(0.95)',
                transitionDelay: '200ms'
              }}
            >
              Our Sponsors
            </h2>
            <p 
              className="text-sm md:text-base lg:text-lg mx-auto max-w-md md:max-w-xl lg:max-w-none px-2 md:px-4 lg:px-0 lg:whitespace-nowrap transition-all duration-1000 ease-out"
              style={{ 
                fontFamily: 'var(--font-kollektif)', 
                color: 'var(--color-brown-dark)',
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
            <div className="grid grid-cols-2 gap-3 md:gap-10 lg:gap-20 mb-12 md:mb-16 lg:mb-24">
              {sponsors.map((sponsor, index) => {
                const sponsorData = sponsor.fields as SponsorSkeleton['fields']
                const logoUrl = getLogoUrl(sponsorData.logo)
                const sponsorName = String(sponsorData.name || '')
                const sponsorWebsiteUrl = (sponsorData.websiteUrl && typeof sponsorData.websiteUrl === 'string') ? sponsorData.websiteUrl : null
                
                return (
                  <div
                    key={sponsor.sys.id}
                    className="flex items-center justify-center h-28 md:h-36 lg:h-56 p-3 md:p-6 lg:p-8 rounded-2xl overflow-hidden transition-all duration-500 ease-out hover:scale-105"
                    style={{
                      background: 'var(--color-brown-dark)',
                      border: '2px solid var(--color-cream)',
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
            <div className="grid grid-cols-2 gap-3 md:gap-10 lg:gap-20 mb-12 md:mb-16 lg:mb-24">
              {[
                { name: 'UOTTAWA', image: '/assets/sponsors/uottawa.png' },
                { name: 'SPCO', image: '/assets/sponsors/SPCO.png' },
                { name: 'BRIDGEHEAD', image: '/assets/sponsors/bridgehead.png' },
                { name: 'MERRY DAIRY', image: '/assets/sponsors/merry dairy.png' },
                { name: "DOMINO'S", image: '/assets/sponsors/dominos.png' },
              ].map((sponsor, index) => (
                <div
                  key={index}
                  className="flex items-center justify-center h-28 md:h-36 lg:h-56 p-3 md:p-6 lg:p-8 rounded-2xl overflow-hidden transition-all duration-500 ease-out hover:scale-105"
                  style={{
                    background: 'var(--color-brown-dark)',
                    border: '2px solid var(--color-cream)',
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
          <div className="mt-10 md:mt-12 lg:mt-20 pt-6 md:pt-8 lg:pt-10 border-t" style={{ borderColor: 'var(--color-brown-dark)' }}>
            <div className="max-w-6xl mx-auto flex flex-row items-center justify-between gap-3 md:gap-5 lg:gap-6 px-2 md:px-4">
              <div className="flex-1 min-w-0 text-left">
                <p 
                  className="text-[11px] md:text-xs lg:text-base leading-snug md:leading-relaxed"
                  style={{ 
                    fontFamily: 'var(--font-leiko)', 
                    opacity: 0.9
                  }}
                >
                  <span className="font-semibold uppercase block md:inline" style={{ fontFamily: 'var(--font-freshwost), var(--font-kollektif), system-ui, Arial, sans-serif', color: 'var(--color-brown-dark)' }}>Become a Partner:</span>{' '}
                  <span style={{ color: 'var(--color-brown-dark)' }}>We&apos;re always looking for organizations and businesses that share our mission of bridging generations. Reach out to us to explore how we can work together.</span>
                </p>
              </div>
              <a
                href="/contact"
                className="flex-shrink-0 inline-flex items-center justify-center px-3 py-2 md:px-5 md:py-2 lg:px-6 lg:py-3 rounded-full transition-all duration-300 hover:scale-105 text-[11px] md:text-xs lg:text-sm"
                style={{ 
                  background: 'var(--color-cream)',
                  border: '2px solid var(--color-brown-dark)',
                  color: 'var(--color-brown-dark)',
                  fontFamily: 'var(--font-kollektif)',
                  fontWeight: '600',
                  whiteSpace: 'nowrap'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = 'var(--color-cream)'
                  e.currentTarget.style.background = 'var(--color-brown-dark)'
                  e.currentTarget.style.borderColor = 'var(--color-brown-dark)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'var(--color-brown-dark)'
                  e.currentTarget.style.background = 'var(--color-cream)'
                  e.currentTarget.style.borderColor = 'var(--color-brown-dark)'
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
