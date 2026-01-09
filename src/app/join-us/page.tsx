'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'

// Confetti Component - Shoots from left and right sides
const ConfettiComponent = ({ boxRef }: { boxRef?: React.RefObject<HTMLDivElement | null> }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const confettiColors = ['#676930', '#EAD4C4', '#D3A5A5', '#AF7978'] // Green, cream, pink light, pink medium

    // Get box position for shooting from sides
    let boxLeft = window.innerWidth * 0.5 - 400 // Approximate center minus half width
    let boxRight = window.innerWidth * 0.5 + 400
    let boxTop = window.innerHeight * 0.4 // Approximate vertical center
    let boxHeight = 400

    if (boxRef?.current) {
      const rect = boxRef.current.getBoundingClientRect()
      boxLeft = rect.left
      boxRight = rect.right
      boxTop = rect.top + rect.height / 2
      boxHeight = rect.height
    }

    const confetti: Array<{
      x: number
      y: number
      vx: number
      vy: number
      color: string
      size: number
      rotation: number
      rotationSpeed: number
      side: 'left' | 'right'
    }> = []

    // Create confetti pieces shooting from left and right
    for (let i = 0; i < 100; i++) {
      const side = i % 2 === 0 ? 'left' : 'right'
      const startX = side === 'left' ? boxLeft : boxRight
      const startY = boxTop + (Math.random() - 0.5) * boxHeight
      
      // Velocity: shoot outward from the box
      const angle = side === 'left' 
        ? Math.random() * Math.PI / 3 - Math.PI / 6 // -30 to 0 degrees
        : Math.random() * Math.PI / 3 + (2 * Math.PI / 3) // 120 to 150 degrees
      
      const speed = Math.random() * 8 + 4
      
      confetti.push({
        x: startX,
        y: startY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 2, // Slight upward initial velocity
        color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
        size: Math.random() * 8 + 4,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 15,
        side
      })
    }

    const startTime = Date.now()
    const duration = 2000 // 2 seconds

    let animationId: number
    const animate = () => {
      const elapsed = Date.now() - startTime
      if (elapsed > duration) {
        return // Stop animation after 2 seconds
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      confetti.forEach((piece) => {
        piece.x += piece.vx
        piece.y += piece.vy
        piece.rotation += piece.rotationSpeed
        piece.vy += 0.15 // gravity

        ctx.save()
        ctx.translate(piece.x, piece.y)
        ctx.rotate((piece.rotation * Math.PI) / 180)
        ctx.fillStyle = piece.color
        ctx.fillRect(-piece.size / 2, -piece.size / 2, piece.size, piece.size)
        ctx.restore()
      })

      animationId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      cancelAnimationFrame(animationId)
    }
  }, [boxRef])

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full pointer-events-none z-50"
      style={{ position: 'fixed' }}
    />
  )
}

interface FormData {
  name: string
  email: string
  phone: string
  program: string
  year: string
  whyJoin: string
  howHeard: string
}

interface Question {
  id: keyof FormData
  label: string
  type: 'text' | 'email' | 'tel' | 'select' | 'textarea'
  required: boolean
  placeholder?: string
  options?: { value: string; label: string }[]
  autoAdvance?: boolean
}

