'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function Contact() {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
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
      setFormData({ name: '', email: '', phone: '', message: '' })
      setTimeout(() => setSubmitSuccess(false), 5000)
    }, 1000)
  }

  return (
    <main className="min-h-screen" style={{ background: 'var(--color-cream)' }}>
      {/* Header Banner Section */}
      <section className="relative h-[250px] md:h-[300px] flex items-center justify-center">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url(/assets/header.jpg)',
            filter: 'blur(2px)',
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        />
        <div className="absolute inset-0" style={{ background: 'rgba(0, 0, 0, 0.4)' }} />
        <div className="relative z-10 text-center">
          <h1 
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-3"
            style={{ 
              fontFamily: 'var(--font-vintage-stylist)', 
              color: 'white',
              textShadow: '0 2px 10px rgba(0, 0, 0, 0.3)'
            }}
          >
            Our Contact
          </h1>
          <div className="flex items-center justify-center gap-2 text-xs md:text-sm">
            <Link 
              href="/" 
              className="hover:opacity-80 transition-opacity"
              style={{ fontFamily: 'var(--font-kollektif)', color: 'white' }}
            >
              HOME
            </Link>
            <span style={{ color: 'white', opacity: 0.7 }}> • </span>
            <span 
              className="font-semibold"
              style={{ fontFamily: 'var(--font-kollektif)', color: 'white' }}
            >
              CONTACT
            </span>
          </div>
        </div>
      </section>

      {/* Get in Touch Section */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left Column - Contact Info */}
            <div>
              <h2 
                className="text-4xl md:text-5xl font-bold mb-6"
                style={{ 
                  fontFamily: 'var(--font-vintage-stylist)', 
                  color: 'var(--color-brown-dark)'
                }}
              >
                Get in Touch
              </h2>
              <p 
                className="text-base md:text-lg mb-8 leading-relaxed"
                style={{ 
                  fontFamily: 'var(--font-kollektif)', 
                  color: 'var(--color-brown-medium)',
                  lineHeight: '1.7'
                }}
              >
                We&apos;d love to hear from you! Whether you&apos;re interested in joining our community, volunteering, or have questions about our programs, feel free to reach out.
              </p>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <svg className="w-6 h-6 flex-shrink-0 mt-1" style={{ color: 'var(--color-brown-medium)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <div>
                    <p 
                      className="text-base leading-relaxed"
                      style={{ 
                        fontFamily: 'var(--font-kollektif)', 
                        color: 'var(--color-brown-dark)'
                      }}
                    >
                      University of Ottawa<br />
                      75 Laurier Ave E<br />
                      Ottawa, ON K1N 6N5, Canada
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <svg className="w-6 h-6 flex-shrink-0 mt-1" style={{ color: 'var(--color-brown-medium)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <div>
                    <a 
                      href="mailto:youth4elders@gmail.com"
                      className="text-base hover:opacity-80 transition-opacity"
                      style={{ 
                        fontFamily: 'var(--font-kollektif)', 
                        color: 'var(--color-brown-dark)'
                      }}
                    >
                      youth4elders@gmail.com
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Image */}
            <div className="relative h-[400px] md:h-[500px] rounded-lg overflow-hidden">
              <div 
                className="w-full h-full bg-cover bg-center"
                style={{
                  backgroundImage: 'url(/assets/header.jpg)',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Send Us a Message Section */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Left Column - Contact Form (Dark Green Background) */}
            <div 
              className="p-8 md:p-10 rounded-lg"
              style={{ 
                background: 'var(--color-brown-medium)',
                boxShadow: '0 8px 24px rgba(188, 87, 39, 0.2)'
              }}
            >
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <input
                    type="text"
                    name="name"
                    placeholder="Your Name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-0 py-4 bg-transparent border-b-2 focus:outline-none transition-all"
                    style={{
                      borderColor: 'rgba(234, 225, 203, 0.3)',
                      fontFamily: 'var(--font-kollektif)',
                      color: 'var(--color-cream)',
                      fontSize: '15px'
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = 'var(--color-cream)'
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(234, 225, 203, 0.3)'
                    }}
                  />
                </div>

                <div>
                  <input
                    type="email"
                    name="email"
                    placeholder="Your Email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-0 py-4 bg-transparent border-b-2 focus:outline-none transition-all"
                    style={{
                      borderColor: 'rgba(234, 225, 203, 0.3)',
                      fontFamily: 'var(--font-kollektif)',
                      color: 'var(--color-cream)',
                      fontSize: '15px'
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = 'var(--color-cream)'
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(234, 225, 203, 0.3)'
                    }}
                  />
                </div>

                <div>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Your Phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-0 py-4 bg-transparent border-b-2 focus:outline-none transition-all"
                    style={{
                      borderColor: 'rgba(234, 225, 203, 0.3)',
                      fontFamily: 'var(--font-kollektif)',
                      color: 'var(--color-cream)',
                      fontSize: '15px'
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = 'var(--color-cream)'
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(234, 225, 203, 0.3)'
                    }}
                  />
                </div>

                <div>
                  <textarea
                    name="message"
                    placeholder="Your Message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={6}
                    className="w-full px-0 py-4 bg-transparent border-b-2 focus:outline-none transition-all resize-none"
                    style={{
                      borderColor: 'rgba(234, 225, 203, 0.3)',
                      fontFamily: 'var(--font-kollektif)',
                      color: 'var(--color-cream)',
                      fontSize: '15px'
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = 'var(--color-cream)'
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(234, 225, 203, 0.3)'
                    }}
                  />
                </div>

                {submitSuccess && (
                  <div className="p-4 rounded-lg" style={{ background: 'rgba(76, 175, 80, 0.2)', border: '1px solid rgba(76, 175, 80, 0.4)' }}>
                    <p className="text-sm font-semibold" style={{ fontFamily: 'var(--font-kollektif)', color: '#4CAF50' }}>
                      ✓ Message sent successfully! We&apos;ll get back to you soon.
                    </p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full px-8 py-4 rounded-lg font-semibold text-base transition-all duration-300 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    background: 'var(--color-cream)',
                    color: 'var(--color-brown-medium)',
                    fontFamily: 'var(--font-kollektif)',
                    border: '2px solid var(--color-cream)'
                  }}
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </div>

            {/* Right Column - Message Details */}
            <div>
              <div className="mb-3">
                <span 
                  className="text-xs font-semibold tracking-wider uppercase"
                  style={{
                    fontFamily: 'var(--font-kollektif)',
                    color: 'var(--color-brown-medium)',
                    letterSpacing: '0.15em'
                  }}
                >
                  CONTACT
                </span>
              </div>
              <h2 
                className="text-4xl md:text-5xl font-bold mb-6"
                style={{ 
                  fontFamily: 'var(--font-vintage-stylist)', 
                  color: 'var(--color-brown-dark)'
                }}
              >
                Send Us a Message
              </h2>
              <p 
                className="text-base md:text-lg mb-8 leading-relaxed"
                style={{ 
                  fontFamily: 'var(--font-kollektif)', 
                  color: 'var(--color-brown-medium)',
                  lineHeight: '1.7'
                }}
              >
                Have questions or want to get involved? Fill out the form and we&apos;ll get back to you as soon as possible. We typically respond within 24-48 hours.
              </p>
              
              <div className="mb-8">
                <h3 
                  className="text-xl font-bold mb-4"
                  style={{ 
                    fontFamily: 'var(--font-vintage-stylist)', 
                    color: 'var(--color-brown-dark)'
                  }}
                >
                  Opening Hours
                </h3>
                <div className="space-y-2">
                  <p 
                    className="text-base"
                    style={{ 
                      fontFamily: 'var(--font-kollektif)', 
                      color: 'var(--color-brown-medium)'
                    }}
                  >
                    Monday - Friday, 9:00 AM - 4:30 PM
                  </p>
                  <p 
                    className="text-base"
                    style={{ 
                      fontFamily: 'var(--font-kollektif)', 
                      color: 'var(--color-brown-medium)'
                    }}
                  >
                    Weekend hours vary by event
                  </p>
                </div>
              </div>

              <div>
                <h3 
                  className="text-xl font-bold mb-4"
                  style={{ 
                    fontFamily: 'var(--font-vintage-stylist)', 
                    color: 'var(--color-brown-dark)'
                  }}
                >
                  Follow Us
                </h3>
                <div className="flex gap-3">
                  <a
                    href="https://www.instagram.com/youth4elders/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 rounded-full flex items-center justify-center transition-all hover:scale-110"
                    style={{ 
                      background: 'var(--color-brown-medium)',
                      color: 'var(--color-cream)'
                    }}
                    aria-label="Instagram"
                  >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                  </a>
                  <a
                    href="https://www.linkedin.com/company/youth4elders"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 rounded-full flex items-center justify-center transition-all hover:scale-110"
                    style={{ 
                      background: 'var(--color-brown-medium)',
                      color: 'var(--color-cream)'
                    }}
                    aria-label="LinkedIn"
                  >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Left Column - FAQ Introduction */}
            <div>
              <div className="mb-3">
                <span 
                  className="text-xs font-semibold tracking-wider uppercase"
                  style={{
                    fontFamily: 'var(--font-kollektif)',
                    color: 'var(--color-brown-medium)',
                    letterSpacing: '0.15em'
                  }}
                >
                  FAQS
                </span>
              </div>
              <h2 
                className="text-4xl md:text-5xl font-bold mb-6"
                style={{ 
                  fontFamily: 'var(--font-vintage-stylist)', 
                  color: 'var(--color-brown-dark)'
                }}
              >
                Frequently Asked Questions
              </h2>
              <p 
                className="text-base md:text-lg leading-relaxed"
                style={{ 
                  fontFamily: 'var(--font-kollektif)', 
                  color: 'var(--color-brown-medium)',
                  lineHeight: '1.7'
                }}
              >
                Find answers to common questions about Youth 4 Elders, our programs, and how to get involved. If you have additional questions, feel free to reach out to us.
              </p>
            </div>

            {/* Right Column - FAQ Accordion */}
            <div className="space-y-0">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className="border-b transition-all"
                  style={{ borderColor: 'rgba(188, 87, 39, 0.2)' }}
                >
                  <button
                    onClick={() => toggleFAQ(index)}
                    className="w-full py-6 flex items-center justify-between text-left group"
                  >
                    <h3 
                      className="text-lg font-semibold pr-8 flex-1"
                      style={{
                        fontFamily: 'var(--font-vintage-stylist)',
                        color: 'var(--color-brown-dark)'
                      }}
                    >
                      {faq.question}
                    </h3>
                    <svg
                      className={`w-5 h-5 flex-shrink-0 transition-transform duration-300 ${
                        openFAQ === index ? 'rotate-45' : 'rotate-0'
                      }`}
                      style={{ color: 'var(--color-brown-medium)' }}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                  <div
                    className="overflow-hidden transition-all duration-500 ease-in-out"
                    style={{
                      maxHeight: openFAQ === index ? '500px' : '0',
                      opacity: openFAQ === index ? 1 : 0
                    }}
                  >
                    <div className="pb-6">
                      <p
                        className="text-base leading-relaxed"
                        style={{
                          fontFamily: 'var(--font-kollektif)',
                          color: 'var(--color-brown-medium)',
                          lineHeight: '1.7'
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
        </div>
      </section>

      {/* Map Section */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12">
          <div className="mb-10 text-center">
            <div className="mb-3">
              <span 
                className="text-xs font-semibold tracking-wider uppercase"
                style={{
                  fontFamily: 'var(--font-kollektif)',
                  color: 'var(--color-brown-medium)',
                  letterSpacing: '0.15em'
                }}
              >
                LOCATION
              </span>
            </div>
            <h2 
              className="text-3xl md:text-4xl font-bold mb-4"
              style={{ 
                fontFamily: 'var(--font-vintage-stylist)', 
                color: 'var(--color-brown-dark)'
              }}
            >
              Find Us
            </h2>
            <p 
              className="text-base max-w-2xl mx-auto"
              style={{ 
                fontFamily: 'var(--font-kollektif)', 
                color: 'var(--color-brown-medium)'
              }}
            >
              Visit us at the University of Ottawa
            </p>
          </div>
          
          <div className="relative">
            <div 
              className="w-full h-[450px] md:h-[550px] rounded-2xl overflow-hidden border-2 shadow-xl"
              style={{ 
                borderColor: 'rgba(188, 87, 39, 0.2)',
                boxShadow: '0 12px 40px rgba(188, 87, 39, 0.15)'
              }}
            >
              <iframe
                src="https://www.google.com/maps?q=75+Laurier+Ave+E,+Ottawa,+ON+K1N+6N5&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
            
            {/* Decorative corner accents */}
            <div 
              className="absolute -top-2 -left-2 w-16 h-16 rounded-full opacity-20"
              style={{ background: 'var(--color-pink-medium)' }}
            />
            <div 
              className="absolute -bottom-2 -right-2 w-20 h-20 rounded-full opacity-20"
              style={{ background: 'var(--color-brown-medium)' }}
            />
          </div>
          
          <div className="mt-8 text-center">
            <a
              href="https://www.google.com/maps/dir/?api=1&destination=75+Laurier+Ave+E,+Ottawa,+ON+K1N+6N5"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all hover:scale-105"
              style={{
                background: 'var(--color-brown-medium)',
                color: 'var(--color-cream)',
                fontFamily: 'var(--font-kollektif)',
                boxShadow: '0 4px 12px rgba(188, 87, 39, 0.3)'
              }}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
              Get Directions
            </a>
          </div>
        </div>
      </section>
    </main>
  )
}
