'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'

export default function ClubInfo() {
  const [isVisible, setIsVisible] = useState(false)
  const [clubBasicsStep, setClubBasicsStep] = useState(0)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  // Sticky + reveal scroll distances (vh).
  const HERO_SCROLL_VH = 105
  const SECOND_SECTION_SCROLL_VH = 160
  const SCROLL_WRAPPER_HEIGHT_VH = HERO_SCROLL_VH + SECOND_SECTION_SCROLL_VH

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
            alignItems: 'center',
            boxSizing: 'border-box',
            // Keep generous spacing, but let the hero content breathe.
            paddingTop: 'clamp(84px, 8vh, 120px)',
            paddingBottom: 'clamp(120px, 16vh, 320px)',
            background: 'var(--color-cream)', 
          }}
        >
          <div className="max-w-screen-2xl mx-auto px-6 md:px-10 w-full flex items-center pt-0 pb-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-12 lg:gap-16 w-full">
              
              {/* Left Column - Photo */}
              <div 
                className="relative w-full flex items-center md:items-stretch transition-all duration-1000"
                style={{
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible ? 'translateX(0)' : 'translateX(-30px)',
                  transitionDelay: '200ms'
                }}
              >
                <div
                  className="relative w-full h-[52vh] sm:h-[58vh] md:h-[64vh] lg:h-[70vh] rounded-3xl overflow-hidden border"
                  style={{
                    boxShadow: '0 10px 28px rgba(100, 50, 27, 0.16)',
                    borderColor: 'rgba(91, 59, 30, 0.18)',
                  }}
                >
                  <Image
                    src="/assets/club-info/signing.jpg"
                    alt="Members signing up at a Youth 4 Elders event"
                    fill
                    priority
                    sizes="(max-width: 768px) 100vw, 50vw"
                    style={{ objectFit: 'cover' }}
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
                    {/* stamp removed */}
                  </div>
                </div>
              </div>

            {/* Right Column - About Us Text */}
            <div 
              className="relative flex items-stretch transition-all duration-1000 w-full"
              style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateX(0)' : 'translateX(30px)',
                transitionDelay: '400ms'
              }}
            >
              <div className="w-full h-full flex flex-col justify-center py-2 md:py-0">
                <blockquote
                  className="text-4xl md:text-5xl lg:text-6xl leading-[1.05]"
                  style={{ fontFamily: 'var(--font-vintage-stylist)', color: 'var(--color-brown-dark)' }}
                >
                  <span style={{ opacity: 0.9 }}>“</span>
                  <span className="font-bold italic">
                    We&apos;re not just a club — we&apos;re your community partners.
                  </span>
                  <span style={{ opacity: 0.9 }}>”</span>
                </blockquote>

                <div className="w-24 h-[2px] my-7" style={{ background: 'rgba(91, 59, 30, 0.25)' }} />

                <p
                  className="text-2xl md:text-3xl leading-relaxed"
                  style={{ fontFamily: 'var(--font-leiko)', color: 'var(--color-brown-dark)', opacity: 0.92 }}
                >
                  We bring youth and elders together through welcoming programs that make connection feel easy—and meaningful.
                </p>

                <p
                  className="mt-5 text-lg md:text-xl leading-relaxed"
                  style={{ fontFamily: 'var(--font-leiko)', color: 'var(--color-brown-dark)', opacity: 0.82 }}
                >
                  A student-led club focused on connection, community, and care.
                </p>
              </div>
            </div>
            </div>
          </div>
        </section>

        {/* Second section (redesigned): Founders + Impact (scroll-reveal over hero) */}
        <section 
          className="relative py-16 md:py-24"
          style={{ 
            position: 'absolute', 
            top: `${HERO_SCROLL_VH}vh`,
            left: 0,
            right: 0,
            width: '100%',
            height: `${SECOND_SECTION_SCROLL_VH}vh`,
            background: 'var(--color-pink-light)',
            zIndex: 3,
            pointerEvents: 'auto',
          }}
        >
          <div className="max-w-6xl mx-auto px-8 relative">
            <div className="mb-10 md:mb-12">
              <p
                className="text-sm md:text-base uppercase tracking-widest mb-3"
                style={{
                  fontFamily: 'var(--font-kollektif)',
                  color: 'var(--color-brown-dark)',
                  letterSpacing: '0.2em',
                }}
              >
                Our story
              </p>
              <h2
                className="text-4xl md:text-5xl lg:text-6xl font-bold italic"
                style={{ fontFamily: 'var(--font-vintage-stylist)', color: 'var(--color-brown-dark)' }}
              >
                Founders
              </h2>
              <p
                className="mt-3 text-base md:text-lg leading-relaxed max-w-3xl"
                style={{ fontFamily: 'var(--font-leiko)', color: 'var(--color-brown-dark)', opacity: 0.88 }}
              >
                Founders (left to right): Julia, Peter.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-start">
              {/* Photo */}
              <div className="w-full max-w-xl mx-auto lg:mx-0">
                <div
                  className="relative w-full h-[420px] md:h-[520px] rounded-3xl overflow-hidden"
                  style={{ boxShadow: '0 12px 34px rgba(100, 50, 27, 0.16)' }}
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
                        'linear-gradient(to top, rgba(91, 59, 30, 0.18) 0%, rgba(91, 59, 30, 0.0) 72%)',
                    }}
                  />
                </div>
              </div>

              {/* Text */}
              <div className="pt-2 md:pt-4">
                <p
                  className="text-lg md:text-xl leading-relaxed"
                  style={{ fontFamily: 'var(--font-leiko)', color: 'var(--color-brown-dark)', opacity: 0.92 }}
                >
                  Youth 4 Elders started when we noticed the same thing everywhere: youth wanted ways to give back, and elders wanted connection that felt warm,
                  consistent, and genuinely two-way.
                </p>

                <p
                  className="mt-6 text-lg md:text-xl leading-relaxed"
                  style={{ fontFamily: 'var(--font-leiko)', color: 'var(--color-brown-dark)', opacity: 0.92 }}
                >
                  We began with small meet-ups and simple activities. Over time, we shaped a repeatable format—so volunteers can lead confidently and every visit
                  feels comfortable, familiar, and welcoming.
                </p>

                <div className="mt-10 pt-8 border-t" style={{ borderColor: 'rgba(91, 59, 30, 0.18)' }}>
                  <p
                    className="text-xs md:text-sm uppercase tracking-widest mb-5"
                    style={{ fontFamily: 'var(--font-kollektif)', color: 'rgba(91, 59, 30, 0.70)', letterSpacing: '0.2em' }}
                  >
                    What we focus on
                  </p>
                  <ul
                    className="space-y-4"
                    style={{ fontFamily: 'var(--font-leiko)', color: 'var(--color-brown-dark)', opacity: 0.92 }}
                  >
                    <li>
                      <span style={{ fontWeight: 700 }}>Start small.</span> Conversation, crafts, and tech help—focused on comfort and kindness.
                    </li>
                    <li>
                      <span style={{ fontWeight: 700 }}>Show up consistently.</span> Familiar formats help new faces join and returning faces feel at home.
                    </li>
                    <li>
                      <span style={{ fontWeight: 700 }}>Grow with partners.</span> Collaborate with community spaces while keeping the small-group feel.
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* (Intentionally kept simple: no extra blocks here) */}
          </div>
        </section>
      </div>

      <section 
        className="pt-14 pb-8 md:pt-20 md:pb-12"
        style={{
          position: 'relative',
          zIndex: 4,
          background: 'var(--color-cream)'
        }}
      >
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center mb-8 md:mb-10">
            <p 
              className="text-xs md:text-sm uppercase tracking-widest mb-4"
              style={{ 
                fontFamily: 'var(--font-kollektif)', 
                color: 'var(--color-brown-dark)',
                letterSpacing: '0.2em'
              }}
            >
              Club basics
            </p>
            <h2 
              className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 max-w-4xl mx-auto leading-tight"
              style={{ 
                fontFamily: 'var(--font-vintage-stylist)', 
                color: 'var(--color-brown-dark)'
              }}
            >
              Three quick things to know.
            </h2>
          </div>

          {/* Carousel (not sticky; click dots to switch) */}
          <div className="flex justify-center">
            <div className="w-full max-w-6xl">
              <div
                className="relative overflow-hidden rounded-[32px] border"
                style={{
                  borderColor: 'rgba(91, 59, 30, 0.18)',
                  background: 'rgba(229, 181, 189, 0.10)',
                  boxShadow: '0 14px 34px rgba(100, 50, 27, 0.10)',
                }}
              >
                <div
                  className="flex"
                  style={{
                    width: '300%',
                    transform: `translateX(-${clubBasicsStep * (100 / 3)}%)`,
                    transition: 'transform 420ms cubic-bezier(0.22, 1, 0.36, 1)',
                  }}
                >
                  {[
                    {
                      kicker: '01',
                      title: 'Point of the club',
                      body: 'Make intergenerational connection normal—not rare. We create low-pressure ways to meet and build relationships that last.',
                    },
                    {
                      kicker: '02',
                      title: 'How it works',
                      body: 'Attend our events and workshops anytime. Want to be more involved? Join as a volunteer/member and help support visits and activities.',
                    },
                    {
                      kicker: '03',
                      title: 'What we do',
                      body: 'Tech support, hands-on workshops, storytelling, and community events—designed for conversation and connection.',
                    },
                  ].map((card) => (
                    <div key={card.kicker} className="w-1/3 p-10 md:p-14">
                      <p
                        className="text-xs uppercase tracking-widest"
                        style={{ fontFamily: 'var(--font-kollektif)', color: 'rgba(91, 59, 30, 0.65)', letterSpacing: '0.25em' }}
                      >
                        {card.kicker}
                      </p>
                      <p
                        className="mt-4 text-4xl md:text-5xl leading-[1.05]"
                        style={{ fontFamily: 'var(--font-vintage-stylist)', color: 'var(--color-brown-dark)' }}
                      >
                        {card.title}
                      </p>
                      <p
                        className="mt-5 text-lg md:text-xl leading-relaxed max-w-2xl"
                        style={{ fontFamily: 'var(--font-leiko)', color: 'var(--color-brown-dark)', opacity: 0.9 }}
                      >
                        {card.body}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
                  {[0, 1, 2].map((i) => (
                    <button
                      key={i}
                      type="button"
                      aria-label={`Show club basics slide ${i + 1}`}
                      onClick={() => setClubBasicsStep(i)}
                      className="w-3 h-3 rounded-full"
                      style={{
                        background: clubBasicsStep === i ? 'var(--color-brown-dark)' : 'rgba(91, 59, 30, 0.25)',
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}