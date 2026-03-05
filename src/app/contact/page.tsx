'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'

const EVENTS_LINK_TEXT = 'View the events and programs we offer here'

export default function Contact() {
  const [openFAQs, setOpenFAQs] = useState<number[]>([])
  const [faqInView, setFaqInView] = useState(false)
  const [faqScrollY, setFaqScrollY] = useState(0)
  const faqSectionRef = useRef<HTMLElement>(null)
  const rafRef = useRef<number | null>(null)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    service: '',
    email: '',
    phone: '',
    projectDescription: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [serviceDropdownOpen, setServiceDropdownOpen] = useState(false)
  const serviceDropdownRef = useRef<HTMLDivElement>(null)

  const serviceOptions = [
    { value: '', label: 'Select...' },
    { value: 'volunteer', label: 'Volunteering' },
    { value: 'partnership', label: 'Partnership' },
    { value: 'general', label: 'General inquiry' }
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

  const faqSections: { title: string; faqs: { question: string; answer: string }[] }[] = [
    {
      title: 'For Interested Members',
      faqs: [
        {
          question: 'What time commitment is expected from members?',
          answer: 'Youth4Elders is designed to be flexible. Most members commit minimally to a 1 hour monthly meeting to stay engaged with club events and planning! Depending on their availability, general members are free to volunteer their time in one-time events, or be involved in one-time events, short-term initiatives, or ongoing placements.'
        },
        {
          question: 'How are volunteering schedules determined?',
          answer: 'Scheduling is managed on a signup basis. Members indicate their preferred shifts or events, and placements are assigned accordingly. We prioritize academic balance, flexibility, and consistency to ensure a positive experience for both volunteers and community partners.'
        },
        {
          question: 'Are there opportunities to join the executive team?',
          answer: 'Yes. Youth4Elders actively recruits motivated members into leadership and executive roles throughout the year. Positions are filled through an application and interview process, with opportunities to contribute to program development, partnerships, and organizational strategy.'
        },
        {
          question: 'Do I need specific vaccines or immunizations?',
          answer: 'Some community partner sites may require standard immunizations depending on their internal policies. Youth4Elders will communicate any health or immunization requirements in advance of placements, and alternatives will be offered when possible.'
        },
        {
          question: 'Is a Vulnerable Sector Check (VSC) required?',
          answer: 'A Vulnerable Sector Check (VSC) is generally not required for members of Youth4Elders. However, some community partners require it for volunteer placements. Members who wish to volunteer with these partners will need to obtain a VSC, and Youth4Elders will provide the necessary documentation to support the process.'
        },
        {
          question: 'Do I need certifications or prior training to volunteer?',
          answer: 'No prior certifications are required. All volunteers receive orientation and role-specific training provided by Youth4Elders. For specialized programs, additional training may be offered in collaboration with partner organizations. For our knowledge, please indicate in your application if you do have standard first aid or any relevant first responder certifications.'
        },
        {
          question: 'Will I have the opportunity to create and lead my own initiative or event?',
          answer: 'Absolutely. Youth4Elders strongly encourages member-led innovation. Volunteers are welcome to design, propose, and lead their own programs, workshops, or events, with mentorship and organizational support from the executive team.'
        }
      ]
    },
    {
      title: 'For Interested Community Partners',
      faqs: [
        {
          question: 'What does Youth4Elders offer as an organization?',
          answer: `Youth4Elders provides trained, reliable student volunteers who support older adults through volunteerism. Our model emphasizes intergenerational connection, respect, and meaningful impact.\n\n${EVENTS_LINK_TEXT}`
        },
        {
          question: 'Is there any cost associated with partnering with Youth4Elders?',
          answer: 'No. Youth4Elders operates as a non-profit, volunteer-based organization. We do not expect payment for our services, as our mission is rooted in community service and accessibility.'
        },
        {
          question: 'How flexible is Youth4Elders\' scheduling and availability?',
          answer: 'We offer highly flexible scheduling. Programming can be delivered during weekdays, evenings, or weekends, depending on mutual availability. Schedules are coordinated to align with both partner needs and volunteer capacity.'
        },
        {
          question: 'Can organizations request specific events or customized programs?',
          answer: 'Yes. Youth4Elders welcomes formal program or event requests. We work collaboratively with partners to design tailored initiatives that align with organizational goals, resident interests, and logistical requirements.'
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
    if (!answer.includes(EVENTS_LINK_TEXT)) {
      return answer
    }
    const parts = answer.split(EVENTS_LINK_TEXT)
    return (
      <>
        {parts[0]}
        <Link
          href="/events"
          className="underline font-medium hover:opacity-80 transition-opacity"
          style={{ color: 'var(--color-brown-dark)' }}
        >
          {EVENTS_LINK_TEXT}
        </Link>
        {parts[1] || ''}
      </>
    )
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const target = e.target
    const name = target.name
    const value = target.type === 'checkbox' ? (target as HTMLInputElement).checked : target.value
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false)
      setSubmitSuccess(true)
      setFormData({ firstName: '', lastName: '', service: '', email: '', phone: '', projectDescription: '' })
      setTimeout(() => setSubmitSuccess(false), 5000)
    }, 1000)
  }

  return (
    <main className="min-h-screen" style={{ background: 'var(--color-cream)' }}>
      {/* Contact - Two columns: heading (left), form with underline fields (right) */}
      <section id="contact-form" className="py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left Column - heading left-aligned, vertically centered with form, shifted up a bit */}
            <div className="flex flex-col items-start justify-center -mt-10 lg:-mt-14">
              <h1
                className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold leading-tight text-left"
                style={{
                  fontFamily: 'var(--font-vintage-stylist)',
                  color: 'var(--color-brown-dark)'
                }}
              >
                Let&apos;s build the future together
              </h1>
            </div>

            {/* Right Column - minimal form: underline inputs, First/Last name, Service, Email, newsletter, Project description, Submit */}
            <div className="w-full">
              <form onSubmit={handleSubmit} className="space-y-8">
                <div>
                  <label
                    htmlFor="contact-first-name"
                    className="block text-sm font-medium mb-1"
                    style={{ fontFamily: 'var(--font-kollektif)', color: 'var(--color-brown-dark)' }}
                  >
                    Name (required)
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      id="contact-first-name"
                      type="text"
                      name="firstName"
                      placeholder="First Name"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                      className="w-full py-2 bg-transparent border-0 border-b-2 focus:outline-none focus:ring-0 transition-colors"
                      style={{
                        borderColor: 'rgba(0,0,0,0.2)',
                        fontFamily: 'var(--font-kollektif)',
                        color: 'var(--color-brown-dark)',
                        fontSize: '15px'
                      }}
                      onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--color-brown-dark)' }}
                      onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(0,0,0,0.2)' }}
                    />
                    <input
                      id="contact-last-name"
                      type="text"
                      name="lastName"
                      placeholder="Last Name"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                      className="w-full py-2 bg-transparent border-0 border-b-2 focus:outline-none focus:ring-0 transition-colors"
                      style={{
                        borderColor: 'rgba(0,0,0,0.2)',
                        fontFamily: 'var(--font-kollektif)',
                        color: 'var(--color-brown-dark)',
                        fontSize: '15px'
                      }}
                      onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--color-brown-dark)' }}
                      onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(0,0,0,0.2)' }}
                    />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="contact-service-trigger"
                    className="block text-sm font-medium mb-1"
                    style={{ fontFamily: 'var(--font-kollektif)', color: 'var(--color-brown-dark)' }}
                  >
                    Service
                  </label>
                  <div className="relative w-full" ref={serviceDropdownRef}>
                    <button
                      type="button"
                      id="contact-service-trigger"
                      onClick={() => setServiceDropdownOpen((o) => !o)}
                      className="w-full flex items-center justify-between py-2 pr-8 bg-transparent border-0 border-b-2 focus:outline-none focus:ring-0 transition-colors cursor-pointer text-left"
                      style={{
                        borderColor: serviceDropdownOpen ? 'var(--color-brown-dark)' : 'rgba(0,0,0,0.2)',
                        fontFamily: 'var(--font-kollektif)',
                        color: formData.service ? 'var(--color-brown-dark)' : 'rgba(98, 32, 47, 0.5)',
                        fontSize: '15px'
                      }}
                    >
                      <span>{serviceOptions.find((o) => o.value === formData.service)?.label ?? 'Select...'}</span>
                      <svg
                        className={`w-4 h-4 flex-shrink-0 absolute right-0 top-1/2 -translate-y-1/2 transition-transform ${serviceDropdownOpen ? 'rotate-180' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        style={{ color: 'var(--color-brown-dark)' }}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {serviceDropdownOpen && (
                      <div
                        className="absolute top-full left-0 right-0 mt-2 rounded-2xl overflow-hidden z-[100] py-2"
                        style={{
                          background: '#FBF7E8',
                          border: '1px solid var(--color-brown-dark)',
                          boxShadow: '0 8px 24px rgba(73, 47, 30, 0.2)'
                        }}
                      >
                        {serviceOptions.map((opt) => (
                          <button
                            key={opt.value || 'empty'}
                            type="button"
                            className="block w-full text-left px-4 py-3 text-sm transition-colors border-0"
                            style={{
                              fontFamily: 'var(--font-kollektif)',
                              color: 'var(--color-brown-dark)',
                              background: 'transparent'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background = 'rgba(73, 47, 30, 0.1)'
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background = 'transparent'
                            }}
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
                <div>
                  <label
                    htmlFor="contact-email"
                    className="block text-sm font-medium mb-1"
                    style={{ fontFamily: 'var(--font-kollektif)', color: 'var(--color-brown-dark)' }}
                  >
                    Email (required)
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    name="email"
                    placeholder="Your email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full py-2 bg-transparent border-0 border-b-2 focus:outline-none focus:ring-0 transition-colors"
                    style={{
                      borderColor: 'rgba(0,0,0,0.2)',
                      fontFamily: 'var(--font-kollektif)',
                      color: 'var(--color-brown-dark)',
                      fontSize: '15px'
                    }}
                    onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--color-brown-dark)' }}
                    onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(0,0,0,0.2)' }}
                  />
                </div>
                <div>
                  <label
                    htmlFor="contact-phone"
                    className="block text-sm font-medium mb-1"
                    style={{ fontFamily: 'var(--font-kollektif)', color: 'var(--color-brown-dark)' }}
                  >
                    Phone number
                  </label>
                  <input
                    id="contact-phone"
                    type="tel"
                    name="phone"
                    placeholder="Your phone number"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full py-2 bg-transparent border-0 border-b-2 focus:outline-none focus:ring-0 transition-colors"
                    style={{
                      borderColor: 'rgba(0,0,0,0.2)',
                      fontFamily: 'var(--font-kollektif)',
                      color: 'var(--color-brown-dark)',
                      fontSize: '15px'
                    }}
                    onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--color-brown-dark)' }}
                    onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(0,0,0,0.2)' }}
                  />
                </div>
                <div>
                  <label
                    htmlFor="contact-project"
                    className="block text-sm font-medium mb-1"
                    style={{ fontFamily: 'var(--font-kollektif)', color: 'var(--color-brown-dark)' }}
                  >
                    Project description
                  </label>
                  <textarea
                    id="contact-project"
                    name="projectDescription"
                    placeholder="Tell us about your project or message"
                    value={formData.projectDescription}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full py-2 bg-transparent border-0 border-b-2 focus:outline-none focus:ring-0 transition-colors resize-none"
                    style={{
                      borderColor: 'rgba(0,0,0,0.2)',
                      fontFamily: 'var(--font-kollektif)',
                      color: 'var(--color-brown-dark)',
                      fontSize: '15px'
                    }}
                    onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--color-brown-dark)' }}
                    onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(0,0,0,0.2)' }}
                  />
                </div>
                {submitSuccess && (
                  <div className="p-4 rounded-xl" style={{ background: 'rgba(76, 175, 80, 0.15)', border: '1px solid rgba(76, 175, 80, 0.4)' }}>
                    <p className="text-sm font-semibold" style={{ fontFamily: 'var(--font-kollektif)', color: '#2e7d32' }}>
                      ✓ Message sent successfully! We&apos;ll get back to you soon.
                    </p>
                  </div>
                )}
                <div className="flex justify-center pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-10 py-3 rounded-lg font-semibold text-base transition-all duration-300 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{
                      background: 'var(--color-brown-dark)',
                      color: 'var(--color-cream)',
                      fontFamily: 'var(--font-kollektif)'
                    }}
                  >
                    {isSubmitting ? 'Sending...' : 'Submit'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section - green (olive), socials underneath inside green */}
      <section
        id="faq"
        ref={faqSectionRef}
        className={`relative overflow-hidden py-16 md:py-24 animate-on-scroll fade-up ${faqInView ? 'visible' : ''}`}
        style={{ background: 'var(--color-olive)', transitionDuration: '0.6s' }}
      >
        <div className="relative z-10 max-w-6xl mx-auto px-4 md:px-8">
          <div className="mb-10">
            <h2
              className="text-3xl md:text-4xl font-bold"
              style={{ fontFamily: 'var(--font-vintage-stylist)', color: 'var(--color-cream)' }}
            >
              Got Any Questions?
            </h2>
            <p
              className="text-lg md:text-xl mt-1"
              style={{ fontFamily: 'var(--font-kollektif)', color: 'var(--color-cream)', opacity: 0.9 }}
            >
              We&apos;ve got answers.
            </p>
          </div>
          <div className="space-y-12">
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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                    {section.faqs.map((faq, faqIdx) => {
                      const globalIndex = globalOffset + faqIdx
                      const isOpen = openFAQs.includes(globalIndex)
                      const t = faqScrollY * 0.02 + globalIndex * 0.6
                      const i = globalIndex
                      const floatX = 0
                      const floatY =
                        Math.cos(t * 0.18 + i * 0.9) * 18 +
                        Math.sin(t * 0.1 + i * 1.3) * 10
                      const floatRotate = Math.sin(t * 0.12 + i * 1.2) * 0.8
                      return (
                        <div
                          key={`${section.title}-${faqIdx}`}
                          className="rounded-2xl overflow-hidden will-change-transform"
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
                            className="w-full px-5 py-4 flex items-center justify-between text-left gap-4"
                          >
                            <span
                              className="text-base font-semibold flex-1 min-w-0"
                              style={{
                                fontFamily: 'var(--font-leiko)',
                                color: 'var(--color-brown-dark)'
                              }}
                            >
                              {faq.question}
                            </span>
                            <span
                              className="flex-shrink-0 w-8 h-8 flex items-center justify-center text-lg font-light rounded-full transition-colors"
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
                            <div className="px-5 pb-5 pt-0">
                              <p
                                className="text-sm md:text-base leading-relaxed whitespace-pre-line"
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
          <div className="mt-16 md:mt-20 pt-12 md:pt-16 flex flex-col items-center gap-8 text-center" style={{ borderTop: '1px solid rgba(251, 247, 232, 0.3)' }}>
            <h2
              className="text-4xl md:text-5xl lg:text-6xl font-bold italic"
              style={{
                fontFamily: 'var(--font-leiko)',
                color: 'var(--color-pink-medium)'
              }}
            >
              Find us in the wild — we don&apos;t bite!
            </h2>
            <div className="flex gap-5 flex-shrink-0 justify-center flex-wrap">
              <a
                href="https://www.instagram.com/youth4elders/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center transition-all hover:opacity-85 hover:scale-105 border-2"
                style={{
                  background: 'var(--color-pink-medium)',
                  color: 'var(--color-brown-dark)',
                  borderColor: 'var(--color-pink-medium)'
                }}
                aria-label="Instagram"
              >
                <svg className="w-7 h-7 md:w-8 md:h-8" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a
                href="https://www.linkedin.com/company/youth4elders"
                target="_blank"
                rel="noopener noreferrer"
                className="w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center transition-all hover:opacity-85 hover:scale-105 border-2"
                style={{
                  background: 'var(--color-pink-medium)',
                  color: 'var(--color-brown-dark)',
                  borderColor: 'var(--color-pink-medium)'
                }}
                aria-label="LinkedIn"
              >
                <svg className="w-7 h-7 md:w-8 md:h-8" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
              <a
                href="mailto:youth4elders@gmail.com"
                className="w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center transition-all hover:opacity-85 hover:scale-105 border-2"
                style={{
                  background: 'var(--color-pink-medium)',
                  color: 'var(--color-brown-dark)',
                  borderColor: 'var(--color-pink-medium)'
                }}
                aria-label="Email"
              >
                <svg className="w-7 h-7 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
