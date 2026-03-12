'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import joinUsContent from '@/content/join-us.json'

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
  program: string
  year: string
  whyJoin: string
  howHeard: string
  experience: string
  resumeFileName: string
}

interface Question {
  id: keyof FormData
  label: string
  type: 'text' | 'email' | 'tel' | 'select' | 'textarea' | 'file'
  required: boolean
  placeholder?: string
  options?: { value: string; label: string }[]
  accept?: string
}

const content = joinUsContent as {
  page: { headline: string; tagline: string }
  cards: {
    generalMember: { title: string; description: string }
    execMember: { title: string; descriptionBeforeLink: string; instagramLabel: string; descriptionAfterLink: string }
  }
  applyBox: { title: string; cta: string }
  form: {
    title: string
    cancel: string
    submit: string
    submitting: string
    errorMessage: string
    questions: Array<{
      id: string
      label: string
      type: string
      required: boolean
      placeholder?: string
      options?: { value: string; label: string }[]
      accept?: string
    }>
  }
  success: { title: string; messageBeforeLink: string; instagramLabel: string; messageAfterLink: string; submitAnother: string }
  loading: { message: string }
}

const questions: Question[] = content.form.questions.map((q) => ({
  id: q.id as keyof FormData,
  label: q.label,
  type: q.type as Question['type'],
  required: q.required,
  placeholder: q.placeholder,
  options: q.options,
  accept: q.accept
}))

