'use client'

import Image from 'next/image'
import { useState, useEffect, useRef } from 'react'

interface TeamMember {
  name: string
  role: string
  category: 'Presidents' | 'Internal' | 'External' | 'Finance' | 'Marketing' | 'Events'
  yearOfStudy: number
  program: string
  funFact: string
  imageUrl?: string // Optional image URL, will use placeholder if not provided
  email?: string // Optional email
  linkedInUrl?: string // Optional LinkedIn profile URL
  focus?: {
    title: string
    points: Array<{ heading: string; description: string }>
  }
}

const teamMembers: TeamMember[] = [
  {
    name: 'Julia Diem Hum',
    role: 'Co-Founder & Co-President',
    category: 'Presidents',
    yearOfStudy: 3,
    program: 'Translational Molecular Medicine - TMM',
    funFact: 'Has met a mermaid',
    imageUrl: '/assets/team/julia.jpg',
    focus: {
      title: "Julia's Focus",
      points: [
        {
          heading: 'Creative connection.',
          description: 'Designing activities that feel welcoming, calm, and easy to join.'
        },
        {
          heading: 'Volunteer experience.',
          description: 'Making sure students feel prepared, supported, and confident with seniors.'
        },
        {
          heading: 'Community storytelling.',
          description: 'Sharing impact stories that highlight the relationships we build.'
        }
      ]
    }
  },
  {
    name: 'Peter Han',
    role: 'Co-Founder & Co-President',
    category: 'Presidents',
    yearOfStudy: 3,
    program: 'Translational Molecular Medicine - TMM',
    funFact: 'Loves Nigerian Jollof',
    imageUrl: '/assets/team/peter.jpg',
    focus: {
      title: "Peter's Focus",
      points: [
        {
          heading: 'Partnerships & outreach.',
          description: 'Building relationships with community spaces and campus partners.'
        },
        {
          heading: 'Program structure.',
          description: 'Keeping sessions organized, consistent, and easy to access.'
        },
        {
          heading: 'Long-term growth.',
          description: 'Planning sustainable initiatives that expand our reach responsibly.'
        }
      ]
    }
  },
  {
    name: 'Eamonn Deery',
    role: 'VP Marketing',
    category: 'Marketing',
    yearOfStudy: 3,
    program: 'Geology',
    funFact: 'TBD',
    imageUrl: '/assets/team/eamonn.jpg',
  },
  {
    name: 'Jenna Smith',
    role: 'VP External Affairs',
    category: 'External',
    yearOfStudy: 3,
    program: 'Health Sciences',
    funFact: 'TBD',
    imageUrl: '/assets/team/jenna.jpg',
  },
  {
    name: 'April Beaulieu',
    role: 'VP Bilingual Affairs',
    category: 'External',
    yearOfStudy: 3,
    program: 'Psychology',
    funFact: 'TBD',
  },
  {
    name: 'Lana Tran',
    role: 'Junior VP Finance',
    category: 'Finance',
    yearOfStudy: 2,
    program: 'Biomedical Sciences',
    funFact: 'TBD',
    imageUrl: '/assets/team/lana.jpg',
  },
  {
    name: 'Monica Mikhail',
    role: 'VP Events',
    category: 'Events',
    yearOfStudy: 4,
    program: 'Psychology',
    funFact: 'TBD',
    imageUrl: '/assets/team/monica.jpg',
  },
  {
    name: 'Cheyenne Hinds',
    role: 'VP of Equity & Sustainability',
    category: 'Internal',
    yearOfStudy: 3,
    program: 'Biomedical Sciences',
    funFact: 'TBD',
    imageUrl: '/assets/team/cheyenne.jpg',
  },
  {
    name: 'Santino Di Censo',
    role: 'VP Events',
    category: 'Events',
    yearOfStudy: 3,
    program: 'Biomedical Sciences',
    funFact: 'TBD',
    imageUrl: '/assets/team/santino.jpg',
  },
  {
    name: 'Leyna Trinh',
    role: 'VP Internal',
    category: 'Internal',
    yearOfStudy: 2,
    program: 'Biomedical Sciences',
    funFact: 'TBD',
    imageUrl: '/assets/team/leyna.jpg',
  },
  {
    name: 'Anwyn Friesen Kroeker',
    role: 'Events Director',
    category: 'Events',
    yearOfStudy: 3,
    program: 'Translational Molecular Medicine - TMM',
    funFact: 'TBD',
    imageUrl: '/assets/team/anwyn.jpg',
  },
  {
    name: 'Jakob Rogers',
    role: 'VP Community Engagement',
    category: 'External',
    yearOfStudy: 3,
    program: 'Health Sciences',
    funFact: 'TBD',
    imageUrl: '/assets/team/jakob.jpg',
  },
  {
    name: 'Marly Mikhail',
    role: 'Events Director',
    category: 'Events',
    yearOfStudy: 3,
    program: 'Translational Molecular Medicine - TMM',
    funFact: 'TBD',
    imageUrl: '/assets/team/marly.jpg',
  },
  {
    name: 'Ekin Atacan',
    role: 'VP Internal',
    category: 'Internal',
    yearOfStudy: 3,
    program: 'Translational Molecular Medicine - TMM',
    funFact: 'TBD',
  },
  {
    name: 'Bradley Dzimiri',
    role: 'VP Finance',
    category: 'Finance',
    yearOfStudy: 3,
    program: 'Economics',
    funFact: 'TBD',
    imageUrl: '/assets/team/bradley.jpg',
  },
]

