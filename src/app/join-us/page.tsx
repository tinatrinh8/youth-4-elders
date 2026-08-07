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

    // Wait one frame so the success box ref is attached and laid out
    const rafId = requestAnimationFrame(() => {
      let boxLeft = window.innerWidth * 0.5 - 400
      let boxRight = window.innerWidth * 0.5 + 400
      let boxTop = window.innerHeight * 0.4
      let boxHeight = 400

      if (boxRef?.current) {
        const rect = boxRef.current.getBoundingClientRect()
        boxLeft = rect.left
        boxRight = rect.right
        boxTop = rect.top + rect.height / 2
        boxHeight = rect.height
      }
      runConfetti(ctx, canvas, confettiColors, boxLeft, boxRight, boxTop, boxHeight)
    })

    return () => cancelAnimationFrame(rafId)
  }, [boxRef])

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full pointer-events-none z-50"
      style={{ position: 'fixed' }}
    />
  )
}

function runConfetti(
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  confettiColors: string[],
  boxLeft: number,
  boxRight: number,
  boxTop: number,
  boxHeight: number
) {

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

  for (let i = 0; i < 100; i++) {
    const side = i % 2 === 0 ? 'left' : 'right'
    const startX = side === 'left' ? boxLeft : boxRight
    const startY = boxTop + (Math.random() - 0.5) * boxHeight

    const angle = side === 'left'
      ? Math.random() * Math.PI / 3 - Math.PI / 6
      : Math.random() * Math.PI / 3 + (2 * Math.PI / 3)
    const speed = Math.random() * 8 + 4

    confetti.push({
      x: startX,
      y: startY,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 2,
      color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
      size: Math.random() * 8 + 4,
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 15,
      side
    })
  }

  const startTime = Date.now()
  const duration = 2000
  let animationId: number

  const animate = () => {
    const elapsed = Date.now() - startTime
    if (elapsed > duration) return
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    confetti.forEach((piece) => {
      piece.x += piece.vx
      piece.y += piece.vy
      piece.rotation += piece.rotationSpeed
      piece.vy += 0.15
      ctx.save()
      ctx.translate(piece.x, piece.y)
      ctx.rotate((piece.rotation * Math.PI) / 180)
      ctx.fillStyle = piece.color
      ctx.fillRect(-piece.size / 2, -piece.size / 2, piece.size, piece.size)
      ctx.restore()
    })
    animationId = requestAnimationFrame(animate)
  }
  animationId = requestAnimationFrame(animate)

  const cleanup = () => cancelAnimationFrame(animationId)
  setTimeout(cleanup, duration + 100)
}

