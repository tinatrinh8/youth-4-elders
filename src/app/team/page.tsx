'use client'

import Image from 'next/image'
import { useEffect, useState, useRef } from 'react'

interface TeamMember {
  name: string
  role: string
  category: 'Presidents' | 'Internal' | 'External' | 'Finance' | 'Marketing' | 'Events'
  yearOfStudy: number
  program: string
  funFact: string
  imageUrl?: string // Optional image URL, will use placeholder if not provided
  email?: string // Optional email
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
    imageUrl: '/assets/team/julia.png',
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
    imageUrl: '/assets/team/peter.png',
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
    imageUrl: '/assets/team/eamonn.png',
  },
  {
    name: 'Jenna Smith',
    role: 'VP External Affairs',
    category: 'External',
    yearOfStudy: 3,
    program: 'Health Sciences',
    funFact: 'TBD',
    imageUrl: '/assets/team/jenna.png',
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
    imageUrl: '/assets/team/lana.png',
  },
  {
    name: 'Monica Mikhail',
    role: 'VP Events',
    category: 'Events',
    yearOfStudy: 4,
    program: 'Psychology',
    funFact: 'TBD',
    imageUrl: '/assets/team/monica.png',
  },
  {
    name: 'Cheyenne Hinds',
    role: 'VP of Equity & Sustainability',
    category: 'Internal',
    yearOfStudy: 3,
    program: 'Biomedical Sciences',
    funFact: 'TBD',
    imageUrl: '/assets/team/cheyenne.png',
  },
  {
    name: 'Santino Di Censo',
    role: 'VP Events',
    category: 'Events',
    yearOfStudy: 3,
    program: 'Biomedical Sciences',
    funFact: 'TBD',
    imageUrl: '/assets/team/santino.png',
  },
  {
    name: 'Leyna Trinh',
    role: 'VP Internal',
    category: 'Internal',
    yearOfStudy: 2,
    program: 'Biomedical Sciences',
    funFact: 'TBD',
    imageUrl: '/assets/team/leyna.png',
  },
  {
    name: 'Anwyn Friesen Kroeker',
    role: 'Events Director',
    category: 'Events',
    yearOfStudy: 3,
    program: 'Translational Molecular Medicine - TMM',
    funFact: 'TBD',
    imageUrl: '/assets/team/anwyn.png',
  },
  {
    name: 'Jakob Rogers',
    role: 'VP Community Engagement',
    category: 'External',
    yearOfStudy: 3,
    program: 'Health Sciences',
    funFact: 'TBD',
    imageUrl: '/assets/team/jakob.png',
  },
  {
    name: 'Karly Mikhail',
    role: 'Events Director',
    category: 'Events',
    yearOfStudy: 3,
    program: 'Translational Molecular Medicine - TMM',
    funFact: 'TBD',
    imageUrl: '/assets/team/marly.png',
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
    imageUrl: '/assets/team/bradley.png',
  },
]