type TeamCategory = TeamMember['category']

const CATEGORY_ORDER: TeamCategory[] = [
  'Presidents',
  'Internal',
  'External',
  'Events',
  'Finance',
  'Marketing',
]

const CATEGORY_META: Record<TeamCategory, { title: string; blurb: string }> = {
  Presidents: { title: 'Presidents', blurb: 'Founders steering the vision.' },
  Internal: { title: 'Internal', blurb: 'Culture, equity, and team operations.' },
  External: { title: 'External', blurb: 'Partnerships, outreach, and community ties.' },
  Events: { title: 'Events', blurb: 'Workshops and experiences that bring people together.' },
  Finance: { title: 'Finance', blurb: 'Budgeting and sustainable growth.' },
  Marketing: { title: 'Marketing', blurb: 'Storytelling and brand presence.' },
}

function roleRank(role: string) {
  const r = role.toLowerCase()
  if (r.includes('founder')) return 0
  if (r.includes('president')) return 1
  if (r.includes('vp') && !r.includes('junior')) return 2
  if (r.includes('junior') && r.includes('vp')) return 3
  if (r.includes('director')) return 4
  return 5
}

const teamSections = CATEGORY_ORDER
  .map(category => ({
    key: category,
    ...CATEGORY_META[category],
    members: teamMembers
      .filter(m => m.category === category)
      .sort((a, b) => {
        const rankDiff = roleRank(a.role) - roleRank(b.role)
        if (rankDiff !== 0) return rankDiff
        return a.name.localeCompare(b.name)
      }),
  }))
  .filter(section => section.members.length > 0)

function getInitials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map(part => part[0]?.toUpperCase() ?? '')
    .join('')
}