interface FormData {
  name: string
  email: string
  schoolStatus: '' | 'in-school' | 'not-in-school'
  schoolName: string
  program: string
  year: string
  schoolSituation: string
  schoolSituationOther: string
  whyJoin: string
  howHeard: string
  experience: string
  resumeFileName: string
  experienceOutline: boolean
  experienceResume: boolean
  linkedinUrl: string
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
    execMember: {
      title: string
      descriptionBeforeLink: string
      instagramLabel: string
      descriptionAfterLink: string
      teamRolesNote: string
    }
  }
  applyBox: { title: string; cta: string }
  form: {
    title: string
    cancel: string
    submit: string
    submitting: string
    errorMessage: string
    schoolStatusLabel: string
    schoolStatusInSchool: string
    schoolStatusNotInSchool: string
    schoolSituationLabel: string
    schoolSituationOtherLabel: string
    schoolSituationOtherPlaceholder: string
    schoolSituationOptions: { value: string; label: string }[]
    experienceChoiceLabel: string
    optionOutline: string
    optionResume: string
    resumeFileNote: string
    experiencePlaceholder: string
    linkedinLabel: string
    linkedinPlaceholder: string
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
  const emptyForm = (): FormData => ({
    name: '',
    email: '',
    schoolStatus: '',
    schoolName: '',
    program: '',
    year: '',
    schoolSituation: '',
    schoolSituationOther: '',
    whyJoin: '',
    howHeard: '',
    experience: '',
    resumeFileName: '',
    experienceOutline: false,
    experienceResume: false,
    linkedinUrl: ''
  })

  const [formData, setFormData] = useState<FormData>(emptyForm)
  const resumeFileRef = useRef<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [hasStarted, setHasStarted] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [showConfetti, setShowConfetti] = useState(false)
  const [, setIsInitialViewVisible] = useState(false)
  const [openSelectId, setOpenSelectId] = useState<keyof FormData | null>(null)
  const selectDropdownRefs = useRef<Record<string, HTMLDivElement | null>>({})

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (openSelectId && selectDropdownRefs.current[openSelectId] && !selectDropdownRefs.current[openSelectId]!.contains(e.target as Node)) {
        setOpenSelectId(null)
      }
    }
    if (openSelectId) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [openSelectId])

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

  const inputBorder = 'var(--color-brown-dark)'

  const handleFieldChange = (id: keyof FormData, value: string) => {
    setFormData({ ...formData, [id]: value })
    if (fieldErrors[id]) setFieldErrors({ ...fieldErrors, [id]: '' })
  }

  const handleFieldBlur = (id: keyof FormData) => {
    const value = formData[id]
    const str = typeof value === 'string' ? value : ''
    const error = validateField(id, str)
    if (error) setFieldErrors({ ...fieldErrors, [id]: error })
    else {
      const next = { ...fieldErrors }; delete next[id]; setFieldErrors(next)
    }
  }

  const isFormValid = () => {
    let valid = true
    const next: Record<string, string> = {}
    questions.forEach((q) => {
      // School-only fields are validated separately based on schoolStatus
      if (q.id === 'schoolName' || q.id === 'program' || q.id === 'year') return
      const val = formData[q.id]
      const err = validateField(q.id, typeof val === 'string' ? val : '')
      if (err && q.required) { valid = false; next[q.id] = err }
    })
    // School status follow-ups
    if (!formData.schoolStatus) {
      valid = false
      next.schoolStatus = 'Please tell us if you are currently in school'
    } else if (formData.schoolStatus === 'in-school') {
      if (!formData.schoolName.trim()) {
        valid = false
        next.schoolName = 'Please enter your university or college'
      }
    } else if (formData.schoolStatus === 'not-in-school') {
      if (!formData.schoolSituation) {
        valid = false
        next.schoolSituation = 'Please select what best describes you'
      } else if (formData.schoolSituation === 'Other' && !formData.schoolSituationOther.trim()) {
        valid = false
        next.schoolSituationOther = 'Please tell us a bit more'
      }
    }

    // Require either resume upload or experience outline (choose one)
    const noChoice = !formData.experienceOutline && !formData.experienceResume
    const choseOutlineButEmpty = formData.experienceOutline && !formData.experience.trim()
    const choseResumeButNoFile = formData.experienceResume && !formData.resumeFileName
    if (noChoice) {
      valid = false
      next.experienceOrResume = 'Please choose to upload a resume or outline your relevant experience'
    } else {
      if (choseOutlineButEmpty) {
        valid = false
        next.experience = 'Please outline your relevant experience'
      }
      if (choseResumeButNoFile) {
        valid = false
        next.resumeFileName = 'Please upload a resume'
      }
    }
    setFieldErrors(next)
    return valid
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const lower = file.name.toLowerCase()
      const okType =
        file.type === 'application/pdf' ||
        file.type === 'application/msword' ||
        file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
        lower.endsWith('.pdf') ||
        lower.endsWith('.doc') ||
        lower.endsWith('.docx')
      if (!okType) {
        resumeFileRef.current = null
        setFormData({ ...formData, resumeFileName: '' })
        setFieldErrors({ ...fieldErrors, resumeFileName: 'Please upload a PDF or DOC/DOCX file' })
        e.target.value = ''
        return
      }
      if (file.size > 8 * 1024 * 1024) {
        resumeFileRef.current = null
        setFormData({ ...formData, resumeFileName: '' })
        setFieldErrors({ ...fieldErrors, resumeFileName: 'Resume must be 8 MB or smaller' })
        e.target.value = ''
        return
      }
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
      const body = new window.FormData()
      body.append('name', formData.name)
      body.append('email', formData.email)
      body.append('schoolStatus', formData.schoolStatus)
      body.append('schoolName', formData.schoolName)
      body.append('program', formData.program)
      body.append('year', formData.year)
      body.append('schoolSituation', formData.schoolSituation)
      body.append('schoolSituationOther', formData.schoolSituationOther)
      body.append('whyJoin', formData.whyJoin)
      body.append('howHeard', formData.howHeard)
      body.append('experience', formData.experience)
      body.append('linkedinUrl', formData.linkedinUrl)
      body.append('experienceOutline', String(formData.experienceOutline))
      body.append('experienceResume', String(formData.experienceResume))
      if (formData.experienceResume && resumeFileRef.current) {
        body.append('resume', resumeFileRef.current)
      }

      const response = await fetch('/api/join-us', {
        method: 'POST',
        body,
      })

      const result = await response.json().catch(() => ({}))

      if (response.ok) {
        await new Promise(resolve => setTimeout(resolve, 800))
        setShowConfetti(true)
        setSubmitStatus('success')
        setFormData(emptyForm())
        resumeFileRef.current = null
        setHasStarted(false)
        setTimeout(() => setShowConfetti(false), 2000)
      } else {
        console.error('Join form error:', result?.error || response.statusText)
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
        document.body.style.background = 'var(--color-brown-dark)'
        document.documentElement.style.background = 'var(--color-brown-dark)'
      })
    })
    
    return () => {
      cancelAnimationFrame(rafId)
      // IMPORTANT: Don't cleanup background on unmount
      // The NavigationBar will handle transitioning back to cream when isJoinUsPage becomes false
    }
  }, [])

  // Page load animation: headline (word-fade blur) → caption slide up → content pulls up
  const [headlineVisible, setHeadlineVisible] = useState(false)
  const [captionVisible, setCaptionVisible] = useState(false)
  const [contentVisible, setContentVisible] = useState(false)
  useEffect(() => {
    const t1 = setTimeout(() => setHeadlineVisible(true), 100)
    const t2 = setTimeout(() => setCaptionVisible(true), 1800)   // after title appears
    const t3 = setTimeout(() => setContentVisible(true), 2500)  // after caption animation finishes (caption is 0.6s)
    const t4 = setTimeout(() => setIsInitialViewVisible(true), 2800)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4) }
  }, [])


  const successBoxRef = useRef<HTMLDivElement>(null)

  // Scroll success box into view (centered) when showing success
  useEffect(() => {
    if (submitStatus === 'success') {
      const id = requestAnimationFrame(() => {
        successBoxRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      })
      return () => cancelAnimationFrame(id)
    }
  }, [submitStatus])

  // Unmount confetti after animation so it doesn't stay stuck on screen
  useEffect(() => {
    if (submitStatus === 'success' && showConfetti) {
      const t = setTimeout(() => setShowConfetti(false), 2100)
      return () => clearTimeout(t)
    }
  }, [submitStatus, showConfetti])

  if (isSubmitting && submitStatus === 'idle') {
    return (
      <main className="min-h-screen pt-[120px] pb-[120px] flex items-center justify-center" style={{ background: 'transparent' }}>
        <div className="text-center">
          <div className="mb-6 inline-block h-12 w-12 rounded-full border-4 border-[var(--color-cream)]/30 border-t-[var(--color-cream)] animate-spin" />
          <p className="text-xl font-medium text-[var(--color-cream)]" style={{ fontFamily: 'var(--font-leiko)' }}>
            {content.loading.message}
          </p>
        </div>
      </main>
    )
  }

  if (submitStatus === 'success') {
    return (
      <main className="min-h-screen pt-[120px] pb-[120px] relative overflow-hidden" style={{ background: 'transparent' }}>
        {showConfetti && <ConfettiComponent boxRef={successBoxRef as React.RefObject<HTMLDivElement>} />}
        <div className="mx-auto px-6 py-12 flex justify-center">
          <div
            ref={successBoxRef}
            className="w-[min(32rem,92vw)] h-[min(32rem,92vw)] rounded-2xl bg-[var(--color-cream)] p-8 md:p-10 shadow-lg border-2 border-[var(--color-brown-dark)] animate-success-fade-in flex flex-col items-center justify-center text-center"
          >
            <div className="mb-5 flex justify-center">
              <Image src="/assets/join us/sign up confirmed.png" alt="Sign up confirmed" width={180} height={180} className="object-contain" />
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
              className="px-6 py-3 rounded-full font-semibold text-base md:text-lg text-[var(--color-cream)] bg-[var(--color-brown-dark)] hover:opacity-90 transition-opacity"
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
      <main className="min-h-screen pb-20" style={{ background: 'transparent' }}>
        {showConfetti && <ConfettiComponent />}
        {/* Headline + tagline */}
        <div className="w-full pt-[72px] sm:pt-[80px] px-4 sm:px-8 pb-4 md:pb-6 max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-[var(--color-cream)]" style={{ fontFamily: 'var(--font-vintage-stylist)' }}>
              {(content.page.headline as string).split(/\s+/).map((word, i) => (
                <span key={i}>
                  <span
                    className={headlineVisible ? 'word-fade-in-up-blur-slow' : ''}
                    style={{
                      display: 'inline-block',
                      animationDelay: headlineVisible ? `${i * 0.2}s` : undefined,
                      opacity: headlineVisible ? undefined : 0
                    }}
                  >
                    {word.replace(/[.,]/g, '')}
                  </span>
                  {word.endsWith('.') ? '.' : ''}{i < (content.page.headline as string).split(/\s+/).length - 1 ? '\u00A0' : ''}
                </span>
              ))}
            </h1>
            <p
              className={`text-base md:text-lg text-[var(--color-cream)] mt-2 ${captionVisible ? 'join-us-caption-reveal' : 'opacity-0'}`}
              style={{ fontFamily: 'var(--font-leiko)', fontStyle: 'italic' }}
            >
              {content.page.tagline}
            </p>
          </div>
          </div>
          
        {/* One box: General member + Exec member + Ready to join CTA; extends down with form */}
        <div className={`max-w-7xl mx-auto px-4 sm:px-8 mt-8 md:mt-10 ${contentVisible ? 'join-us-content-pull-up' : ''}`}
          style={contentVisible ? { animationDelay: '0s' } : { opacity: 0 }}
        >
          <div className="rounded-2xl border-2 border-[var(--color-brown-dark)]/20 overflow-hidden bg-[var(--color-cream)] shadow-lg max-w-5xl mx-auto w-full">
            <div className="p-6 md:p-8 space-y-6 md:space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                <div className="rounded-xl border-2 border-[var(--color-brown-dark)] bg-[var(--color-pink-light)] px-5 py-4">
                  <h3 className="text-lg md:text-xl font-bold text-[var(--color-brown-dark)] mb-2" style={{ fontFamily: 'var(--font-leiko)' }}>
                    {content.cards.generalMember.title}
                  </h3>
                  <p className="text-sm md:text-base text-[var(--color-brown-dark)] leading-relaxed opacity-90" style={{ fontFamily: 'var(--font-kollektif)' }}>
                    {content.cards.generalMember.description}
            </p>
          </div>
                <div className="rounded-xl border-2 border-[var(--color-brown-dark)] bg-[var(--color-pink-light)] px-5 py-4">
                  <h3 className="text-lg md:text-xl font-bold text-[var(--color-brown-dark)] mb-2" style={{ fontFamily: 'var(--font-leiko)' }}>
                    {content.cards.execMember.title}
                  </h3>
                  <p className="text-sm md:text-base text-[var(--color-brown-dark)] leading-relaxed opacity-90" style={{ fontFamily: 'var(--font-kollektif)' }}>
                    {content.cards.execMember.descriptionBeforeLink}
                    <a href="https://www.instagram.com/youth4elders/" target="_blank" rel="noopener noreferrer" className="font-semibold underline hover:no-underline text-[var(--color-brown-dark)]">
                      {content.cards.execMember.instagramLabel}
                    </a>
                    {content.cards.execMember.descriptionAfterLink}
                    <strong className="font-bold text-[var(--color-brown-dark)]">Team roles</strong>
                    {content.cards.execMember.teamRolesNote}
                  </p>
                </div>
              </div>
            <button
                type="button"
                onClick={() => setHasStarted(true)}
                className="w-full text-center p-5 md:p-6 flex flex-col items-center gap-2 rounded-xl bg-[var(--color-brown-dark)] hover:bg-[var(--color-brown-dark)]/90 transition-opacity border-2 border-[var(--color-cream)]/40"
              >
                <h3 className="text-lg md:text-xl font-bold text-[var(--color-cream)]" style={{ fontFamily: 'var(--font-leiko)' }}>
                  {content.applyBox.title}
                </h3>
            </button>
            </div>
            <div className={`overflow-hidden transition-all duration-500 ease-out ${hasStarted ? 'max-h-[3600px] opacity-100' : 'max-h-0 opacity-0'}`}>
              <div className={`bg-[var(--color-cream)] border-t-2 border-[var(--color-brown-dark)]/20 p-8 md:p-10 ${hasStarted ? 'join-us-form-roll-down' : ''}`}>
        <div className="max-w-5xl w-full">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-[var(--color-brown-dark)]" style={{ fontFamily: 'var(--font-leiko)' }}>
            {content.form.title}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {questions.filter((q) => q.id === 'name' || q.id === 'email').map((q) => (
              <div key={q.id}>
                <label className="block text-base md:text-lg font-semibold text-[var(--color-brown-dark)] mb-2" style={{ fontFamily: 'var(--font-leiko)' }}>
                  {q.label}{q.required && <span className="text-[var(--color-error)] ml-0.5">*</span>}
                </label>
                <input
                  type={q.type}
                  value={(typeof formData[q.id] === 'string' ? formData[q.id] : '') as string}
                  onChange={(e) => handleFieldChange(q.id, e.target.value)}
                  onBlur={() => handleFieldBlur(q.id)}
                  placeholder={q.placeholder}
                  className="w-full px-5 py-4 rounded-xl border-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-brown-dark)]/20 transition-all text-[var(--color-brown-dark)] text-base md:text-lg"
                  style={{ fontFamily: 'var(--font-kollektif)', borderColor: fieldErrors[q.id] ? 'var(--color-error)' : inputBorder, background: 'var(--color-pink-light)' }}
                />
                {fieldErrors[q.id] && (
                  <p className="text-base text-[var(--color-error)] mt-1.5" style={{ fontFamily: 'var(--font-kollektif)' }}>{fieldErrors[q.id]}</p>
                )}
              </div>
            ))}

            {/* School status */}
            <div className="md:col-span-2">
              <label className="block text-base md:text-lg font-semibold text-[var(--color-brown-dark)] mb-2" style={{ fontFamily: 'var(--font-leiko)' }}>
                {content.form.schoolStatusLabel}<span className="text-[var(--color-error)] ml-0.5">*</span>
              </label>
              {fieldErrors.schoolStatus && (
                <p className="text-base text-[var(--color-error)] mb-2" style={{ fontFamily: 'var(--font-kollektif)' }}>{fieldErrors.schoolStatus}</p>
              )}
              <div className="flex flex-wrap gap-3 mb-4">
                <button
                  type="button"
                  onClick={() => {
                    setFormData((prev) => ({
                      ...prev,
                      schoolStatus: 'in-school',
                      schoolSituation: '',
                      schoolSituationOther: '',
                    }))
                    setFieldErrors((prev) => {
                      const next = { ...prev }
                      delete next.schoolStatus
                      delete next.schoolSituation
                      delete next.schoolSituationOther
                      return next
                    })
                  }}
                  className="px-5 py-4 rounded-xl border-2 text-base font-medium transition-colors"
                  style={{
                    fontFamily: 'var(--font-kollektif)',
                    borderColor: formData.schoolStatus === 'in-school' ? 'var(--color-brown-dark)' : inputBorder,
                    background: formData.schoolStatus === 'in-school' ? 'rgba(98, 32, 47, 0.08)' : 'var(--color-pink-light)',
                    color: 'var(--color-brown-dark)'
                  }}
                >
                  {content.form.schoolStatusInSchool}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setFormData((prev) => ({
                      ...prev,
                      schoolStatus: 'not-in-school',
                      schoolName: '',
                      program: '',
                      year: '',
                    }))
                    setFieldErrors((prev) => {
                      const next = { ...prev }
                      delete next.schoolStatus
                      delete next.schoolName
                      delete next.program
                      delete next.year
                      return next
                    })
                  }}
                  className="px-5 py-4 rounded-xl border-2 text-base font-medium transition-colors"
                  style={{
                    fontFamily: 'var(--font-kollektif)',
                    borderColor: formData.schoolStatus === 'not-in-school' ? 'var(--color-brown-dark)' : inputBorder,
                    background: formData.schoolStatus === 'not-in-school' ? 'rgba(98, 32, 47, 0.08)' : 'var(--color-pink-light)',
                    color: 'var(--color-brown-dark)'
                  }}
                >
                  {content.form.schoolStatusNotInSchool}
                </button>
              </div>

              {formData.schoolStatus === 'in-school' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {questions.filter((q) => q.id === 'schoolName' || q.id === 'program' || q.id === 'year').map((q) => (
                    <div key={q.id} className={q.id === 'schoolName' ? 'md:col-span-2' : ''}>
                      <label className="block text-base md:text-lg font-semibold text-[var(--color-brown-dark)] mb-2" style={{ fontFamily: 'var(--font-leiko)' }}>
                        {q.label}{q.required && <span className="text-[var(--color-error)] ml-0.5">*</span>}
                      </label>
                      {q.type === 'select' ? (
                        <div className={`relative w-full ${openSelectId === q.id ? 'z-[100]' : ''}`} ref={(el) => { selectDropdownRefs.current[q.id] = el }}>
                          <button
                            type="button"
                            onClick={() => setOpenSelectId((prev) => (prev === q.id ? null : q.id))}
                            onBlur={() => handleFieldBlur(q.id)}
                            className="w-full flex items-center justify-between pl-5 pr-12 py-4 rounded-xl border-2 text-left transition-colors cursor-pointer"
                            style={{
                              fontFamily: 'var(--font-kollektif)',
                              borderColor: fieldErrors[q.id] ? 'var(--color-error)' : inputBorder,
                              background: 'var(--color-pink-light)',
                              color: formData[q.id] ? 'var(--color-brown-dark)' : 'rgba(98, 32, 47, 0.6)',
                              fontSize: '1rem'
                            }}
                          >
                            <span className="text-base md:text-lg">{q.options?.find((o) => o.value === formData[q.id])?.label ?? 'Select...'}</span>
                            <svg
                              className={`w-5 h-5 flex-shrink-0 absolute right-5 top-1/2 -translate-y-1/2 transition-transform ${openSelectId === q.id ? 'rotate-180' : ''}`}
                              style={{ color: 'var(--color-brown-dark)' }}
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </button>
                          {openSelectId === q.id && q.options && (
                            <div
                              className="absolute top-full left-0 right-0 mt-2 rounded-xl overflow-y-auto overflow-x-hidden z-[9999] py-2 max-h-48 border-2"
                              style={{
                                background: 'var(--color-cream)',
                                borderColor: 'var(--color-brown-dark)',
                                boxShadow: '0 8px 24px rgba(98, 32, 47, 0.2)'
                              }}
                            >
                              {q.options.map((opt) => (
                                <button
                                  key={opt.value || 'empty'}
                                  type="button"
                                  className="block w-full text-left px-5 py-3.5 text-base md:text-lg transition-colors border-0"
                                  style={{
                                    fontFamily: 'var(--font-kollektif)',
                                    color: 'var(--color-brown-dark)',
                                    background: 'transparent'
                                  }}
                                  onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(98, 32, 47, 0.08)' }}
                                  onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}
                                  onClick={() => {
                                    handleFieldChange(q.id, opt.value)
                                    setOpenSelectId(null)
                                  }}
                                >
                                  {opt.label}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      ) : (
                        <input
                          type="text"
                          value={(typeof formData[q.id] === 'string' ? formData[q.id] : '') as string}
                          onChange={(e) => handleFieldChange(q.id, e.target.value)}
                          onBlur={() => handleFieldBlur(q.id)}
                          placeholder={q.placeholder}
                          className="w-full px-5 py-4 rounded-xl border-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-brown-dark)]/20 transition-all text-[var(--color-brown-dark)] text-base md:text-lg"
                          style={{ fontFamily: 'var(--font-kollektif)', borderColor: fieldErrors[q.id] ? 'var(--color-error)' : inputBorder, background: 'var(--color-pink-light)' }}
                        />
                      )}
                    </div>
                  ))}
                </div>
              )}

              {formData.schoolStatus === 'not-in-school' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-base md:text-lg font-semibold text-[var(--color-brown-dark)] mb-2" style={{ fontFamily: 'var(--font-leiko)' }}>
                      {content.form.schoolSituationLabel}<span className="text-[var(--color-error)] ml-0.5">*</span>
                    </label>
                    {fieldErrors.schoolSituation && (
                      <p className="text-base text-[var(--color-error)] mb-2" style={{ fontFamily: 'var(--font-kollektif)' }}>{fieldErrors.schoolSituation}</p>
                    )}
                    <div className={`relative w-full ${openSelectId === 'schoolSituation' ? 'z-[100]' : ''}`} ref={(el) => { selectDropdownRefs.current.schoolSituation = el }}>
                      <button
                        type="button"
                        onClick={() => setOpenSelectId((prev) => (prev === 'schoolSituation' ? null : 'schoolSituation'))}
                        className="w-full flex items-center justify-between pl-5 pr-12 py-4 rounded-xl border-2 text-left transition-colors cursor-pointer"
                        style={{
                          fontFamily: 'var(--font-kollektif)',
                          borderColor: fieldErrors.schoolSituation ? 'var(--color-error)' : inputBorder,
                          background: 'var(--color-pink-light)',
                          color: formData.schoolSituation ? 'var(--color-brown-dark)' : 'rgba(98, 32, 47, 0.6)',
                          fontSize: '1rem'
                        }}
                      >
                        <span className="text-base md:text-lg">
                          {content.form.schoolSituationOptions.find((o) => o.value === formData.schoolSituation)?.label ?? 'Select...'}
                        </span>
                        <svg
                          className={`w-5 h-5 flex-shrink-0 absolute right-5 top-1/2 -translate-y-1/2 transition-transform ${openSelectId === 'schoolSituation' ? 'rotate-180' : ''}`}
                          style={{ color: 'var(--color-brown-dark)' }}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      {openSelectId === 'schoolSituation' && (
                        <div
                          className="absolute top-full left-0 right-0 mt-2 rounded-xl overflow-y-auto overflow-x-hidden z-[9999] py-2 max-h-56 border-2"
                          style={{
                            background: 'var(--color-cream)',
                            borderColor: 'var(--color-brown-dark)',
                            boxShadow: '0 8px 24px rgba(98, 32, 47, 0.2)'
                          }}
                        >
                          {content.form.schoolSituationOptions.map((opt) => (
                            <button
                              key={opt.value || 'empty'}
                              type="button"
                              className="block w-full text-left px-5 py-3.5 text-base md:text-lg transition-colors border-0"
                              style={{
                                fontFamily: 'var(--font-kollektif)',
                                color: 'var(--color-brown-dark)',
                                background: 'transparent'
                              }}
                              onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(98, 32, 47, 0.08)' }}
                              onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}
                              onClick={() => {
                                setFormData((prev) => ({
                                  ...prev,
                                  schoolSituation: opt.value,
                                  schoolSituationOther: opt.value === 'Other' ? prev.schoolSituationOther : '',
                                }))
                                setFieldErrors((prev) => {
                                  const next = { ...prev }
                                  delete next.schoolSituation
                                  if (opt.value !== 'Other') delete next.schoolSituationOther
                                  return next
                                })
                                setOpenSelectId(null)
                              }}
                            >
                              {opt.label}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  {formData.schoolSituation === 'Other' && (
                    <div>
                      <label className="block text-base md:text-lg font-semibold text-[var(--color-brown-dark)] mb-2" style={{ fontFamily: 'var(--font-leiko)' }}>
                        {content.form.schoolSituationOtherLabel}<span className="text-[var(--color-error)] ml-0.5">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.schoolSituationOther}
                        onChange={(e) => {
                          setFormData((prev) => ({ ...prev, schoolSituationOther: e.target.value }))
                          if (fieldErrors.schoolSituationOther) {
                            setFieldErrors((prev) => {
                              const next = { ...prev }
                              delete next.schoolSituationOther
                              return next
                            })
                          }
                        }}
                        placeholder={content.form.schoolSituationOtherPlaceholder}
                        className="w-full px-5 py-4 rounded-xl border-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-brown-dark)]/20 transition-all text-[var(--color-brown-dark)] text-base md:text-lg"
                        style={{ fontFamily: 'var(--font-kollektif)', borderColor: fieldErrors.schoolSituationOther ? 'var(--color-error)' : inputBorder, background: 'var(--color-pink-light)' }}
                      />
                      {fieldErrors.schoolSituationOther && (
                        <p className="text-base text-[var(--color-error)] mt-1.5" style={{ fontFamily: 'var(--font-kollektif)' }}>{fieldErrors.schoolSituationOther}</p>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            {questions.filter((q) => !['name', 'email', 'schoolName', 'program', 'year'].includes(q.id)).map((q) => (
              <div key={q.id} className={q.type === 'textarea' || q.type === 'file' ? 'md:col-span-2' : ''}>
                {q.id === 'experience' ? (
                  <>
                    <label className="block text-base md:text-lg font-semibold text-[var(--color-brown-dark)] mb-2" style={{ fontFamily: 'var(--font-leiko)' }}>
                      {content.form.experienceChoiceLabel}<span className="text-[var(--color-error)] ml-0.5">*</span>
                    </label>
                    {fieldErrors.experienceOrResume && (
                      <p className="text-base text-[var(--color-error)] mb-2" style={{ fontFamily: 'var(--font-kollektif)' }}>{fieldErrors.experienceOrResume}</p>
                    )}
                    <div className="flex flex-wrap gap-3 mb-4">
            <button
                        type="button"
              onClick={() => {
                          resumeFileRef.current = null
                          setFormData((prev) => ({ ...prev, experienceOutline: true, experienceResume: false, resumeFileName: '' }))
                          setFieldErrors((prev) => { const next = { ...prev }; delete next.experienceOrResume; return next })
                        }}
                        className="px-5 py-4 rounded-xl border-2 text-base font-medium transition-colors"
              style={{
                          fontFamily: 'var(--font-kollektif)',
                          borderColor: formData.experienceOutline ? 'var(--color-brown-dark)' : inputBorder,
                          background: formData.experienceOutline ? 'rgba(98, 32, 47, 0.08)' : 'var(--color-pink-light)',
                          color: 'var(--color-brown-dark)'
                        }}
                      >
                        {content.form.optionOutline}
            </button>
                      <button
                        type="button"
                        onClick={() => {
                          resumeFileRef.current = null
                          setFormData((prev) => ({ ...prev, experienceResume: true, experienceOutline: false, experience: '' }))
                          setFieldErrors((prev) => { const next = { ...prev }; delete next.experienceOrResume; return next })
                        }}
                        className="px-5 py-4 rounded-xl border-2 text-base font-medium transition-colors"
              style={{ 
                          fontFamily: 'var(--font-kollektif)',
                          borderColor: formData.experienceResume ? 'var(--color-brown-dark)' : inputBorder,
                          background: formData.experienceResume ? 'rgba(98, 32, 47, 0.08)' : 'var(--color-pink-light)',
                          color: 'var(--color-brown-dark)'
                        }}
                      >
                        {content.form.optionResume}
                      </button>
                    </div>
                    {(formData.experienceOutline || formData.experienceResume) && (
                      <div className="space-y-6 mb-6">
                        {formData.experienceOutline && (
                          <div>
                            <textarea
                              value={formData.experience}
                              onChange={(e) => handleFieldChange('experience', e.target.value)}
                              onBlur={() => handleFieldBlur('experience')}
                              placeholder={content.form.experiencePlaceholder}
                              rows={4}
                              className="w-full px-5 py-4 rounded-xl border-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-brown-dark)]/20 transition-all resize-none text-[var(--color-brown-dark)] text-base md:text-lg"
                              style={{ fontFamily: 'var(--font-kollektif)', borderColor: fieldErrors.experience ? 'var(--color-error)' : inputBorder, background: 'var(--color-pink-light)' }}
                            />
                            {fieldErrors.experience && (
                              <p className="text-base text-[var(--color-error)] mt-1.5" style={{ fontFamily: 'var(--font-kollektif)' }}>{fieldErrors.experience}</p>
                            )}
                </div>
                        )}
                        {formData.experienceResume && (
                          <div className="space-y-2">
                            <p className="text-sm text-[var(--color-brown-dark)] opacity-80" style={{ fontFamily: 'var(--font-kollektif)' }}>{content.form.resumeFileNote}</p>
                            <input
                              type="file"
                              accept=".pdf,.doc,.docx"
                              onChange={handleFileChange}
                              className="w-full text-base md:text-lg text-[var(--color-brown-dark)] file:mr-4 file:py-3 file:px-5 file:rounded-lg file:border-0 file:font-semibold file:bg-[var(--color-brown-dark)] file:text-[var(--color-cream)] file:text-base"
                              style={{ fontFamily: 'var(--font-kollektif)', borderColor: fieldErrors.resumeFileName ? 'var(--color-error)' : 'transparent' }}
                            />
                            {fieldErrors.resumeFileName && (
                              <p className="text-base text-[var(--color-error)] mt-1.5" style={{ fontFamily: 'var(--font-kollektif)' }}>{fieldErrors.resumeFileName}</p>
                            )}
                            {formData.resumeFileName && !fieldErrors.resumeFileName && (
                              <p className="text-base text-[var(--color-brown-dark)] opacity-80" style={{ fontFamily: 'var(--font-kollektif)' }}>Selected: {formData.resumeFileName}</p>
                            )}
          </div>
                        )}
        </div>
                    )}
                    <label className="block text-base md:text-lg font-semibold text-[var(--color-brown-dark)] mb-2 mt-4" style={{ fontFamily: 'var(--font-leiko)' }}>
                      {content.form.linkedinLabel}
                    </label>
                    <input
                      type="url"
                      value={formData.linkedinUrl}
                      onChange={(e) => setFormData((prev) => ({ ...prev, linkedinUrl: e.target.value }))}
                      placeholder={content.form.linkedinPlaceholder}
                      className="w-full px-5 py-4 rounded-xl border-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-brown-dark)]/20 transition-all text-[var(--color-brown-dark)] text-base md:text-lg"
                      style={{ fontFamily: 'var(--font-kollektif)', borderColor: fieldErrors.linkedinUrl ? 'var(--color-error)' : inputBorder, background: 'var(--color-pink-light)' }}
                    />
                  </>
                ) : (
                <>
                <label className="block text-base md:text-lg font-semibold text-[var(--color-brown-dark)] mb-2" style={{ fontFamily: 'var(--font-leiko)' }}>
                  {q.label}{q.required && <span className="text-[var(--color-error)] ml-0.5">*</span>}
                </label>
                {q.type === 'textarea' ? (
              <textarea
                    value={(typeof formData[q.id] === 'string' ? formData[q.id] : '') as string}
                    onChange={(e) => handleFieldChange(q.id, e.target.value)}
                    onBlur={() => handleFieldBlur(q.id)}
                    placeholder={q.placeholder}
                    rows={5}
                    className="w-full px-5 py-4 rounded-xl border-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-brown-dark)]/20 transition-all resize-none text-[var(--color-brown-dark)] text-base md:text-lg"
                    style={{ fontFamily: 'var(--font-kollektif)', borderColor: fieldErrors[q.id] ? 'var(--color-error)' : inputBorder, background: 'var(--color-pink-light)' }}
                  />
                ) : q.type === 'select' ? (
                  <div className={`relative w-full ${openSelectId === q.id ? 'z-[100]' : ''}`} ref={(el) => { selectDropdownRefs.current[q.id] = el }}>
                <button
                  type="button"
                      onClick={() => setOpenSelectId((prev) => (prev === q.id ? null : q.id))}
                      onBlur={() => handleFieldBlur(q.id)}
                      className="w-full flex items-center justify-between pl-5 pr-12 py-4 rounded-xl border-2 text-left transition-colors cursor-pointer"
                style={{ 
                  fontFamily: 'var(--font-kollektif)',
                        borderColor: fieldErrors[q.id] ? 'var(--color-error)' : inputBorder,
                        background: 'var(--color-pink-light)',
                        color: formData[q.id] ? 'var(--color-brown-dark)' : 'rgba(98, 32, 47, 0.6)',
                        fontSize: '1rem'
                      }}
                    >
                      <span className="text-base md:text-lg">{q.options?.find((o) => o.value === formData[q.id])?.label ?? 'Select...'}</span>
                      <svg
                        className={`w-5 h-5 flex-shrink-0 absolute right-5 top-1/2 -translate-y-1/2 transition-transform ${openSelectId === q.id ? 'rotate-180' : ''}`}
                        style={{ color: 'var(--color-brown-dark)' }}
                    fill="none"
                      stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                    {openSelectId === q.id && q.options && (
                  <div
                        className="absolute top-full left-0 right-0 mt-2 rounded-xl overflow-y-auto overflow-x-hidden z-[9999] py-2 max-h-48 border-2"
                    style={{
                          background: 'var(--color-cream)',
                          borderColor: 'var(--color-brown-dark)',
                          boxShadow: '0 8px 24px rgba(98, 32, 47, 0.2)'
                        }}
                      >
                        {q.options.map((opt) => (
                      <button
                            key={opt.value || 'empty'}
                        type="button"
                            className="block w-full text-left px-5 py-3.5 text-base md:text-lg transition-colors border-0"
                        style={{
                          fontFamily: 'var(--font-kollektif)',
                              color: 'var(--color-brown-dark)',
                              background: 'transparent'
                            }}
                            onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(98, 32, 47, 0.08)' }}
                            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}
                            onClick={() => {
                              handleFieldChange(q.id, opt.value)
                              setOpenSelectId(null)
                            }}
                          >
                            {opt.label}
                      </button>
                ))}
                  </div>
                    )}
                  </div>
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
                    value={(typeof formData[q.id] === 'string' ? formData[q.id] : '') as string}
                    onChange={(e) => handleFieldChange(q.id, e.target.value)}
                    onBlur={() => handleFieldBlur(q.id)}
                    placeholder={q.placeholder}
                    className="w-full px-5 py-4 rounded-xl border-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-brown-dark)]/20 transition-all text-[var(--color-brown-dark)] text-base md:text-lg"
                    style={{ fontFamily: 'var(--font-kollektif)', borderColor: fieldErrors[q.id] ? 'var(--color-error)' : inputBorder, background: 'var(--color-pink-light)' }}
                  />
                )}
                {fieldErrors[q.id] && (
                  <p className="text-base text-[var(--color-error)] mt-1.5" style={{ fontFamily: 'var(--font-kollektif)' }}>{fieldErrors[q.id]}</p>
                )}
                </>
                )}
          </div>
            ))}
            </div>

          {submitStatus === 'error' && (
            <div className="w-full mt-4 mb-4 p-4 rounded-xl border-2 flex items-start justify-between gap-3" style={{ background: 'var(--color-error)', borderColor: 'var(--color-error)', color: 'var(--color-cream)' }}>
              <p className="text-sm flex-1" style={{ fontFamily: 'var(--font-kollektif)', color: 'var(--color-cream)' }}>
                {content.form.errorMessage}
              </p>
              <button type="button" onClick={() => setSubmitStatus('idle')} className="flex-shrink-0 text-lg opacity-80 hover:opacity-100" style={{ color: 'var(--color-cream)' }} aria-label="Close">×</button>
            </div>
          )}
          <div className="flex justify-between items-center gap-4 flex-wrap mt-10">
              <button
                type="button"
                onClick={() => {
                  setFormData(emptyForm()); resumeFileRef.current = null; setHasStarted(false)
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
        </div>
              </div>
            </div>
        </div>
      </div>
    </main>
  )
}