export default function JoinUs() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    program: '',
    year: '',
    whyJoin: '',
    howHeard: '',
    experience: '',
    resumeFileName: ''
  })
  const resumeFileRef = useRef<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [hasStarted, setHasStarted] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [showConfetti, setShowConfetti] = useState(false)
  const [isInitialViewVisible, setIsInitialViewVisible] = useState(false)

  // Design: dark text on light backgrounds for readability

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

  const inputBorder = 'var(--color-pink-medium)'

  const handleFieldChange = (id: keyof FormData, value: string) => {
    setFormData({ ...formData, [id]: value })
    if (fieldErrors[id]) setFieldErrors({ ...fieldErrors, [id]: '' })
  }

  const handleFieldBlur = (id: keyof FormData) => {
    const value = formData[id]
    const error = validateField(id, value)
    if (error) setFieldErrors({ ...fieldErrors, [id]: error })
    else {
      const next = { ...fieldErrors }; delete next[id]; setFieldErrors(next)
    }
  }

  const isFormValid = () => {
    let valid = true
    const next: Record<string, string> = {}
    questions.forEach((q) => {
      const err = validateField(q.id, formData[q.id])
      if (err && q.required) { valid = false; next[q.id] = err }
    })
    setFieldErrors((prev) => ({ ...prev, ...next }))
    return valid
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      resumeFileRef.current = file
      setFormData({ ...formData, resumeFileName: file.name })
    }
    if (fieldErrors.resumeFileName) {
      setFieldErrors({ ...fieldErrors, resumeFileName: '' })
    }
  }

  const handleSubmitForm = async () => {
    if (!isFormValid()) return

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
          program: '',
          year: '',
          whyJoin: '',
          howHeard: '',
          experience: '',
          resumeFileName: ''
        })
        resumeFileRef.current = null
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

  if (isSubmitting && submitStatus === 'idle') {
    return (
      <main className="min-h-screen pt-[120px] pb-[120px] flex items-center justify-center" style={{ background: 'var(--color-cream)' }}>
        <div className="text-center">
          <div className="mb-6 inline-block h-12 w-12 rounded-full border-4 border-[var(--color-pink-light)] border-t-[var(--color-brown-dark)] animate-spin" />
          <p className="text-xl font-medium text-[var(--color-brown-dark)]" style={{ fontFamily: 'var(--font-leiko)' }}>
            {content.loading.message}
          </p>
        </div>
      </main>
    )
  }

  if (submitStatus === 'success') {
    return (
      <main className="min-h-screen pt-[120px] pb-[120px] relative overflow-hidden" style={{ background: 'var(--color-cream)' }}>
        {showConfetti && <ConfettiComponent boxRef={successBoxRef as React.RefObject<HTMLDivElement>} />}
        <div className="max-w-lg mx-auto px-6 py-12 text-center">
          <div ref={successBoxRef} className="rounded-2xl bg-[var(--color-olive-light)] p-10 shadow-lg border border-[var(--color-olive)] animate-success-fade-in">
            <div className="mb-6 flex justify-center">
              <Image src="/assets/join us/sign up confirmed.png" alt="Sign up confirmed" width={160} height={160} className="object-contain" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-3 text-[var(--color-brown-dark)]" style={{ fontFamily: 'var(--font-vintage-stylist)' }}>
              {content.success.title}
            </h2>
            <p className="text-base md:text-lg text-[var(--color-brown-dark)] mb-6 leading-relaxed" style={{ fontFamily: 'var(--font-leiko)' }}>
              {content.success.messageBeforeLink}
              <a href="https://www.instagram.com/youth4elders/" target="_blank" rel="noopener noreferrer" className="font-semibold text-[var(--color-brown-dark)] underline hover:no-underline">
                {content.success.instagramLabel}
              </a>
              {content.success.messageAfterLink}
            </p>
            <button
              onClick={() => { setSubmitStatus('idle'); setHasStarted(false) }}
              className="px-6 py-3 rounded-full font-semibold text-[var(--color-cream)] bg-[var(--color-brown-dark)] hover:opacity-90 transition-opacity"
              style={{ fontFamily: 'var(--font-leiko)' }}
            >
              {content.success.submitAnother}
            </button>
          </div>
        </div>
      </main>
    )
  }

  return (
      <main className="min-h-screen pb-20" style={{ background: 'var(--color-cream)' }}>
        {showConfetti && <ConfettiComponent />}
        {/* Headline + tagline */}
        <div className="w-full pt-[72px] sm:pt-[80px] px-4 sm:px-8 pb-4 md:pb-6 max-w-7xl mx-auto">
          <div className={`text-center transition-all duration-500 ${isInitialViewVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-[var(--color-brown-dark)]" style={{ fontFamily: 'var(--font-vintage-stylist)' }}>
              {content.page.headline}
            </h1>
            <p className="text-base md:text-lg text-[var(--color-brown-dark)] mt-2 opacity-90" style={{ fontFamily: 'var(--font-leiko)', fontStyle: 'italic' }}>
              {content.page.tagline}
            </p>
          </div>
        </div>

        {/* General member + Exec member — info only */}
        <div className={`max-w-7xl mx-auto px-4 sm:px-8 pb-6 transition-all duration-500 ${isInitialViewVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <div className="rounded-2xl bg-[var(--color-olive)] p-5 md:p-6 border border-[var(--color-olive-dark)] min-h-[140px] flex flex-col">
              <h3 className="text-lg md:text-xl font-bold text-[var(--color-cream)] mb-2" style={{ fontFamily: 'var(--font-leiko)' }}>
                {content.cards.generalMember.title}
              </h3>
              <p className="text-sm md:text-base text-[var(--color-cream)] leading-relaxed opacity-95 flex-1" style={{ fontFamily: 'var(--font-kollektif)' }}>
                {content.cards.generalMember.description}
              </p>
            </div>
            <div className="rounded-2xl bg-[var(--color-olive)] p-5 md:p-6 border border-[var(--color-olive-dark)] min-h-[140px] flex flex-col">
              <h3 className="text-lg md:text-xl font-bold text-[var(--color-cream)] mb-2" style={{ fontFamily: 'var(--font-leiko)' }}>
                {content.cards.execMember.title}
              </h3>
              <p className="text-sm md:text-base text-[var(--color-cream)] leading-relaxed opacity-95 flex-1" style={{ fontFamily: 'var(--font-kollektif)' }}>
                {content.cards.execMember.descriptionBeforeLink}
                <a href="https://www.instagram.com/youth4elders/" target="_blank" rel="noopener noreferrer" className="font-semibold underline hover:no-underline text-[var(--color-olive-light)]">
                  {content.cards.execMember.instagramLabel}
                </a>
                {content.cards.execMember.descriptionAfterLink}
              </p>
            </div>
          </div>
        </div>

        {/* I'm interested — own box; extends down with form */}
        <div className={`max-w-7xl mx-auto px-4 sm:px-8 mt-8 md:mt-10 transition-all duration-500 ${isInitialViewVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <div className="rounded-2xl border-2 border-[var(--color-brown-dark)] overflow-hidden bg-[var(--color-cream)] shadow-sm max-w-5xl mx-auto w-full">
            <button
              type="button"
              onClick={() => setHasStarted(true)}
              className="w-full text-center p-5 md:p-6 flex flex-col items-center gap-2 hover:bg-[var(--color-pink-light)]/40 transition-colors"
            >
              <h3 className="text-lg md:text-xl font-bold text-[var(--color-brown-dark)]" style={{ fontFamily: 'var(--font-leiko)' }}>
                {content.applyBox.title}
              </h3>
              {!hasStarted && (
                <span className="text-[var(--color-brown-dark)]/80 text-sm font-semibold inline-flex items-center gap-1" style={{ fontFamily: 'var(--font-leiko)' }}>
                  {content.applyBox.cta}
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </span>
              )}
            </button>
            <div className={`overflow-hidden transition-all duration-500 ease-out ${hasStarted ? 'max-h-[3600px] opacity-100' : 'max-h-0 opacity-0'}`}>
              <div className="bg-[var(--color-pink-light)] border-t-2 border-[var(--color-pink-dark)] p-8 md:p-10">
        <div className="max-w-5xl w-full">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-[var(--color-brown-dark)]" style={{ fontFamily: 'var(--font-leiko)' }}>
            {content.form.title}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {questions.map((q) => (
              <div key={q.id} className={q.type === 'textarea' || q.type === 'file' ? 'md:col-span-2' : ''}>
                <label className="block text-base md:text-lg font-semibold text-[var(--color-brown-dark)] mb-2" style={{ fontFamily: 'var(--font-leiko)' }}>
                  {q.label}{q.required && <span className="text-red-500 ml-0.5">*</span>}
                </label>
                {q.type === 'textarea' ? (
                  <textarea
                    value={formData[q.id]}
                    onChange={(e) => handleFieldChange(q.id, e.target.value)}
                    onBlur={() => handleFieldBlur(q.id)}
                    placeholder={q.placeholder}
                    rows={5}
                    className="w-full px-5 py-4 rounded-xl border-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-brown-dark)]/20 transition-all resize-none text-[var(--color-brown-dark)] text-base md:text-lg"
                    style={{ fontFamily: 'var(--font-kollektif)', borderColor: fieldErrors[q.id] ? '#dc2626' : inputBorder, background: 'var(--color-pink-medium)' }}
                  />
                ) : q.type === 'select' ? (
                  <select
                    value={formData[q.id]}
                    onChange={(e) => handleFieldChange(q.id, e.target.value)}
                    onBlur={() => handleFieldBlur(q.id)}
                    className="w-full px-5 py-4 rounded-xl border-2 text-[var(--color-brown-dark)] bg-[var(--color-pink-medium)] text-base md:text-lg"
                    style={{ fontFamily: 'var(--font-kollektif)', borderColor: fieldErrors[q.id] ? '#dc2626' : inputBorder }}
                  >
                    {q.options?.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                ) : q.type === 'file' ? (
                  <div className="space-y-2">
                    <input
                      type="file"
                      accept={q.accept || '.pdf,.doc,.docx'}
                      onChange={handleFileChange}
                      className="w-full text-base md:text-lg text-[var(--color-brown-dark)] file:mr-4 file:py-3 file:px-5 file:rounded-lg file:border-0 file:font-semibold file:bg-[var(--color-brown-dark)] file:text-[var(--color-cream)] file:text-base"
                      style={{ fontFamily: 'var(--font-kollektif)' }}
                    />
                    {formData.resumeFileName && (
                      <p className="text-base text-[var(--color-brown-dark)] opacity-80" style={{ fontFamily: 'var(--font-kollektif)' }}>Selected: {formData.resumeFileName}</p>
                    )}
                  </div>
                ) : (
                  <input
                    type={q.type}
                    value={formData[q.id]}
                    onChange={(e) => handleFieldChange(q.id, e.target.value)}
                    onBlur={() => handleFieldBlur(q.id)}
                    placeholder={q.placeholder}
                    className="w-full px-5 py-4 rounded-xl border-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-brown-dark)]/20 transition-all text-[var(--color-brown-dark)] text-base md:text-lg"
                    style={{ fontFamily: 'var(--font-kollektif)', borderColor: fieldErrors[q.id] ? '#dc2626' : inputBorder, background: 'var(--color-pink-medium)' }}
                  />
                )}
                {fieldErrors[q.id] && (
                  <p className="text-base text-red-600 mt-1.5" style={{ fontFamily: 'var(--font-kollektif)' }}>{fieldErrors[q.id]}</p>
                )}
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center gap-4 flex-wrap mt-10">
              <button
                type="button"
                onClick={() => {
                  setFormData({ name: '', email: '', program: '', year: '', whyJoin: '', howHeard: '', experience: '', resumeFileName: '' }); resumeFileRef.current = null; setHasStarted(false)
                }}
                className="px-6 py-3 rounded-full font-semibold text-base md:text-lg text-[var(--color-brown-dark)] bg-transparent border-2 border-[var(--color-brown-dark)] hover:bg-[var(--color-brown-dark)] hover:text-[var(--color-cream)] transition-colors"
                style={{ fontFamily: 'var(--font-leiko)' }}
              >
                {content.form.cancel}
              </button>
            <button
              type="button"
              onClick={handleSubmitForm}
              disabled={isSubmitting}
              className="px-8 py-3 rounded-full font-semibold text-base md:text-lg text-[var(--color-cream)] bg-[var(--color-brown-dark)] hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
              style={{ fontFamily: 'var(--font-leiko)' }}
            >
              {isSubmitting ? content.form.submitting : content.form.submit}
            </button>
          </div>

          {submitStatus === 'error' && (
            <div className="mt-8 p-5 rounded-xl bg-red-50 border border-red-200">
              <p className="text-base text-red-700" style={{ fontFamily: 'var(--font-kollektif)' }}>
                {content.form.errorMessage}
              </p>
            </div>
          )}
        </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    )
}
