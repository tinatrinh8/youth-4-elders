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
    name: 'Sarah Chen',
    role: 'Secretary & Treasurer',
    category: 'Finance',
    yearOfStudy: 2,
    program: 'Biomedical Sciences',
    funFact: 'Has a collection of 50+ houseplants',
  },
  {
    name: 'Alyssa Park',
    role: 'Finance Coordinator',
    category: 'Finance',
    yearOfStudy: 3,
    program: 'Accounting',
    funFact: 'Collects vintage postcards',
  },
  {
    name: 'Michael Torres',
    role: 'Workshop Director',
    category: 'Events',
    yearOfStudy: 4,
    program: 'Social Work',
    funFact: 'Can solve a Rubik\'s cube in under 2 minutes',
  },
  {
    name: 'Noah Patel',
    role: 'Events Coordinator',
    category: 'Events',
    yearOfStudy: 2,
    program: 'Health Sciences',
    funFact: 'Loves night hikes',
  },
  {
    name: 'Emma Miller',
    role: 'Volunteer Coordinator',
    category: 'Internal',
    yearOfStudy: 2,
    program: 'Psychology',
    funFact: 'Once hiked 20km in one day',
  },
  {
    name: 'Liam Nguyen',
    role: 'Internal Coordinator',
    category: 'Internal',
    yearOfStudy: 3,
    program: 'Sociology',
    funFact: 'Can bake sourdough from scratch',
  },
  {
    name: 'David Kim',
    role: 'Social Media Manager',
    category: 'Marketing',
    yearOfStudy: 3,
    program: 'Communications',
    funFact: 'Plays 3 different musical instruments',
  },
  {
    name: 'Sofia Alvarez',
    role: 'Marketing Lead',
    category: 'Marketing',
    yearOfStudy: 4,
    program: 'Digital Media',
    funFact: 'Runs a film photography page',
  },
  {
    name: 'Riley Thompson',
    role: 'External Relations Lead',
    category: 'External',
    yearOfStudy: 4,
    program: 'Public Relations',
    funFact: 'Volunteers at community gardens',
  },
  {
    name: 'Marcus Adeyemi',
    role: 'External Outreach Coordinator',
    category: 'External',
    yearOfStudy: 2,
    program: 'Political Science',
    funFact: 'Speaks three languages',
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

  const getGroupMembers = (category: TeamMember['category']) =>
    teamMembers.filter((member) => member.category === category)

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
              color: 'var(--color-pink-medium)',
              WebkitTextStroke: '0.6px var(--color-brown-dark)',
              textShadow: '0 1px 0 rgba(98, 32, 47, 0.45)',
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
                  className="text-3xl md:text-4xl font-bold mb-6 text-center"
                  style={{ fontFamily: 'var(--font-vintage-stylist)', color: 'var(--color-brown-dark)' }}
                >
                  {group}
                </h2>
                {members.length > 0 ? (
                  <div className="space-y-16 md:space-y-24">
                    {Array.from({ length: Math.ceil(members.length / 3) }, (_, rowIndex) => (
                      <TeamRow
                        key={`${group}-${rowIndex}`}
                        members={members.slice(rowIndex * 3, rowIndex * 3 + 3)}
                      />
                    ))}
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

  const useCenteredLayout = members.length < 3
  const gridCols = members.length === 1 ? 'md:grid-cols-1' : 'md:grid-cols-2'

  return (
    <div ref={ref} className={useCenteredLayout ? 'md:flex md:justify-center' : ''}>
      <div
        className={`grid grid-cols-1 ${useCenteredLayout ? gridCols : 'md:grid-cols-2 lg:grid-cols-3'} gap-x-12 md:gap-x-24 gap-y-16 md:gap-y-20 justify-items-center w-full ${useCenteredLayout ? 'max-w-5xl' : ''}`}
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
            width: '180px',
            height: '180px',
            background: blobColor,
            borderRadius: blobShape,
            opacity: 0.8,
            zIndex: 0,
          }}
        />
        
        {/* Person Image - Will be cut out/transparent background */}
        <div 
          className="relative z-10"
          style={{
            width: '240px',
            height: '240px',
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
              style={{ objectFit: 'cover' }}
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
      <p 
        className="text-base md:text-lg mb-4 text-center italic"
        style={{ 
          fontFamily: 'var(--font-kollektif)', 
          color: 'var(--color-pink-medium)',
          WebkitTextStroke: '0.6px var(--color-brown-dark)',
          textShadow: '0 1px 0 rgba(98, 32, 47, 0.45)'
        }}
      >
        {member.role}
      </p>

      <p
        className="text-sm md:text-base text-center"
        style={{ fontFamily: 'var(--font-kollektif)', color: 'var(--color-brown-medium)' }}
      >
        {member.program}
      </p>

    </div>
  )
}