export default function Team() {
  const [titleVisible, setTitleVisible] = useState(false)
  const [descriptionVisible, setDescriptionVisible] = useState(false)
  const teamGroups: TeamMember['category'][] = [
    'Presidents',
    'Internal',
    'External',
    'Finance',
    'Marketing',
    'Events'
  ]

  const getGroupMembers = (category: TeamMember['category']) => {
    const rolePriority = (role: string) => {
      const normalized = role.toLowerCase()
      if (normalized.includes('vp') && !normalized.includes('junior')) return 0
      if (normalized.includes('junior')) return 1
      if (normalized.includes('director')) return 2
      return 3
    }
    const internalOrder: Record<string, number> = {
      'leyna trinh': 0,
      'ekin atacan': 1,
      'cheyenne hinds': 2
    }
    const externalOrder: Record<string, number> = {
      'jenna smith': 0,
      'jakob rogers': 1,
      'april beauileu': 2,
      'april beaulieu': 2
    }
    return teamMembers
      .filter((member) => member.category === category)
      .sort((a, b) => {
        if (category === 'Internal') {
          const orderA = internalOrder[a.name.toLowerCase()]
          const orderB = internalOrder[b.name.toLowerCase()]
          if (orderA !== undefined || orderB !== undefined) {
            return (orderA ?? 99) - (orderB ?? 99)
          }
        }
        if (category === 'External') {
          const orderA = externalOrder[a.name.toLowerCase()]
          const orderB = externalOrder[b.name.toLowerCase()]
          if (orderA !== undefined || orderB !== undefined) {
            return (orderA ?? 99) - (orderB ?? 99)
          }
        }
        const priorityDiff = rolePriority(a.role) - rolePriority(b.role)
        if (priorityDiff !== 0) return priorityDiff
        return a.name.localeCompare(b.name)
      })
  }

  useEffect(() => {
    let titleTimer: NodeJS.Timeout
    let descTimer: NodeJS.Timeout
    
    // Use requestAnimationFrame to ensure DOM is ready
    requestAnimationFrame(() => {
      // Small delay to ensure page is ready, then start title animation
      titleTimer = setTimeout(() => {
        setTitleVisible(true)
      }, 200)
      
      // Description animation with delay
      descTimer = setTimeout(() => {
        setDescriptionVisible(true)
      }, 700)
    })
    
    return () => {
      clearTimeout(titleTimer)
      clearTimeout(descTimer)
    }
  }, [])

  return (
    <main className="min-h-screen pt-[140px] pb-32 md:pb-40" style={{ background: 'var(--color-cream)' }}>
      <div className="max-w-7xl mx-auto px-8 py-16">
        {/* Page Header */}
        <div className="text-center mb-20">
          <div 
            className={`flex items-center justify-center gap-4 md:gap-8 mb-6 ${titleVisible ? 'animate-fadeInScale' : 'opacity-0'}`}
            style={{ 
              animationDelay: titleVisible ? '0s' : '0s',
              willChange: titleVisible ? 'auto' : 'opacity, transform'
            }}
          >
            {/* Flower decoration - left */}
            <div className="flex-shrink-0">
              <Image
                src="/assets/team/flower.png"
                alt=""
                width={400}
                height={400}
                className="w-20 h-20 sm:w-32 sm:h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 xl:w-56 xl:h-56"
              />
            </div>
            
            <h1 
              className="text-5xl md:text-7xl lg:text-8xl font-bold" 
              style={{ fontFamily: 'var(--font-vintage-stylist)', color: 'var(--color-brown-dark)' }}
            >
              Meet the Team
            </h1>
            
            {/* Star decoration - right */}
            <div className="flex-shrink-0">
              <Image
                src="/assets/team/star.png"
                alt=""
                width={400}
                height={400}
                className="w-20 h-20 sm:w-32 sm:h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 xl:w-56 xl:h-56"
              />
            </div>
          </div>
          <p 
            className={`text-lg md:text-xl max-w-3xl mx-auto leading-relaxed ${descriptionVisible ? 'animate-fadeInUp' : 'opacity-0'}`}
            style={{ 
              fontFamily: 'var(--font-leiko)', 
              color: 'var(--color-brown-dark)',
              textShadow: '0 1px 4px rgba(245, 208, 198, 0.6)',
              marginBottom: '250px',
              animationDelay: descriptionVisible ? '0s' : '0s'
            }}
          >
            Get to know the passionate students who make Youth 4 Elders possible! From organizing workshops to building connections, our team brings creativity and dedication to everything we do.
          </p>
        </div>

        {/* Team Members Grid - Grouped by Section */}
        <div className="space-y-32 md:space-y-40">
          {teamGroups.map((group) => {
            const members = getGroupMembers(group)
            return (
              <div key={group}>
                <h2
                  className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8 text-center"
                  style={{ fontFamily: 'var(--font-vintage-stylist)', color: 'var(--color-brown-dark)' }}
                >
                  {group}
                </h2>
                {members.length > 0 ? (
                  <div className="space-y-16 md:space-y-24">
                    {group === 'External' ? (
                      <>
                        <TeamRow key={`${group}-lead`} members={members.slice(0, 1)} />
                        {Array.from({ length: Math.ceil((members.length - 1) / 2) }, (_, rowIndex) => (
                          <TeamRow
                            key={`${group}-rest-${rowIndex}`}
                            members={members.slice(1 + rowIndex * 2, 1 + rowIndex * 2 + 2)}
                          />
                        ))}
                      </>
                    ) : (
                      Array.from({ length: Math.ceil(members.length / 2) }, (_, rowIndex) => (
                        <TeamRow
                          key={`${group}-${rowIndex}`}
                          members={members.slice(rowIndex * 2, rowIndex * 2 + 2)}
                        />
                      ))
                    )}
                  </div>
                ) : (
                  <p
                    className="text-center text-base md:text-lg"
                    style={{ fontFamily: 'var(--font-leiko)', color: 'var(--color-brown-medium)' }}
                  >
                    Team members coming soon.
                  </p>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </main>
  )
}

function TeamRow({ members }: { members: TeamMember[] }) {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const hasAnimated = useRef(false)

  useEffect(() => {
    if (!ref.current || hasAnimated.current) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated.current) {
            hasAnimated.current = true
            setIsVisible(true)
            observer.unobserve(entry.target)
          }
        })
      },
      {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
      }
    )

    observer.observe(ref.current)

    return () => {
      observer.disconnect()
    }
  }, [])

  const useCenteredLayout = members.length < 2
  const gridCols = members.length === 1 ? 'md:grid-cols-1' : 'md:grid-cols-2'

  return (
    <div ref={ref} className={useCenteredLayout ? 'md:flex md:justify-center' : ''}>
      <div
        className={`grid grid-cols-1 ${useCenteredLayout ? gridCols : 'md:grid-cols-2'} gap-x-12 md:gap-x-24 gap-y-16 md:gap-y-20 justify-items-center w-full ${useCenteredLayout ? 'max-w-5xl' : ''}`}
      >
        {members.map((member, index) => (
          <TeamMemberCard
            key={index}
            member={member}
            index={index}
            isVisible={isVisible}
            cardDelay={index * 0.1}
          />
        ))}
      </div>
    </div>
  )
}

function TeamMemberCard({ member, index, isVisible, cardDelay }: { member: TeamMember; index: number; isVisible: boolean; cardDelay: number }) {
  // Generate unique blob shape for each card
  const blobShapes = [
    '60% 40% 30% 70% / 60% 30% 70% 40%',
    '30% 60% 70% 40% / 50% 60% 30% 60%',
    '40% 60% 60% 40% / 60% 30% 70% 40%',
    '50% 50% 50% 50% / 60% 60% 40% 40%',
    '70% 30% 50% 50% / 40% 70% 30% 60%',
    '45% 55% 55% 45% / 55% 45% 55% 45%',
  ]
  
  const blobShape = blobShapes[index % blobShapes.length]
  
  // Different pink shades for each person
  const blobColors = [
    'var(--color-pink-light)',      // Light pink
    'var(--color-pink-medium)',     // Medium pink
    'rgba(211, 165, 165, 0.8)',     // Pink light with opacity
    'var(--color-pink-dark)',       // Dark pink
    'rgba(175, 121, 120, 0.7)',     // Pink medium with opacity
    'rgba(211, 165, 165, 0.9)',     // Pink light more opaque
  ]
  const blobColor = blobColors[index % blobColors.length]

  return (
    <div 
      className={`flex flex-col items-center w-full max-w-sm mx-auto ${isVisible ? 'animate-fadeInUp' : 'opacity-0'}`}
      style={{
        animationDelay: isVisible ? `${cardDelay}s` : '0s',
        willChange: isVisible ? 'auto' : 'opacity, transform'
      }}
    >
      {/* Image with Blob Background */}
      <div className="relative mb-6 w-full flex justify-center">
        {/* Organic Blob Shape Behind Image */}
        <div 
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
          style={{
            width: member.name === 'Cheyenne Hinds' ? '200px' : '160px',
            height: member.name === 'Cheyenne Hinds' ? '200px' : '160px',
            background: blobColor,
            borderRadius: blobShape,
            opacity: 0.9,
            zIndex: 0,
          }}
        />
        
        {/* Person Image - Will be cut out/transparent background */}
        <div 
          className="relative z-10"
          style={{
            width: member.name === 'Julia Diem Hum' || member.name === 'Peter Han' ? '260px' : '320px',
            height: member.name === 'Julia Diem Hum' || member.name === 'Peter Han' ? '260px' : '320px',
            borderRadius: '50%',
            overflow: 'hidden',
            background: 'transparent',
          }}
        >
          {member.imageUrl ? (
            <Image
              src={member.imageUrl}
              alt={member.name}
              fill
              className="object-cover object-center"
              style={{ objectFit: 'cover', objectPosition: 'center' }}
            />
          ) : (
            <div 
              className="w-full h-full flex items-center justify-center"
              style={{ background: 'var(--color-cream)' }}
            >
              <div 
                className="text-5xl"
                style={{ color: 'var(--color-brown-medium)', opacity: 0.3 }}
              >
                👤
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Name */}
      <h2 
        className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3 text-center"
        style={{ fontFamily: 'var(--font-leiko)', color: 'var(--color-brown-dark)' }}
      >
        {member.name}
      </h2>

      {/* Role */}
      <p className="mb-4 text-center">
        <span
          className="inline-block text-base md:text-lg italic px-4 py-2 rounded-full"
          style={{ 
            fontFamily: 'var(--font-kollektif)', 
            color: 'var(--color-brown-dark)',
            background: 'var(--color-pink-medium)',
            textShadow: '0 1px 4px rgba(245, 208, 198, 0.6)'
          }}
        >
          {member.role}
        </span>
      </p>

      <p
        className="text-sm md:text-base text-center"
        style={{ fontFamily: 'var(--font-kollektif)', color: 'var(--color-brown-medium)' }}
      >
        Year {member.yearOfStudy} • {member.program}
      </p>

    </div>
  )
}
