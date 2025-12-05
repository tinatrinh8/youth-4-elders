'use client'

import Image from 'next/image'
import { useEffect, useState, useRef } from 'react'

interface TeamMember {
  name: string
  role: string
  yearOfStudy: number
  program: string
  funFact: string
  imageUrl?: string // Optional image URL, will use placeholder if not provided
  email?: string // Optional email
}

const teamMembers: TeamMember[] = [
  {
    name: 'Julia Diem Hum',
    role: 'Co-Founder & Co-President',
    yearOfStudy: 3,
    program: 'Translational Molecular Medicine - TMM',
    funFact: 'Has met a mermaid',
    imageUrl: '/assets/team/julia.png',
  },
  {
    name: 'Peter Han',
    role: 'Co-Founder & Co-President',
    yearOfStudy: 3,
    program: 'Translational Molecular Medicine - TMM',
    funFact: 'Loves Nigerian Jollof',
    imageUrl: '/assets/team/peter.png',
  },
  {
    name: 'Sarah Chen',
    role: 'Secretary & Treasurer',
    yearOfStudy: 2,
    program: 'Biomedical Sciences',
    funFact: 'Has a collection of 50+ houseplants',
  },
  {
    name: 'Michael Torres',
    role: 'Workshop Director',
    yearOfStudy: 4,
    program: 'Social Work',
    funFact: 'Can solve a Rubik\'s cube in under 2 minutes',
  },
  {
    name: 'Emma Miller',
    role: 'Volunteer Coordinator',
    yearOfStudy: 2,
    program: 'Psychology',
    funFact: 'Once hiked 20km in one day',
  },
  {
    name: 'David Kim',
    role: 'Social Media Manager',
    yearOfStudy: 3,
    program: 'Communications',
    funFact: 'Plays 3 different musical instruments',
  },
]

export default function Team() {
  const [titleVisible, setTitleVisible] = useState(false)
  const [descriptionVisible, setDescriptionVisible] = useState(false)

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
    <main className="min-h-screen pt-[140px] pb-20" style={{ background: 'var(--color-cream)' }}>
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
              color: 'var(--color-brown-medium)',
              marginBottom: '250px',
              animationDelay: descriptionVisible ? '0s' : '0s'
            }}
          >
            Get to know the passionate students who make Youth 4 Elders possible! From organizing workshops to building connections, our team brings creativity and dedication to everything we do.
          </p>
        </div>

        {/* Team Members Grid - Grouped by Rows */}
        <div className="space-y-16 md:space-y-24">
          {Array.from({ length: Math.ceil(teamMembers.length / 3) }, (_, rowIndex) => (
            <TeamRow 
              key={rowIndex} 
              members={teamMembers.slice(rowIndex * 3, rowIndex * 3 + 3)} 
            />
          ))}
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

  return (
    <div 
      ref={ref}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 md:gap-x-12 gap-y-16 md:gap-y-20"
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
  
  // Alternate between pink and yellow colors staying on theme
  const blobColors = [
    'var(--color-pink-medium)',
    'var(--color-pink-light)',
    '#FFC370', // Yellow from the color palette
    '#FFA970', // Light orange/peach
    'var(--color-pink-medium)',
    '#FFC370', // Yellow
  ]
  const blobColor = blobColors[index % blobColors.length]

  return (
    <div 
      className={`flex flex-col items-center ${isVisible ? 'animate-fadeInUp' : 'opacity-0'}`}
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
        className="text-xl md:text-2xl font-bold mb-2 text-center"
        style={{ fontFamily: 'var(--font-leiko)', color: 'var(--color-brown-dark)' }}
      >
        {member.name}
      </h2>

      {/* Role */}
      <p 
        className="text-sm md:text-base mb-3 text-center"
        style={{ fontFamily: 'var(--font-kollektif)', color: 'var(--color-brown-medium)' }}
      >
        {member.role}
      </p>

      {/* Email (if provided) */}
      {member.email && (
        <a
          href={`mailto:${member.email}`}
          className="text-sm mb-4 block hover:opacity-70 transition-opacity text-center"
          style={{ 
            fontFamily: 'var(--font-kollektif)', 
            color: 'var(--color-pink-medium)' 
          }}
        >
          {member.email}
        </a>
      )}

      {/* Info Block - Compact, Left Aligned */}
      <div 
        className="rounded-lg p-4 w-full mt-2 text-left"
        style={{ 
          background: 'var(--color-brown-medium)',
          color: 'var(--color-cream)',
        }}
      >
        <div className="space-y-2 text-sm">
          <div>
            <span 
              className="font-semibold"
              style={{ fontFamily: 'var(--font-kollektif)' }}
            >
              Year {member.yearOfStudy}
            </span>
            {' • '}
            <span style={{ fontFamily: 'var(--font-kollektif)' }}>
              {member.program}
            </span>
          </div>
          <div className="pt-1">
            <span 
              className="font-semibold"
              style={{ fontFamily: 'var(--font-kollektif)' }}
            >
              Fun Fact:{' '}
            </span>
            <span style={{ fontFamily: 'var(--font-kollektif)' }}>
              {member.funFact}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
