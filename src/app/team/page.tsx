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

// Display order (hierarchy): Founders → Presidents → VPs → Junior VPs → Directors → Others (A–Z within each tier)
const sortedTeamMembers = [...teamMembers].sort((a, b) => {
  const rank = (role: string) => {
    const r = role.toLowerCase()
    if (r.includes('founder')) return 0
    if (r.includes('president')) return 1 // includes co-president
    if (r.includes('vp') && !r.includes('junior')) return 2
    if (r.includes('junior') && r.includes('vp')) return 3
    if (r.includes('director')) return 4
    return 5
  }

  const rankDiff = rank(a.role) - rank(b.role)
  if (rankDiff !== 0) return rankDiff
  return a.name.localeCompare(b.name)
})

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
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setCardsVisible(true)
        })
      },
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  // Whole-page background: set html/body to pink so the full viewport (including above nav) is pink
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
        <header className="text-left pt-0 pb-14 md:pb-20">
          <h1
            className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-none"
            style={{ fontFamily: 'var(--font-vintage-stylist)', color: 'var(--color-brown-dark)' }}
          >
            <span className="block">
              {['OUR', 'TEAM'].map((word, i) => (
                <span key={i}>
                  <span
                    className={titleVisible ? 'word-fade-in-up-blur-slow' : ''}
                    style={{
                      display: 'inline-block',
                      animationDelay: titleVisible ? `${i * 0.5}s` : undefined,
                      opacity: titleVisible ? undefined : 0
                    }}
                  >
                    {word}
                  </span>
                  {i < 1 ? '\u00A0' : ''}
                </span>
              ))}
            </span>
            <span className="block">
              {['BEHIND', 'THE', 'VISION'].map((word, i) => (
                <span key={i}>
                  <span
                    className={titleVisible ? 'word-fade-in-up-blur-slow' : ''}
                    style={{
                      display: 'inline-block',
                      animationDelay: titleVisible ? `${2 * 0.5 + i * 0.5}s` : undefined,
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
          <p
            className={`text-lg md:text-xl max-w-5xl mt-8 md:mt-10 leading-snug font-normal ${descVisible ? 'animate-fadeInUp' : 'opacity-0'}`}
            style={{
              fontFamily: 'var(--font-leiko)',
              color: 'var(--color-olive-dark)',
              animationDelay: descVisible ? '0.15s' : '0s'
            }}
          >
            Get to know the passionate students who make Youth 4 Elders possible! From organizing workshops to building connections, our team brings creativity and dedication to everything we&nbsp;do.
          </p>
        </header>

        <section ref={sectionRef} className="pt-4" aria-label="Team members">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-14 md:gap-x-10 md:gap-y-20 lg:[&>*:nth-child(3n+1)]:justify-self-start lg:[&>*:nth-child(3n+2)]:justify-self-center lg:[&>*:nth-child(3n)]:justify-self-end">
            {sortedTeamMembers.map((member, index) => {
              const cols = 3
              const row = Math.floor(index / cols)
              const col = index % cols
              const cardDelay = row * 1.6 + col * 0.1
              return (
                <TeamMemberCard
                  key={member.name}
                  member={member}
                  index={index}
                  isVisible={cardsVisible}
                  cardDelay={cardDelay}
                />
              )
            })}
          </div>
        </section>
      </div>
    </main>
  )
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars -- index used by parent for cardDelay
function TeamMemberCard({ member, index, isVisible, cardDelay }: { member: TeamMember; index: number; isVisible: boolean; cardDelay: number }) {
  return (
    <div
      className={`w-full max-w-[340px] ${isVisible ? 'animate-fadeInUp' : 'opacity-0'}`}
      style={{
        animationDelay: isVisible ? `${cardDelay}s` : '0s',
        willChange: isVisible ? 'auto' : 'opacity, transform'
      }}
    >
      <div
        className="relative w-full aspect-[3/4] overflow-hidden rounded-2xl mb-3"
        style={{ background: 'var(--color-pink-light)' }}
      >
        {member.imageUrl ? (
          <Image
            src={member.imageUrl}
            alt={member.name}
            fill
            className="object-cover object-top"
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center"
            style={{ background: 'var(--color-pink-light)' }}
          >
            <span className="text-5xl opacity-40" style={{ color: 'var(--color-brown-dark)' }}>👤</span>
          </div>
        )}
      </div>
      <p
        className="font-bold text-xl md:text-2xl leading-tight mt-3"
        style={{ fontFamily: 'var(--font-leiko)', color: 'var(--color-brown-dark)' }}
      >
        {member.name}
      </p>
      <p
        className="text-base md:text-lg leading-snug mt-1 font-normal"
        style={{ fontFamily: 'var(--font-kollektif)', color: 'var(--color-olive-dark)' }}
      >
        {member.role}
      </p>
      <p
        className="text-sm md:text-base leading-snug mt-1 font-normal italic"
        style={{ fontFamily: 'var(--font-kollektif)', color: 'var(--color-brown-dark)' }}
      >
        Year {member.yearOfStudy} • {member.program}
      </p>
    </div>
  )
}