const questions: Question[] = [
  {
    id: 'name',
    label: 'What\'s your full name?',
    type: 'text',
    required: true,
    placeholder: 'Enter your full name'
  },
  {
    id: 'email',
    label: 'What\'s your email address?',
    type: 'email',
    required: true,
    placeholder: 'Enter your email'
  },
  {
    id: 'phone',
    label: 'What\'s your phone number? (optional)',
    type: 'tel',
    required: false,
    placeholder: 'Enter your phone number'
  },
  {
    id: 'program',
    label: 'What\'s your program or field of study?',
    type: 'text',
    required: false,
    placeholder: 'e.g., Computer Science, Nursing'
  },
  {
    id: 'year',
    label: 'What year are you in?',
    type: 'select',
    required: false,
    autoAdvance: true,
    options: [
      { value: '', label: 'Select year' },
      { value: '1st Year', label: '1st Year' },
      { value: '2nd Year', label: '2nd Year' },
      { value: '3rd Year', label: '3rd Year' },
      { value: '4th Year', label: '4th Year' },
      { value: '5th Year', label: '5th Year' },
      { value: 'Graduate', label: 'Graduate' },
      { value: 'Alumni', label: 'Alumni' },
      { value: 'Community Member', label: 'Community Member' }
    ]
  },
  {
    id: 'whyJoin',
    label: 'Why do you want to join Youth 4 Elders?',
    type: 'textarea',
    required: true,
    placeholder: 'Tell us what interests you about our mission...'
  },
  {
    id: 'howHeard',
    label: 'How did you hear about us?',
    type: 'select',
    required: false,
    autoAdvance: true,
    options: [
      { value: '', label: 'Select an option' },
      { value: 'Club Fair', label: 'Club Fair' },
      { value: 'Social Media', label: 'Social Media' },
      { value: 'Friend/Classmate', label: 'Friend/Classmate' },
      { value: 'Website', label: 'Website' },
      { value: 'Poster/Flyer', label: 'Poster/Flyer' },
      { value: 'Event', label: 'Event' },
      { value: 'Other', label: 'Other' }
    ]
  }
]

