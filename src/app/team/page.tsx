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

/** Photos that exist in /public/assets/team — skip Image if the file is missing. */
const EXISTING_TEAM_PHOTOS = new Set([
  '/assets/team/anwyn.jpg',
  '/assets/team/bradley.jpg',
  '/assets/team/cheyenne.jpg',
  '/assets/team/eamonn.jpg',
  '/assets/team/jakob.jpg',
  '/assets/team/jenna.jpg',
  '/assets/team/julia.jpg',
  '/assets/team/lana.jpg',
  '/assets/team/leyna.jpg',
  '/assets/team/marly.jpg',
  '/assets/team/monica.jpg',
  '/assets/team/peter.jpg',
])

function resolveTeamPhoto(imageUrl?: string) {
  if (!imageUrl || !EXISTING_TEAM_PHOTOS.has(imageUrl)) return undefined
  return imageUrl
}

function getInitials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map(part => part[0]?.toUpperCase() ?? '')
    .join('')
}

function useScrollReveal<T extends HTMLElement>(rootMargin = '0px 0px -10% 0px') {
  const ref = useRef<T>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        setVisible(true)
        observer.unobserve(el)
      },
      { threshold: 0.12, rootMargin }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [rootMargin])

  return { ref, visible }
}

export default function Team() {
  const [titleVisible, setTitleVisible] = useState(false)
  const [descVisible, setDescVisible] = useState(false)

  useEffect(() => {
    const t1 = setTimeout(() => setTitleVisible(true), 100)
    // Wait for title word animation (~0.4s delay + ~0.8–1s anim) before desc
    const t2 = setTimeout(() => setDescVisible(true), 1100)
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
    }
  }, [])

  return (
    <main className="min-h-screen pt-[120px] pb-24 md:pb-32 team-page-tablet-lock" style={{ background: 'transparent' }}>
      <div className="team-page-inner w-full max-w-7xl mx-auto px-4 md:px-8">
        <header className="team-page-hero pt-2 pb-[120px] md:pb-20">
          <div className="max-w-4xl">
            <h1
              className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[0.95]"
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
            </h1>

            <div
              className={`mt-4 md:mt-8 h-1 w-10 md:w-14 rounded-full transition-all duration-700 ease-out ${descVisible ? 'opacity-100 translate-y-0 scale-x-100' : 'opacity-0 translate-y-3 scale-x-50'}`}
              style={{
                background: 'var(--color-olive)',
                transformOrigin: 'left center',
                transitionDelay: descVisible ? '0ms' : '0ms',
              }}
              aria-hidden
            />
          </div>

          <p
            className={`text-sm md:text-xl mt-4 md:mt-8 leading-relaxed font-normal max-w-5xl transition-all duration-700 ease-out ${descVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}
            style={{
              fontFamily: 'var(--font-leiko)',
              color: 'var(--color-olive-dark)',
              transitionDelay: descVisible ? '120ms' : '0ms',
            }}
          >
            Get to know the passionate students who make Youth 4 Elders possible. From organizing workshops to building connections, our team brings creativity and dedication to everything we&nbsp;do.
          </p>
        </header>

        <section className="space-y-24 md:space-y-20" aria-label="Team members">
          {teamSections.map(section => (
            <TeamSectionBlock key={section.key} section={section} />
          ))}
        </section>
      </div>
    </main>
  )
}

function TeamSectionBlock({
  section,
}: {
  section: (typeof teamSections)[number]
}) {
  const { ref, visible } = useScrollReveal<HTMLDivElement>()

  return (
    <div ref={ref}>
      <div
        className={`mb-5 md:mb-10 flex items-stretch gap-3 md:gap-5 transition-all duration-700 ease-out ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
      >
        <div
          className={`w-1 shrink-0 rounded-full self-stretch min-h-[2rem] md:min-h-[3rem] transition-all duration-700 ease-out ${visible ? 'opacity-100 scale-y-100' : 'opacity-0 scale-y-50'}`}
          style={{ background: 'var(--color-olive)', transformOrigin: 'top center', transitionDelay: visible ? '80ms' : '0ms' }}
          aria-hidden
        />
        <div>
          <h2
            className="text-2xl md:text-4xl lg:text-5xl font-bold tracking-tight leading-none"
            style={{ fontFamily: 'var(--font-freshwost)', color: 'var(--color-brown-dark)' }}
          >
            {section.title}
          </h2>
          <p
            className={`mt-1.5 md:mt-3 text-sm md:text-xl lg:text-2xl font-normal leading-snug transition-all duration-700 ease-out ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
            style={{
              fontFamily: 'var(--font-kollektif)',
              color: 'var(--color-olive-dark)',
              transitionDelay: visible ? '140ms' : '0ms',
            }}
          >
            {section.blurb}
          </p>
        </div>
      </div>

      <div
        className={`grid grid-cols-2 gap-x-3 gap-y-8 md:gap-x-8 md:gap-y-12 ${
          section.key === 'Presidents' || section.members.length <= 2
            ? 'lg:grid-cols-2 lg:max-w-3xl'
            : 'lg:grid-cols-3'
        }`}
      >
        {section.members.map((member, memberIndex) => (
          <TeamMemberCard
            key={member.name}
            member={member}
            staggerDelay={0.1 + memberIndex * 0.08}
          />
        ))}
      </div>
    </div>
  )
}

function TeamMemberCard({
  member,
  staggerDelay,
}: {
  member: TeamMember
  staggerDelay: number
}) {
  const { ref, visible } = useScrollReveal<HTMLElement>()
  const photoSrc = resolveTeamPhoto(member.imageUrl)
  const initials = getInitials(member.name)

  return (
    <article
      ref={ref}
      className={`team-member-card w-full transition-all duration-700 ease-out ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
      style={{ transitionDelay: visible ? `${staggerDelay}s` : '0s' }}
    >
      <div
        className={`team-member-photo relative w-full max-w-none md:max-w-[300px] aspect-[4/5] overflow-hidden rounded-xl mb-3 md:mb-4 transition-all duration-700 ease-out ${visible ? 'opacity-100 scale-100' : 'opacity-0 scale-[0.96]'}`}
        style={{
          background: 'var(--color-cream)',
          boxShadow: '0 1px 0 rgba(98, 32, 47, 0.06)',
          transitionDelay: visible ? `${staggerDelay + 0.05}s` : '0s',
        }}
      >
        {photoSrc ? (
          <Image
            src={photoSrc}
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
        className={`text-sm md:text-xl font-bold leading-snug tracking-tight transition-all duration-700 ease-out ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'}`}
        style={{
          fontFamily: 'var(--font-kollektif)',
          color: 'var(--color-brown-dark)',
          transitionDelay: visible ? `${staggerDelay + 0.12}s` : '0s',
        }}
      >
        {member.name}
      </h3>
      <p
        className={`text-xs md:text-[0.95rem] leading-snug mt-1 font-semibold transition-all duration-700 ease-out ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'}`}
        style={{
          fontFamily: 'var(--font-kollektif)',
          color: 'var(--color-olive-dark)',
          transitionDelay: visible ? `${staggerDelay + 0.18}s` : '0s',
        }}
      >
        {member.role}
      </p>
      <p
        className={`text-xs md:text-sm leading-snug mt-1.5 font-normal transition-all duration-700 ease-out ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'}`}
        style={{
          fontFamily: 'var(--font-kollektif)',
          color: 'rgba(98, 32, 47, 0.7)',
          transitionDelay: visible ? `${staggerDelay + 0.24}s` : '0s',
        }}
      >
        Year {member.yearOfStudy} · {member.program}
      </p>
    </article>
  )
}
