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

  useEffect(() => {
    setIsVisible(true)
  }, [])

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
  const SECOND_SECTION_SCROLL_VH = 230
  const SECOND_SECTION_OFFSET = 60
  const SCROLL_WRAPPER_HEIGHT_VH = HERO_SCROLL_VH + SECOND_SECTION_OFFSET + SECOND_SECTION_SCROLL_VH

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
          className="relative"
          style={{
            position: 'sticky', 
            top: 0,
            height: `${HERO_SCROLL_VH}vh`,
            zIndex: 2,          
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            alignItems: 'center',
            boxSizing: 'border-box',
            paddingTop: 'clamp(10px, 1vh, 20px)',
            paddingBottom: 'clamp(20px, 2vh, 40px)',
            background: 'var(--color-cream)', 
          }}
        >
          <div className="max-w-screen-2xl mx-auto px-6 md:px-10 w-full h-full flex flex-col justify-start items-center" style={{ paddingTop: 'clamp(30px, 4vh, 60px)' }}>
            {/* Image in the middle */}
            <div 
              className="relative w-full max-w-3xl mb-4 md:mb-6 transition-all duration-1000"
              style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0)' : 'translateY(-30px)',
                transitionDelay: '200ms'
              }}
            >
              <div 
                className="relative w-full h-[40vh] sm:h-[45vh] md:h-[48vh] lg:h-[52vh] rounded-3xl overflow-hidden border"
                style={{
                  boxShadow: '0 10px 28px rgba(73, 47, 30, 0.16)',
                  borderColor: 'rgba(91, 59, 30, 0.18)',
                }}
              >
                  <Image
                  src="/assets/club-info/signing.jpg"
                  alt="Members signing up at a Youth 4 Elders event"
                    fill
                    priority
                  sizes="(max-width: 768px) 100vw, 80vw"
                  style={{ objectFit: 'cover', objectPosition: 'center 30%' }}
                />
                <div
                  aria-hidden
                  className="absolute inset-0"
                  style={{
                    background:
                      'linear-gradient(to top, rgba(91, 59, 30, 0.30) 0%, rgba(91, 59, 30, 0.0) 60%)',
                  }}
                />
                <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between gap-4">
                  <div>
                    <p
                      className="text-xs uppercase tracking-widest"
                      style={{
                        fontFamily: 'var(--font-kollektif)',
                        color: 'rgba(234, 225, 203, 0.92)',
                        letterSpacing: '0.2em',
                      }}
                    >
                      Club life
                    </p>
                    <p
                      className="text-lg md:text-xl leading-tight"
                      style={{ fontFamily: 'var(--font-vintage-stylist)', color: 'rgba(234, 225, 203, 0.98)' }}
                    >
                      Real people, real connection.
                    </p>
                  </div>
                  </div>
                </div>
              </div>

            {/* Text at the bottom */}
            <div 
              className="relative w-full text-center transition-all duration-1000"
              style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
                transitionDelay: '400ms',
                marginTop: 'clamp(20px, 4vh, 60px)',
                paddingLeft: 'clamp(20px, 4vw, 60px)',
                paddingRight: 'clamp(20px, 4vw, 60px)'
              }}
            >
              <blockquote
                className="text-2xl md:text-3xl lg:text-4xl leading-[1.05] mb-3 md:mb-4"
                style={{ fontFamily: 'var(--font-vintage-stylist)', color: 'var(--color-brown-dark)' }}
              >
                <span style={{ opacity: 0.9 }}>&ldquo;</span>
                <span className="font-bold italic">
                  We&apos;re not just a club , we&apos;re your community partners.
                </span>
                <span style={{ opacity: 0.9 }}>&rdquo;</span>
              </blockquote>
                
              <div className="w-20 h-[2px] mx-auto my-6 md:my-8" style={{ background: 'rgba(91, 59, 30, 0.25)' }} />

              <p 
                className="text-lg md:text-xl lg:text-2xl leading-relaxed text-center"
                style={{ fontFamily: 'var(--font-leiko)', color: 'var(--color-brown-dark)', opacity: 0.92, whiteSpace: 'nowrap', textAlign: 'center', width: '100%' }}
              >
                We bring youth and elders together through welcoming programs that make connection feel easy and meaningful.
                  </p>

                  <p 
                className="mt-3 md:mt-4 text-base md:text-lg leading-relaxed italic text-center"
                style={{ fontFamily: 'var(--font-leiko)', color: 'var(--color-brown-dark)', opacity: 0.82, fontStyle: 'italic' }}
              >
                A student-led club focused on connection,<br />community, and care.
                  </p>
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
            background: 'var(--color-pink-light)',
            zIndex: 3,
            pointerEvents: 'auto',
            overflow: 'visible',
          }}
        >
          <div className="max-w-6xl mx-auto px-6 md:px-10 lg:px-12 relative" style={{ overflow: 'visible' }}>
            <div className="mb-12 md:mb-16 pt-20 md:pt-32">
              <p 
                className="text-sm md:text-base uppercase tracking-widest mb-3"
                style={{ 
                  fontFamily: 'var(--font-kollektif)', 
                  color: 'var(--color-brown-dark)',
                  letterSpacing: '0.2em',
                }}
              >
                <span style={{ color: 'var(--color-brown-dark)' }}>Our story</span>
              </p>
              <h2 
                className="text-4xl md:text-5xl lg:text-6xl font-bold italic"
                style={{ fontFamily: 'var(--font-vintage-stylist)', color: 'var(--color-brown-dark)' }}
              >
                Founders
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
              {/* Text - Now on the left */}
              <div className="pt-2 md:pt-4 order-2 lg:order-1">
                  <blockquote 
                  className="text-lg md:text-xl leading-relaxed italic mb-16 md:mb-18"
                  style={{ fontFamily: 'var(--font-leiko)', color: 'var(--color-brown-dark)', opacity: 0.92, fontStyle: 'italic', borderLeft: '3px solid var(--color-pink-medium)', paddingLeft: '20px' }}
                  >
                  <p className="mb-4">
                    &ldquo;Youth 4 Elders started when we noticed the same thing everywhere: youth wanted ways to give back, and elders wanted connection that felt warm,
                    consistent, and genuinely two-way. We saw how much stronger a community becomes when people of different generations spend time together in ways that
                    feel respectful, relaxed, and real.
                  </p>

                  <p>
                    We began with small meet-ups and simple activities, listening closely to what made people feel at ease. Over time, we shaped a repeatable format that
                    centers care and conversation, so volunteers can lead confidently and every visit feels comfortable, familiar, and welcoming. That steady rhythm lets
                    relationships grow naturally, and it keeps the experience meaningful for everyone involved.&rdquo;
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
                    background: 'rgba(73, 47, 30, 1)', // Dark brown full opacity
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
                    background: 'rgba(91, 59, 30, 1)', // Different shade of dark brown full opacity
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

            <div className="mt-16 md:mt-20 pt-6">
              <div className="flex flex-col gap-3 mb-12">
                <p
                  className="text-sm md:text-base uppercase tracking-widest"
                  style={{ fontFamily: 'var(--font-kollektif)', color: 'var(--color-brown-dark)', letterSpacing: '0.2em' }}
                >
                  Founder goals
                </p>
                <div className="h-[2px] w-20 mt-4" style={{ background: 'rgba(175, 121, 120, 0.45)' }} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16">
                <div className="pr-0 md:pr-10 md:border-r" style={{ borderColor: 'rgba(175, 121, 120, 0.25)' }}>
                  <h3 className="text-4xl md:text-5xl font-semibold mb-6" style={{ fontFamily: 'var(--font-vintage-stylist)', color: 'var(--color-brown-dark)' }}>
                    Julia
                  </h3>
                  <p className="text-lg md:text-xl leading-relaxed mb-5" style={{ fontFamily: 'var(--font-leiko)', color: 'var(--color-brown-dark)' }}>
                    <span style={{ fontWeight: 700 }}>Design welcoming activities.</span> Creative connection that feels calm, friendly, and easy to join.
                  </p>
                  <p className="text-lg md:text-xl leading-relaxed" style={{ fontFamily: 'var(--font-leiko)', color: 'var(--color-brown-dark)' }}>
                    <span style={{ fontWeight: 700 }}>Support volunteers and share impact.</span> Prepare students with care and highlight the relationships we build.
                  </p>
                </div>

                <div className="pl-0 md:pl-10">
                  <h3 className="text-4xl md:text-5xl font-semibold mb-6" style={{ fontFamily: 'var(--font-vintage-stylist)', color: 'var(--color-brown-dark)' }}>
                    Peter
                  </h3>
                  <p className="text-lg md:text-xl leading-relaxed mb-5" style={{ fontFamily: 'var(--font-leiko)', color: 'var(--color-brown-dark)' }}>
                    <span style={{ fontWeight: 700 }}>Build partnerships and outreach.</span> Connect with community spaces and campus partners.
                  </p>
                  <p className="text-lg md:text-xl leading-relaxed" style={{ fontFamily: 'var(--font-leiko)', color: 'var(--color-brown-dark)' }}>
                    <span style={{ fontWeight: 700 }}>Strengthen structure and sustainability.</span> Keep sessions organized and grow the program responsibly.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </section>
      </div>

      {/* Programs & Services Section */}
      <section className="py-16 md:py-24" style={{ background: 'var(--color-cream)' }}>
        <div className="max-w-6xl mx-auto px-6 md:px-10 lg:px-12">
          <div className="mb-12 md:mb-16 text-center">
            <p 
              className="text-sm md:text-base uppercase tracking-widest mb-3"
              style={{ 
                fontFamily: 'var(--font-kollektif)', 
                color: 'var(--color-brown-dark)',
                letterSpacing: '0.2em',
              }}
            >
              Programs & Services
            </p>
            <h2 
              className="text-4xl md:text-5xl lg:text-6xl font-bold italic"
              style={{ fontFamily: 'var(--font-vintage-stylist)', color: 'var(--color-brown-dark)' }}
            >
              Programs & Services we offer
            </h2>
          </div>

          <div className="rounded-2xl border overflow-hidden" style={{ borderColor: 'rgba(175, 121, 120, 0.25)', background: 'rgba(234, 212, 196, 0.18)' }}>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 p-6 md:p-8">
              <div className="md:col-span-7">
                <p className="text-xs uppercase tracking-widest mb-2" style={{ fontFamily: 'var(--font-kollektif)', color: 'var(--color-brown-medium)' }}>
                  Ongoing
                </p>
                <h3 className="text-2xl md:text-3xl font-bold mb-2" style={{ fontFamily: 'var(--font-vintage-stylist)', color: 'var(--color-brown-dark)' }}>
                  Regular Weekly Sessions
                </h3>
                <p className="text-base md:text-lg leading-relaxed" style={{ fontFamily: 'var(--font-leiko)', color: 'var(--color-brown-dark)', opacity: 0.92 }}>
                  Consistent meet-ups every week for conversation, activities, and connection. Same time, same place—so you always know where to find us.
                </p>
              </div>
              <div className="md:col-span-5">
                <div className="flex flex-wrap gap-2">
                  {['Tech help drop-ins', 'Social coffee hours', 'Activity workshops'].map((item) => (
                    <span key={item} className="px-3 py-1 rounded-full text-xs" style={{ fontFamily: 'var(--font-kollektif)', color: 'var(--color-brown-dark)', background: 'var(--color-cream)' }}>
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="border-t" style={{ borderColor: 'rgba(175, 121, 120, 0.25)' }} />

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 p-6 md:p-8" style={{ background: 'rgba(234, 212, 196, 0.3)' }}>
              <div className="md:col-span-7">
                <p className="text-xs uppercase tracking-widest mb-2" style={{ fontFamily: 'var(--font-kollektif)', color: 'var(--color-brown-medium)' }}>
                  Seasonal
                </p>
                <h3 className="text-2xl md:text-3xl font-bold mb-2" style={{ fontFamily: 'var(--font-vintage-stylist)', color: 'var(--color-brown-dark)' }}>
                  Special Events & Programs
                </h3>
                <p className="text-base md:text-lg leading-relaxed" style={{ fontFamily: 'var(--font-leiko)', color: 'var(--color-brown-dark)', opacity: 0.92 }}>
                  Monthly and seasonal events that bring the community together for celebration, learning, and shared experiences.
                </p>
              </div>
              <div className="md:col-span-5">
                <div className="flex flex-wrap gap-2">
                  {['Holiday celebrations', 'Educational seminars', 'Community outings'].map((item) => (
                    <span key={item} className="px-3 py-1 rounded-full text-xs" style={{ fontFamily: 'var(--font-kollektif)', color: 'var(--color-brown-dark)', background: 'var(--color-cream)' }}>
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="border-t" style={{ borderColor: 'rgba(175, 121, 120, 0.25)' }} />

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 p-6 md:p-8">
              <div className="md:col-span-7">
                <p className="text-xs uppercase tracking-widest mb-2" style={{ fontFamily: 'var(--font-kollektif)', color: 'var(--color-brown-medium)' }}>
                  Community
                </p>
                <h3 className="text-2xl md:text-3xl font-bold mb-2" style={{ fontFamily: 'var(--font-vintage-stylist)', color: 'var(--color-brown-dark)' }}>
                  Partnership Programs
                </h3>
                <p className="text-base md:text-lg leading-relaxed" style={{ fontFamily: 'var(--font-leiko)', color: 'var(--color-brown-dark)', opacity: 0.92 }}>
                  Collaborating with schools, senior centers, and community organizations to create meaningful intergenerational experiences.
                </p>
              </div>
              <div className="md:col-span-5">
                <div className="flex flex-wrap gap-2">
                  {['School partnerships', 'Senior center visits', 'Community collaborations'].map((item) => (
                    <span key={item} className="px-3 py-1 rounded-full text-xs" style={{ fontFamily: 'var(--font-kollektif)', color: 'var(--color-brown-dark)', background: 'var(--color-cream)' }}>
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="border-t" style={{ borderColor: 'rgba(175, 121, 120, 0.25)' }} />

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 p-6 md:p-8" style={{ background: 'rgba(234, 212, 196, 0.3)' }}>
              <div className="md:col-span-7">
                <p className="text-xs uppercase tracking-widest mb-2" style={{ fontFamily: 'var(--font-kollektif)', color: 'var(--color-brown-medium)' }}>
                  Training
                </p>
                <h3 className="text-2xl md:text-3xl font-bold mb-2" style={{ fontFamily: 'var(--font-vintage-stylist)', color: 'var(--color-brown-dark)' }}>
                  Volunteer Training
                </h3>
                <p className="text-base md:text-lg leading-relaxed" style={{ fontFamily: 'var(--font-leiko)', color: 'var(--color-brown-dark)', opacity: 0.92 }}>
                  Comprehensive training for student volunteers to ensure they&apos;re prepared, confident, and ready to make a positive impact.
                </p>
              </div>
              <div className="md:col-span-5">
                <div className="flex flex-wrap gap-2">
                  {['Orientation sessions', 'Skill-building workshops'].map((item) => (
                    <span key={item} className="px-3 py-1 rounded-full text-xs" style={{ fontFamily: 'var(--font-kollektif)', color: 'var(--color-brown-dark)', background: 'var(--color-cream)' }}>
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Services Message Box */}
      <section className="py-12 md:py-16 pb-16 md:pb-36" style={{ background: 'var(--color-cream)' }}>
        <div className="w-full mx-auto px-6 lg:px-20">
          <div
            className="rounded-3xl border-2 p-6 md:p-10"
            style={{
              background: 'var(--color-pink-light)',
              borderColor: 'var(--color-pink-dark)',
              boxShadow: '0 12px 30px rgba(64, 83, 44, 0.12)'
            }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-20 items-center">
            {/* Left Side - Heading and Paragraph */}
            <div 
              className="rounded-2xl border-2 p-6 md:p-8"
              style={{ 
                background: 'var(--color-pink-medium)',
                borderColor: 'var(--color-pink-dark)',
                borderStyle: 'dashed',
                boxShadow: '0 10px 30px rgba(64, 83, 44, 0.15)'
              }}
            >
              <div className="flex items-start gap-3 mb-4">
                <div 
                  className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ background: 'rgba(234, 212, 196, 0.2)' }}
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
                style={{ fontFamily: 'var(--font-leiko)', color: 'var(--color-cream)', opacity: 0.95 }}
              >
                We&apos;re always looking to expand our services and seminars. Have an idea for a workshop, topic, or activity that would benefit our community? We&apos;d love to hear from you. Your suggestions help us grow and serve better.
              </p>
            </div>

            {/* Right Side - Form */}
            <div style={{ paddingTop: 'clamp(64px, 8vh, 88px)', position: 'relative', minHeight: '350px' }}>
              {/* Success Message */}
              {ideaSubmitSuccess && (
                <div 
                  className="flex flex-col items-center justify-center min-h-[350px] animate-fadeInUp"
                  style={{
                    animation: 'fadeInUp 0.6s ease-out forwards',
                  }}
                >
                  <p 
                    className="text-3xl md:text-4xl lg:text-5xl font-semibold" 
                style={{ 
                  fontFamily: 'var(--font-leiko)', 
                      color: 'var(--color-cream)',
                      textAlign: 'center',
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
