'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'

const EVENTS_LINK_TEXT = 'View the events and programs we offer here'
const CLUB_INFO_LINK_PLACEHOLDER = '__CLUB_INFO_LINK__'
const EVENTS_LINK_PLACEHOLDER = '__EVENTS_LINK__'

function isValidEmail(value: string) {
  const email = value.trim()
  if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) return false
  if (email.includes('..')) return false
  const [local, domain] = email.split('@')
  if (!local || !domain) return false
  if (local.startsWith('.') || local.endsWith('.')) return false
  if (domain.startsWith('-') || domain.endsWith('-') || domain.startsWith('.') || domain.endsWith('.')) return false
  return true
}

function isValidPhone(value: string) {
  return /^\d+$/.test(value.trim())
}

export default function Contact() {
  const [openFAQs, setOpenFAQs] = useState<number[]>([])
  const [faqInView, setFaqInView] = useState(false)
  const [faqScrollY, setFaqScrollY] = useState(0)
  const faqSectionRef = useRef<HTMLElement>(null)
  const rafRef = useRef<number | null>(null)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    company: '',
    service: '',
    email: '',
    phone: '',
    projectDescription: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [submitError, setSubmitError] = useState(false)
  const [submitErrorMessage, setSubmitErrorMessage] = useState('')
  const [fieldErrors, setFieldErrors] = useState<{ name?: string; email?: string; phone?: string; message?: string }>({})
  const [serviceDropdownOpen, setServiceDropdownOpen] = useState(false)
  const serviceDropdownRef = useRef<HTMLDivElement>(null)
  const contactFormSectionRef = useRef<HTMLElement>(null)
  const [contactTitleVisible, setContactTitleVisible] = useState(false)
  const [contactCaptionVisible, setContactCaptionVisible] = useState(false)
  const [contactFormVisible, setContactFormVisible] = useState(false)
  const [socialsInView, setSocialsInView] = useState(false)
  const socialsRef = useRef<HTMLDivElement>(null)

  const serviceOptions = [
    { value: '', label: 'Select...' },
    { value: 'volunteer', label: 'Volunteering' },
    { value: 'partnership', label: 'Partnership' },
    { value: 'events', label: 'Events & programs' },
    { value: 'membership', label: 'Membership' },
    { value: 'donations', label: 'Donations & support' },
    { value: 'media', label: 'Media & press' },
    { value: 'collaboration', label: 'Collaboration & projects' },
    { value: 'general', label: 'General inquiry' },
    { value: 'other', label: 'Other' }
  ]

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (serviceDropdownRef.current && !serviceDropdownRef.current.contains(e.target as Node)) {
        setServiceDropdownOpen(false)
      }
    }
    if (serviceDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [serviceDropdownOpen])

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 1023px)')
    const apply = () => {
      if (mq.matches) {
        document.documentElement.style.overflowX = 'clip'
        document.body.style.overflowX = 'clip'
      } else {
        document.documentElement.style.overflowX = ''
        document.body.style.overflowX = ''
      }
    }
    apply()
    mq.addEventListener('change', apply)
    return () => {
      mq.removeEventListener('change', apply)
      document.documentElement.style.overflowX = ''
      document.body.style.overflowX = ''
    }
  }, [])

  useEffect(() => {
    const t1 = setTimeout(() => setContactTitleVisible(true), 100)
    const t2 = setTimeout(() => setContactCaptionVisible(true), 2500)
    const t3 = setTimeout(() => setContactFormVisible(true), 2700)
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
    }
  }, [])

  useEffect(() => {
    const el = socialsRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setSocialsInView(true)
      },
      { threshold: 0.15, rootMargin: '0px 0px -30px 0px' }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (submitSuccess || submitError) {
      const startScroll = () => {
        if (typeof window === 'undefined') return
        const targetY = 0
        const startY = window.scrollY
        const distance = targetY - startY
        const duration = 600
        const startTime = performance.now()

        const easeOutCubic = (t: number) => 1 - (1 - t) ** 3

        const step = (now: number) => {
          const elapsed = now - startTime
          const progress = Math.min(elapsed / duration, 1)
          const eased = easeOutCubic(progress)
          window.scrollTo(0, startY + distance * eased)
          if (progress < 1) requestAnimationFrame(step)
        }
        requestAnimationFrame(step)
      }
      const t = setTimeout(startScroll, 200)
      return () => clearTimeout(t)
    }
  }, [submitSuccess, submitError])

  const faqSections: { title: string; faqs: { question: string; answer: string }[] }[] = [
    {
      title: 'For Interested Members',
      faqs: [
        {
          question: 'What time commitment is expected from members?',
          answer: 'Youth4Elders is designed to be **flexible**. Most members commit minimally to a **1 hour monthly meeting** to stay engaged with club events and planning! Depending on their availability, general members are free to volunteer their time in one-time events, or be involved in one-time events, short-term initiatives, or ongoing placements.'
        },
        {
          question: 'How are volunteering schedules determined?',
          answer: 'Scheduling is managed on a **signup basis**. Members indicate their preferred shifts or events, and placements are assigned accordingly. We prioritize **academic balance, flexibility, and consistency** to ensure a positive experience for both volunteers and community partners.'
        },
        {
          question: 'Are there opportunities to join the executive team?',
          answer: '**Yes.** Youth4Elders actively recruits motivated members into leadership and executive roles throughout the year. Positions are filled through an **application and interview process**, with opportunities to contribute to program development, partnerships, and organizational strategy.'
        },
        {
          question: 'Do I need specific vaccines or immunizations?',
          answer: '**Some community partner sites may require** standard immunizations depending on their internal policies. Youth4Elders will **communicate any health or immunization requirements in advance** of placements, and alternatives will be offered when possible.'
        },
        {
          question: 'Is a Vulnerable Sector Check (VSC) required?',
          answer: 'A Vulnerable Sector Check (VSC) is **generally not required** for members of Youth4Elders. However, **some community partners require it** for volunteer placements. Members who wish to volunteer with these partners will need to obtain a VSC, and **Youth4Elders will provide the necessary documentation** to support the process.'
        },
        {
          question: 'Do I need certifications or prior training to volunteer?',
          answer: '**No prior certifications are required.** All volunteers receive **orientation and role-specific training** provided by Youth4Elders. For specialized programs, additional training may be offered in collaboration with partner organizations. For our knowledge, please indicate in your application if you do have standard first aid or any relevant first responder certifications.'
        },
        {
          question: 'Will I have the opportunity to create and lead my own initiative or event?',
          answer: '**Absolutely.** Youth4Elders strongly encourages member-led innovation. Volunteers are welcome to **design, propose, and lead their own programs**, workshops, or events, with mentorship and organizational support from the executive team.'
        }
      ]
    },
    {
      title: 'For Interested Community Partners',
      faqs: [
        {
          question: 'What does Youth4Elders offer as an organization?',
          answer: `Youth4Elders provides **trained, reliable student volunteers** who support older adults through volunteerism. Our model emphasizes **intergenerational connection, respect, and meaningful impact**.\n\n${EVENTS_LINK_TEXT} on our ${CLUB_INFO_LINK_PLACEHOLDER} and ${EVENTS_LINK_PLACEHOLDER} pages.`
        },
        {
          question: 'Is there any cost associated with partnering with Youth4Elders?',
          answer: '**No.** Youth4Elders operates as a **non-profit, volunteer-based** organization. **We do not expect payment** for our services, as our mission is rooted in community service and accessibility.'
        },
        {
          question: 'How flexible is Youth4Elders\' scheduling and availability?',
          answer: 'We offer **highly flexible** scheduling. Programming can be delivered during **weekdays, evenings, or weekends**, depending on mutual availability. Schedules are coordinated to align with both partner needs and volunteer capacity.'
        },
        {
          question: 'Can organizations request specific events or customized programs?',
          answer: '**Yes.** Youth4Elders welcomes **formal program or event requests**. We work collaboratively with partners to design **tailored initiatives** that align with organizational goals, resident interests, and logistical requirements.'
        }
      ]
    }
  ]

  const toggleFAQ = (index: number) => {
    setOpenFAQs((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    )
  }

  useEffect(() => {
    const el = faqSectionRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setFaqInView(true)
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const section = faqSectionRef.current
    if (!section) return
    const onScroll = () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current)
      rafRef.current = requestAnimationFrame(() => {
        setFaqScrollY(typeof window !== 'undefined' ? window.scrollY : 0)
        rafRef.current = null
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current)
    }
  }, [])

  const renderAnswer = (answer: string) => {
    const withBold = (text: string) => {
      const parts = text.split(/(\*\*.*?\*\*)/g)
      return parts.map((part, idx) =>
        part.startsWith('**') && part.endsWith('**') ? (
          <strong key={idx}>{part.slice(2, -2)}</strong>
        ) : (
          <span key={idx}>{part}</span>
        )
      )
    }
    const linkStyle = { color: 'var(--color-brown-dark)' }
    const linkClass = 'underline font-medium hover:opacity-80 transition-opacity'
    if (answer.includes(CLUB_INFO_LINK_PLACEHOLDER) && answer.includes(EVENTS_LINK_PLACEHOLDER)) {
      const [before, rest] = answer.split(CLUB_INFO_LINK_PLACEHOLDER)
      const [mid, after] = rest.split(EVENTS_LINK_PLACEHOLDER)
      return (
        <>
          {withBold(before)}
          <Link href="/club-info" className={linkClass} style={linkStyle}>Club Info</Link>
          {withBold(mid)}
          <Link href="/events/past" className={linkClass} style={linkStyle}>Past Events</Link>
          {withBold(after)}
        </>
      )
    }
    if (answer.includes(EVENTS_LINK_TEXT)) {
      const parts = answer.split(EVENTS_LINK_TEXT)
      return (
        <>
          {withBold(parts[0])}
          <Link href="/events/upcoming" className={linkClass} style={linkStyle}>{EVENTS_LINK_TEXT}</Link>
          {parts[1] ? withBold(parts[1]) : null}
        </>
      )
    }
    return withBold(answer)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const target = e.target
    const name = target.name
    const value = target.type === 'checkbox' ? (target as HTMLInputElement).checked : target.value
    setFormData(prev => ({ ...prev, [name]: value }))
    // Clear error for this field when user types
    if (name === 'firstName' || name === 'lastName') {
      if (fieldErrors.name) setFieldErrors(prev => { const next = { ...prev }; delete next.name; return next })
    } else if (name === 'email') {
      if (fieldErrors.email) setFieldErrors(prev => { const next = { ...prev }; delete next.email; return next })
    } else if (name === 'phone') {
      if (fieldErrors.phone) setFieldErrors(prev => { const next = { ...prev }; delete next.phone; return next })
    } else if (name === 'projectDescription') {
      if (fieldErrors.message) setFieldErrors(prev => { const next = { ...prev }; delete next.message; return next })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const errors: { name?: string; email?: string; phone?: string; message?: string } = {}
    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      errors.name = 'Please enter your name'
    }
    if (!formData.email.trim()) {
      errors.email = 'Please enter your email'
    } else if (!isValidEmail(formData.email)) {
      errors.email = 'Please enter a valid email address'
    }
    if (formData.phone.trim() && !isValidPhone(formData.phone)) {
      errors.phone = 'Please enter a valid phone number'
    }
    if (!formData.projectDescription.trim()) {
      errors.message = 'Please share your message'
    }
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      return
    }
    setIsSubmitting(true)
    setFieldErrors({})
    setSubmitError(false)
    setSubmitErrorMessage('')

    try {
      const response = await fetch('/api/send-contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      const data = await response.json()

      if (response.ok) {
        setSubmitSuccess(true)
        setFormData({ firstName: '', lastName: '', company: '', service: '', email: '', phone: '', projectDescription: '' })
        setTimeout(() => setSubmitSuccess(false), 5000)
      } else {
        setSubmitErrorMessage(data.error || 'Something went wrong — please try again.')
        setSubmitError(true)
      }
    } catch (error) {
      console.error('Error submitting contact form:', error)
      setSubmitErrorMessage('Something went wrong — please try again.')
      setSubmitError(true)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="min-h-screen contact-page-tablet-lock" style={{ background: 'var(--color-cream)' }}>
      {/* Contact - Two columns: heading (left), form with underline fields (right) */}
      <section id="contact-form" ref={contactFormSectionRef} className="py-16 lg:py-24">
        <div className="max-w-6xl mx-auto px-4 md:px-5 lg:px-8 contact-tablet-align-nav">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left Column - heading left-aligned, vertically centered with form, shifted up a bit */}
            <div className="flex flex-col items-start justify-center -mt-10 lg:-mt-14">
              <h1
                className="text-5xl lg:text-7xl xl:text-8xl font-bold leading-tight text-left md:break-words lg:break-normal"
                style={{ 
                  fontFamily: 'var(--font-vintage-stylist)', 
                  color: 'var(--color-brown-dark)'
                }}
              >
                {["Let's", "build", "the", "future", "together."].map((word, i) => (
                  <span key={i}>
                    <span
                      className={contactTitleVisible ? 'word-fade-in-up-blur-slow' : ''}
                      style={{
                        display: 'inline-block',
                        animationDelay: contactTitleVisible ? `${i * 0.35}s` : undefined,
                        opacity: contactTitleVisible ? undefined : 0
                      }}
                    >
                      {word}
                    </span>
                    {i < 4 ? '\u00A0' : ''}
                  </span>
                ))}
              </h1>
              <p
                className={`mt-4 text-lg lg:text-2xl italic whitespace-nowrap md:whitespace-normal lg:whitespace-nowrap ${contactCaptionVisible ? 'contact-caption-reveal' : 'opacity-0'}`}
                style={{ 
                  fontFamily: 'var(--font-leiko)',
                  color: 'var(--color-brown-dark)'
                }}
              >
                We&apos;d love to hear from you.
              </p>
            </div>

            {/* Right Column - form: pink bg, rounded (less pill), larger type */}
            <div className="w-full relative">
              <div className="w-full relative">
              {submitSuccess && (
                <div className="contact-form-mobile-compact w-full rounded-2xl p-8 lg:p-10 shadow-lg contact-result-box-in" style={{ background: 'var(--color-pink-light)', border: '2px solid var(--color-brown-dark)' }}>
                  <p className="text-lg font-medium mb-5" style={{ fontFamily: 'var(--font-kollektif)', color: 'var(--color-brown-dark)' }}>
                    Got it — we got your message and we&apos;ll be in touch!
                  </p>
                  <button
                    type="button"
                    onClick={() => setSubmitSuccess(false)}
                    className="contact-submit-btn px-10 py-4 rounded-2xl font-semibold text-lg"
                      style={{ 
                      background: 'var(--color-brown-dark)',
                      color: 'var(--color-cream)',
                      fontFamily: 'var(--font-kollektif)'
                    }}
                  >
                    <span className="relative z-10">Submit another</span>
                  </button>
                </div>
              )}

              {!submitSuccess && (
                <div className="contact-form-enter contact-form-mobile-compact w-full">
              <form onSubmit={handleSubmit} className="space-y-3.5 lg:space-y-6" noValidate>
                {/* Row 1: Name (required) - First Name | Last Name */}
                <div
                  className={contactFormVisible ? 'contact-form-row-slide-up' : 'opacity-0'}
                  style={{ animationDelay: contactFormVisible ? '0.1s' : undefined, animationFillMode: 'both' }}
                >
                  <div>
                  <label htmlFor="contact-first-name" className="block text-base font-medium mb-2" style={{ fontFamily: 'var(--font-kollektif)', color: 'var(--color-brown-dark)' }}>
                    Name (required <span style={{ color: 'red' }}>*</span>)
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 lg:gap-5">
                    <input
                      id="contact-first-name"
                      type="text"
                      name="firstName"
                      placeholder="First Name"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                      className="contact-form-field w-full px-5 py-4 rounded-2xl border-2 focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-[var(--color-pink-dark)] transition-colors placeholder-[rgba(98,32,47,0.55)]"
                      style={{ 
                        background: formData.firstName.trim() ? 'var(--color-pink-light)' : 'var(--color-pink-medium)',
                        fontFamily: 'var(--font-kollektif)', 
                        color: 'var(--color-brown-dark)',
                        fontSize: '17px',
                        borderColor: fieldErrors.name ? 'var(--color-error)' : 'transparent'
                      }}
                    />
                  <input
                      id="contact-last-name"
                    type="text"
                      name="lastName"
                      placeholder="Last Name"
                      value={formData.lastName}
                    onChange={handleInputChange}
                    required
                      className="contact-form-field w-full px-5 py-4 rounded-2xl border-2 focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-[var(--color-pink-dark)] transition-colors placeholder-[rgba(98,32,47,0.55)]"
                    style={{
                        background: formData.lastName.trim() ? 'var(--color-pink-light)' : 'var(--color-pink-medium)',
                      fontFamily: 'var(--font-kollektif)',
                        color: 'var(--color-brown-dark)',
                        fontSize: '17px',
                        borderColor: fieldErrors.name ? 'var(--color-error)' : 'transparent'
                      }}
                    />
                  </div>
                  {fieldErrors.name && (
                    <p className="text-sm mt-1.5" style={{ fontFamily: 'var(--font-kollektif)', color: 'var(--color-error)' }}>{fieldErrors.name}</p>
                  )}
                </div>
                </div>
                {/* Company / group (optional) */}
                <div
                  className={contactFormVisible ? 'contact-form-row-slide-up' : 'opacity-0'}
                  style={{ animationDelay: contactFormVisible ? '0.16s' : undefined, animationFillMode: 'both' }}
                >
                  <div>
                    <label htmlFor="contact-company" className="block text-base font-medium mb-2" style={{ fontFamily: 'var(--font-kollektif)', color: 'var(--color-brown-dark)' }}>
                      Organization
                    </label>
                    <input
                      id="contact-company"
                      type="text"
                      name="company"
                      placeholder="School, company, or group (optional)"
                      value={formData.company}
                      onChange={handleInputChange}
                      className="contact-form-field w-full px-5 py-4 rounded-2xl border-2 focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-[var(--color-pink-dark)] transition-colors placeholder-[rgba(98,32,47,0.55)]"
                      style={{
                        background: formData.company.trim() ? 'var(--color-pink-light)' : 'var(--color-pink-medium)',
                        fontFamily: 'var(--font-kollektif)',
                        color: 'var(--color-brown-dark)',
                        fontSize: '17px',
                        borderColor: 'transparent'
                      }}
                    />
                  </div>
                </div>
                {/* Row 2: Email | Phone */}
                <div
                  className={contactFormVisible ? 'contact-form-row-slide-up' : 'opacity-0'}
                  style={{ animationDelay: contactFormVisible ? '0.22s' : undefined, animationFillMode: 'both' }}
                >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 lg:gap-5">
                <div>
                    <label htmlFor="contact-email" className="block text-base font-medium mb-2" style={{ fontFamily: 'var(--font-kollektif)', color: 'var(--color-brown-dark)' }}>
                      Email (required <span style={{ color: 'red' }}>*</span>)
                    </label>
                  <input
id="contact-email"
                    type="email"
                    name="email"
                      placeholder="Your email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="contact-form-field w-full px-5 py-4 rounded-2xl border-2 focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-[var(--color-pink-dark)] transition-colors placeholder-[rgba(98,32,47,0.55)]"
                    style={{
                      background: formData.email.trim() ? 'var(--color-pink-light)' : 'var(--color-pink-medium)',
                      fontFamily: 'var(--font-kollektif)',
                      color: 'var(--color-brown-dark)',
                      fontSize: '17px',
                      borderColor: fieldErrors.email ? 'var(--color-error)' : 'transparent'
                    }}
                  />
                  {fieldErrors.email && (
                    <p className="text-sm mt-1.5" style={{ fontFamily: 'var(--font-kollektif)', color: 'var(--color-error)' }}>{fieldErrors.email}</p>
                  )}
                </div>
                <div>
                    <label htmlFor="contact-phone" className="block text-base font-medium mb-2" style={{ fontFamily: 'var(--font-kollektif)', color: 'var(--color-brown-dark)' }}>
                      Phone number
                    </label>
                  <input
                      id="contact-phone"
                    type="tel"
                    name="phone"
                      placeholder="Your phone number"
                    value={formData.phone}
                    onChange={handleInputChange}
                      className="contact-form-field w-full px-5 py-4 rounded-2xl border-2 focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-[var(--color-pink-dark)] transition-colors placeholder-[rgba(98,32,47,0.55)]"
                    style={{
                        background: formData.phone.trim() ? 'var(--color-pink-light)' : 'var(--color-pink-medium)',
                      fontFamily: 'var(--font-kollektif)',
                        color: 'var(--color-brown-dark)',
                        fontSize: '17px',
                        borderColor: fieldErrors.phone ? 'var(--color-error)' : 'transparent'
                      }}
                    />
                  {fieldErrors.phone && (
                    <p className="text-sm mt-1.5" style={{ fontFamily: 'var(--font-kollektif)', color: 'var(--color-error)' }}>{fieldErrors.phone}</p>
                  )}
                  </div>
                </div>
                </div>
                {/* Row 3: Service */}
                <div
                  className={`${contactFormVisible ? 'contact-form-row-slide-up' : 'opacity-0'} ${serviceDropdownOpen ? 'relative z-[200]' : ''}`}
                  style={{ animationDelay: contactFormVisible ? '0.34s' : undefined, animationFillMode: 'both' }}
                >
                <div>
                  <label htmlFor="contact-service-trigger" className="block text-base font-medium mb-2" style={{ fontFamily: 'var(--font-kollektif)', color: 'var(--color-brown-dark)' }}>
                    Service
                  </label>
                  <div className={`relative w-full ${serviceDropdownOpen ? 'z-[100]' : ''}`} ref={serviceDropdownRef}>
                    <button
                      type="button"
                      id="contact-service-trigger"
                      onClick={() => setServiceDropdownOpen((o) => !o)}
                      className="w-full flex items-center justify-between px-5 py-4 pr-12 rounded-2xl border-0 focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-[var(--color-pink-dark)] transition-colors cursor-pointer text-left"
                      style={{
                        background: formData.service ? 'var(--color-pink-light)' : 'var(--color-pink-medium)',
                        fontFamily: 'var(--font-kollektif)',
                        color: formData.service ? 'var(--color-brown-dark)' : 'rgba(98, 32, 47, 0.6)',
                        fontSize: '17px'
                      }}
                    >
                    <span>{serviceOptions.find((o) => o.value === formData.service)?.label ?? 'Select...'}</span>
                    <svg
                      className={`w-5 h-5 flex-shrink-0 absolute right-5 top-1/2 -translate-y-1/2 transition-transform ${serviceDropdownOpen ? 'rotate-180' : ''}`}
                      style={{ color: 'var(--color-brown-dark)' }}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {serviceDropdownOpen && (
                    <div
                      className="absolute top-full left-0 right-0 mt-2 rounded-2xl overflow-y-auto overflow-x-hidden z-[9999] py-2 max-h-48"
                      style={{
                        background: 'var(--color-cream)',
                        border: '1px solid var(--color-brown-dark)',
                        boxShadow: '0 8px 24px rgba(73, 47, 30, 0.2)'
                      }}
                    >
                      {serviceOptions.map((opt) => (
                        <button
                          key={opt.value || 'empty'}
                          type="button"
                          className="block w-full text-left px-5 py-3.5 text-base transition-colors border-0"
                          style={{
                            fontFamily: 'var(--font-kollektif)',
                            color: 'var(--color-brown-dark)',
                            background: 'transparent'
                          }}
                          onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(73, 47, 30, 0.1)' }}
                          onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}
                          onClick={() => {
                            setFormData((prev) => ({ ...prev, service: opt.value }))
                            setServiceDropdownOpen(false)
                          }}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  )}
                  </div>
                </div>
                </div>
                {/* Row 4: Message (textarea) */}
                <div
                  className={contactFormVisible ? 'contact-form-row-slide-up' : 'opacity-0'}
                  style={{ animationDelay: contactFormVisible ? '0.46s' : undefined, animationFillMode: 'both' }}
                >
                <div>
                  <label htmlFor="contact-project" className="block text-base font-medium mb-2" style={{ fontFamily: 'var(--font-kollektif)', color: 'var(--color-brown-dark)' }}>
                    What&apos;s on your mind?
                  </label>
                  <textarea
                    id="contact-project"
                    name="projectDescription"
                    placeholder="Drop us a line, ask a question, or just say hi..."
                    value={formData.projectDescription}
                    onChange={handleInputChange}
                    rows={5}
                    className="contact-form-field w-full px-5 py-4 rounded-2xl border-2 focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-[var(--color-pink-dark)] transition-colors resize-none placeholder-[rgba(98,32,47,0.55)]"
                    style={{
                      background: formData.projectDescription.trim() ? 'var(--color-pink-light)' : 'var(--color-pink-medium)',
                      fontFamily: 'var(--font-kollektif)',
                      color: 'var(--color-brown-dark)',
                      fontSize: '17px',
                      borderColor: fieldErrors.message ? 'var(--color-error)' : 'transparent'
                    }}
                  />
                  {fieldErrors.message && (
                    <p className="text-sm mt-1.5" style={{ fontFamily: 'var(--font-kollektif)', color: 'var(--color-error)' }}>{fieldErrors.message}</p>
                  )}
                </div>
                  </div>
                {/* Submit: left-aligned, larger */}
                <div
                  className={contactFormVisible ? 'contact-form-row-slide-up' : 'opacity-0'}
                  style={{ animationDelay: contactFormVisible ? '0.58s' : undefined, animationFillMode: 'both' }}
                >
                {submitError && submitErrorMessage && (
                  <div className="mb-4 p-4 rounded-xl border-2 flex items-start justify-between gap-3" style={{ background: 'var(--color-error)', borderColor: 'var(--color-error)', color: 'var(--color-cream)' }}>
                    <p className="text-sm flex-1" style={{ fontFamily: 'var(--font-kollektif)', color: 'var(--color-cream)' }}>{submitErrorMessage}</p>
                    <button type="button" onClick={() => { setSubmitError(false); setSubmitErrorMessage('') }} className="flex-shrink-0 text-lg opacity-80 hover:opacity-100" style={{ color: 'var(--color-cream)' }} aria-label="Close">×</button>
                  </div>
                )}
                <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                    className="contact-submit-btn px-10 py-4 rounded-2xl font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                      background: 'var(--color-brown-dark)',
                      color: 'var(--color-cream)',
                      fontFamily: 'var(--font-kollektif)'
                    }}
                  >
                    <span className="relative z-10">{isSubmitting ? 'Sending...' : 'Submit'}</span>
                </button>
                </div>
                </div>
              </form>
                </div>
              )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section - green (olive), socials underneath inside green */}
      <section
        id="faq"
        ref={faqSectionRef}
        className="relative overflow-hidden py-16 lg:py-24"
        style={{ background: 'var(--color-olive)' }}
      >
        <div className="relative z-10 max-w-6xl mx-auto px-4 md:px-5 lg:px-8 contact-tablet-align-nav">
          <div className={`mb-10 animate-on-scroll fade-up ${faqInView ? 'visible' : ''}`} style={{ transitionDuration: '0.6s', transitionDelay: '0.1s' }}>
            <h2
              className="text-3xl lg:text-4xl font-bold"
              style={{ fontFamily: 'var(--font-vintage-stylist)', color: 'var(--color-cream)' }}
            >
              Got Any Questions?
            </h2>
            <p
              className="text-lg lg:text-xl mt-1"
              style={{ fontFamily: 'var(--font-kollektif)', color: 'var(--color-cream)', opacity: 0.9 }}
            >
              We&apos;ve got answers.
            </p>
          </div>
          <div className={`space-y-12 animate-on-scroll fade-up ${faqInView ? 'visible' : ''}`} style={{ transitionDuration: '0.6s', transitionDelay: '0.2s' }}>
            {faqSections.map((section, sectionIdx) => {
              const globalOffset = faqSections
                .slice(0, sectionIdx)
                .reduce((acc, s) => acc + s.faqs.length, 0)
              return (
                <div key={section.title}>
                  <h3
                    className="text-xl font-bold mb-6"
                    style={{
                      fontFamily: 'var(--font-freshwost)',
                      color: 'var(--color-cream)',
                      opacity: 0.95
                    }}
                  >
                    {section.title}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-3 lg:gap-8 items-start">
                    {section.faqs.map((faq, faqIdx) => {
                      const globalIndex = globalOffset + faqIdx
                      const isOpen = openFAQs.includes(globalIndex)
                      const t = faqScrollY * 0.02 + globalIndex * 0.6
                      const i = globalIndex
                      const floatX = 0
                      const floatY =
                        Math.cos(t * 0.18 + i * 0.9) * 3 +
                        Math.sin(t * 0.1 + i * 1.3) * 1.5
                      const baseTilt = [1.15, -0.7, 0.9, -1.3, 0.55, -0.95, 1.35, -0.5, 0.8, -1.1, 1.0][i % 11]
                      const floatRotate = baseTilt + Math.sin(t * 0.12 + i * 1.2) * 0.25
                      return (
                        <div
                          key={`${section.title}-${faqIdx}`}
                          className="rounded-xl lg:rounded-2xl overflow-hidden will-change-transform"
                  style={{
                            background: 'var(--color-cream)',
                            boxShadow: '0 2px 12px rgba(98, 32, 47, 0.08)',
                            transform: `translate(${floatX}px, ${floatY}px) rotate(${floatRotate}deg)`,
                            transition: 'transform 0.06s ease-out'
                          }}
                        >
                          <button
                            type="button"
                            onClick={() => toggleFAQ(globalIndex)}
                            className="w-full px-3.5 py-2.5 lg:px-5 lg:py-4 flex items-center justify-between text-left gap-2.5 lg:gap-4"
                          >
                            <span
                              className="text-sm lg:text-base font-semibold flex-1 min-w-0"
                style={{ 
                                fontFamily: 'var(--font-leiko)',
                  color: 'var(--color-brown-dark)'
                }}
              >
                              {faq.question}
                            </span>
                            <span
                              className="flex-shrink-0 w-6 h-6 lg:w-8 lg:h-8 flex items-center justify-center text-base lg:text-lg font-light rounded-full transition-colors"
                              style={{
                                color: 'var(--color-brown-dark)',
                                background: isOpen ? 'rgba(98, 32, 47, 0.08)' : 'transparent'
                              }}
                              aria-hidden
                            >
                              {isOpen ? '×' : '+'}
                            </span>
                          </button>
                          <div
                            className="overflow-hidden transition-all duration-500 ease-in-out"
                            style={{
                              maxHeight: isOpen ? '800px' : '0',
                              opacity: isOpen ? 1 : 0
                            }}
                          >
                            <div className="px-3.5 pb-3.5 lg:px-5 lg:pb-5 pt-0">
                              <p
                                className="text-sm lg:text-base leading-relaxed whitespace-pre-line"
                style={{ 
                  fontFamily: 'var(--font-kollektif)', 
                  color: 'var(--color-brown-medium)',
                  lineHeight: '1.7'
                }}
              >
                                {renderAnswer(faq.answer)}
                              </p>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )
            })}
            </div>

          {/* Socials - underneath FAQ, inside green section */}
          <div
            ref={socialsRef}
            className="mt-12 lg:mt-16 pt-10 lg:pt-12 flex flex-col items-center gap-6 text-center"
            style={{ borderTop: '1px solid rgba(251, 247, 232, 0.3)' }}
          >
            <h2
              className={`text-3xl lg:text-5xl font-bold italic max-w-4xl leading-tight animate-on-scroll fade-up ${socialsInView ? 'visible' : ''}`}
              style={{ fontFamily: 'var(--font-leiko)', color: 'var(--color-pink-medium)', transitionDuration: '0.5s', transitionDelay: '0s' }}
            >
              We&apos;re here, there, a bit everywhere!
            </h2>
            <div className="flex gap-5 flex-shrink-0 justify-center flex-wrap">
                  <span className={`inline-block ${socialsInView ? 'socials-logos-pop' : 'opacity-0'}`} style={{ animationDelay: socialsInView ? '0.35s' : undefined, animationFillMode: 'both' }}>
                    <a
                      href="https://www.instagram.com/youth4elders/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-14 h-14 lg:w-16 lg:h-16 rounded-full flex items-center justify-center transition-all hover:opacity-85 hover:scale-105 border-2"
                      style={{ background: 'var(--color-pink-medium)', color: 'var(--color-brown-dark)', borderColor: 'var(--color-pink-medium)' }}
                      aria-label="Instagram"
                    >
                      <svg className="w-7 h-7 lg:w-8 lg:h-8" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                      </svg>
                    </a>
                  </span>
                  <span className={`inline-block ${socialsInView ? 'socials-logos-pop' : 'opacity-0'}`} style={{ animationDelay: socialsInView ? '0.45s' : undefined, animationFillMode: 'both' }}>
                    <a
                      href="https://www.linkedin.com/company/youth4elders"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-14 h-14 lg:w-16 lg:h-16 rounded-full flex items-center justify-center transition-all hover:opacity-85 hover:scale-105 border-2"
                      style={{ background: 'var(--color-pink-medium)', color: 'var(--color-brown-dark)', borderColor: 'var(--color-pink-medium)' }}
                      aria-label="LinkedIn"
                    >
                      <svg className="w-7 h-7 lg:w-8 lg:h-8" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                    </a>
                  </span>
                  <span className={`inline-block ${socialsInView ? 'socials-logos-pop' : 'opacity-0'}`} style={{ animationDelay: socialsInView ? '0.55s' : undefined, animationFillMode: 'both' }}>
                    <a
                      href="mailto:youth4elders@gmail.com"
                      className="w-14 h-14 lg:w-16 lg:h-16 rounded-full flex items-center justify-center transition-all hover:opacity-85 hover:scale-105 border-2"
                      style={{ background: 'var(--color-pink-medium)', color: 'var(--color-brown-dark)', borderColor: 'var(--color-pink-medium)' }}
                      aria-label="Email"
                    >
                      <svg className="w-7 h-7 lg:w-8 lg:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </a>
                  </span>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