export default function Team() {
  const [titleVisible, setTitleVisible] = useState(false)
  const [descVisible, setDescVisible] = useState(false)
  const [cardsVisible, setCardsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const t1 = setTimeout(() => setTitleVisible(true), 100)
    const t2 = setTimeout(() => setDescVisible(true), 450)
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
    }
  }, [])

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(e => {
          if (e.isIntersecting) setCardsVisible(true)
        })
      },
      { threshold: 0.06, rootMargin: '0px 0px -40px 0px' }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    document.body.style.transition = 'background 0.8s ease-in-out'
    document.documentElement.style.transition = 'background 0.8s ease-in-out'
    document.body.style.background = 'var(--color-pink-light)'
    document.documentElement.style.background = 'var(--color-pink-light)'
    return () => {
      document.body.style.background = ''
      document.documentElement.style.background = ''
    }
  }, [])

  return (
    <main className="min-h-screen pt-[120px] pb-24 md:pb-32" style={{ background: 'transparent' }}>
      <div className="w-full max-w-7xl mx-auto px-4 md:px-8">
        <header className="pt-2 pb-14 md:pb-20">
          <div className="max-w-3xl">
            <h1
              className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[0.95]"
              style={{ fontFamily: 'var(--font-vintage-stylist)', color: 'var(--color-brown-dark)' }}
            >
              <span className="block">
                {['OUR', 'TEAM'].map((word, i) => (
                  <span key={i}>
                    <span
                      className={titleVisible ? 'word-fade-in-up-blur-slow' : ''}
                      style={{
                        display: 'inline-block',
                        animationDelay: titleVisible ? `${i * 0.4}s` : undefined,
                        opacity: titleVisible ? undefined : 0
                      }}
                    >
                      {word}
                    </span>
                    {i < 1 ? '\u00A0' : ''}
                  </span>
                ))}
              </span>
              <span className="block mt-1">
                {['BEHIND', 'THE', 'VISION'].map((word, i) => (
                  <span key={i}>
                    <span
                      className={titleVisible ? 'word-fade-in-up-blur-slow' : ''}
                      style={{
                        display: 'inline-block',
                        animationDelay: titleVisible ? `${0.8 + i * 0.4}s` : undefined,
                        opacity: titleVisible ? undefined : 0
                      }}
                    >
                      {word}
                    </span>
                    {i < 2 ? '\u00A0' : ''}
                  </span>
                ))}
              </span>
            </h1>

            <div
              className={`mt-6 md:mt-8 h-1 w-14 rounded-full ${descVisible ? 'animate-fadeInUp' : 'opacity-0'}`}
              style={{ background: 'var(--color-olive)', animationDelay: descVisible ? '0s' : '0s' }}
              aria-hidden
            />
          </div>

          <p
            className={`text-lg md:text-xl mt-6 md:mt-8 leading-relaxed font-normal max-w-none ${descVisible ? 'animate-fadeInUp' : 'opacity-0'}`}
            style={{
              fontFamily: 'var(--font-leiko)',
              color: 'var(--color-olive-dark)',
              animationDelay: descVisible ? '0.12s' : '0s'
            }}
          >
            Get to know the passionate students who make Youth 4 Elders possible. From organizing workshops to building connections, our team brings creativity and dedication to everything we&nbsp;do.
          </p>
        </header>

        <section ref={sectionRef} className="space-y-16 md:space-y-20" aria-label="Team members">
          {teamSections.map((section, sectionIndex) => (
            <div key={section.key}>
              <div className="mb-8 md:mb-10 flex items-stretch gap-4 md:gap-5">
                <div
                  className="w-1 shrink-0 rounded-full self-stretch min-h-[3rem]"
                  style={{ background: 'var(--color-olive)' }}
                  aria-hidden
                />
                <div>
                  <h2
                    className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight leading-none"
                    style={{ fontFamily: 'var(--font-freshwost)', color: 'var(--color-brown-dark)' }}
                  >
                    {section.title}
                  </h2>
                  <p
                    className="mt-2 md:mt-3 text-lg md:text-xl lg:text-2xl font-normal leading-snug"
                    style={{ fontFamily: 'var(--font-kollektif)', color: 'var(--color-olive-dark)' }}
                  >
                    {section.blurb}
                  </p>
                </div>
              </div>

              <div
                className={`grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-10 md:gap-x-8 md:gap-y-12 ${
                  section.key === 'Presidents' || section.members.length <= 2
                    ? 'lg:grid-cols-2 lg:max-w-3xl'
                    : 'lg:grid-cols-3'
                }`}
              >
                {section.members.map((member, memberIndex) => {
                  const globalIndex = sectionIndex * 8 + memberIndex
                  return (
                    <TeamMemberCard
                      key={member.name}
                      member={member}
                      isVisible={cardsVisible}
                      cardDelay={0.08 + globalIndex * 0.05}
                    />
                  )
                })}
              </div>
            </div>
          ))}
        </section>
      </div>
    </main>
  )
}

function TeamMemberCard({
  member,
  isVisible,
  cardDelay,
}: {
  member: TeamMember
  isVisible: boolean
  cardDelay: number
}) {
  const initials = getInitials(member.name)

  return (
    <article
      className={`w-full ${isVisible ? 'animate-fadeInUp' : 'opacity-0'}`}
      style={{
        animationDelay: isVisible ? `${cardDelay}s` : '0s',
      }}
    >
      <div
        className="relative w-full max-w-[280px] md:max-w-[300px] aspect-[4/5] overflow-hidden rounded-xl mb-4"
        style={{
          background: 'var(--color-cream)',
          boxShadow: '0 1px 0 rgba(98, 32, 47, 0.06)',
        }}
      >
        {member.imageUrl ? (
          <Image
            src={member.imageUrl}
            alt={member.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover object-top"
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center"
            style={{ background: 'var(--color-cream)' }}
          >
            <span
              className="text-3xl md:text-4xl font-bold tracking-wide"
              style={{ fontFamily: 'var(--font-kollektif)', color: 'var(--color-olive)' }}
              aria-hidden
            >
              {initials}
            </span>
          </div>
        )}
      </div>

      <h3
        className="text-lg md:text-xl font-bold leading-snug tracking-tight"
        style={{ fontFamily: 'var(--font-kollektif)', color: 'var(--color-brown-dark)' }}
      >
        {member.name}
      </h3>
      <p
        className="text-sm md:text-[0.95rem] leading-snug mt-1 font-semibold"
        style={{ fontFamily: 'var(--font-kollektif)', color: 'var(--color-olive-dark)' }}
      >
        {member.role}
      </p>
      <p
        className="text-xs md:text-sm leading-snug mt-1.5 font-normal"
        style={{ fontFamily: 'var(--font-kollektif)', color: 'rgba(98, 32, 47, 0.7)' }}
      >
        Year {member.yearOfStudy} · {member.program}
      </p>
    </article>
  )
}
