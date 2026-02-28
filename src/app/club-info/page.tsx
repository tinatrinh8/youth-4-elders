'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState, useRef } from 'react'
import { createPortal } from 'react-dom'

export default function ClubInfo() {
  const [isVisible, setIsVisible] = useState(false)
  const [ideaFormData, setIdeaFormData] = useState({
    name: '',
    email: '',
    message: ''
  })
  const [isSubmittingIdea, setIsSubmittingIdea] = useState(false)
  const [ideaSubmitSuccess, setIdeaSubmitSuccess] = useState(false)
  const [ideaSubmitError, setIdeaSubmitError] = useState('')
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({})
  const [isClosingError, setIsClosingError] = useState(false)
  const [isClosingFieldErrors, setIsClosingFieldErrors] = useState(false)
  const [founderStoryOpen, setFounderStoryOpen] = useState<'julia' | 'peter' | null>(null)
  const [isClosingFounderStory, setIsClosingFounderStory] = useState(false)
  const aboutUsTitleRef = useRef<HTMLDivElement>(null)
  const [cursorMask, setCursorMask] = useState<{ x: number; y: number } | null>(null)
  const lastCursorRef = useRef<{ x: number; y: number } | null>(null)
  const [contentVisible, setContentVisible] = useState(false)
  const missionLeftRef = useRef<HTMLDivElement>(null)
  const missionRightRef = useRef<HTMLDivElement>(null)
  const missionHeaderRef = useRef<HTMLHeadingElement>(null)
  const [missionLeftInView, setMissionLeftInView] = useState(false)
  const [missionRightInView, setMissionRightInView] = useState(false)
  const [missionTitleVisible, setMissionTitleVisible] = useState(false)
  const impactStatsRef = useRef<HTMLDivElement>(null)
  const collageSectionRef = useRef<HTMLElement>(null)
  const collageFirstCheck = useRef(true)
  const [collageRevealed, setCollageRevealed] = useState(false)
  const COLLAGE_DELAYS = [0, 0.12, 0.24, 0.36, 0.48, 0.6, 0.35]
  const [impactStatsInView, setImpactStatsInView] = useState(false)
  const [statPrimary, setStatPrimary] = useState(0)
  const [statCommunity, setStatCommunity] = useState(0)
  const [statStudent, setStatStudent] = useState(0)
  const ideasSectionRef = useRef<HTMLElement>(null)
  const [ideasInView, setIdeasInView] = useState(false)
  const testimoniesSectionRef = useRef<HTMLElement>(null)
  const [testimoniesInView, setTestimoniesInView] = useState(false)

  useEffect(() => {
    const el = impactStatsRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.target === el && entry.isIntersecting) setImpactStatsInView(true)
        })
      },
      { threshold: 0.25 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  useEffect(() => {
    if (!impactStatsInView) return
    const duration = 2000
    const start = performance.now()
    const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3)
    let rafId: number
    const tick = (now: number) => {
      const elapsed = now - start
      const t = Math.min(elapsed / duration, 1)
      const progress = easeOutCubic(t)
      setStatPrimary(Math.round(5000 * progress))
      setStatCommunity(Math.round(3000 * progress))
      setStatStudent(Math.round(100 * progress))
      if (t < 1) rafId = requestAnimationFrame(tick)
    }
    rafId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafId)
  }, [impactStatsInView])

  useEffect(() => {
    const headerEl = missionHeaderRef.current
    if (!headerEl) return
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.target === headerEl && entry.isIntersecting) setMissionTitleVisible(true)
        })
      },
      { threshold: 0.2, rootMargin: '0px 0px -40px 0px' }
    )
    obs.observe(headerEl)
    return () => obs.disconnect()
  }, [])

  useEffect(() => {
    const leftEl = missionLeftRef.current
    const rightEl = missionRightRef.current
    if (!leftEl || !rightEl) return
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.target === leftEl) setMissionLeftInView(entry.isIntersecting)
          if (entry.target === rightEl) setMissionRightInView(entry.isIntersecting)
        })
      },
      { threshold: 0.15, rootMargin: '0px 0px -60px 0px' }
    )
    obs.observe(leftEl)
    obs.observe(rightEl)
    return () => obs.disconnect()
  }, [])

  useEffect(() => {
    const section = collageSectionRef.current
    if (!section) return
    let delayedRevealId: ReturnType<typeof setTimeout> | null = null
    const obs = new IntersectionObserver(
      ([entry]) => {
        const isFirst = collageFirstCheck.current
        collageFirstCheck.current = false
        if (!entry?.isIntersecting) return
        if (isFirst) {
          delayedRevealId = setTimeout(() => setCollageRevealed(true), 450)
          obs.disconnect()
          return
        }
        setCollageRevealed(true)
        obs.disconnect()
      },
      { threshold: 0.15, rootMargin: '0px 0px -80px 0px' }
    )
    obs.observe(section)
    return () => {
      obs.disconnect()
      if (delayedRevealId) clearTimeout(delayedRevealId)
    }
  }, [])

  useEffect(() => {
    const el = ideasSectionRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.target === el && entry.isIntersecting) setIdeasInView(true)
        })
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  useEffect(() => {
    const el = testimoniesSectionRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.target === el && entry.isIntersecting) setTestimoniesInView(true)
        })
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  useEffect(() => {
    const startTitle = setTimeout(() => setIsVisible(true), 500)
    const startContent = setTimeout(() => setContentVisible(true), 1200)
    return () => {
      clearTimeout(startTitle)
      clearTimeout(startContent)
    }
  }, [])

  useEffect(() => {
    if (!founderStoryOpen) return
    const originalOverflow = document.body.style.overflow
    const originalHtmlOverflow = document.documentElement.style.overflow
    document.body.style.overflow = 'hidden'
    document.documentElement.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = originalOverflow
      document.documentElement.style.overflow = originalHtmlOverflow
    }
  }, [founderStoryOpen])

  const handleIdeaInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setIdeaFormData(prev => ({
      ...prev,
      [name]: value
    }))
    setIdeaSubmitError('')
    // Clear field error when user starts typing
    if (fieldErrors[name]) {
      setFieldErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const handleCloseError = () => {
    setIsClosingError(true)
    setTimeout(() => {
      setIdeaSubmitError('')
      setIsClosingError(false)
    }, 280)
  }

  const handleCloseFieldErrors = () => {
    setIsClosingFieldErrors(true)
    setTimeout(() => {
      setFieldErrors({})
      setIsClosingFieldErrors(false)
    }, 280)
  }

  const handleIdeaSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Custom validation
    const errors: { [key: string]: string } = {}
    if (!ideaFormData.name.trim()) {
      errors.name = 'Please enter your name'
    }
    if (!ideaFormData.email.trim()) {
      errors.email = 'Please enter your email'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(ideaFormData.email)) {
      errors.email = 'Please enter a valid email address'
    }
    if (!ideaFormData.message.trim()) {
      errors.message = 'Please share your idea'
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      return
    }

    setIsSubmittingIdea(true)
    setIdeaSubmitError('')
    setIdeaSubmitSuccess(false)
    setFieldErrors({})

    try {
      const response = await fetch('/api/send-idea', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(ideaFormData),
      })

      const data = await response.json()

      if (response.ok) {
        setIdeaSubmitSuccess(true)
        setIdeaFormData({ name: '', email: '', message: '' })
        setTimeout(() => setIdeaSubmitSuccess(false), 5000)
      } else {
        setIdeaSubmitError(data.error || 'Failed to send message. Please try again.')
      }
    } catch (error) {
      console.error('Error submitting idea:', error)
      setIdeaSubmitError('An error occurred. Please try again later.')
    } finally {
      setIsSubmittingIdea(false)
    }
  }

  // Sticky + reveal scroll distances (vh).
  const HERO_SCROLL_VH = 100
  const SECOND_SECTION_SCROLL_VH = 310
  const SECOND_SECTION_OFFSET = 60
  const SCROLL_WRAPPER_HEIGHT_VH = HERO_SCROLL_VH + SECOND_SECTION_OFFSET + SECOND_SECTION_SCROLL_VH
  const founderStories = [
    {
      key: 'julia' as const,
      name: 'Julia',
      sample:
        '“My connection to senior care began at an early age through time spent in long-term care homes, where I visited family members and formed relationships with residents through music, games, and conversation.\n\nWhile volunteering in community centres during the COVID-19 pandemic, as social isolation deepened for many older adults, it became increasingly clear to me that many seniors were left without consistent support. This experience revealed a meaningful gap and a powerful opportunity for youth to engage, contribute, and help build more equitable and accessible care for older adults.”'
    },
    {
      key: 'peter' as const,
      name: 'Peter',
      sample:
        '“Youth4Elders began for me with a simple video call with my grandparents. They were struggling with a few issues with their phones and tablets, so I spent about an hour helping them adjust phone settings and learn how to better use their device. What started as a small act of support quickly became something more meaningful.\n\nThat call made me realize that many older adults face unique challenges in today’s fast-moving society. Too often, they are left without the guidance or education needed to navigate everyday tools we take for granted. Reflecting on my own community, I began to wonder how many other elders had the same questions as my grandparents but felt hesitant to ask, didn’t know who to turn to, or lacked access to help altogether.\n\nEventually this reflection inspired me to take the steps in the creation of Youth4Elders with my co-president Julia. In hopes to organize change with our peers and create something that had a long-lasting interpersonal impact on the local communities in Ottawa.”'
    }
  ]

  return (
    <main className="min-h-screen" style={{ background: 'var(--color-cream)' }}>
      
      <div 
        style={{
          position: 'relative',
          height: `${SCROLL_WRAPPER_HEIGHT_VH}vh`, 
          zIndex: 2
        }}
      >
        <section 
          className="relative flex flex-col justify-center items-center px-6 md:px-8 py-12 overflow-visible"
          style={{
            position: 'sticky', 
            top: 0,
            height: `${HERO_SCROLL_VH}vh`,
            zIndex: 2,          
            background: 'var(--color-cream)', 
          }}
        >
            <div className="w-full max-w-3xl text-center">
            <h2 className="text-7xl md:text-8xl lg:text-9xl font-bold mb-8" style={{ fontFamily: 'var(--font-vintage-ligatures)' }}>
              <div
                ref={aboutUsTitleRef}
                className="relative inline-block cursor-default select-none"
                onMouseMove={(e) => {
                  const el = aboutUsTitleRef.current
                  if (!el) return
                  const rect = el.getBoundingClientRect()
                  const pos = { x: e.clientX - rect.left, y: e.clientY - rect.top }
                  lastCursorRef.current = pos
                  setCursorMask(pos)
                }}
                onMouseLeave={() => setCursorMask(null)}
                style={(cursorMask || lastCursorRef.current)
                  ? {
                      ['--cursor-x' as string]: `${(cursorMask || lastCursorRef.current)!.x}px`,
                      ['--cursor-y' as string]: `${(cursorMask || lastCursorRef.current)!.y}px`,
                    }
                  : undefined
                }
              >
                <span className="block">
                  {['ABOUT', 'US'].map((word, i) => (
                    <span key={i}>
                      <span
                        className={isVisible ? 'word-fade-in-up-blur-slow' : ''}
                        style={{
                          display: 'inline-block',
                          color: 'var(--color-brown-dark)',
                          animationDelay: isVisible ? `${i * 0.7}s` : undefined,
                          opacity: isVisible ? undefined : 0
                        }}
                      >
                        {word}
                      </span>
                      {i < 1 ? '\u00A0' : ''}
                    </span>
                  ))}
                </span>
                <span
                  aria-hidden
                  className="about-us-pink-mask absolute inset-0 block pointer-events-none transition-opacity duration-150 ease-out"
                  style={{
                    fontFamily: 'var(--font-vintage-ligatures)',
                    color: 'var(--color-pink-medium)',
                    opacity: cursorMask ? 1 : 0,
                    maskImage: (cursorMask || lastCursorRef.current)
                      ? `radial-gradient(circle 16px at var(--cursor-x) var(--cursor-y), black 0%, black 100%, transparent 100%)`
                      : 'none',
                    WebkitMaskImage: (cursorMask || lastCursorRef.current)
                      ? `radial-gradient(circle 16px at var(--cursor-x) var(--cursor-y), black 0%, black 100%, transparent 100%)`
                      : 'none',
                    maskSize: (cursorMask || lastCursorRef.current) ? '100% 100%' : undefined,
                    maskRepeat: (cursorMask || lastCursorRef.current) ? 'no-repeat' : undefined,
                    WebkitMaskSize: (cursorMask || lastCursorRef.current) ? '100% 100%' : undefined,
                    WebkitMaskRepeat: (cursorMask || lastCursorRef.current) ? 'no-repeat' : undefined,
                  }}
                >
                  {['ABOUT', 'US'].map((word, i) => (
                    <span key={i}>
                      <span
                        className={isVisible ? 'word-fade-in-up-blur-slow' : ''}
                        style={{
                          display: 'inline-block',
                          animationDelay: isVisible ? `${i * 0.7}s` : undefined,
                          opacity: isVisible ? undefined : 0
                        }}
                      >
                        {word}
                      </span>
                      {i < 1 ? '\u00A0' : ''}
                    </span>
                  ))}
                </span>
              </div>
            </h2>
            <div
              className={contentVisible ? 'animate-fadeInUp' : 'opacity-0'}
              style={{ animationDelay: contentVisible ? '0.15s' : '0s' }}
            >
              <p
                className="text-xl md:text-2xl leading-relaxed mb-14"
                style={{ fontFamily: 'var(--font-leiko)', color: 'var(--color-brown-dark)', opacity: 0.92 }}
              >
                Youth 4 Elders is a student-led organization from the University of Ottawa, dedicated to supporting the senior community through meaningful volunteerism.
              </p>
              <p
                className="text-lg italic opacity-90"
                style={{ fontFamily: 'var(--font-leiko)', color: 'var(--color-brown-dark)' }}
              >
                Scroll to find out more
              </p>
              <span className="inline-block animate-bounce text-base mt-2 opacity-90" style={{ color: 'var(--color-brown-dark)' }} aria-hidden>↓</span>
            </div>
          </div>
        </section>

        {/* Second section (redesigned): Founders + Impact (scroll-reveal over hero) */}
        <section 
          className="relative py-16 md:py-24"
          style={{ 
            position: 'absolute', 
            top: `${HERO_SCROLL_VH + SECOND_SECTION_OFFSET}vh`,
            left: 0,
            right: 0,
            width: '100%',
            height: `${SECOND_SECTION_SCROLL_VH}vh`,
            background: 'var(--color-olive)',
            zIndex: 3,
            pointerEvents: 'auto',
            overflow: 'visible',
          }}
        >
          <div className="max-w-6xl mx-auto px-6 md:px-10 lg:px-12 relative pt-[12vh] md:pt-[18vh]" style={{ overflow: 'visible' }}>
            <div className="mb-8 md:mb-12">
              <p 
                className="text-sm md:text-base uppercase tracking-widest mb-3"
                style={{ 
                  fontFamily: 'var(--font-kollektif)', 
                  color: 'var(--color-cream)',
                  letterSpacing: '0.2em',
                }}
              >
                <span style={{ color: 'var(--color-cream)' }}>Our story</span>
              </p>
              <h2 
                className="text-4xl md:text-5xl lg:text-6xl font-bold italic"
                style={{ fontFamily: 'var(--font-vintage-stylist)', color: 'var(--color-cream)' }}
              >
                Founders
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 xl:gap-28 items-start">
              {/* Text - narrower column for more space before image */}
              <div className="pt-2 md:pt-4 order-2 lg:order-1 max-w-xl lg:max-w-none lg:pr-4 xl:pr-8">
                <blockquote 
                  className="text-lg md:text-xl leading-relaxed italic mb-16 md:mb-18 max-w-xl"
                  style={{ fontFamily: 'var(--font-leiko)', color: 'var(--color-cream)', opacity: 0.92, fontStyle: 'italic', borderLeft: '3px solid var(--color-cream)', paddingLeft: '20px' }}
                  >
                  <p className="mb-4">
                    Youth 4 Elders was founded through a shared passion for intergenerational connection and community care.
                  </p>

                  <p>
                    Julia’s connection to senior care began at an early age, through time spent in long-term care homes visiting family and forming relationships with residents through music, games, and conversation. While volunteering in community centres during the COVID-19 pandemic, as social isolation deepened for many older adults, it became increasingly clear to Julia that many seniors were left without consistent support. This experience revealed a meaningful gap and a powerful opportunity for youth to engage, contribute, and help build more equitable and accessible care for older adults.
                  </p>
                </blockquote>

              </div>

              {/* Photo - Now on the right with decorative blobs */}
              <div className="w-full max-w-2xl mx-auto lg:mx-0 order-1 lg:order-2 relative" style={{ minHeight: '600px', padding: '40px 20px', overflow: 'visible' }}>
                {/* First decorative blob - top right (outside) */}
              <div 
                  className="absolute"
                  style={{
                    width: '420px',
                    height: '420px',
                    background: '#C9DAA8', // Seafoam light
                    borderRadius: '45% 55% 60% 40% / 55% 45% 55% 45%',
                    zIndex: 0,
                    top: '-10%',
                    right: '-15%',
                  }}
                />
                {/* Second decorative blob - bottom left (outside) */}
                <div 
                  className="absolute"
                  style={{
                    width: '300px',
                    height: '300px',
                    background: '#A9C98A', // Seafoam deep
                    borderRadius: '55% 45% 50% 50% / 45% 55% 45% 55%',
                    zIndex: 0,
                    bottom: '2%',
                    left: '-5%',
                  }}
                />
                {/* Founders image with organic blob shape */}
                <div 
                  className="relative z-10 mx-auto"
                style={{ 
                    width: '520px',
                    height: '520px',
                    maxWidth: '100%',
                    borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%',
                    overflow: 'hidden',
                    boxShadow: '0 12px 34px rgba(73, 47, 30, 0.16)',
                    background: 'var(--color-cream)',
                }}
              >
                  <Image
                    src="/assets/club-info/founders.jpg"
                    alt="Youth 4 Elders founders at a club gathering"
                    fill
                    sizes="(max-width: 1024px) 100vw, 520px"
                    style={{ objectFit: 'cover', objectPosition: 'center 25%' }}
                  />
                  <div
                    aria-hidden
                    className="absolute inset-0"
                    style={{ 
                      background:
                        'linear-gradient(to top, rgba(91, 59, 30, 0.15) 0%, rgba(91, 59, 30, 0.0) 70%)',
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="mt-24 md:mt-32 pt-6">
              <div className="flex flex-col gap-3 mb-12">
                <p
                  className="text-sm md:text-base uppercase tracking-widest mb-2"
                  style={{ fontFamily: 'var(--font-kollektif)', color: 'var(--color-olive-light)', letterSpacing: '0.2em' }}
                >
                  Founder goals
                </p>
                <div className="h-[2px] w-20 mt-4" style={{ background: 'var(--color-olive-light)' }} />
              </div>

              <p
                className="text-lg md:text-xl leading-relaxed w-full pr-0"
                style={{ fontFamily: 'var(--font-leiko)', color: 'var(--color-olive-light)' }}
              >
                We connect youth and seniors through tech help, education, and one‑on‑one engagement—building confidence on both sides and empowering youth with leadership and community responsibility. Our focus is older adults in senior homes and those facing isolation, through workshops, companionship, and support for care communities.
              </p>

            </div>

            <div className="mt-44 md:mt-52">
              <div className="flex flex-col gap-3 mb-8 text-center">
                <p
                  className="text-3xl md:text-4xl lg:text-5xl font-semibold italic"
                  style={{ fontFamily: 'var(--font-vintage-stylist)', color: 'var(--color-cream)' }}
                >
                  Founder Perspectives
                </p>
                <p
                  className="text-lg md:text-xl lg:text-2xl"
                  style={{ fontFamily: 'var(--font-leiko)', color: 'rgba(251, 247, 232, 0.85)' }}
                >
                  Hear our founders in their own words.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10 md:mt-16">
                {founderStories.map((item) => (
                  <button
                    key={item.key}
                    type="button"
                    className="group border p-10 text-center transition-all duration-300 hover:-translate-y-1 w-80 h-80 md:w-96 md:h-96 lg:w-[28rem] lg:h-[28rem] mx-auto flex flex-col items-center justify-center relative"
                    style={{
                      borderColor: 'rgba(251, 247, 232, 0.45)',
                      background: 'rgba(251, 247, 232, 0.04)',
                      borderRadius:
                        item.key === 'julia'
                          ? '60% 40% 55% 45% / 55% 50% 50% 45%'
                          : '55% 45% 50% 50% / 45% 55% 40% 60%'
                    }}
                    onClick={() => setFounderStoryOpen(item.key)}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(173, 216, 230, 0.4)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'rgba(251, 247, 232, 0.04)'
                    }}
                  >
                    <div
                      className="mx-auto relative w-36 h-36 md:w-40 md:h-40 rounded-full overflow-hidden"
                      style={{ background: 'var(--color-olive-light)' }}
                    >
                      <Image
                        src={
                          item.key === 'julia'
                            ? '/assets/club-info/julia.png'
                            : '/assets/club-info/peter.png'
                        }
                        alt={`${item.name} illustration`}
                        fill
                        className="object-contain"
                      />
                    </div>
                    <h3
                      className="mt-4 text-4xl md:text-5xl font-semibold"
                      style={{ fontFamily: 'var(--font-vintage-stylist)', color: 'var(--color-olive-light)' }}
                    >
                      {item.name}
                    </h3>
                    <div
                      className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      style={{
                        background: 'rgba(201, 218, 168, 0.7)',
                        backdropFilter: 'blur(8px)',
                        WebkitBackdropFilter: 'blur(8px)',
                        borderRadius:
                          item.key === 'julia'
                            ? '60% 40% 55% 45% / 55% 50% 50% 45%'
                            : '55% 45% 50% 50% / 45% 55% 40% 60%'
                      }}
                    >
                      <span
                        className="text-xs md:text-sm uppercase tracking-widest"
                        style={{ fontFamily: 'var(--font-kollektif)', color: 'var(--color-olive)' }}
                      >
                        Open my story
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {founderStoryOpen && typeof document !== 'undefined' && createPortal(
              <div
                className={`fixed inset-0 z-[9999] flex items-center justify-center px-6 py-10 backdrop-blur-md ${
                  isClosingFounderStory ? 'modal-overlay-fade-out' : 'modal-overlay-fade'
                }`}
                style={{ background: 'rgba(15, 31, 20, 0.65)' }}
                onClick={() => {
                  setIsClosingFounderStory(true)
                  setTimeout(() => {
                    setFounderStoryOpen(null)
                    setIsClosingFounderStory(false)
                  }, 280)
                }}
              >
                <div
                  className={`relative w-full max-w-4xl rounded-3xl border p-8 md:p-10 ${
                    isClosingFounderStory ? 'modal-card-pop-out' : 'modal-card-pop'
                  }`}
                  style={{
                    background: 'var(--color-pink-light)',
                    borderColor: 'rgba(98, 32, 47, 0.35)',
                    boxShadow: '0 24px 60px rgba(15, 31, 20, 0.25)',
                    maxHeight: '85vh',
                    overflowY: 'auto'
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    type="button"
                    className="absolute top-5 right-5 w-10 h-10 rounded-full flex items-center justify-center"
                    style={{
                      background: 'var(--color-brown-dark)',
                      color: 'var(--color-pink-light)',
                      border: '1px solid var(--color-pink-light)'
                    }}
                    onClick={() => {
                      setIsClosingFounderStory(true)
                      setTimeout(() => {
                        setFounderStoryOpen(null)
                        setIsClosingFounderStory(false)
                      }, 280)
                    }}
                    aria-label="Close story"
                  >
                    ✕
                  </button>
                  <div>
                    {founderStories
                      .filter((item) => item.key === founderStoryOpen)
                      .map((item) => (
                        <div key={item.key}>
                          <p
                            className="text-xs md:text-sm uppercase tracking-widest mb-4"
                            style={{ fontFamily: 'var(--font-kollektif)', color: 'var(--color-brown-dark)' }}
                          >
                            {item.name}&rsquo;s story
                          </p>
                          <div className="mb-6 flex justify-center">
                            <div className="relative w-44 h-44 md:w-52 md:h-52">
                              <Image
                                src={
                                  item.key === 'julia'
                                    ? '/assets/club-info/heart.png'
                                    : '/assets/club-info/hug.png'
                                }
                                alt={`${item.name} story illustration`}
                                fill
                                className="object-contain"
                              />
                            </div>
                          </div>
                          <h3
                            className="text-3xl md:text-4xl font-semibold mb-5"
                            style={{ fontFamily: 'var(--font-vintage-stylist)', color: 'var(--color-brown-dark)' }}
                          >
                            {item.key === 'julia' ? 'Music, Care, and Connection' : 'A Call That Sparked a Movement'}
                          </h3>
                          <p
                            className="text-base md:text-lg leading-relaxed whitespace-pre-line"
                            style={{ fontFamily: 'var(--font-leiko)', color: 'var(--color-brown-dark)' }}
                          >
                            {item.sample}
                          </p>
                        </div>
                      ))}
                  </div>
                </div>
              </div>,
              document.body
            )}

          </div>
        </section>
      </div>

      {/* Wrapper so Youth 4 Elders bar sticks through General club info + Programs, then scrolls away before Ideas Welcome */}
      <div>
        <div
          className="border-t-4 md:border-t-[6px] border-dotted"
          style={{
            position: 'sticky',
            top: 0,
            height: 'auto',
            minHeight: 'clamp(36px, 6vh, 48px)',
            background: 'var(--color-pink-light)',
            borderTopColor: 'var(--color-olive)',
            zIndex: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 'clamp(6px, 1vh, 10px) clamp(12px, 2vw, 20px)',
          }}
        >
          <span
            className="font-bold italic text-center whitespace-nowrap"
              style={{ 
              fontFamily: 'var(--font-vintage-stylist)',
              color: 'var(--color-olive)',
              fontStyle: 'italic',
              fontSize: 'clamp(1rem, 2vw, 1.35rem)',
              lineHeight: 1.02,
              letterSpacing: '0.02em',
            }}
          >
            Youth 4 Elders
          </span>
        </div>

      {/* Our Mission — inspo: centered headline + overlapping image & soft pink card per block */}
      <section className="pt-28 pb-20 md:pt-36 md:pb-28" style={{ background: 'var(--color-cream)' }}>
        <div className="max-w-7xl mx-auto px-3 md:px-4 lg:px-5">
          <header className="text-center mb-28 md:mb-40 pt-4 md:pt-6">
            <h2
              ref={missionHeaderRef}
              className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold max-w-4xl mx-auto leading-tight mb-6 md:mb-8"
              style={{ fontFamily: 'var(--font-vintage-stylist)', color: 'var(--color-brown-dark)' }}
            >
              {['The work we do. The ', 'difference', ' you can make.'].map((part, i) => (
                <span key={i}>
                  {part === 'difference' ? (
                    <span
                      className={missionTitleVisible ? 'word-fade-in-up-blur-slow' : ''}
                      style={{
                        display: 'inline-block',
                        animationDelay: missionTitleVisible ? `${i * 0.5}s` : undefined,
                        opacity: missionTitleVisible ? undefined : 0,
                      }}
                    >
                      <span className="px-2 py-0.5 rounded-full" style={{ background: 'var(--color-pink-light)', boxShadow: '0 0 0 2px var(--color-pink-medium)' }}>
                        difference
                    </span>
                    </span>
                  ) : (
                    <span
                      className={missionTitleVisible ? 'word-fade-in-up-blur-slow' : ''}
                      style={{
                        display: 'inline-block',
                        animationDelay: missionTitleVisible ? `${i * 0.5}s` : undefined,
                        opacity: missionTitleVisible ? undefined : 0,
                      }}
                    >
                      {part}
                    </span>
                  )}
                    </span>
                  ))}
            </h2>
            <p className="text-base md:text-lg lg:text-xl max-w-3xl mx-auto leading-relaxed mb-12 md:mb-16" style={{ fontFamily: 'var(--font-leiko)', color: 'var(--color-olive)', opacity: 0.98 }}>
              To inspire passion among their peers —
              all the while mobilizing youth, raising awareness, and creating meaningful impact.
            </p>
          </header>

          <div className="space-y-28 md:space-y-36 lg:space-y-44">
            {/* Block 1: image on left, wider, shifted right to overlap the box */}
            <div
              ref={missionLeftRef}
              className="flex flex-col lg:flex-row lg:items-center gap-6 lg:gap-0"
              style={{
                transition: 'opacity 0.7s ease-out, transform 0.7s ease-out',
                opacity: missionLeftInView ? 1 : 0.6,
                transform: missionLeftInView ? 'translateX(0)' : 'translateX(-32px)',
              }}
            >
              {/* Image — overlaps the pink box more (larger negative margin) */}
              <div className="relative w-full lg:w-96 xl:w-[26rem] flex-shrink-0 aspect-square rounded-xl overflow-hidden mx-auto lg:mx-0 lg:mr-[-7rem] lg:z-10 max-w-lg border-4 border-solid" style={{ borderColor: 'var(--color-olive)' }}>
                <Image
                  src="/assets/club-info/table.jpg"
                  alt="Support that reaches every generation — collaboration and programs"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 416px"
                />
              </div>
              {/* Box: MERLOT background. Text: label = cream, title + body = pink */}
              <div
                className="flex-1 min-h-[440px] md:min-h-[520px] lg:min-h-[600px] rounded-2xl md:rounded-3xl py-5 md:py-6 lg:py-8 pl-24 md:pl-32 lg:pl-40 pr-6 md:pr-8 flex flex-col justify-center text-left"
                style={{
                  background: 'var(--color-brown-dark)',
                  boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2), 0 4px 12px rgba(0, 0, 0, 0.12)',
                }}
              >
                <div className="max-w-2xl">
                  <p className="text-base md:text-lg uppercase tracking-[0.2em] mb-4 font-semibold italic" style={{ fontFamily: 'var(--font-freshwost)', color: 'var(--color-olive)' }}>
                    What we do
                  </p>
                  <h3 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight" style={{ fontFamily: 'var(--font-vintage-ligatures)', color: 'var(--color-pink-medium)' }}>
                    Support that reaches every generation.
                </h3>
                  <p className="text-lg md:text-xl leading-relaxed mb-5" style={{ fontFamily: 'var(--font-kollektif)', color: 'var(--color-pink-medium)', opacity: 0.95 }}>
                    The club delivers <strong>workshops, events, programs, and fundraisers</strong> designed to provide <strong>direct support</strong> to older adults and raise awareness about issues that affect seniors. Our programs and services are built on a commitment to <strong>equity and accessibility</strong>, ensuring that opportunities for connection and support remain <strong>inclusive and responsive</strong> to the diverse needs of older adults.
                </p>
              </div>
            </div>
          </div>

            {/* Block 2: same as block 1 — merlot box, pink label/title/body, image on right */}
            <div
              ref={missionRightRef}
              className="flex flex-col lg:flex-row-reverse lg:items-center gap-6 lg:gap-0"
            style={{
                transition: 'opacity 0.7s ease-out, transform 0.7s ease-out',
                opacity: missionRightInView ? 1 : 0.6,
                transform: missionRightInView ? 'translateX(0)' : 'translateX(32px)',
              }}
            >
              {/* Image — on right, overlaps the box (mirror of block 1) */}
              <div className="relative w-full lg:w-96 xl:w-[26rem] flex-shrink-0 aspect-square rounded-xl overflow-hidden mx-auto lg:mx-0 lg:ml-[-7rem] lg:z-10 max-w-lg order-1 lg:order-1 border-4 border-solid" style={{ borderColor: 'var(--color-olive)' }}>
                <Image
                  src="/assets/club-info/team.jpg"
                  alt="Grow your skills. Make a real impact — Youth 4 Elders team"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 416px"
                />
              </div>
              {/* Box: same as block 1 — MERLOT, text shifted left (less left padding) */}
              <div
                className="flex-1 min-h-[440px] md:min-h-[520px] lg:min-h-[600px] rounded-2xl md:rounded-3xl py-5 md:py-6 lg:py-8 pl-12 md:pl-16 lg:pl-20 pr-6 md:pr-8 flex flex-col justify-center text-left order-2 lg:order-2"
              style={{ 
                  background: 'var(--color-brown-dark)',
                  boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2), 0 4px 12px rgba(0, 0, 0, 0.12)',
                }}
              >
                <div className="max-w-2xl">
                  <p className="text-base md:text-lg uppercase tracking-[0.2em] mb-4 font-semibold italic" style={{ fontFamily: 'var(--font-freshwost)', color: 'var(--color-olive)' }}>
                    Why get involved
                  </p>
                  <h3 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight" style={{ fontFamily: 'var(--font-vintage-ligatures)', color: 'var(--color-pink-medium)' }}>
                    Grow your skills. Make a real impact.
                  </h3>
                  <ul className="text-lg md:text-xl leading-relaxed space-y-4 list-disc pl-5 md:pl-6" style={{ fontFamily: 'var(--font-kollektif)', color: 'var(--color-pink-medium)', opacity: 0.95 }}>
                    <li>Support older adults while building <strong>transferable skills</strong>—communication, leadership, collaboration, empathy, and compassion—and form <strong>meaningful connections</strong> along the way. Skills you can use in school, work, and beyond.</li>
                    <li>Gain <strong>professional experience</strong> that counts: <strong>volunteer hours and reference letters</strong> for school or your career, plus opportunities to build lasting <strong>professional relationships</strong> and expand your network.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

        </div>

      {/* Impact stats — full-width strip with count-up */}
      <section
        ref={impactStatsRef}
        className="py-6 md:py-8 mb-14 md:mb-24 border-y-4 md:border-y-[6px] border-dotted"
        style={{
          background: 'var(--color-pink-light)',
          borderColor: 'var(--color-olive)',
        }}
      >
        <div className="max-w-6xl mx-auto px-6 md:px-10 grid grid-cols-1 sm:grid-cols-3 gap-10 md:gap-12 text-center">
          <div className="flex flex-col items-center gap-2">
            <span className="text-4xl md:text-5xl lg:text-6xl font-bold tabular-nums" style={{ fontFamily: 'var(--font-vintage-stylist)', color: 'var(--color-olive)' }}>
              {statPrimary.toLocaleString()}+
            </span>
            <span className="text-sm md:text-base uppercase tracking-widest" style={{ fontFamily: 'var(--font-kollektif)', color: 'var(--color-olive)', opacity: 0.95 }}>Primary participants</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <span className="text-4xl md:text-5xl lg:text-6xl font-bold tabular-nums" style={{ fontFamily: 'var(--font-vintage-stylist)', color: 'var(--color-olive)' }}>
              {statCommunity.toLocaleString()}+
            </span>
            <span className="text-sm md:text-base uppercase tracking-widest" style={{ fontFamily: 'var(--font-kollektif)', color: 'var(--color-olive)', opacity: 0.95 }}>Community &amp; public impact</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <span className="text-4xl md:text-5xl lg:text-6xl font-bold tabular-nums" style={{ fontFamily: 'var(--font-vintage-stylist)', color: 'var(--color-olive)' }}>
              {statStudent}%
            </span>
            <span className="text-sm md:text-base uppercase tracking-widest" style={{ fontFamily: 'var(--font-kollektif)', color: 'var(--color-olive)', opacity: 0.95 }}>Student-led</span>
          </div>
        </div>
      </section>

      {/* Photo collage — full viewport bleed, no side padding, images can cut off left/right */}
      <section
        ref={collageSectionRef}
        className="relative pt-8 pb-0 md:pt-10 md:pb-0 overflow-hidden"
        style={{
          background: 'var(--color-cream)',
          minHeight: 'clamp(540px, 60vw, 740px)',
          width: '100vw',
          marginLeft: 'calc(-50vw + 50%)',
          marginRight: 'calc(-50vw + 50%)',
        }}
      >
        <div className="relative w-full max-w-none px-0 origin-center" style={{ minHeight: 'clamp(500px, 56vw, 680px)', transform: 'scale(0.88)', width: '100%' }}>
          {/* Left panel — vertical */}
          <div
            className={`absolute left-[-4%] md:left-[-10%] top-0 w-[34%] min-w-[180px] max-w-[340px] aspect-[3/4] rounded-lg overflow-hidden z-10 ${collageRevealed ? 'collage-scroll-reveal' : ''}`}
            style={{ opacity: 0, animationDelay: collageRevealed ? `${COLLAGE_DELAYS[0]}s` : undefined }}
          >
            <Image
              src="/assets/club-info/carousel2.JPG"
              alt=""
              fill
              className="object-cover"
              sizes="340px"
            />
          </div>

          {/* Center panel — overlaps left, main focal */}
          <div
            className={`absolute left-[24%] md:left-[78%] top-[5%] w-[50%] min-w-[240px] max-w-[500px] aspect-[4/5] rounded-lg overflow-hidden z-[8] ${collageRevealed ? 'collage-scroll-reveal' : ''}`}
            style={{ opacity: 0, animationDelay: collageRevealed ? `${COLLAGE_DELAYS[1]}s` : undefined }}
          >
            <Image
              src="/assets/club-info/carousel3.JPG"
              alt=""
              fill
              className="object-cover"
              sizes="500px"
            />
          </div>

          {/* Top-right card — overlaps center */}
          <div
            className={`absolute left-[52%] md:left-[60%] top-[62%] w-[20%] min-w-[140px] max-w-[280px] aspect-[4/5] rounded-lg overflow-hidden z-[6] ${collageRevealed ? 'collage-scroll-reveal' : ''}`}
            style={{ opacity: 0, animationDelay: collageRevealed ? `${COLLAGE_DELAYS[2]}s` : undefined }}
          >
            <Image
              src="/assets/club-info/carousel1.JPG"
              alt=""
              fill
              className="object-cover"
              sizes="280px"
            />
          </div>

          {/* Meet the team — on top of images */}
          <Link
            href="/team"
            className={`group absolute left-[16%] top-[22%] z-[20] inline-flex items-center gap-2 font-semibold text-sm md:text-base tracking-widest transition-all duration-300 ${collageRevealed ? 'collage-scroll-reveal' : ''}`}
            style={{ fontFamily: 'var(--font-kollektif)', color: 'var(--color-brown-dark)', letterSpacing: '0.15em', opacity: 0, animationDelay: collageRevealed ? `${COLLAGE_DELAYS[6]}s` : undefined }}
          >
            <span>MEET THE TEAM</span>
            <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            <span className="absolute bottom-0 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full" style={{ background: 'var(--color-brown-dark)' }} />
          </Link>

          {/* Sixth photo — overlaps center/right (gym / community) */}
          <div
            className={`absolute left-[61%] md:left-[65%] top-[-10%] w-[30%] min-w-[140px] max-w-[300px] aspect-[4/5] rounded-lg overflow-hidden z-[8] ${collageRevealed ? 'collage-scroll-reveal' : ''}`}
            style={{ opacity: 0, animationDelay: collageRevealed ? `${COLLAGE_DELAYS[3]}s` : undefined }}
          >
            <Image
              src="/assets/club-info/carousel4.JPG"
              alt=""
              fill
              className="object-cover"
              sizes="300px"
            />
          </div>

          {/* Check photo — horizontal frame to match landscape photo (no vertical crop) */}
          <div
            className={`absolute left-[52%] md:left-[5%] top-[30%] w-[50%] min-w-[320px] max-w-[660px] aspect-[4/3] rounded-lg overflow-hidden z-[6] ${collageRevealed ? 'collage-scroll-reveal' : ''}`}
            style={{ opacity: 0, animationDelay: collageRevealed ? `${COLLAGE_DELAYS[4]}s` : undefined }}
          >
            <Image
              src="/assets/club-info/carousel.JPG"
              alt=""
              fill
              className="object-cover"
              sizes="660px"
            />
          </div>

          {/* Flowers (carousel5) — square container to match square image */}
          <div
            className={`absolute left-[53%] md:left-[40%] top-[10%] w-[38%] min-w-[200px] max-w-[400px] aspect-square rounded-lg overflow-hidden z-[7] ${collageRevealed ? 'collage-scroll-reveal' : ''}`}
            style={{ opacity: 0, animationDelay: collageRevealed ? `${COLLAGE_DELAYS[5]}s` : undefined }}
          >
            <Image
              src="/assets/club-info/carousel5.JPG"
              alt=""
              fill
              className="object-contain"
              sizes="400px"
            />
          </div>
        </div>
        <div className="h-8 md:h-10" aria-hidden />
        <div className="mt-20 md:mt-28 mx-auto max-w-3xl border-t-4 md:border-t-[6px] border-dashed" style={{ borderColor: 'var(--color-brown-dark)' }} aria-hidden />
      </section>

      {/* Ideas Welcome — form left, copy right; green & pink colour scheme */}
      <section ref={ideasSectionRef} id="ideas" className="mt-0 py-16 md:py-20 lg:py-28 scroll-mt-6" style={{ background: 'var(--color-cream)' }}>
        <div className={`w-full mx-auto px-6 md:px-10 lg:px-12 max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center animate-on-scroll fade-up ${ideasInView ? 'visible' : ''}`} style={{ transitionDuration: '0.6s', transitionDelay: '0.2s' }}>
          {/* Form — left */}
          <div className="relative min-w-0 flex flex-col items-center lg:items-start order-2 lg:order-1">
            <div
              key={ideaSubmitSuccess ? 'success' : 'form'}
              className={`relative w-full max-w-lg rounded-2xl p-6 md:p-8 lg:p-10 shadow-lg ${ideaSubmitSuccess ? 'idea-success-box-in' : ''}`}
              style={{ background: 'var(--color-pink-light)', border: '2px solid var(--color-olive)' }}
            >
              {ideaSubmitSuccess && (
                <div className="py-10 text-left">
                  <p className="text-lg font-medium" style={{ fontFamily: 'var(--font-kollektif)', color: 'var(--color-olive)' }}>
                    Got it — we got your idea and we We’ll be in touch!
                  </p>
                </div>
              )}

              {(ideaSubmitError || isClosingError) && !ideaSubmitSuccess && (
                <div
                  role="button"
                  tabIndex={0}
                  onClick={handleCloseError}
                  onKeyDown={(e) => e.key === 'Enter' && handleCloseError()}
                  className={`absolute inset-0 flex items-center justify-center z-50 rounded-2xl backdrop-blur-[6px] cursor-pointer ${isClosingError ? 'modal-overlay-fade-out' : 'modal-overlay-fade'}`}
                  style={{ backgroundColor: 'rgba(255, 255, 255, 0.25)' }}
                  aria-label="Close"
                >
                  <div
                    role="dialog"
                    aria-modal="true"
                    onClick={(e) => e.stopPropagation()}
                    onKeyDown={(e) => e.stopPropagation()}
                    className={`p-4 rounded-xl mx-4 max-w-md border-2 shadow-xl cursor-default ${isClosingError ? 'modal-card-pop-out' : 'modal-card-pop'}`}
                    style={{ background: 'var(--color-olive)', borderColor: 'var(--color-olive)', color: 'var(--color-cream)' }}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <p className="text-sm flex-1" style={{ fontFamily: 'var(--font-kollektif)', color: 'var(--color-cream)' }}>{ideaSubmitError}</p>
                      <button onClick={handleCloseError} className="flex-shrink-0 text-lg opacity-80 hover:opacity-100" style={{ color: 'var(--color-cream)' }} aria-label="Close">×</button>
                    </div>
                  </div>
                </div>
              )}

              {((fieldErrors.name || fieldErrors.email || fieldErrors.message) || isClosingFieldErrors) && (
                <div
                  role="button"
                  tabIndex={0}
                  onClick={handleCloseFieldErrors}
                  onKeyDown={(e) => e.key === 'Enter' && handleCloseFieldErrors()}
                  className={`absolute inset-0 flex items-center justify-center z-50 rounded-2xl backdrop-blur-[6px] cursor-pointer ${isClosingFieldErrors ? 'modal-overlay-fade-out' : 'modal-overlay-fade'}`}
                  style={{ backgroundColor: 'rgba(255, 255, 255, 0.25)' }}
                  aria-label="Close"
                >
                  <div
                    role="dialog"
                    aria-modal="true"
                    onClick={(e) => e.stopPropagation()}
                    onKeyDown={(e) => e.stopPropagation()}
                    className={`p-4 rounded-xl mx-4 max-w-sm border-2 shadow-xl cursor-default ${isClosingFieldErrors ? 'modal-card-pop-out' : 'modal-card-pop'}`}
                    style={{ background: 'var(--color-olive)', borderColor: 'var(--color-olive)', color: 'var(--color-cream)' }}
                  >
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <p className="text-sm font-medium" style={{ fontFamily: 'var(--font-kollektif)', color: 'var(--color-cream)' }}>Please fill in all fields.</p>
                      <button type="button" onClick={handleCloseFieldErrors} className="flex-shrink-0 text-lg opacity-80 hover:opacity-100" style={{ color: 'var(--color-cream)' }} aria-label="Close">×</button>
                    </div>
                    <ul className="space-y-0.5 text-xs" style={{ fontFamily: 'var(--font-kollektif)', color: 'var(--color-cream)', opacity: 0.95 }}>
                      {fieldErrors.name && <li>• {fieldErrors.name}</li>}
                      {fieldErrors.email && <li>• {fieldErrors.email}</li>}
                      {fieldErrors.message && <li>• {fieldErrors.message}</li>}
                    </ul>
                  </div>
                </div>
              )}

              {!ideaSubmitSuccess && (
                <form onSubmit={handleIdeaSubmit} className="relative" noValidate>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="idea-name" className="block text-sm font-semibold mb-2 uppercase tracking-wider" style={{ fontFamily: 'var(--font-kollektif)', color: 'var(--color-olive)' }}>
                        Name
                      </label>
                      <input
                        id="idea-name"
                        type="text"
                        name="name"
                        value={ideaFormData.name}
                        onChange={handleIdeaInputChange}
                        placeholder="e.g. Jane Smith"
                        className="w-full px-5 py-4 text-base md:text-lg rounded-xl border-2 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-[var(--color-pink-medium)] transition-colors"
                        style={{ background: 'var(--color-cream)', borderColor: 'var(--color-olive)', color: 'var(--color-olive)', fontFamily: 'var(--font-kollektif)' }}
                      />
                    </div>
                    <div>
                      <label htmlFor="idea-email" className="block text-sm font-semibold mb-2 uppercase tracking-wider" style={{ fontFamily: 'var(--font-kollektif)', color: 'var(--color-olive)' }}>
                        Email
                      </label>
                      <input
                        id="idea-email"
                        type="email"
                        name="email"
                        value={ideaFormData.email}
                        onChange={handleIdeaInputChange}
                        placeholder="e.g. jane@example.com"
                        className="w-full px-5 py-4 text-base md:text-lg rounded-xl border-2 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-[var(--color-pink-medium)] transition-colors"
                        style={{ background: 'var(--color-cream)', borderColor: 'var(--color-olive)', color: 'var(--color-olive)', fontFamily: 'var(--font-kollektif)' }}
                      />
                    </div>
                    <div>
                      <label htmlFor="idea-message" className="block text-sm font-semibold mb-2 uppercase tracking-wider" style={{ fontFamily: 'var(--font-kollektif)', color: 'var(--color-olive)' }}>
                        Your idea
                      </label>
                      <textarea
                        id="idea-message"
                        name="message"
                        value={ideaFormData.message}
                        onChange={handleIdeaInputChange}
                        placeholder="Tell us about your program or event idea..."
                        rows={5}
                        className="w-full px-5 py-4 text-base md:text-lg rounded-xl border-2 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-[var(--color-pink-medium)] transition-colors resize-none"
                        style={{ background: 'var(--color-cream)', borderColor: 'var(--color-olive)', color: 'var(--color-olive)', fontFamily: 'var(--font-kollektif)' }}
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmittingIdea}
                    className="mt-6 w-full py-3.5 rounded-xl font-semibold text-base uppercase tracking-wider disabled:opacity-50 disabled:cursor-not-allowed border-2 transition-colors hover:opacity-90"
                    style={{ background: 'var(--color-olive)', color: 'var(--color-cream)', fontFamily: 'var(--font-kollektif)', borderColor: 'var(--color-olive)' }}
                  >
                    {isSubmittingIdea ? 'Sending...' : 'Send your idea'}
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Copy — right */}
          <div className="order-1 lg:order-2 text-right">
            <h3 className="text-4xl md:text-5xl lg:text-6xl font-bold uppercase mb-10 flex flex-wrap items-center justify-end gap-x-3 gap-y-1" style={{ fontFamily: 'var(--font-kollektif)', color: 'var(--color-olive)', letterSpacing: '0.08em' }}>
              Ideas Welcome
            </h3>
            <p className="text-lg md:text-xl leading-relaxed mb-6" style={{ fontFamily: 'var(--font-leiko)', color: 'var(--color-olive)', opacity: 0.9, lineHeight: 1.7 }}>
              Got a program or event idea? We’d love to hear it. We team up with partners to shape initiatives that fit your goals, your residents’ interests, and what works on the ground.
            </p>
            <p className="text-base md:text-lg leading-relaxed" style={{ fontFamily: 'var(--font-leiko)', color: 'var(--color-olive)', lineHeight: 1.7 }}>
              <span
                className="px-1.5 -mx-1.5 inline whitespace-nowrap"
                style={{
                  fontFamily: 'var(--font-kollektif)',
                  backgroundImage: 'linear-gradient(transparent 25%, var(--color-pink-light) 25%, var(--color-pink-light) 75%, transparent 75%)',
                  boxDecorationBreak: 'clone',
                  WebkitBoxDecorationBreak: 'clone',
                }}
              >
                Drop your idea below and let’s make something great.
              </span>
            </p>
          </div>
        </div>
      </section>

      <section
        id="programs"
        className="relative py-20 md:py-28 flex flex-col justify-center scroll-mt-6"
        style={{
          minHeight: '105vh',
          backgroundImage:
            "linear-gradient(rgba(44, 35, 31, 0.3), rgba(55, 30, 36, 0.8)), url('/assets/club-info/programs%20background.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      >
        <div className="relative z-10 max-w-6xl mx-auto px-6 md:px-10 lg:px-12 w-full">
          <div>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
              <div className="lg:col-span-5">
                <h2
                  className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold italic mb-4 leading-tight"
                  style={{ fontFamily: 'var(--font-vintage-stylist)', color: 'var(--color-cream)' }}
                >
                  Programs & Services
                </h2>
                <p
                  className="text-base md:text-lg leading-relaxed"
                  style={{ fontFamily: 'var(--font-leiko)', color: 'rgba(234, 225, 203, 0.9)' }}
                >
                  Programs may include the following. All programs are adaptable to meet the specific needs of each partner organization.
                </p>
                <p
                  className="text-base md:text-lg leading-relaxed mt-4 mb-6"
                  style={{ fontFamily: 'var(--font-leiko)', color: 'rgba(234, 225, 203, 0.9)' }}
                >
                  We run new workshops, sessions, and community events throughout the year—see what&apos;s coming up on our events page.
                </p>
                <div className="mt-6">
                  <Link
                    href="/events"
                    className="group inline-flex items-center gap-2 font-semibold text-base md:text-lg transition-all duration-300 relative"
                    style={{
                      color: 'var(--color-cream)',
                      fontFamily: 'var(--font-kollektif)',
                    }}
                  >
                    <span>See new events</span>
                    <svg
                      className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                    <span
                      className="absolute bottom-0 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full"
                      style={{ background: 'var(--color-cream)' }}
                    />
                  </Link>
                </div>
              </div>

              <div className="lg:col-span-7">
                <p
                  className="text-xs md:text-sm uppercase tracking-widest mb-6"
                  style={{ fontFamily: 'var(--font-kollektif)', color: 'rgba(234, 225, 203, 0.85)', letterSpacing: '0.2em' }}
                >
                  Programs may include:
                </p>
                <div className="space-y-0">
                  {[
                    'One-on-one or group technology literacy support',
                    'Social engagement and companionship initiatives',
                    'Educational workshops (digital safety, communication tools)',
                    'Health and Wellness workshops',
                    'Community events and intergenerational activities',
                    'Youth-led active living programs',
                  ].map((item, index) => (
                    <div
                      key={item}
                      className="flex items-start gap-6 py-6"
                      style={{ borderBottom: index === 5 ? 'none' : '1px solid rgba(234, 225, 203, 0.35)' }}
                    >
                      <div
                        className="text-2xl md:text-3xl flex-shrink-0 tabular-nums"
                        style={{ fontFamily: 'var(--font-vintage-stylist)', color: 'var(--color-cream)' }}
                      >
                        {`0${index + 1} /`}
                      </div>
                      <p
                        className="text-base md:text-lg leading-relaxed pt-0.5"
                        style={{ fontFamily: 'var(--font-leiko)', color: 'rgba(234, 225, 203, 0.9)' }}
                      >
                        {item}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonies */}
      <section ref={testimoniesSectionRef} className="pt-16 md:pt-24 pb-16 md:pb-24" style={{ background: 'var(--color-cream)' }}>
        <div className="w-full mx-auto px-6 md:px-10 max-w-6xl">
          <header className={`mb-10 md:mb-12 text-center max-w-2xl mx-auto animate-on-scroll fade-up ${testimoniesInView ? 'visible' : ''}`} style={{ transitionDuration: '0.6s' }}>
            <h2 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold italic tracking-tight" style={{ fontFamily: 'var(--font-kollektif)', color: 'var(--color-brown-dark)' }}>
              Testimonies
            </h2>
            <p className="mt-3 text-base md:text-lg leading-relaxed" style={{ fontFamily: 'var(--font-leiko)', color: 'var(--color-brown-dark)', opacity: 0.88 }}>
              Voices from elders, volunteers, and partners—short reflections on the comfort, connection, and impact of our work, in their own words.
            </p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            <div
              className={`min-h-[200px] md:min-h-[240px] flex flex-col justify-center p-6 md:p-8 text-center rounded-none border-4 md:border-[6px] border-dotted animate-on-scroll fade-up ${testimoniesInView ? 'visible' : ''}`}
              style={{ background: 'var(--color-olive)', borderColor: 'var(--color-cream)', transitionDuration: '0.6s', transitionDelay: '0.25s' }}
            >
              <blockquote className="text-base md:text-lg leading-relaxed mb-3" style={{ fontFamily: 'var(--font-leiko)', color: 'var(--color-cream)' }}>
                &ldquo;The tech support sessions have been a lifesaver. The students are so patient and kind, and I finally feel confident using my tablet.&rdquo;
              </blockquote>
              <p className="text-sm font-medium" style={{ fontFamily: 'var(--font-kollektif)', color: 'var(--color-cream)', opacity: 0.9 }}>
                — Margaret, 72 · Elder
              </p>
            </div>

            <div
              className={`min-h-[200px] md:min-h-[240px] flex flex-col justify-center p-6 md:p-8 text-center rounded-none border-4 md:border-[6px] border-dotted animate-on-scroll fade-up ${testimoniesInView ? 'visible' : ''}`}
              style={{ background: 'var(--color-brown-dark)', borderColor: 'var(--color-cream)', transitionDuration: '0.6s', transitionDelay: '0.4s' }}
            >
              <blockquote className="text-base md:text-lg leading-relaxed mb-3" style={{ fontFamily: 'var(--font-leiko)', color: 'var(--color-cream)' }}>
                &ldquo;Volunteering here has been one of the most rewarding experiences of my university years. The connections I&apos;ve made are genuine and meaningful.&rdquo;
              </blockquote>
              <p className="text-sm font-medium" style={{ fontFamily: 'var(--font-kollektif)', color: 'var(--color-cream)', opacity: 0.9 }}>
                — Sarah · Student Volunteer
              </p>
            </div>

            <div
              className={`min-h-[200px] md:min-h-[240px] flex flex-col justify-center p-6 md:p-8 text-center rounded-none border-4 md:border-[6px] border-dotted animate-on-scroll fade-up ${testimoniesInView ? 'visible' : ''}`}
              style={{ background: 'var(--color-olive)', borderColor: 'var(--color-cream)', transitionDuration: '0.6s', transitionDelay: '0.55s' }}
            >
              <blockquote className="text-base md:text-lg leading-relaxed mb-3" style={{ fontFamily: 'var(--font-leiko)', color: 'var(--color-cream)' }}>
                &ldquo;The workshops and visits have brought so much joy to our residents. Youth 4 Elders has become a highlight of our programming.&rdquo;
              </blockquote>
              <p className="text-sm font-medium" style={{ fontFamily: 'var(--font-kollektif)', color: 'var(--color-cream)', opacity: 0.9 }}>
                — Care home partner
              </p>
            </div>
          </div>
        </div>
      </section>

    </main>
  )
}