export default function JoinUs() {
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    program: '',
    year: '',
    whyJoin: '',
    howHeard: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [hasStarted, setHasStarted] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isDropdownClosing, setIsDropdownClosing] = useState(false)
  const [slideDirection, setSlideDirection] = useState<'left' | 'right'>('right')
  const [showConfetti, setShowConfetti] = useState(false)
  const [isInitialViewVisible, setIsInitialViewVisible] = useState(false)

  // Color variables - using cream, pink, and green (no brown to avoid clashing with green)
  const textColor = 'var(--color-pink-light)'

  // Validation functions
  const validateField = (id: keyof FormData, value: string): string => {
    if (!value.trim() && questions.find(q => q.id === id)?.required) {
      return 'This field is required'
    }

    switch (id) {
      case 'email':
        if (value.trim() && !value.includes('@')) {
          return 'Email must contain an @ symbol'
        }
        if (value.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          return 'Please enter a valid email address'
        }
        break
      case 'phone':
        if (value.trim() && !/^[\d\s\-\+\(\)]+$/.test(value)) {
          return 'Please enter a valid phone number'
        }
        break
      case 'name':
        if (value.trim() && value.trim().length < 2) {
          return 'Name must be at least 2 characters'
        }
        break
      case 'whyJoin':
        if (value.trim() && value.trim().length < 10) {
          return 'Please provide a more detailed answer (at least 10 characters)'
        }
        break
    }
    return ''
  }

  const currentQuestion = questions[currentStep]
  const progress = ((currentStep + 1) / questions.length) * 100
  const isLastStep = currentStep === questions.length - 1
  const currentFieldValue = formData[currentQuestion.id]
  const currentFieldError = fieldErrors[currentQuestion.id] || ''
  const isValid = validateField(currentQuestion.id, currentFieldValue) === ''
  const canProceed = currentQuestion.required 
    ? (currentFieldValue.trim() !== '' && isValid)
    : (currentFieldValue.trim() === '' || isValid)
  
  // Color variables - using cream, pink, and green
  const primaryColor = 'var(--color-pink-medium)'
  const primaryDarkColor = 'var(--color-pink-dark)'

  const handleChange = (value: string) => {
    setFormData({
      ...formData,
      [currentQuestion.id]: value
    })

    // Clear error when user starts typing
    if (fieldErrors[currentQuestion.id]) {
      setFieldErrors({
        ...fieldErrors,
        [currentQuestion.id]: ''
      })
    }

    // Auto-advance for select fields when an option is selected
    if (currentQuestion.autoAdvance && currentQuestion.type === 'select' && value !== '') {
      setTimeout(() => {
        handleNext()
      }, 300)
    }
  }

  const handleBlur = () => {
    const error = validateField(currentQuestion.id, currentFieldValue)
    if (error) {
      setFieldErrors({
        ...fieldErrors,
        [currentQuestion.id]: error
      })
    } else {
      // Clear error if valid
      const newErrors = { ...fieldErrors }
      delete newErrors[currentQuestion.id]
      setFieldErrors(newErrors)
    }
  }

  const handleNext = () => {
    // Validate before proceeding
    const error = validateField(currentQuestion.id, currentFieldValue)
    if (error) {
      setFieldErrors({
        ...fieldErrors,
        [currentQuestion.id]: error
      })
      return
    }

    if (canProceed && currentStep < questions.length - 1) {
      // Clear error for current field before moving
      const newErrors = { ...fieldErrors }
      delete newErrors[currentQuestion.id]
      setFieldErrors(newErrors)
      setSlideDirection('right')
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setSlideDirection('left')
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async () => {
    if (!canProceed) return

    setIsSubmitting(true)
    setSubmitStatus('idle')

    try {
      const GOOGLE_SCRIPT_URL = process.env.NEXT_PUBLIC_GOOGLE_SCRIPT_URL || 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE'
      
      const response = await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          timestamp: new Date().toISOString()
        })
      })

      if (response.ok) {
        // Add a small delay to show loading state
        await new Promise(resolve => setTimeout(resolve, 1500))
        setShowConfetti(true)
        setSubmitStatus('success')
        setFormData({
          name: '',
          email: '',
          phone: '',
          program: '',
          year: '',
          whyJoin: '',
          howHeard: ''
        })
        setCurrentStep(0)
        setHasStarted(false)
        // Stop confetti after 2 seconds
        setTimeout(() => setShowConfetti(false), 2000)
      } else {
        setSubmitStatus('error')
      }
    } catch (error) {
      console.error('Error submitting form:', error)
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Focus input when step changes
  useEffect(() => {
    if (hasStarted && currentQuestion.type !== 'textarea') {
      const input = document.getElementById(`question-${currentQuestion.id}`)
      if (input) {
        setTimeout(() => input.focus(), 100)
      }
    }
  }, [currentStep, hasStarted, currentQuestion])

  // Set initial background on mount and update when light mode changes
  // Ensure transition is set, then change the background
  useEffect(() => {
    // Use requestAnimationFrame to ensure transition is set before background change
    // This ensures smooth animation when navigating to join-us page
    const rafId = requestAnimationFrame(() => {
      // Ensure transition is set on both elements (in case inline styles override CSS)
      document.body.style.transition = 'background 0.8s ease-in-out'
      document.documentElement.style.transition = 'background 0.8s ease-in-out'
      
      // Then set background - the transition will handle the animation
      requestAnimationFrame(() => {
        // Plain beige/cream background
        document.body.style.background = 'var(--color-cream)'
        document.documentElement.style.background = 'var(--color-cream)'
      })
    })
    
    return () => {
      cancelAnimationFrame(rafId)
      // IMPORTANT: Don't cleanup background on unmount
      // The NavigationBar will handle transitioning back to cream when isJoinUsPage becomes false
    }
  }, [])

  // Page load animation
  useEffect(() => {
    setTimeout(() => {
      setIsInitialViewVisible(true)
    }, 100)
  }, [])


  const successBoxRef = useRef<HTMLDivElement>(null)

  // Show loading state while submitting
  if (isSubmitting && submitStatus === 'idle') {
    return (
      <main className="min-h-screen pt-[120px] pb-[120px] relative flex items-center justify-center" style={{ 
        background: 'transparent'
      }}>
        <div className="text-center">
          <div className="mb-8">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-solid border-current border-r-transparent" 
              style={{ 
                color: textColor,
                animation: 'spin 1s linear infinite'
              }}
            />
          </div>
          <p 
            className="text-2xl font-semibold"
            style={{ 
              fontFamily: 'var(--font-leiko)', 
              color: 'var(--color-pink-light)' 
            }}
          >
            Submitting your application...
          </p>
        </div>
      </main>
    )
  }

  if (submitStatus === 'success') {
    return (
      <main className="min-h-screen pt-[120px] pb-[120px] relative overflow-hidden" style={{ 
        background: 'var(--color-cream)'
      }}>
        {/* Confetti Effect */}
        {showConfetti && <ConfettiComponent boxRef={successBoxRef as React.RefObject<HTMLDivElement>} />}
        <div className="max-w-2xl mx-auto px-8 pt-4 md:pt-8 pb-8 md:pb-12 text-center relative">
          <div 
            ref={successBoxRef}
            className="rounded-2xl p-12 shadow-lg animate-success-fade-in"
            style={{ 
              background: 'var(--color-olive)', 
              border: '3px solid var(--color-olive-dark)',
              boxShadow: '0 8px 32px rgba(103, 105, 48, 0.2)'
            }}
          >
            <div className="mb-6 flex justify-center">
              <Image
                src="/assets/join us/sign up confirmed.png"
                alt="Sign up confirmed"
                width={200}
                height={200}
                className="object-contain"
              />
            </div>
            <h2 
              className="text-4xl md:text-5xl font-bold mb-4 animate-success-title"
              style={{ fontFamily: 'var(--font-freshwost)', color: 'var(--color-pink-light)' }}
            >
              Thank You!
            </h2>
            <p 
              className="text-lg md:text-xl mb-4 animate-success-text"
              style={{ fontFamily: 'var(--font-leiko)', color: 'var(--color-pink-light)' }}
            >
              Thank you for signing up to be a community volunteer! We&apos;ll reach out if we have opportunities that match your interests.
            </p>
            <p 
              className="text-lg md:text-xl mb-8 animate-success-text"
              style={{ fontFamily: 'var(--font-leiko)', color: 'var(--color-pink-light)' }}
            >
              For now,{' '}
              <a
                href="https://www.instagram.com/youth4elders/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold underline hover:no-underline transition-all"
                style={{ color: 'var(--color-olive)' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = 'var(--color-olive-light)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'var(--color-olive)'
                }}
              >
                follow our Instagram
              </a>
              {' '}for club updates!
            </p>
            <button
              onClick={() => {
                setSubmitStatus('idle')
                setHasStarted(false)
                setCurrentStep(0)
              }}
              className="px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 hover:scale-105 shadow-lg animate-success-button"
              style={{
                background: 'var(--color-pink-medium)',
                color: 'var(--color-cream)',
                fontFamily: 'var(--font-leiko)',
                border: '2px solid var(--color-pink-dark)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'var(--color-pink-dark)'
                e.currentTarget.style.color = 'var(--color-cream)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'var(--color-pink-medium)'
                e.currentTarget.style.color = 'var(--color-cream)'
              }}
            >
              Submit Another Application
            </button>
          </div>
        </div>
      </main>
    )
  }

  if (!hasStarted) {
    return (
      <main className="min-h-screen pt-[120px] relative overflow-hidden" style={{ 
        background: 'var(--color-cream)'
      }}>
        {/* Confetti Effect */}
        {showConfetti && <ConfettiComponent />}
        <div className="max-w-7xl mx-auto px-8 pt-4 md:pt-8 pb-8 md:pb-12 relative">
          <div className={`flex flex-col md:flex-row items-center md:items-start justify-between gap-6 md:gap-12 mb-24 md:mb-32 transition-all duration-1000 ${
            isInitialViewVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            <h1 
              className={`text-6xl md:text-8xl lg:text-9xl font-bold text-center md:text-left flex-shrink-0 transition-all duration-1000 delay-200 ${
                isInitialViewVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
              }`}
              style={{ fontFamily: 'var(--font-vintage-stylist)', color: 'var(--color-pink-medium)' }}
            >
              Join Us
            </h1>
            <p 
              className={`text-xl md:text-2xl lg:text-3xl leading-relaxed text-center md:text-right flex-1 max-w-2xl transition-all duration-1000 delay-300 ${
                isInitialViewVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'
              }`}
              style={{ fontFamily: 'var(--font-leiko)', color: textColor }}
            >
              Join Youth 4 Elders as a volunteer and become part of our student community!
            </p>
          </div>
          
          {/* Intro paragraph about volunteering */}
          <div className={`max-w-3xl mx-auto mb-12 text-center transition-all duration-1000 delay-400 ${
            isInitialViewVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}>
            <p 
              className="text-base md:text-lg leading-relaxed"
              style={{ fontFamily: 'var(--font-kollektif)', color: textColor, opacity: 0.9 }}
            >
              Join us as a community volunteer and help build meaningful intergenerational connections. Through workshops, tech support sessions, storytelling events, and community activities, you&apos;ll create spaces where stories, skills, and support move across generations. Below, we&apos;ll ask you a few quick questions to learn more about you and your interests.
            </p>
          </div>
          
          {/* Quiz Box - Larger */}
          <div 
            className={`rounded-3xl p-12 md:p-16 shadow-xl text-center max-w-4xl mx-auto mb-8 transition-all duration-1000 delay-500 ${
              isInitialViewVisible ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-8'
            }`}
            style={{ 
              background: 'var(--color-olive)', 
              border: '3px solid var(--color-olive-dark)',
              boxShadow: '0 8px 32px rgba(103, 105, 48, 0.2)'
            }}
          >
            <p 
              className="text-xl md:text-2xl mb-10 leading-relaxed"
              style={{ fontFamily: 'var(--font-leiko)', color: textColor }}
            >
              Ready to get started? We&apos;ll ask you a few quick questions to learn more about you.
            </p>
            <button
              onClick={() => {
                setSlideDirection('right')
                setHasStarted(true)
              }}
              className="px-12 py-5 rounded-full font-semibold text-xl transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
              style={{
                background: 'var(--color-pink-medium)',
                color: 'var(--color-cream)',
                fontFamily: 'var(--font-leiko)',
                border: '2px solid var(--color-pink-dark)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'var(--color-pink-dark)'
                e.currentTarget.style.color = 'var(--color-cream)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'var(--color-pink-medium)'
                e.currentTarget.style.color = 'var(--color-cream)'
              }}
            >
              Let&apos;s Begin →
            </button>
            
            {/* TEST BUTTON - Remove this after testing */}
            <button
              onClick={() => {
                setShowConfetti(true)
                setSubmitStatus('success')
                setTimeout(() => setShowConfetti(false), 2000)
              }}
              className="mt-4 px-6 py-2 rounded-full text-sm font-semibold transition-all duration-300 hover:scale-105"
              style={{
                background: 'transparent',
                color: 'var(--color-cream)',
                fontFamily: 'var(--font-leiko)',
                border: '1px dashed var(--color-cream)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'var(--color-cream)'
                e.currentTarget.style.color = 'var(--color-pink-light)'
                e.currentTarget.style.borderColor = 'var(--color-pink-light)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent'
                e.currentTarget.style.color = 'var(--color-cream)'
                e.currentTarget.style.borderColor = 'var(--color-cream)'
              }}
            >
              🧪 Test Success Message
            </button>
          </div>

          {/* Notice about Exec Applications - Below quiz box, different design with infinite animation */}
          <div 
            className={`max-w-4xl mx-auto mb-16 md:mb-24 relative important-note-container transition-all duration-1000 delay-700 ${
              isInitialViewVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
            style={{ 
              transform: 'rotate(-1deg)',
            }}
          >
            <div 
              className="px-8 py-6 rounded-lg relative important-note-box"
              style={{ 
                background: 'var(--color-olive)',
                border: '2px dashed var(--color-olive-dark)',
                borderTop: '4px solid var(--color-olive-dark)',
                position: 'relative',
              }}
            >
              {/* Note pin/tape effect at top */}
              <div 
                className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                  style={{
                    width: '40px',
                    height: '20px',
                    background: 'var(--color-olive)',
                    borderRadius: '50% 50% 0 0',
                    opacity: 0.7,
                  }}
              />
              <div className="flex items-start gap-3 pt-2">
                <div 
                  className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ 
                    background: 'var(--color-olive)',
                    boxShadow: '0 2px 8px rgba(103, 105, 48, 0.3)'
                  }}
                >
                  <span className="text-base font-bold" style={{ color: textColor }}>!</span>
                </div>
                <p 
                  className="text-base md:text-lg text-left leading-relaxed flex-1"
                  style={{ fontFamily: 'var(--font-kollektif)', color: 'var(--color-pink-light)' }}
                >
                  <span className="font-bold" style={{ color: 'var(--color-pink-light)' }}>Important:</span> Executive team applications are currently closed. Applications will reopen in 2026 (typically end of school year). You can still join as a community volunteer and participate in all our events and activities!
            </p>
          </div>
        </div>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen pt-[120px] relative" style={{ 
      background: 'var(--color-cream)'
    }}>
      <div className="max-w-3xl mx-auto px-8 pt-4 md:pt-8 pb-8 md:pb-12 relative">
        {/* Progress Bar */}
        <div className="mb-8 animate-progress-fade-in">
          <div className="flex justify-between items-center mb-2">
            <span 
              className="text-sm font-semibold"
              style={{ fontFamily: 'var(--font-leiko)', color: 'var(--color-pink-light)' }}
            >
              Question {currentStep + 1} of {questions.length}
            </span>
            <span 
              className="text-sm font-semibold"
              style={{ fontFamily: 'var(--font-leiko)', color: 'var(--color-pink-light)' }}
            >
              {Math.round(progress)}%
            </span>
          </div>
          <div 
            className="w-full h-3 rounded-full overflow-hidden"
            style={{ background: 'var(--color-pink-light)' }}
          >
            <div
              className="h-full rounded-full transition-all duration-500 ease-out"
              style={{ 
                width: `${progress}%`,
                background: 'var(--color-olive)'
              }}
            />
          </div>
        </div>

        {/* Question Card with Slide Animation */}
        <div 
          className={`rounded-2xl p-8 md:p-12 shadow-lg mb-16 md:mb-24 min-h-[400px] flex flex-col justify-center transition-transform duration-500 ease-in-out ${
            slideDirection === 'right' ? 'slide-in-right' : 'slide-in-left'
          }`}
          style={{ 
            background: 'var(--color-olive)', 
            border: `3px solid var(--color-olive-dark)`,
            boxShadow: '0 8px 24px rgba(103, 105, 48, 0.2)'
          }}
        >
          <h2 
            className="text-3xl md:text-4xl font-bold mb-8"
            style={{ fontFamily: 'var(--font-freshwost)', color: 'var(--color-pink-light)' }}
          >
            {currentQuestion.label}
            {currentQuestion.required && (
              <span className="text-red-500 ml-1">*</span>
            )}
          </h2>

          <div className="mb-8">
            {currentQuestion.type === 'textarea' ? (
              <textarea
                id={`question-${currentQuestion.id}`}
                value={formData[currentQuestion.id]}
                onChange={(e) => handleChange(e.target.value)}
                placeholder={currentQuestion.placeholder}
                rows={6}
                className="w-full px-4 py-3 rounded-lg border-2 focus:outline-none focus:ring-2 transition-all duration-200 resize-none"
                style={{ 
                  borderColor: currentFieldError 
                    ? '#dc2626' 
                    : formData[currentQuestion.id] 
                      ? primaryColor 
                      : primaryColor,
                  fontFamily: 'var(--font-kollektif)',
                  background: 'white'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = currentFieldError ? '#dc2626' : primaryDarkColor
                  e.target.style.boxShadow = currentFieldError 
                    ? '0 0 0 3px rgba(220, 38, 38, 0.1)' 
                    : '0 0 0 3px rgba(103, 105, 48, 0.15)'
                }}
                onBlur={(e) => {
                  handleBlur()
                  e.target.style.borderColor = currentFieldError 
                    ? '#dc2626' 
                    : primaryColor
                  e.target.style.boxShadow = 'none'
                }}
              />
            ) : currentQuestion.type === 'select' ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    if (isDropdownOpen) {
                      // Start closing animation
                      setIsDropdownClosing(true)
                      setTimeout(() => {
                        setIsDropdownOpen(false)
                        setIsDropdownClosing(false)
                      }, 400) // Match animation duration
                    } else {
                      setIsDropdownOpen(true)
                      setIsDropdownClosing(false)
                    }
                  }}
                  className="w-full py-4 rounded-lg border-2 focus:outline-none focus:ring-2 transition-all duration-200 text-lg text-left flex items-center relative"
                style={{ 
                    borderColor: currentFieldError 
                      ? '#dc2626' 
                      : formData[currentQuestion.id] 
                        ? primaryColor 
                        : primaryColor,
                  fontFamily: 'var(--font-kollektif)',
                    background: 'white',
                    color: 'var(--color-pink-light)',
                    paddingLeft: '1rem',
                    paddingRight: '3rem'
                }}
                onFocus={(e) => {
                    e.currentTarget.style.borderColor = currentFieldError ? '#dc2626' : primaryDarkColor
                    e.currentTarget.style.boxShadow = currentFieldError 
                      ? '0 0 0 3px rgba(220, 38, 38, 0.1)' 
                      : '0 0 0 3px rgba(211, 165, 165, 0.1)'
                }}
                onBlur={(e) => {
                    // Delay to allow option click
                    setTimeout(() => {
                      if (isDropdownOpen) {
                        // Start closing animation
                        setIsDropdownClosing(true)
                        setTimeout(() => {
                          setIsDropdownOpen(false)
                          setIsDropdownClosing(false)
                          handleBlur()
                          if (e.currentTarget) {
                            e.currentTarget.style.borderColor = currentFieldError 
                              ? '#dc2626' 
                              : formData[currentQuestion.id] 
                                ? primaryColor 
                                : primaryColor
                            e.currentTarget.style.boxShadow = 'none'
                          }
                        }, 400) // Match animation duration
                      } else {
                        handleBlur()
                        if (e.currentTarget) {
                          e.currentTarget.style.borderColor = currentFieldError 
                            ? '#dc2626' 
                            : formData[currentQuestion.id] 
                              ? primaryColor 
                              : primaryColor
                          e.currentTarget.style.boxShadow = 'none'
                        }
                      }
                    }, 200)
                  }}
                >
                  <span style={{ 
                    color: formData[currentQuestion.id] ? 'var(--color-pink-light)' : primaryColor
                  }}>
                    {formData[currentQuestion.id] 
                      ? currentQuestion.options?.find(opt => opt.value === formData[currentQuestion.id])?.label
                      : currentQuestion.options?.[0]?.label || 'Select an option'}
                  </span>
                  <svg
                    className={`transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    style={{ 
                      color: primaryColor,
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
                {(isDropdownOpen || isDropdownClosing) && currentQuestion.options && (
                  <div
                    className={`absolute z-50 w-full mt-1 rounded-lg border-2 shadow-lg max-h-60 overflow-auto ${
                      isDropdownClosing ? 'animate-dropdown-roll-in' : 'animate-dropdown-roll-out'
                    }`}
                    style={{
                      background: 'white',
                      borderColor: primaryColor,
                      boxShadow: '0 8px 24px rgba(103, 105, 48, 0.2)'
                    }}
                  >
                    {currentQuestion.options.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => {
                          handleChange(option.value)
                          // Start closing animation
                          setIsDropdownClosing(true)
                          setTimeout(() => {
                            setIsDropdownOpen(false)
                            setIsDropdownClosing(false)
                          }, 400) // Match animation duration
                        }}
                        className="w-full text-left px-4 py-3 hover:bg-opacity-10 transition-colors"
                        style={{
                          fontFamily: 'var(--font-kollektif)',
                          color: formData[currentQuestion.id] === option.value ? 'var(--color-pink-light)' : 'var(--color-pink-light)',
                          background: formData[currentQuestion.id] === option.value 
                            ? 'rgba(103, 105, 48, 0.15)'
                            : 'transparent'
                        }}
                        onMouseEnter={(e) => {
                          if (formData[currentQuestion.id] !== option.value) {
                            e.currentTarget.style.background = 'rgba(103, 105, 48, 0.1)'
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (formData[currentQuestion.id] !== option.value) {
                            e.currentTarget.style.background = 'transparent'
                          }
                        }}
                      >
                    {option.label}
                      </button>
                ))}
                  </div>
                )}
              </div>
            ) : (
              <input
                id={`question-${currentQuestion.id}`}
                type={currentQuestion.type}
                value={formData[currentQuestion.id]}
                onChange={(e) => handleChange(e.target.value)}
                placeholder={currentQuestion.placeholder}
                className="w-full px-4 py-4 rounded-lg border-2 focus:outline-none focus:ring-2 transition-all duration-200 text-lg"
                style={{ 
                  borderColor: currentFieldError 
                    ? '#dc2626' 
                    : formData[currentQuestion.id] 
                      ? primaryColor 
                      : primaryColor,
                  fontFamily: 'var(--font-kollektif)',
                  background: 'white'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = currentFieldError ? '#dc2626' : primaryDarkColor
                  e.target.style.boxShadow = currentFieldError 
                    ? '0 0 0 3px rgba(220, 38, 38, 0.1)' 
                    : '0 0 0 3px rgba(103, 105, 48, 0.15)'
                }}
                onBlur={(e) => {
                  handleBlur()
                  e.target.style.borderColor = currentFieldError 
                    ? '#dc2626' 
                    : primaryColor
                  e.target.style.boxShadow = 'none'
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && canProceed && !isLastStep) {
                    e.preventDefault()
                    handleNext()
                  }
                }}
              />
            )}
          </div>
          
          {/* Error Message */}
          {currentFieldError && (
            <div className="mb-6 -mt-4">
              <p
                className="text-sm text-red-600"
                style={{ fontFamily: 'var(--font-kollektif)' }}
              >
                {currentFieldError}
              </p>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center gap-4">
            {currentStep === 0 ? (
              <button
                onClick={() => {
                  setHasStarted(false)
                  setCurrentStep(0)
                  setFormData({
                    name: '',
                    email: '',
                    phone: '',
                    program: '',
                    year: '',
                    whyJoin: '',
                    howHeard: ''
                  })
                }}
                className="px-6 py-3 rounded-full font-semibold transition-all duration-300 hover:scale-105"
                style={{
                  background: primaryColor,
                  color: 'var(--color-cream)',
                  fontFamily: 'var(--font-leiko)',
                  border: `2px solid ${primaryDarkColor}`
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = primaryDarkColor
                  e.currentTarget.style.color = 'var(--color-cream)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = primaryColor
                  e.currentTarget.style.color = 'var(--color-cream)'
                }}
              >
                Cancel
              </button>
            ) : (
            <button
              onClick={handlePrevious}
                className="px-6 py-3 rounded-full font-semibold transition-all duration-300 hover:scale-105"
              style={{
                  background: primaryColor,
                  color: 'var(--color-cream)',
                fontFamily: 'var(--font-leiko)',
                  border: `2px solid ${primaryDarkColor}`
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = primaryDarkColor
                e.currentTarget.style.color = 'var(--color-cream)'
              }}
              onMouseLeave={(e) => {
                  e.currentTarget.style.background = primaryColor
                  e.currentTarget.style.color = 'var(--color-cream)'
              }}
            >
              ← Previous
            </button>
            )}

            {isLastStep ? (
              <button
                onClick={handleSubmit}
                disabled={!canProceed || isSubmitting}
                className="px-8 py-3 rounded-full font-semibold transition-all duration-300 hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  background: canProceed ? primaryColor : 'rgba(211, 165, 165, 0.5)',
                  color: 'var(--color-cream)',
                  fontFamily: 'var(--font-leiko)',
                  border: `2px solid ${primaryDarkColor}`
                }}
                onMouseEnter={(e) => {
                  if (canProceed && !isSubmitting) {
                    e.currentTarget.style.background = primaryDarkColor
                    e.currentTarget.style.color = 'var(--color-cream)'
                  }
                }}
                onMouseLeave={(e) => {
                  if (canProceed && !isSubmitting) {
                    e.currentTarget.style.background = primaryColor
                    e.currentTarget.style.color = 'var(--color-cream)'
                  }
                }}
              >
                {isSubmitting ? 'Submitting...' : 'Submit →'}
              </button>
            ) : (
              <button
                onClick={handleNext}
                disabled={!canProceed}
                className="px-8 py-3 rounded-full font-semibold transition-all duration-300 hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  background: canProceed ? primaryColor : 'rgba(211, 165, 165, 0.5)',
                  color: 'var(--color-cream)',
                  fontFamily: 'var(--font-leiko)',
                  border: `2px solid ${primaryDarkColor}`
                }}
                onMouseEnter={(e) => {
                  if (canProceed) {
                    e.currentTarget.style.background = primaryDarkColor
                    e.currentTarget.style.color = 'var(--color-cream)'
                  }
                }}
                onMouseLeave={(e) => {
                  if (canProceed) {
                    e.currentTarget.style.background = primaryColor
                    e.currentTarget.style.color = 'var(--color-cream)'
                  }
                }}
              >
                Next →
              </button>
            )}
          </div>

          {/* Error Message */}
          {submitStatus === 'error' && (
            <div 
              className="mt-6 p-4 rounded-lg"
              style={{ 
                background: 'rgba(244, 67, 54, 0.1)',
                border: '2px solid rgba(244, 67, 54, 0.3)'
              }}
            >
              <p className="text-red-700" style={{ fontFamily: 'var(--font-kollektif)' }}>
                ✗ There was an error submitting your application. Please try again.
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
