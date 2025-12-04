'use client'

import { useState } from 'react'

export default function Contact() {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null)

  const faqs = [
    {
      question: "HOW TO JOIN?",
      answer: "Simply reach out to us via email or Instagram! We welcome all uOttawa students who are passionate about bridging generational gaps and making a positive impact in our community."
    },
    {
      question: "WHAT ACTIVITIES?",
      answer: "We organize workshops, storytelling sessions, technology help sessions, craft fairs, and various intergenerational activities that bring youth and elders together."
    },
    {
      question: "SPECIAL SKILLS?",
      answer: "Not at all! We value enthusiasm, empathy, and a willingness to learn. Whether you're tech-savvy, crafty, or just great at listening, there's a place for you here."
    },
    {
      question: "MEETING FREQUENCY?",
      answer: "We organize events throughout the semester and meet regularly for planning sessions. Follow us on Instagram for the latest updates on upcoming events and meetings."
    }
  ]

  const toggleFAQ = (index: number) => {
    setOpenFAQ(openFAQ === index ? null : index)
  }
  return (
    <main className="min-h-screen relative overflow-hidden" style={{ background: 'var(--color-cream)' }}>
      {/* Soft Pink Flower at Top */}
      <div className="absolute top-8 left-1/2 transform -translate-x-1/2 w-32 h-32 opacity-80">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <path d="M50 20 L55 35 L70 35 L60 45 L65 60 L50 50 L35 60 L40 45 L30 35 L45 35 Z" 
                fill="#F8B4CB" opacity="0.8"/>
          <path d="M50 15 L52 25 L62 25 L55 30 L58 40 L50 35 L42 40 L45 30 L38 25 L48 25 Z" 
                fill="#F8B4CB" opacity="0.6"/>
        </svg>
      </div>
      
      <div className="max-w-6xl mx-auto relative z-10 pt-32 pb-16 px-8">
        <h1 className="text-5xl font-bold mb-16 text-center" style={{ fontFamily: 'var(--font-playfair)', color: '#6B5D4F' }}>
          Frequently Asked Questions
        </h1>
        
        {/* Three Column Layout */}
        <section className="mb-20">
          <div className="grid md:grid-cols-3 gap-12 max-w-5xl mx-auto">
            {/* How to Join Column */}
            <div className="text-center space-y-6">
              <div className="flex justify-center">
                <div className="w-20 h-20 flex items-center justify-center">
                  <svg className="w-16 h-16" style={{ color: '#8B6F5E' }} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                  </svg>
                </div>
              </div>
              <h3 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-playfair)', color: '#F8B4CB' }}>
                How can I join?
              </h3>
              <p className="text-lg leading-relaxed" style={{ fontFamily: 'var(--font-lato)', color: '#9D7A6B' }}>
                Simply reach out to us via email or Instagram! We welcome all uOttawa students who are passionate about bridging generational gaps and making a positive impact in our community.
              </p>
            </div>

            {/* What Activities Column */}
            <div className="text-center space-y-6">
              <div className="flex justify-center">
                <div className="w-20 h-20 flex items-center justify-center">
                  <svg className="w-16 h-16" style={{ color: '#9D7A6B' }} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                  </svg>
                </div>
              </div>
              <h3 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-playfair)', color: '#F8B4CB' }}>
                What activities do you organize?
              </h3>
              <p className="text-lg leading-relaxed" style={{ fontFamily: 'var(--font-lato)', color: '#7A5C5C' }}>
                We organize workshops, storytelling sessions, technology help sessions, craft fairs, and various intergenerational activities that bring youth and elders together.
              </p>
            </div>

            {/* Meeting Frequency Column */}
            <div className="text-center space-y-6">
              <div className="flex justify-center">
                <div className="w-20 h-20 flex items-center justify-center">
                  <svg className="w-16 h-16" style={{ color: '#A68B7D' }} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
                  </svg>
                </div>
              </div>
              <h3 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-playfair)', color: '#F8B4CB' }}>
                How often do you meet?
              </h3>
              <p className="text-lg leading-relaxed" style={{ fontFamily: 'var(--font-lato)', color: '#8B6F5E' }}>
                We organize events throughout the semester and meet regularly for planning sessions. Follow us on Instagram for the latest updates on upcoming events and meetings.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="mb-16">
          <div className="text-center space-y-8">
            <h2 className="text-3xl font-bold" style={{ fontFamily: 'var(--font-playfair)', color: '#6B5D4F' }}>
              Ready to get started?
            </h2>
            <p className="text-lg max-w-2xl mx-auto" style={{ fontFamily: 'var(--font-lato)', color: '#9D7A6B' }}>
              Have a question or want to collaborate? We&apos;d love to hear from you!
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <a 
                href="mailto:youth4elders@gmail.com"
                className="border-2 px-8 py-3 rounded-lg font-semibold text-white transition-colors"
                style={{ borderColor: '#8B6F5E', background: '#8B6F5E' }}
              >
                Email Us
              </a>
              <a 
                href="https://www.instagram.com/youth4elders/"
                target="_blank"
                rel="noopener noreferrer"
                className="border-2 px-8 py-3 rounded-lg font-semibold text-white transition-colors"
                style={{ borderColor: '#9D7A6B', background: '#9D7A6B' }}
              >
                Follow Us
              </a>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}
