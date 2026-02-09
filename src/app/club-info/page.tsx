'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'

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

  useEffect(() => {
    setIsVisible(true)
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
    }, 300)
  }

  const handleCloseFieldErrors = () => {
    setIsClosingFieldErrors(true)
    setTimeout(() => {
      setFieldErrors({})
      setIsClosingFieldErrors(false)
    }, 300)
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
          className="relative flex flex-col justify-center items-center px-6 md:px-8 py-12"
          style={{
            position: 'sticky', 
            top: 0,
            height: `${HERO_SCROLL_VH}vh`,
            zIndex: 2,          
            background: 'var(--color-cream)', 
          }}
        >
            <div 
            className="w-full max-w-3xl text-center transition-all duration-1000"
              style={{
                opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateY(0)' : 'translateY(12px)',
              transitionDelay: '300ms',
            }}
          >
            <h2
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8"
              style={{ fontFamily: 'var(--font-vintage-stylist)', color: 'var(--color-brown-dark)' }}
            >
              About Us
            </h2>
            <p
              className="text-xl md:text-2xl leading-relaxed mb-14"
              style={{ fontFamily: 'var(--font-leiko)', color: 'var(--color-brown-dark)', opacity: 0.92 }}
            >
              Youth 4 Elders is a student-led organization from the University of Ottawa, dedicated to supporting the senior community through meaningful volunteerism.
            </p>
            <p
              className="text-lg italic text-[var(--color-brown-dark)] opacity-75"
              style={{ fontFamily: 'var(--font-leiko)' }}
            >
              Scroll to find out more
            </p>
            <span className="inline-block animate-bounce text-base mt-2 text-[var(--color-brown-dark)] opacity-70" aria-hidden>↓</span>
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
                    Youth 4 Elders was founded through a shared passion for intergenerational connection and community care, guided by a strong commitment to equity and accessibility.
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
                  style={{ fontFamily: 'var(--font-kollektif)', color: 'var(--color-cream)', letterSpacing: '0.2em' }}
                >
                  Founder goals
                </p>
                <div className="h-[2px] w-20 mt-4" style={{ background: 'rgba(251, 247, 232, 0.6)' }} />
              </div>

              <p
                className="text-lg md:text-xl leading-relaxed w-full pr-0"
                style={{ fontFamily: 'var(--font-leiko)', color: 'var(--color-cream)' }}
              >
                Youth4Elders connects youth and seniors through meaningful support—tech help, education, and one‑on‑one engagement that builds confidence. We also empower youth with collaboration, leadership, and community responsibility.
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

            {founderStoryOpen && (
              <div
                className={`fixed inset-0 z-[999] flex items-center justify-center px-6 py-10 ${
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
                    borderColor: 'rgba(111, 101, 9, 0.35)',
                    boxShadow: '0 24px 60px rgba(15, 31, 20, 0.25)',
                    maxHeight: '80vh',
                    overflowY: 'auto'
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    type="button"
                    className="absolute top-5 right-5 w-10 h-10 rounded-full flex items-center justify-center"
                    style={{
                      background: 'var(--color-olive)',
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
                          <div className="mb-4 flex justify-center">
                          <div className="relative w-44 h-44 md:w-52 md:h-52 lg:w-60 lg:h-60">
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
                            style={{ fontFamily: 'var(--font-leiko)', color: 'var(--color-olive)' }}
                          >
                            {item.sample}
                          </p>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            )}

          </div>
        </section>
      </div>

      {/* Wrapper so Youth 4 Elders bar sticks through General club info + Programs, then scrolls away before Ideas Welcome */}
      <div>
        <div
          style={{
            position: 'sticky',
            top: 0,
            height: 'auto',
            minHeight: 'clamp(36px, 6vh, 48px)',
            background: 'var(--color-olive)',
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
              color: 'var(--color-cream)',
              fontStyle: 'italic',
              fontSize: 'clamp(1rem, 2vw, 1.35rem)',
              lineHeight: 1.02,
              letterSpacing: '0.02em',
            }}
          >
            Youth 4 Elders
          </span>
        </div>

      {/* What we do (left) — Why get involved (right), with light design */}
      <section className="py-20 md:py-28" style={{ background: 'var(--color-cream)' }}>
        <div className="max-w-6xl mx-auto px-6 md:px-10 lg:px-12 space-y-20 md:space-y-24">
          {/* What we do — left */}
          <div
            className="w-full max-w-xl mr-auto ml-0 rounded-xl pl-6 pr-6 py-6 border-l-4"
            style={{
              borderColor: 'var(--color-olive)',
              background: 'linear-gradient(to right, rgba(245, 208, 198, 0.12) 0%, rgba(251, 247, 232, 0.4) 60%, transparent 100%)',
            }}
          >
            <p className="text-xs uppercase tracking-[0.18em] mb-3" style={{ fontFamily: 'var(--font-kollektif)', color: 'var(--color-olive)' }}>
              The club
            </p>
            <h2
              className="text-2xl md:text-3xl font-bold mb-4"
              style={{ fontFamily: 'var(--font-vintage-stylist)', color: 'var(--color-brown-dark)' }}
            >
              What we do
            </h2>
            <div className="h-0.5 w-10 mb-5 rounded-full" style={{ background: 'var(--color-olive)' }} aria-hidden />
            <p
              className="text-base md:text-lg leading-relaxed"
              style={{ fontFamily: 'var(--font-leiko)', color: 'var(--color-brown-dark)', opacity: 0.92 }}
            >
              Youth 4 Elders is a student-based, youth-led organization shaped by the interests and values of its executive team and dedicated to supporting the senior community through meaningful volunteerism. The club delivers a wide range of initiatives, including workshops, events, programs, and fundraisers, all designed to provide direct support to older adults while raising awareness about issues that affect seniors. Equity and accessibility are central pillars that guide the development of all programs and services, ensuring opportunities for connection and support are inclusive and responsive to the diverse needs of older adults.
            </p>
          </div>

          {/* Why get involved — right */}
          <div
            className="w-full max-w-xl ml-auto mr-0 text-right rounded-xl pl-6 pr-6 py-6 border-r-4"
            style={{
              borderColor: 'var(--color-olive)',
              background: 'linear-gradient(to left, rgba(111, 101, 9, 0.08) 0%, rgba(251, 247, 232, 0.35) 60%, transparent 100%)',
            }}
          >
            <p className="text-xs uppercase tracking-[0.18em] mb-3" style={{ fontFamily: 'var(--font-kollektif)', color: 'var(--color-olive)' }}>
              Join us
            </p>
            <h2
              className="text-2xl md:text-3xl font-bold mb-4"
              style={{ fontFamily: 'var(--font-vintage-stylist)', color: 'var(--color-brown-dark)' }}
            >
              Why get involved
            </h2>
            <div className="h-0.5 w-10 ml-auto mr-0 mb-5 rounded-full" style={{ background: 'var(--color-olive)' }} aria-hidden />
            <p
              className="text-base md:text-lg leading-relaxed mb-6"
              style={{ fontFamily: 'var(--font-leiko)', color: 'var(--color-brown-dark)', opacity: 0.92 }}
            >
              Through involvement with Youth 4 Elders, members gain valuable transferable skills such as communication, leadership, collaboration, empathy, and compassion, while also earning volunteer hours, reference letters, and opportunities to build lasting professional relationships.
            </p>
            <Link
              href="/join-us"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-medium text-sm border-2 transition-all duration-300"
              style={{
                fontFamily: 'var(--font-kollektif)',
                background: 'var(--color-olive)',
                color: 'var(--color-cream)',
                borderColor: 'var(--color-olive)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'var(--color-olive-light)'
                e.currentTarget.style.color = 'var(--color-olive)'
                e.currentTarget.style.borderColor = 'var(--color-olive)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'var(--color-olive)'
                e.currentTarget.style.color = 'var(--color-cream)'
                e.currentTarget.style.borderColor = 'var(--color-olive)'
              }}
            >
              Get involved
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Programs we offer — cream, pill tags + note */}
      <section
        id="programs"
        className="py-20 md:py-28"
        style={{ background: 'var(--color-cream)' }}
      >
        <div className="max-w-4xl mx-auto px-6 md:px-10">
          <h2
            className="text-2xl md:text-3xl font-bold text-center mb-3"
            style={{ fontFamily: 'var(--font-vintage-stylist)', color: 'var(--color-brown-dark)' }}
          >
            Programs we offer
          </h2>
          <p className="text-center text-base mb-10" style={{ fontFamily: 'var(--font-leiko)', color: 'var(--color-brown-dark)', opacity: 0.9 }}>
            Programs may include:
          </p>
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {[
              'Technology literacy support (one-on-one or group)',
              'Social engagement & companionship',
              'Educational workshops (digital safety, communication tools)',
              'Health and wellness workshops',
              'Community events & intergenerational activities',
              'Youth-led active living programs',
            ].map((label) => (
              <span
                key={label}
                className="px-4 py-2 rounded-full text-sm"
                style={{ fontFamily: 'var(--font-leiko)', color: 'var(--color-brown-dark)', background: 'rgba(111, 101, 9, 0.12)', border: '1px solid rgba(111, 101, 9, 0.3)' }}
              >
                {label}
                    </span>
                  ))}
                </div>
          <p className="text-center text-sm md:text-base max-w-xl mx-auto" style={{ fontFamily: 'var(--font-leiko)', color: 'var(--color-brown-dark)', opacity: 0.88 }}>
            Programs are adaptable to meet the specific needs of each partner organization.
                </p>
              </div>
      </section>

        </div>

      {/* Ideas Welcome — on merlot (bar scrolls away before this) */}
      <section id="ideas" className="py-12 md:py-16 pb-16 md:pb-36 scroll-mt-6" style={{ background: 'var(--color-brown-dark)' }}>
        <div className="w-full mx-auto px-6 lg:px-20 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            {/* Left — Ideas welcome text on merlot (no white box) */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div 
                  className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ background: 'rgba(251, 247, 232, 0.2)' }}
                >
                  <svg className="w-5 h-5" style={{ color: 'var(--color-cream)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h3 
                  className="text-2xl md:text-3xl font-bold"
                  style={{ fontFamily: 'var(--font-vintage-stylist)', color: 'var(--color-cream)' }}
                >
                  Ideas Welcome
                </h3>
              </div>
              <p 
                className="text-base md:text-lg leading-relaxed"
                style={{ fontFamily: 'var(--font-leiko)', color: 'rgba(251, 247, 232, 0.92)' }}
              >
                We&apos;re always looking to expand our services and seminars. Have an idea for a workshop, topic, or activity that would benefit our community? We&apos;d love to hear from you. Your suggestions help us grow and serve better.
              </p>
            </div>

            {/* Right — Form in one cream card */}
                <div 
              className="rounded-2xl p-6 md:p-8"
                  style={{
                background: 'var(--color-cream)',
                boxShadow: '0 16px 40px rgba(0, 0, 0, 0.2)',
              }}
            >
            <div style={{ position: 'relative', minHeight: '280px' }}>
              {/* Success Message */}
              {ideaSubmitSuccess && (
                <div
                  className="flex flex-col items-center justify-center min-h-[280px] animate-fadeInUp"
                  style={{ animation: 'fadeInUp 0.6s ease-out forwards' }}
                >
                  <p
                    className="text-2xl md:text-3xl font-semibold text-center"
                style={{ 
                  fontFamily: 'var(--font-leiko)', 
                      color: 'var(--color-brown-dark)',
                    }}
                  >
                    Thank you! Your idea has been sent successfully.
                  </p>
                </div>
              )}

              {/* Error Message Popup */}
              {(ideaSubmitError || isClosingError) && !ideaSubmitSuccess && (
                <div 
                  className="absolute inset-0 flex items-center justify-center z-50"
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    pointerEvents: 'none',
                    animation: isClosingError ? 'fadeOut 0.3s ease-in forwards' : 'fadeIn 0.3s ease-out forwards',
                  }}
                >
                  <div 
                    className="p-4 rounded-lg shadow-lg"
                    style={{ 
                      background: 'var(--color-brown-dark)', 
                      border: '2px solid var(--color-brown-dark)',
                      maxWidth: '400px',
                      width: '90%',
                      pointerEvents: 'auto',
                      animation: isClosingError ? 'fadeOutScale 0.3s ease-in forwards' : 'fadeInScale 0.3s ease-out forwards',
                }}
              >
                    <div className="flex items-start justify-between gap-3">
                      <p className="text-sm flex-1" style={{ fontFamily: 'var(--font-leiko)', color: 'var(--color-cream)' }}>
                        {ideaSubmitError}
                      </p>
                      <button
                        onClick={handleCloseError}
                        className="flex-shrink-0 text-lg leading-none hover:opacity-100 transition-opacity"
                        style={{ color: 'var(--color-cream)', opacity: 0.7 }}
                        aria-label="Close error message"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Form - Hide when success is shown */}
              {!ideaSubmitSuccess && (
                <form onSubmit={handleIdeaSubmit} className="space-y-3 relative" noValidate>
                <div>
                  <input
                    type="text"
                    name="name"
                    value={ideaFormData.name}
                    onChange={handleIdeaInputChange}
                    placeholder="Your name"
                    className="w-full px-4 py-2.5 rounded-lg focus:outline-none placeholder:opacity-70"
                    style={{
                      background: 'rgba(234, 212, 196, 0.3)',
                      border: 'none',
                      color: 'var(--color-brown-dark)',
                      fontFamily: 'var(--font-kollektif)',
                    }}
                  />
                </div>
                <div>
                  <input
                    type="email"
                    name="email"
                    value={ideaFormData.email}
                    onChange={handleIdeaInputChange}
                    placeholder="Your email"
                    className="w-full px-4 py-2.5 rounded-lg focus:outline-none placeholder:opacity-70"
                    style={{
                      background: 'rgba(234, 212, 196, 0.3)',
                      border: 'none',
                      color: 'var(--color-brown-dark)',
                      fontFamily: 'var(--font-kollektif)',
                    }}
                  />
                </div>
                <div>
                  <textarea
                    name="message"
                    value={ideaFormData.message}
                    onChange={handleIdeaInputChange}
                    placeholder="Share your idea..."
                    rows={4}
                    className="w-full px-4 py-2.5 rounded-lg focus:outline-none resize-none placeholder:opacity-70"
                    style={{
                      background: 'rgba(234, 212, 196, 0.3)',
                      border: 'none',
                      color: 'var(--color-brown-dark)',
                      fontFamily: 'var(--font-kollektif)',
                    }}
                  />
                </div>
                
                {/* Field Errors Popup */}
                {((fieldErrors.name || fieldErrors.email || fieldErrors.message) || isClosingFieldErrors) && (
                  <div 
                    className="absolute inset-0 flex items-center justify-center z-50"
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      pointerEvents: 'none',
                      animation: isClosingFieldErrors ? 'fadeOut 0.3s ease-in forwards' : 'fadeIn 0.3s ease-out forwards',
                    }}
                  >
                    <div 
                      className="p-4 rounded-lg shadow-lg"
                      style={{ 
                        background: 'var(--color-brown-dark)', 
                        border: '2px solid var(--color-brown-dark)',
                        maxWidth: '400px',
                        width: '90%',
                        pointerEvents: 'auto',
                        animation: isClosingFieldErrors ? 'fadeOutScale 0.3s ease-in forwards' : 'fadeInScale 0.3s ease-out forwards',
                      }}
                    >
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <p className="text-sm font-semibold" style={{ fontFamily: 'var(--font-leiko)', color: 'var(--color-cream)' }}>
                          Please fill in all fields:
                        </p>
                        <button
                          onClick={handleCloseFieldErrors}
                          className="flex-shrink-0 text-lg leading-none hover:opacity-100 transition-opacity"
                          style={{ color: 'var(--color-cream)', opacity: 0.7 }}
                          aria-label="Close error message"
                        >
                          ×
                        </button>
                      </div>
                      <ul className="space-y-1">
                        {fieldErrors.name && (
                          <li className="text-xs" style={{ fontFamily: 'var(--font-kollektif)', color: 'var(--color-cream)' }}>
                            • {fieldErrors.name}
                          </li>
                        )}
                        {fieldErrors.email && (
                          <li className="text-xs" style={{ fontFamily: 'var(--font-kollektif)', color: 'var(--color-cream)' }}>
                            • {fieldErrors.email}
                          </li>
                        )}
                        {fieldErrors.message && (
                          <li className="text-xs" style={{ fontFamily: 'var(--font-kollektif)', color: 'var(--color-cream)' }}>
                            • {fieldErrors.message}
                          </li>
                        )}
                      </ul>
                    </div>
                  </div>
                )}
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={isSubmittingIdea}
                    className="px-6 py-2 rounded-full font-semibold text-sm transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{
                      background: 'var(--color-pink-medium)',
                      color: 'var(--color-cream)',
                      fontFamily: 'var(--font-kollektif)',
                      border: '2px solid transparent',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)'
                    }}
                  >
                    {isSubmittingIdea ? 'Sending...' : 'Send Idea'}
                  </button>
                </div>
              </form>
              )}
            </div>
            </div>
          </div>
        </div>
      </section>

      <section
        className="relative py-20 md:py-28"
        style={{
          minHeight: '105vh',
          backgroundImage:
            "linear-gradient(rgba(91, 59, 30, 0.72), rgba(91, 59, 30, 0.72)), url('/assets/sip.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      >
        <div className="relative z-10 max-w-6xl mx-auto px-6 md:px-10 lg:px-12">
          <div className="sticky top-[85%]" style={{ transform: 'translateY(30%)' }}>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
              <div className="lg:col-span-5">
              <p
                className="text-xs md:text-sm uppercase tracking-widest mb-4"
                style={{ fontFamily: 'var(--font-kollektif)', color: 'rgba(234, 225, 203, 0.85)', letterSpacing: '0.2em' }}
              >
                Why join
              </p>
              <h2
                className="text-4xl md:text-5xl lg:text-6xl font-bold italic mb-4"
                style={{ fontFamily: 'var(--font-vintage-stylist)', color: 'var(--color-cream)' }}
              >
                Meet your community.
              </h2>
              <p
                className="text-base md:text-lg leading-relaxed"
                style={{ fontFamily: 'var(--font-leiko)', color: 'rgba(234, 225, 203, 0.9)' }}
              >
                Connect with seniors, grow as a leader, and make a lasting impact in our Ottawa community.
              </p>
              <div className="mt-6">
                <Link
                  href="/join-us"
                  className="inline-flex items-center gap-2 rounded-full px-6 py-2.5 text-sm md:text-base font-semibold transition-all duration-300"
                  style={{
                    background: 'var(--color-cream)',
                    color: 'var(--color-brown-dark)',
                    fontFamily: 'var(--font-kollektif)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)'
                  }}
                >
                  Get involved
                  <span aria-hidden>→</span>
                </Link>
              </div>
              </div>

              <div className="lg:col-span-7">
              <p
                className="text-xs md:text-sm uppercase tracking-widest mb-6"
                style={{ fontFamily: 'var(--font-kollektif)', color: 'rgba(234, 225, 203, 0.85)', letterSpacing: '0.2em' }}
              >
                What to expect
              </p>
              <div className="space-y-6">
                {[
                  'Join a welcoming, low-pressure session.',
                  'Build real friendships through weekly connection.',
                  'Gain leadership experience by helping facilitate.',
                  'Grow with a supportive, purpose-driven community.'
                ].map((item, index) => (
                  <div key={item} className="flex items-start gap-6 pb-6" style={{ borderBottom: index === 3 ? 'none' : '1px solid rgba(234, 225, 203, 0.35)' }}>
                    <div
                      className="text-2xl md:text-3xl"
                      style={{ fontFamily: 'var(--font-vintage-stylist)', color: 'var(--color-cream)' }}
                    >
                      {`0${index + 1} /`}
                    </div>
                    <p
                      className="text-base md:text-lg leading-relaxed"
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

      <section className="pt-20 md:pt-28 pb-32 md:pb-40" style={{ background: 'var(--color-cream)' }}>
        <div className="max-w-5xl mx-auto px-6 md:px-10 lg:px-12">
          <div className="text-center">
            <p 
              className="text-xs md:text-sm uppercase tracking-widest mb-4"
              style={{ 
                fontFamily: 'var(--font-kollektif)', 
                color: 'var(--color-brown-dark)',
                letterSpacing: '0.2em',
              }}
            >
              Voices from our community
            </p>
            <h2 
              className="text-3xl md:text-4xl lg:text-5xl font-bold italic mb-4"
              style={{ fontFamily: 'var(--font-vintage-stylist)', color: 'var(--color-brown-dark)' }}
            >
              Testimonies
            </h2>
            <p
              className="text-base md:text-lg leading-relaxed mb-10 mx-auto"
              style={{ fontFamily: 'var(--font-leiko)', color: 'var(--color-brown-dark)', opacity: 0.85, maxWidth: '720px' }}
            >
              Short reflections from elders and volunteers—capturing the comfort, patience, and connection that define our sessions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            <div
              className="rounded-2xl p-6 md:p-7 border"
              style={{ background: 'rgba(234, 212, 196, 0.35)', borderColor: 'rgba(175, 121, 120, 0.25)' }}
            >
              <p className="text-xs uppercase tracking-widest mb-3" style={{ fontFamily: 'var(--font-kollektif)', color: 'var(--color-brown-medium)' }}>
                Elder
              </p>
              <blockquote
                className="text-lg md:text-xl leading-relaxed italic mb-4"
                style={{ fontFamily: 'var(--font-leiko)', color: 'var(--color-brown-dark)' }}
              >
                &ldquo;The tech support sessions have been a lifesaver. The students are so patient and kind, and I finally feel confident using my tablet.&rdquo;
              </blockquote>
              <p className="text-sm font-semibold" style={{ fontFamily: 'var(--font-kollektif)', color: 'var(--color-brown-medium)' }}>
                — Margaret, 72
              </p>
            </div>

            <div
              className="rounded-2xl p-6 md:p-7 border"
              style={{ background: 'rgba(234, 212, 196, 0.35)', borderColor: 'rgba(175, 121, 120, 0.25)' }}
            >
              <p className="text-xs uppercase tracking-widest mb-3" style={{ fontFamily: 'var(--font-kollektif)', color: 'var(--color-brown-medium)' }}>
                Volunteer
              </p>
              <blockquote
                className="text-lg md:text-xl leading-relaxed italic mb-4"
                style={{ fontFamily: 'var(--font-leiko)', color: 'var(--color-brown-dark)' }}
              >
                &ldquo;Volunteering here has been one of the most rewarding experiences of my university years. The connections I&apos;ve made are genuine and meaningful.&rdquo;
              </blockquote>
              <p className="text-sm font-semibold" style={{ fontFamily: 'var(--font-kollektif)', color: 'var(--color-brown-medium)' }}>
                — Sarah, Student Volunteer
              </p>
            </div>
          </div>
        </div>
      </section>

    </main>
  )
}
