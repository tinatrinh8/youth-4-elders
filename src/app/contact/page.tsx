'use client'

import { useState } from 'react'

export default function Contact() {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [isSubjectDropdownOpen, setIsSubjectDropdownOpen] = useState(false)

  const subjectOptions = [
    { value: '', label: 'Select a subject' },
    { value: 'join', label: 'I want to join' },
    { value: 'volunteer', label: 'Volunteering opportunities' },
    { value: 'event', label: 'Event information' },
    { value: 'partnership', label: 'Partnership inquiry' },
    { value: 'other', label: 'Other' }
  ]

  const faqs = [
    {
      question: "Who can join Youth 4 Elders?",
      answer: "We welcome all uOttawa students who are passionate about bridging generational gaps and making a positive impact in our community. Whether you're an undergraduate, graduate student, or alumni, there's a place for you. We also welcome elders from the community to participate in our programs and activities. No prior experience is necessary - just enthusiasm and a willingness to connect across generations!"
    },
    {
      question: "How do I join as a community member/volunteer?",
      answer: "To join as a community volunteer, simply fill out the form on our 'Join Us' page! We welcome all uOttawa students who want to volunteer and participate in our events. You can also reach out to us via email or Instagram, or attend one of our events to meet the team and learn more. As a community member, you'll receive updates about upcoming events and can participate as your schedule allows."
    },
    {
      question: "How do I join the executive team?",
      answer: "Applications to join the executive team are currently closed. Applications will open in 2026, typically at the end of the school year or during the summer. When applications reopen, we'll post information on our Instagram and website. Executive team positions typically involve an application process and interview. If you're interested in joining the exec team, follow us on Instagram @youth4elders to stay updated on when applications open again."
    },
    {
      question: "What activities do you organize?",
      answer: "We organize workshops, storytelling sessions, technology help sessions, craft fairs, and various intergenerational activities that bring youth and elders together. Our events range from one-time workshops to ongoing programs throughout the semester. Community volunteers can help facilitate these activities and engage with participants."
    },
    {
      question: "Do I need special skills to join as a volunteer?",
      answer: "Not at all! We value enthusiasm, empathy, and a willingness to learn. Whether you're tech-savvy, crafty, or just great at listening, there's a place for you here. We provide training and support for all our volunteers. As a community member, you can contribute in whatever way feels comfortable to you."
    },
    {
      question: "How often do you meet?",
      answer: "We organize events throughout the semester and meet regularly for planning sessions. Community volunteers can participate in events as their schedule allows - there's no mandatory meeting requirement. Executive team members have regular planning meetings. Follow us on Instagram for the latest updates on upcoming events and meetings."
    },
    {
      question: "Can elders participate in your programs?",
      answer: "Absolutely! Our programs are designed to bring youth and elders together. If you're an elder interested in participating, please reach out to us via email or Instagram, and we'll be happy to include you in our upcoming activities."
    },
    {
      question: "How can I stay updated on events?",
      answer: "The best way to stay updated is to follow us on Instagram @youth4elders. We post regular updates about upcoming events, meeting times, and opportunities to get involved. You can also reach out via email to be added to our mailing list, or fill out the 'Join Us' form to receive updates."
    }
  ]

  const toggleFAQ = (index: number) => {
    setOpenFAQ(openFAQ === index ? null : index)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate form submission (replace with actual API call)
    setTimeout(() => {
      setIsSubmitting(false)
      setSubmitSuccess(true)
      setFormData({ name: '', email: '', subject: '', message: '' })
      setTimeout(() => setSubmitSuccess(false), 5000)
    }, 1000)
  }

  return (
    <main className="min-h-screen" style={{ background: 'var(--color-cream)' }}>
      {/* Contact Form and Info Section */}
      <section className="py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Contact Form */}
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-8" style={{ fontFamily: 'var(--font-vintage-stylist)', color: 'var(--color-brown-dark)' }}>
                Send us a Message
              </h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block mb-2 text-sm font-semibold" style={{ fontFamily: 'var(--font-kollektif)', color: 'var(--color-brown-dark)' }}>
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border-2 transition-all duration-300 focus:outline-none focus:ring-2"
                    style={{
                      background: 'var(--color-cream)',
                      borderColor: 'rgba(152, 90, 64, 0.3)',
                      fontFamily: 'var(--font-kollektif)',
                      color: 'var(--color-brown-dark)'
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = 'var(--color-pink-medium)'
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(152, 90, 64, 0.3)'
                    }}
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block mb-2 text-sm font-semibold" style={{ fontFamily: 'var(--font-kollektif)', color: 'var(--color-brown-dark)' }}>
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border-2 transition-all duration-300 focus:outline-none focus:ring-2"
                    style={{
                      background: 'var(--color-cream)',
                      borderColor: 'rgba(152, 90, 64, 0.3)',
                      fontFamily: 'var(--font-kollektif)',
                      color: 'var(--color-brown-dark)'
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = 'var(--color-pink-medium)'
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(152, 90, 64, 0.3)'
                    }}
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block mb-2 text-sm font-semibold" style={{ fontFamily: 'var(--font-kollektif)', color: 'var(--color-brown-dark)' }}>
                    Subject
                  </label>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setIsSubjectDropdownOpen(!isSubjectDropdownOpen)}
                      className="w-full py-3 rounded-lg border-2 focus:outline-none focus:ring-2 transition-all duration-200 text-left flex items-center relative"
                    style={{
                        borderColor: formData.subject 
                          ? 'var(--color-pink-medium)' 
                          : 'rgba(152, 90, 64, 0.3)',
                        fontFamily: 'var(--font-kollektif)',
                      background: 'var(--color-cream)',
                        color: formData.subject ? 'var(--color-brown-dark)' : '#999',
                        paddingLeft: '1rem',
                        paddingRight: '3rem'
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = 'var(--color-pink-medium)'
                        e.currentTarget.style.boxShadow = '0 0 0 3px rgba(244, 142, 184, 0.1)'
                    }}
                    onBlur={(e) => {
                        setTimeout(() => {
                          setIsSubjectDropdownOpen(false)
                          if (e.currentTarget) {
                            e.currentTarget.style.borderColor = formData.subject 
                              ? 'var(--color-pink-medium)' 
                              : 'rgba(152, 90, 64, 0.3)'
                            e.currentTarget.style.boxShadow = 'none'
                          }
                        }, 200)
                      }}
                    >
                      <span>
                        {formData.subject 
                          ? subjectOptions.find(opt => opt.value === formData.subject)?.label
                          : subjectOptions[0]?.label || 'Select a subject'}
                      </span>
                      <svg
                        className={`transition-transform duration-200 ${isSubjectDropdownOpen ? 'rotate-180' : ''}`}
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        style={{
                          color: 'var(--color-pink-medium)',
                          marginLeft: '0.75rem',
                          flexShrink: 0,
                          position: 'absolute',
                          right: '1rem',
                          pointerEvents: 'none'
                        }}
                      >
                        <path
                          d="M4 6L8 10L12 6"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                    {isSubjectDropdownOpen && (
                      <div
                        className="absolute z-50 w-full mt-1 rounded-lg border-2 shadow-lg max-h-60 overflow-auto"
                        style={{
                          background: 'var(--color-cream)',
                          borderColor: 'var(--color-pink-medium)',
                          boxShadow: '0 8px 24px rgba(244, 142, 184, 0.2)'
                        }}
                      >
                        {subjectOptions.map((option) => {
                          if (option.value === '') return null // Skip the placeholder option
                          return (
                            <button
                              key={option.value}
                              type="button"
                              onClick={() => {
                                setFormData(prev => ({
                                  ...prev,
                                  subject: option.value
                                }))
                                setIsSubjectDropdownOpen(false)
                              }}
                              className="w-full text-left px-4 py-3 hover:bg-opacity-10 transition-colors"
                              style={{
                                fontFamily: 'var(--font-kollektif)',
                                color: formData.subject === option.value ? 'var(--color-pink-medium)' : 'var(--color-brown-dark)',
                                background: formData.subject === option.value 
                                  ? 'rgba(244, 142, 184, 0.1)'
                                  : 'transparent'
                              }}
                              onMouseEnter={(e) => {
                                if (formData.subject !== option.value) {
                                  e.currentTarget.style.background = 'rgba(244, 142, 184, 0.05)'
                                }
                              }}
                              onMouseLeave={(e) => {
                                if (formData.subject !== option.value) {
                                  e.currentTarget.style.background = 'transparent'
                                }
                              }}
                            >
                              {option.label}
                            </button>
                          )
                        })}
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label htmlFor="message" className="block mb-2 text-sm font-semibold" style={{ fontFamily: 'var(--font-kollektif)', color: 'var(--color-brown-dark)' }}>
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 rounded-lg border-2 transition-all duration-300 focus:outline-none focus:ring-2 resize-none"
                    style={{
                      background: 'var(--color-cream)',
                      borderColor: 'rgba(152, 90, 64, 0.3)',
                      fontFamily: 'var(--font-kollektif)',
                      color: 'var(--color-brown-dark)'
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = 'var(--color-pink-medium)'
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(152, 90, 64, 0.3)'
                    }}
                  />
                </div>

                {submitSuccess && (
                  <div className="p-4 rounded-lg" style={{ background: 'rgba(76, 175, 80, 0.1)', border: '2px solid rgba(76, 175, 80, 0.3)' }}>
                    <p className="text-sm font-semibold" style={{ fontFamily: 'var(--font-leiko)', color: '#4CAF50' }}>
                      ✓ Message sent successfully! We&apos;ll get back to you soon.
                    </p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    background: isSubmitting ? 'var(--color-brown-medium)' : 'var(--color-pink-medium)',
                    color: 'white',
                    fontFamily: 'var(--font-freshwost)',
                    border: '2px solid transparent'
                  }}
                  onMouseEnter={(e) => {
                    if (!isSubmitting) {
                      e.currentTarget.style.borderColor = '#D85A8F'
                      e.currentTarget.style.background = '#D85A8F'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isSubmitting) {
                      e.currentTarget.style.borderColor = 'transparent'
                      e.currentTarget.style.background = 'var(--color-pink-medium)'
                    }
                  }}
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </div>

            {/* Contact Information */}
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-8" style={{ fontFamily: 'var(--font-vintage-stylist)', color: 'var(--color-brown-dark)' }}>
                Contact Information
              </h2>
              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-semibold mb-4" style={{ fontFamily: 'var(--font-freshwost)', color: 'var(--color-brown-dark)' }}>
                    Email
                  </h3>
                  <a
                    href="mailto:youth4elders@gmail.com"
                    className="text-lg transition-colors duration-300 inline-flex items-center gap-2"
                    style={{ fontFamily: 'var(--font-kollektif)', color: 'var(--color-brown-medium)' }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = 'var(--color-pink-medium)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = 'var(--color-brown-medium)'
                    }}
                  >
                    youth4elders@gmail.com
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </a>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-4" style={{ fontFamily: 'var(--font-freshwost)', color: 'var(--color-brown-dark)' }}>
                    Social Media
                  </h3>
                  <div className="space-y-3">
                    <a
                      href="https://www.instagram.com/youth4elders/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-lg transition-colors duration-300 inline-flex items-center gap-2"
                      style={{ fontFamily: 'var(--font-kollektif)', color: 'var(--color-brown-medium)' }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = 'var(--color-pink-medium)'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = 'var(--color-brown-medium)'
                      }}
                    >
                      @youth4elders
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                      </svg>
                    </a>
                    <div>
                      <a
                        href="https://www.linkedin.com/company/youth4elders"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-lg transition-colors duration-300 inline-flex items-center gap-2"
                        style={{ fontFamily: 'var(--font-kollektif)', color: 'var(--color-brown-medium)' }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.color = 'var(--color-pink-medium)'
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.color = 'var(--color-brown-medium)'
                        }}
                      >
                        LinkedIn
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>

                <div className="pt-8 border-t" style={{ borderColor: 'rgba(152, 90, 64, 0.2)' }}>
                  <p className="text-base leading-relaxed" style={{ fontFamily: 'var(--font-leiko)', color: 'var(--color-brown-dark)', opacity: 0.8 }}>
                    We typically respond within 24-48 hours. For urgent matters, please reach out via Instagram DM for faster response.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-12 md:py-20" style={{ background: 'var(--color-cream)' }}>
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ fontFamily: 'var(--font-vintage-stylist)', color: 'var(--color-brown-dark)' }}>
              Frequently Asked Questions
            </h2>
            <p className="text-lg" style={{ fontFamily: 'var(--font-leiko)', color: 'var(--color-brown-dark)', opacity: 0.8 }}>
              Find answers to common questions about Youth 4 Elders
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="group relative p-6 md:p-8 rounded-2xl transition-all duration-300 cursor-pointer"
                style={{
                  background: 'var(--color-cream)',
                  border: '2px solid rgba(152, 90, 64, 0.15)',
                  boxShadow: '0 2px 12px rgba(0, 0, 0, 0.05)'
                }}
                onClick={() => toggleFAQ(index)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--color-pink-medium)'
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(244, 142, 184, 0.2)'
                  e.currentTarget.style.transform = 'translateY(-4px)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(152, 90, 64, 0.15)'
                  e.currentTarget.style.boxShadow = '0 2px 12px rgba(0, 0, 0, 0.05)'
                  e.currentTarget.style.transform = 'translateY(0)'
                }}
              >
                {/* Question Number */}
                <div className="flex items-start gap-4 mb-4">
                  <div 
                    className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg transition-all duration-300"
                    style={{
                      background: openFAQ === index ? 'var(--color-pink-medium)' : 'rgba(244, 142, 184, 0.15)',
                      color: openFAQ === index ? 'white' : 'var(--color-pink-medium)',
                      fontFamily: 'var(--font-kollektif)'
                    }}
                  >
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <h3 
                      className="text-xl font-bold mb-3 transition-colors duration-300"
                      style={{
                        fontFamily: 'var(--font-freshwost)',
                        color: openFAQ === index ? 'var(--color-pink-medium)' : 'var(--color-brown-dark)'
                      }}
                    >
                      {faq.question}
                    </h3>
                  </div>
                  <svg
                    className={`w-6 h-6 transition-transform duration-300 flex-shrink-0 mt-1`}
                    style={{
                      transform: openFAQ === index ? 'rotate(180deg)' : 'rotate(0deg)',
                      color: 'var(--color-pink-medium)'
                    }}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>

                {/* Answer */}
                <div
                  className="overflow-hidden transition-all duration-500 ease-in-out"
                  style={{
                    maxHeight: openFAQ === index ? '300px' : '0',
                    opacity: openFAQ === index ? 1 : 0,
                    marginTop: openFAQ === index ? '1rem' : '0'
                  }}
                >
                  <div className="pl-14">
                    <div 
                      className="h-px mb-4 transition-all duration-300"
                      style={{
                        width: openFAQ === index ? '100%' : '0%',
                        background: 'rgba(152, 90, 64, 0.2)'
                      }}
                    />
                    <p
                      className="text-base leading-relaxed whitespace-pre-line"
                      style={{
                        fontFamily: 'var(--font-leiko)',
                        color: 'var(--color-brown-dark)',
                        opacity: 0.8
                      }}
                    >
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
