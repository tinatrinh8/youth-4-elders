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

    const confettiColors = [
      '#62202F', // brown-dark
      '#FBF7E8', // cream
      '#F8DAD4', // pink-light
      '#F5D0C6', // pink-medium
      '#6f6509', // olive
    ]

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
  schoolStatus: '' | 'university-college' | 'high-school' | 'not-in-school'
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
  teamRole: string
  teamRoleSecond: string
  referralName: string
  uOttawaConfirm: boolean
}

type ApplicationType = 'general' | 'team'

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
      description: string
      applicationsOpen: boolean
      openStatus: string
      pausedLabel: string
      closedStatus: string
      closedCta: string
  }
  }
  applyBox: { generalTitle: string; teamTitle: string; cta: string }
  form: {
    title: string
    cancel: string
    submit: string
    submitting: string
    errorMessage: string
    schoolStatusLabel: string
    schoolStatusOptions: { value: string; label: string }[]
    highSchoolNameLabel: string
    highSchoolNamePlaceholder: string
    highSchoolGradeLabel: string
    highSchoolGradeOptions: { value: string; label: string }[]
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
  teamForm: {
    title: string
    uOttawaConfirmEyebrow: string
    uOttawaConfirmTitle: string
    uOttawaConfirmBody: string
    uOttawaConfirmLabel: string
    uOttawaConfirmError: string
    programLabel: string
    programPlaceholder: string
    yearLabel: string
    yearRequired: boolean
    teamRoleFirstLabel: string
    teamRoleSecondLabel: string
    referralNameLabel: string
    referralNamePlaceholder: string
    whyJoinLabel: string
    whyJoinPlaceholder: string
    teamRoleOptions: { value: string; label: string }[]
    teamRoleSecondOptions: { value: string; label: string }[]
  }
  success: {
    general: {
      title: string
      messageBeforeLink: string
      instagramLabel: string
      messageAfterLink: string
      cue: string
    }
    team: {
      title: string
      message: string
      cue: string
    }
    submitAnother: string
  }
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
    linkedinUrl: '',
    teamRole: '',
    teamRoleSecond: '',
    referralName: '',
    uOttawaConfirm: false,
  })

  const [formData, setFormData] = useState<FormData>(emptyForm)
  const resumeFileRef = useRef<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [hasStarted, setHasStarted] = useState(false)
  const [applicationType, setApplicationType] = useState<ApplicationType | null>(null)
  const [submittedApplicationType, setSubmittedApplicationType] = useState<ApplicationType | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [showConfetti, setShowConfetti] = useState(false)
  const [, setIsInitialViewVisible] = useState(false)
  const [openSelectId, setOpenSelectId] = useState<keyof FormData | null>(null)
  const selectDropdownRefs = useRef<Record<string, HTMLDivElement | null>>({})

  const isTeamApp = applicationType === 'team'
  const teamApplicationsOpen = content.cards.execMember.applicationsOpen

  const startApplication = (type: ApplicationType) => {
    if (type === 'team' && !teamApplicationsOpen) return
    setApplicationType(type)
    resumeFileRef.current = null
    setFieldErrors({})
    setSubmitStatus('idle')
    setFormData(
      type === 'team'
        ? {
            ...emptyForm(),
            schoolStatus: 'university-college',
            schoolName: 'University of Ottawa',
            uOttawaConfirm: false,
          }
        : emptyForm()
    )
    setHasStarted(true)
  }

  const resetApplication = () => {
    setFormData(emptyForm())
    resumeFileRef.current = null
    setHasStarted(false)
    setApplicationType(null)
    setSubmittedApplicationType(null)
    setFieldErrors({})
    setSubmitStatus('idle')
  }

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
    if (id === 'whyJoin' && !value.trim()) return 'This field is required'
    if (id === 'name' || id === 'email') {
      if (!value.trim()) return 'This field is required'
    }
    if (!isTeamApp && !value.trim() && questions.find(q => q.id === id)?.required) {
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

    ;(['name', 'email', 'whyJoin'] as const).forEach((id) => {
      const err = validateField(id, formData[id])
      if (err) {
        valid = false
        next[id] = err
      }
    })

    if (isTeamApp) {
      if (!formData.uOttawaConfirm) {
        valid = false
        next.uOttawaConfirm = content.teamForm.uOttawaConfirmError
      }
      if (!formData.program.trim()) {
        valid = false
        next.program = 'Please enter your program'
      }
      if (!formData.year) {
        valid = false
        next.year = 'Please select your year'
      }
      if (!formData.teamRole) {
        valid = false
        next.teamRole = 'Please select your first-choice role'
      }
      if (!formData.teamRoleSecond) {
        valid = false
        next.teamRoleSecond = 'Please select a second-choice role (or “No second preference”)'
      } else if (
        formData.teamRole &&
        formData.teamRoleSecond !== 'No second preference' &&
        formData.teamRoleSecond === formData.teamRole
      ) {
        valid = false
        next.teamRoleSecond = 'Please choose a different fallback role'
      }
    } else {
    questions.forEach((q) => {
        if (q.id === 'schoolName' || q.id === 'program' || q.id === 'year' || q.id === 'name' || q.id === 'email' || q.id === 'whyJoin') return
      const val = formData[q.id]
      const err = validateField(q.id, typeof val === 'string' ? val : '')
      if (err && q.required) { valid = false; next[q.id] = err }
    })
      if (!formData.schoolStatus) {
        valid = false
        next.schoolStatus = 'Please select your current school status'
      } else if (formData.schoolStatus === 'university-college') {
        if (!formData.schoolName.trim()) {
          valid = false
          next.schoolName = 'Please enter your university or college'
        }
      } else if (formData.schoolStatus === 'high-school') {
        if (!formData.schoolName.trim()) {
          valid = false
          next.schoolName = 'Please enter your high school'
        }
        if (!formData.year) {
          valid = false
          next.year = 'Please select your grade'
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
    }

    // Experience / resume is only required for team applications
    if (isTeamApp) {
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

    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
    document.documentElement.scrollTop = 0
    document.body.scrollTop = 0

    setIsSubmitting(true)
    setSubmitStatus('idle')

    try {
      const body = new window.FormData()
      body.append('applicationType', applicationType || 'general')
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
      body.append('uOttawaConfirm', String(formData.uOttawaConfirm))
      body.append('teamRole', formData.teamRole)
      body.append('teamRoleSecond', formData.teamRoleSecond)
      body.append('referralName', formData.referralName)
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
        setSubmittedApplicationType(applicationType || 'general')
        setSubmitStatus('success')
        setFormData(emptyForm())
        resumeFileRef.current = null
        setHasStarted(false)
        setApplicationType(null)
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
    document.body.classList.add('join-us-page')
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
      document.body.classList.remove('join-us-page')
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

  // Long form leaves the window scrolled down — jump to top for loading + success
  useEffect(() => {
    if (!(isSubmitting || submitStatus === 'success')) return

    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
    document.documentElement.scrollTop = 0
    document.body.scrollTop = 0

    if (submitStatus !== 'success') return

    const timers = [50, 150, 350].map((ms) =>
      window.setTimeout(() => {
        successBoxRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' })
      }, ms)
    )
    return () => timers.forEach((id) => window.clearTimeout(id))
  }, [isSubmitting, submitStatus])

  // Unmount confetti after animation so it doesn't stay stuck on screen
  useEffect(() => {
    if (submitStatus === 'success' && showConfetti) {
      const t = setTimeout(() => setShowConfetti(false), 2100)
      return () => clearTimeout(t)
    }
  }, [submitStatus, showConfetti])

  if (isSubmitting && submitStatus === 'idle') {
    return (
      <main
        className="fixed inset-0 z-[50] flex items-center justify-center px-6 join-us-page-lock"
        style={{ background: 'var(--color-brown-dark)' }}
      >
        <div className="flex flex-col items-center text-center">
          <div className="mb-6 inline-block h-12 w-12 rounded-full border-4 border-[var(--color-cream)]/30 border-t-[var(--color-cream)] animate-spin" />
          <p className="text-xl font-medium text-[var(--color-cream)]" style={{ fontFamily: 'var(--font-leiko)' }}>
            {content.loading.message}
          </p>
        </div>
      </main>
    )
  }

  if (submitStatus === 'success') {
    const isTeamSuccess = submittedApplicationType === 'team'
    const successCopy = isTeamSuccess ? content.success.team : content.success.general
    return (
      <main className="join-us-success-view join-us-page-lock min-h-screen pt-20 pb-20 lg:pt-[120px] lg:pb-[120px] relative overflow-hidden flex items-start lg:items-center justify-center" style={{ background: 'transparent' }}>
        {showConfetti && <ConfettiComponent boxRef={successBoxRef as React.RefObject<HTMLDivElement>} />}
        <div className="join-us-success-wrap mx-auto px-4 py-0 lg:px-6 lg:py-12 flex justify-center w-full">
          <div
            ref={successBoxRef}
            className="join-us-success-card w-[min(20rem,90vw)] lg:w-[min(32rem,92vw)] min-h-0 lg:min-h-[min(32rem,92vw)] rounded-2xl bg-[var(--color-cream)] p-4 sm:p-5 lg:p-10 shadow-lg border-2 border-[var(--color-brown-dark)] animate-success-fade-in flex flex-col items-center justify-center text-center"
          >
            <div className="mb-3 lg:mb-5 flex justify-center">
              <Image src="/assets/join us/sign up confirmed.png" alt="Sign up confirmed" width={180} height={180} className="object-contain w-20 h-auto sm:w-24 lg:w-[180px]" />
            </div>
            <h2 className="text-xl sm:text-2xl lg:text-4xl font-bold mb-2 lg:mb-3 text-[var(--color-brown-dark)]" style={{ fontFamily: 'var(--font-vintage-stylist)' }}>
              {successCopy.title}
            </h2>
            {isTeamSuccess ? (
              <p className="text-sm lg:text-lg text-[var(--color-brown-dark)] mb-2.5 lg:mb-4 leading-relaxed" style={{ fontFamily: 'var(--font-leiko)' }}>
                {content.success.team.message}
              </p>
            ) : (
              <p className="text-sm lg:text-lg text-[var(--color-brown-dark)] mb-2.5 lg:mb-4 leading-relaxed" style={{ fontFamily: 'var(--font-leiko)' }}>
                {content.success.general.messageBeforeLink}
              <a href="https://www.instagram.com/youth4elders/" target="_blank" rel="noopener noreferrer" className="font-semibold text-[var(--color-brown-dark)] underline hover:no-underline">
                  {content.success.general.instagramLabel}
                </a>
                {content.success.general.messageAfterLink}
              </p>
            )}
            <p
              className="text-xs sm:text-sm lg:text-base text-[var(--color-brown-dark)] mb-4 lg:mb-6 leading-relaxed italic"
              style={{ fontFamily: 'var(--font-leiko)', opacity: 0.85 }}
            >
              {successCopy.cue}
            </p>
            <button
              onClick={() => { setSubmitStatus('idle'); resetApplication() }}
              className="px-4 py-2 lg:px-6 lg:py-3 rounded-full font-semibold text-sm lg:text-lg text-[var(--color-cream)] bg-[var(--color-brown-dark)] hover:opacity-90 transition-opacity"
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
      <main className="min-h-screen pb-20 join-us-page-lock" style={{ background: 'transparent' }}>
        {showConfetti && <ConfettiComponent />}
        {/* Headline + tagline */}
        <div className="join-us-hero w-full pt-[72px] sm:pt-[80px] px-4 sm:px-8 pb-4 md:pb-6 max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-[var(--color-cream)]" style={{ fontFamily: 'var(--font-vintage-stylist)' }}>
              {(content.page.headline as string).split(/\s+/).map((word, i) => (
                <span key={i}>
                  <span
                    className={headlineVisible ? 'word-fade-in-up-blur-slow' : ''}
                    style={{
                      display: 'inline-block',
                      ['--word-fade-delay' as string]: headlineVisible ? `${i * 0.2}s` : undefined,
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
              className={`join-us-tagline text-base md:text-lg text-[var(--color-cream)] mt-2 ${captionVisible ? 'join-us-caption-reveal' : 'opacity-0'}`}
              style={{ fontFamily: 'var(--font-leiko)', fontStyle: 'italic' }}
            >
              {content.page.tagline}
            </p>
          </div>
          </div>
          
        {/* One box: General member + Exec member + Ready to join CTA; extends down with form */}
        <div className={`join-us-content max-w-7xl mx-auto px-4 sm:px-8 mt-8 md:mt-10 ${contentVisible ? 'join-us-content-pull-up' : ''}`}
          style={contentVisible ? { animationDelay: '0s' } : { opacity: 0 }}
        >
          <div className="join-us-card rounded-2xl border-2 border-[var(--color-brown-dark)]/20 overflow-hidden bg-[var(--color-cream)] shadow-lg max-w-5xl mx-auto w-full">
            <div className="join-us-card-intro p-4 md:p-5">
              <div className="join-us-role-grid grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
                <div className="join-us-role-block flex flex-col gap-3">
                  <div className="join-us-role-card rounded-xl border-2 border-[var(--color-brown-dark)] bg-[var(--color-pink-light)] px-5 py-3 flex-1">
                  <h3 className="text-lg md:text-xl font-bold text-[var(--color-brown-dark)] mb-2" style={{ fontFamily: 'var(--font-leiko)' }}>
                    {content.cards.generalMember.title}
                  </h3>
                  <p className="text-sm md:text-base text-[var(--color-brown-dark)] leading-relaxed opacity-90" style={{ fontFamily: 'var(--font-kollektif)' }}>
                    {content.cards.generalMember.description}
            </p>
          </div>
                  <button
                    type="button"
                    onClick={() => startApplication('general')}
                    className="join-us-role-cta w-full text-center px-4 py-3 md:px-5 md:py-4 flex items-center justify-center rounded-xl bg-[var(--color-brown-dark)] hover:bg-[var(--color-brown-dark)]/90 transition-opacity border-2 border-[var(--color-cream)]/40"
                  >
                    <span className="text-sm md:text-base font-bold text-[var(--color-cream)]" style={{ fontFamily: 'var(--font-leiko)' }}>
                      {content.applyBox.generalTitle}
                    </span>
                  </button>
                </div>
                <div className={`join-us-role-block flex flex-col gap-3 ${teamApplicationsOpen ? '' : 'is-paused'}`}>
                  <div className="join-us-role-card relative rounded-xl border-2 border-[var(--color-brown-dark)] bg-[var(--color-pink-light)] px-5 py-3 flex-1">
                  <h3 className="text-lg md:text-xl font-bold text-[var(--color-brown-dark)] mb-2" style={{ fontFamily: 'var(--font-leiko)' }}>
                    {content.cards.execMember.title}
                  </h3>
                  <p className="text-sm md:text-base text-[var(--color-brown-dark)] leading-relaxed opacity-90" style={{ fontFamily: 'var(--font-kollektif)' }}>
                      {content.cards.execMember.description}
                    </p>
                    {teamApplicationsOpen && (
                    <p
                      className="mt-2 text-sm md:text-base font-bold italic underline underline-offset-2"
                      style={{ fontFamily: 'var(--font-kollektif)', color: 'var(--color-brown-dark)' }}
                    >
                      {content.cards.execMember.openStatus}
                    </p>
                    )}
                    {!teamApplicationsOpen && (
                      <div className="join-us-paused-stamp" aria-hidden>
                        <span className="join-us-paused-stamp-word">{content.cards.execMember.pausedLabel}</span>
                        <span className="join-us-paused-stamp-sub">{content.cards.execMember.closedStatus}</span>
                </div>
                    )}
              </div>
            <button
                type="button"
                    onClick={() => startApplication('team')}
                    disabled={!teamApplicationsOpen}
                    aria-disabled={!teamApplicationsOpen}
                    aria-label={
                      teamApplicationsOpen
                        ? content.applyBox.teamTitle
                        : `${content.cards.execMember.pausedLabel}. ${content.cards.execMember.closedStatus}.`
                    }
                    className={`join-us-role-cta w-full text-center px-4 py-3 md:px-5 md:py-4 flex items-center justify-center rounded-xl border-2 ${
                      teamApplicationsOpen
                        ? 'bg-[var(--color-brown-dark)] hover:bg-[var(--color-brown-dark)]/90 transition-opacity border-[var(--color-cream)]/40'
                        : 'join-us-paused-seal cursor-default'
                    }`}
                  >
                    <span
                      className={`text-sm md:text-base font-bold ${teamApplicationsOpen ? 'text-[var(--color-cream)]' : 'join-us-paused-seal-label'}`}
                      style={{ fontFamily: teamApplicationsOpen ? 'var(--font-leiko)' : 'var(--font-vintage-stylist)' }}
                    >
                      {teamApplicationsOpen ? content.applyBox.teamTitle : content.cards.execMember.closedCta}
                    </span>
            </button>
            </div>
              </div>
            </div>
            <div className={`join-us-form-shell overflow-hidden transition-all duration-500 ease-out ${hasStarted ? 'is-open max-h-[8000px] opacity-100' : 'max-h-0 opacity-0'}`}>
              <div className={`join-us-form bg-[var(--color-cream)] border-t-2 border-[var(--color-brown-dark)]/20 p-8 md:p-10 ${hasStarted ? 'join-us-form-roll-down' : ''}`}>
        <div className="max-w-5xl w-full">
          <h2 className="join-us-form-title text-2xl md:text-3xl font-bold mb-8 text-[var(--color-brown-dark)]" style={{ fontFamily: 'var(--font-leiko)' }}>
            {isTeamApp ? content.teamForm.title : content.form.title}
          </h2>

          <div className="join-us-form-fields grid grid-cols-1 md:grid-cols-2 gap-6">
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

            {/* Team: university / program / year / role */}
            {isTeamApp && (
              <>
                <div className="md:col-span-2">
                  <div
                    className="overflow-hidden rounded-lg border-2"
                    style={{
                      borderColor: fieldErrors.uOttawaConfirm ? 'var(--color-error)' : 'var(--color-brown-dark)',
                      background: 'var(--color-cream)',
                    }}
                  >
                    <div
                      className="px-5 py-3 border-b-2"
                      style={{
                        borderColor: 'var(--color-brown-dark)',
                        background: 'var(--color-pink-medium)',
                      }}
                    >
                      <p
                        className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.2em]"
                        style={{ fontFamily: 'var(--font-kollektif)', color: 'var(--color-brown-dark)' }}
                      >
                        {content.teamForm.uOttawaConfirmEyebrow}
                      </p>
                      <p
                        className="mt-1 text-base md:text-lg font-bold"
                        style={{ fontFamily: 'var(--font-leiko)', color: 'var(--color-brown-dark)' }}
                      >
                        {content.teamForm.uOttawaConfirmTitle}
                      </p>
                    </div>

                    <div className="px-5 py-4 space-y-4" style={{ background: 'var(--color-cream)' }}>
                      <p
                        className="text-sm md:text-base leading-relaxed"
                        style={{ fontFamily: 'var(--font-kollektif)', color: 'var(--color-brown-dark)' }}
                      >
                        {content.teamForm.uOttawaConfirmBody}
                      </p>

                      <button
                        type="button"
                        onClick={() => {
                          setFormData((prev) => ({
                            ...prev,
                            uOttawaConfirm: !prev.uOttawaConfirm,
                            schoolName: 'University of Ottawa',
                            schoolStatus: 'university-college',
                          }))
                          setFieldErrors((prev) => {
                            const next = { ...prev }
                            delete next.uOttawaConfirm
                            return next
                          })
                        }}
                        className="w-full flex items-start gap-3 rounded-md border-2 px-4 py-3.5 text-left transition-colors"
                        style={{
                          fontFamily: 'var(--font-kollektif)',
                          borderColor: fieldErrors.uOttawaConfirm
                            ? 'var(--color-error)'
                            : 'var(--color-brown-dark)',
                          background: formData.uOttawaConfirm
                            ? 'var(--color-pink-medium)'
                            : 'var(--color-pink-light)',
                          color: 'var(--color-brown-dark)',
                        }}
                        aria-pressed={formData.uOttawaConfirm}
                      >
                        <span
                          className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-sm border-2"
                          style={{
                            borderColor: fieldErrors.uOttawaConfirm
                              ? 'var(--color-error)'
                              : 'var(--color-brown-dark)',
                            background: formData.uOttawaConfirm
                              ? 'var(--color-brown-dark)'
                              : 'var(--color-cream)',
                          }}
                          aria-hidden
                        >
                          {formData.uOttawaConfirm && (
                            <svg className="h-3.5 w-3.5 text-[var(--color-cream)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </span>
                        <span className="min-w-0">
                          <span className="block text-[10px] font-bold uppercase tracking-[0.16em] mb-1" style={{ color: 'var(--color-brown-dark)' }}>
                            Applicant acknowledgement
                          </span>
                          <span className="block text-sm md:text-base leading-snug font-medium">
                            {content.teamForm.uOttawaConfirmLabel}
                            <span className="text-[var(--color-error)] ml-0.5">*</span>
                          </span>
                        </span>
                      </button>
                    </div>
                  </div>
                  {fieldErrors.uOttawaConfirm && (
                    <p className="text-base text-[var(--color-error)] mt-2" style={{ fontFamily: 'var(--font-kollektif)' }}>{fieldErrors.uOttawaConfirm}</p>
                  )}
                </div>
                <div>
                  <label className="block text-base md:text-lg font-semibold text-[var(--color-brown-dark)] mb-2" style={{ fontFamily: 'var(--font-leiko)' }}>
                    {content.teamForm.programLabel}<span className="text-[var(--color-error)] ml-0.5">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.program}
                    onChange={(e) => handleFieldChange('program', e.target.value)}
                    placeholder={content.teamForm.programPlaceholder}
                    className="w-full px-5 py-4 rounded-xl border-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-brown-dark)]/20 transition-all text-[var(--color-brown-dark)] text-base md:text-lg"
                    style={{ fontFamily: 'var(--font-kollektif)', borderColor: fieldErrors.program ? 'var(--color-error)' : inputBorder, background: 'var(--color-pink-light)' }}
                  />
                  {fieldErrors.program && (
                    <p className="text-base text-[var(--color-error)] mt-1.5" style={{ fontFamily: 'var(--font-kollektif)' }}>{fieldErrors.program}</p>
                  )}
                </div>
                <div>
                  <label className="block text-base md:text-lg font-semibold text-[var(--color-brown-dark)] mb-2" style={{ fontFamily: 'var(--font-leiko)' }}>
                    {content.teamForm.yearLabel}<span className="text-[var(--color-error)] ml-0.5">*</span>
                  </label>
                  <div className={`relative w-full ${openSelectId === 'year' ? 'z-[100]' : ''}`} ref={(el) => { selectDropdownRefs.current.year = el }}>
                    <button
                      type="button"
                      onClick={() => setOpenSelectId((prev) => (prev === 'year' ? null : 'year'))}
                      className="w-full flex items-center justify-between pl-5 pr-12 py-4 rounded-xl border-2 text-left transition-colors cursor-pointer"
                      style={{
                        fontFamily: 'var(--font-kollektif)',
                        borderColor: fieldErrors.year ? 'var(--color-error)' : inputBorder,
                        background: 'var(--color-pink-light)',
                        color: formData.year ? 'var(--color-brown-dark)' : 'var(--color-pink-dark)',
                        fontSize: '1rem'
                      }}
                    >
                      <span className="text-base md:text-lg">{questions.find(q => q.id === 'year')?.options?.find((o) => o.value === formData.year)?.label ?? 'Select...'}</span>
                      <svg className={`w-5 h-5 flex-shrink-0 absolute right-5 top-1/2 -translate-y-1/2 transition-transform ${openSelectId === 'year' ? 'rotate-180' : ''}`} style={{ color: 'var(--color-brown-dark)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {openSelectId === 'year' && (
                      <div className="absolute top-full left-0 right-0 mt-2 rounded-xl overflow-y-auto overflow-x-hidden z-[9999] py-2 max-h-48 border-2" style={{ background: 'var(--color-cream)', borderColor: 'var(--color-brown-dark)', boxShadow: '0 8px 24px color-mix(in srgb, var(--color-brown-dark) 25%, transparent)' }}>
                        {(questions.find(q => q.id === 'year')?.options || []).map((opt) => (
                          <button key={opt.value || 'empty'} type="button" className="block w-full text-left px-5 py-3.5 text-base md:text-lg transition-colors border-0" style={{ fontFamily: 'var(--font-kollektif)', color: 'var(--color-brown-dark)', background: 'transparent' }} onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--color-pink-medium)' }} onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }} onClick={() => { handleFieldChange('year', opt.value); setOpenSelectId(null) }}>
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  {fieldErrors.year && (
                    <p className="text-base text-[var(--color-error)] mt-1.5" style={{ fontFamily: 'var(--font-kollektif)' }}>{fieldErrors.year}</p>
                  )}
                </div>
                <div className="md:col-span-2">
                  <label className="block text-base md:text-lg font-semibold text-[var(--color-brown-dark)] mb-2" style={{ fontFamily: 'var(--font-leiko)' }}>
                    {content.teamForm.teamRoleFirstLabel}<span className="text-[var(--color-error)] ml-0.5">*</span>
                  </label>
                  <div className={`relative w-full ${openSelectId === 'teamRole' ? 'z-[100]' : ''}`} ref={(el) => { selectDropdownRefs.current.teamRole = el }}>
                    <button
                      type="button"
                      onClick={() => setOpenSelectId((prev) => (prev === 'teamRole' ? null : 'teamRole'))}
                      className="w-full flex items-center justify-between pl-5 pr-12 py-4 rounded-xl border-2 text-left transition-colors cursor-pointer"
                      style={{
                        fontFamily: 'var(--font-kollektif)',
                        borderColor: fieldErrors.teamRole ? 'var(--color-error)' : inputBorder,
                        background: 'var(--color-pink-light)',
                        color: formData.teamRole ? 'var(--color-brown-dark)' : 'var(--color-pink-dark)',
                        fontSize: '1rem'
                      }}
                    >
                      <span className="text-base md:text-lg">{content.teamForm.teamRoleOptions.find((o) => o.value === formData.teamRole)?.label ?? 'Select...'}</span>
                      <svg className={`w-5 h-5 flex-shrink-0 absolute right-5 top-1/2 -translate-y-1/2 transition-transform ${openSelectId === 'teamRole' ? 'rotate-180' : ''}`} style={{ color: 'var(--color-brown-dark)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {openSelectId === 'teamRole' && (
                      <div className="absolute top-full left-0 right-0 mt-2 rounded-xl overflow-y-auto overflow-x-hidden z-[9999] py-2 max-h-56 border-2" style={{ background: 'var(--color-cream)', borderColor: 'var(--color-brown-dark)', boxShadow: '0 8px 24px color-mix(in srgb, var(--color-brown-dark) 25%, transparent)' }}>
                        {content.teamForm.teamRoleOptions.map((opt) => (
                          <button key={opt.value || 'empty'} type="button" className="block w-full text-left px-5 py-3.5 text-base md:text-lg transition-colors border-0" style={{ fontFamily: 'var(--font-kollektif)', color: 'var(--color-brown-dark)', background: 'transparent' }} onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--color-pink-medium)' }} onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }} onClick={() => {
                            setFormData((prev) => ({
                              ...prev,
                              teamRole: opt.value,
                              teamRoleSecond:
                                prev.teamRoleSecond === opt.value && opt.value !== 'Open to any team role'
                                  ? ''
                                  : prev.teamRoleSecond,
                            }))
                            setFieldErrors((prev) => {
                              const next = { ...prev }
                              delete next.teamRole
                              delete next.teamRoleSecond
                              return next
                            })
                            setOpenSelectId(null)
                          }}>
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  {fieldErrors.teamRole && (
                    <p className="text-base text-[var(--color-error)] mt-1.5" style={{ fontFamily: 'var(--font-kollektif)' }}>{fieldErrors.teamRole}</p>
                  )}
                </div>
                <div className="md:col-span-2">
                  <label className="block text-base md:text-lg font-semibold text-[var(--color-brown-dark)] mb-2" style={{ fontFamily: 'var(--font-leiko)' }}>
                    {content.teamForm.teamRoleSecondLabel}<span className="text-[var(--color-error)] ml-0.5">*</span>
                  </label>
                  <div className={`relative w-full ${openSelectId === 'teamRoleSecond' ? 'z-[100]' : ''}`} ref={(el) => { selectDropdownRefs.current.teamRoleSecond = el }}>
                    <button
                      type="button"
                      onClick={() => setOpenSelectId((prev) => (prev === 'teamRoleSecond' ? null : 'teamRoleSecond'))}
                      className="w-full flex items-center justify-between pl-5 pr-12 py-4 rounded-xl border-2 text-left transition-colors cursor-pointer"
                      style={{
                        fontFamily: 'var(--font-kollektif)',
                        borderColor: fieldErrors.teamRoleSecond ? 'var(--color-error)' : inputBorder,
                        background: 'var(--color-pink-light)',
                        color: formData.teamRoleSecond ? 'var(--color-brown-dark)' : 'var(--color-pink-dark)',
                        fontSize: '1rem'
                      }}
                    >
                      <span className="text-base md:text-lg">{content.teamForm.teamRoleSecondOptions.find((o) => o.value === formData.teamRoleSecond)?.label ?? 'Select...'}</span>
                      <svg className={`w-5 h-5 flex-shrink-0 absolute right-5 top-1/2 -translate-y-1/2 transition-transform ${openSelectId === 'teamRoleSecond' ? 'rotate-180' : ''}`} style={{ color: 'var(--color-brown-dark)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {openSelectId === 'teamRoleSecond' && (
                      <div className="absolute top-full left-0 right-0 mt-2 rounded-xl overflow-y-auto overflow-x-hidden z-[9999] py-2 max-h-56 border-2" style={{ background: 'var(--color-cream)', borderColor: 'var(--color-brown-dark)', boxShadow: '0 8px 24px color-mix(in srgb, var(--color-brown-dark) 25%, transparent)' }}>
                        {content.teamForm.teamRoleSecondOptions
                          .filter((opt) => !opt.value || opt.value === 'No second preference' || opt.value !== formData.teamRole)
                          .map((opt) => (
                          <button key={opt.value || 'empty-second'} type="button" className="block w-full text-left px-5 py-3.5 text-base md:text-lg transition-colors border-0" style={{ fontFamily: 'var(--font-kollektif)', color: 'var(--color-brown-dark)', background: 'transparent' }} onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--color-pink-medium)' }} onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }} onClick={() => { handleFieldChange('teamRoleSecond', opt.value); setOpenSelectId(null) }}>
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  {fieldErrors.teamRoleSecond && (
                    <p className="text-base text-[var(--color-error)] mt-1.5" style={{ fontFamily: 'var(--font-kollektif)' }}>{fieldErrors.teamRoleSecond}</p>
                  )}
                </div>
                <div className="md:col-span-2">
                  <label className="block text-base md:text-lg font-semibold text-[var(--color-brown-dark)] mb-2" style={{ fontFamily: 'var(--font-leiko)' }}>
                    {content.teamForm.referralNameLabel}
                  </label>
                  <input
                    type="text"
                    value={formData.referralName}
                    onChange={(e) => handleFieldChange('referralName', e.target.value)}
                    placeholder={content.teamForm.referralNamePlaceholder}
                    className="w-full px-5 py-4 rounded-xl border-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-brown-dark)]/20 transition-all text-[var(--color-brown-dark)] text-base md:text-lg"
                    style={{ fontFamily: 'var(--font-kollektif)', borderColor: fieldErrors.referralName ? 'var(--color-error)' : inputBorder, background: 'var(--color-pink-light)' }}
                  />
                </div>
              </>
            )}

            {/* General: school status */}
            {!isTeamApp && (
            <div className="md:col-span-2">
              <label className="block text-base md:text-lg font-semibold text-[var(--color-brown-dark)] mb-2" style={{ fontFamily: 'var(--font-leiko)' }}>
                {content.form.schoolStatusLabel}<span className="text-[var(--color-error)] ml-0.5">*</span>
              </label>
              {fieldErrors.schoolStatus && (
                <p className="text-base text-[var(--color-error)] mb-2" style={{ fontFamily: 'var(--font-kollektif)' }}>{fieldErrors.schoolStatus}</p>
              )}
              <div className={`relative w-full mb-4 ${openSelectId === 'schoolStatus' ? 'z-[100]' : ''}`} ref={(el) => { selectDropdownRefs.current.schoolStatus = el }}>
                <button
                  type="button"
                  onClick={() => setOpenSelectId((prev) => (prev === 'schoolStatus' ? null : 'schoolStatus'))}
                  className="w-full flex items-center justify-between pl-5 pr-12 py-4 rounded-xl border-2 text-left transition-colors cursor-pointer"
                  style={{
                    fontFamily: 'var(--font-kollektif)',
                    borderColor: fieldErrors.schoolStatus ? 'var(--color-error)' : inputBorder,
                    background: 'var(--color-pink-light)',
                    color: formData.schoolStatus ? 'var(--color-brown-dark)' : 'var(--color-pink-dark)',
                    fontSize: '1rem'
                  }}
                >
                  <span className="text-base md:text-lg">
                    {content.form.schoolStatusOptions.find((o) => o.value === formData.schoolStatus)?.label ?? 'Select an option'}
                  </span>
                  <svg
                    className={`w-5 h-5 flex-shrink-0 absolute right-5 top-1/2 -translate-y-1/2 transition-transform ${openSelectId === 'schoolStatus' ? 'rotate-180' : ''}`}
                    style={{ color: 'var(--color-brown-dark)' }}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {openSelectId === 'schoolStatus' && (
                  <div
                    className="absolute top-full left-0 right-0 mt-2 rounded-xl overflow-y-auto overflow-x-hidden z-[9999] py-2 max-h-56 border-2"
                    style={{
                      background: 'var(--color-cream)',
                      borderColor: 'var(--color-brown-dark)',
                      boxShadow: '0 8px 24px color-mix(in srgb, var(--color-brown-dark) 25%, transparent)'
                    }}
                  >
                    {content.form.schoolStatusOptions.map((opt) => (
                      <button
                        key={opt.value || 'empty'}
                        type="button"
                        className="block w-full text-left px-5 py-3.5 text-base md:text-lg transition-colors border-0"
                        style={{
                          fontFamily: 'var(--font-kollektif)',
                          color: 'var(--color-brown-dark)',
                          background: formData.schoolStatus === opt.value ? 'var(--color-pink-medium)' : 'transparent'
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--color-pink-medium)' }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background =
                            formData.schoolStatus === opt.value ? 'var(--color-pink-medium)' : 'transparent'
                        }}
                        onClick={() => {
                          const nextStatus = opt.value as FormData['schoolStatus']
                          setFormData((prev) => ({
                            ...prev,
                            schoolStatus: nextStatus,
                            ...(nextStatus === 'university-college'
                              ? { schoolSituation: '', schoolSituationOther: '', year: '' }
                              : {}),
                            ...(nextStatus === 'high-school'
                              ? { program: '', year: '', schoolSituation: '', schoolSituationOther: '' }
                              : {}),
                            ...(nextStatus === 'not-in-school'
                              ? { schoolName: '', program: '', year: '' }
                              : {}),
                            ...(nextStatus === ''
                              ? {
                                  schoolName: '',
                                  program: '',
                                  year: '',
                                  schoolSituation: '',
                                  schoolSituationOther: '',
                                }
                              : {}),
                          }))
                          setFieldErrors((prev) => {
                            const next = { ...prev }
                            delete next.schoolStatus
                            delete next.schoolName
                            delete next.program
                            delete next.year
                            delete next.schoolSituation
                            delete next.schoolSituationOther
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

              {formData.schoolStatus === 'university-college' && (
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
                              color: formData[q.id] ? 'var(--color-brown-dark)' : 'var(--color-pink-dark)',
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
                                boxShadow: '0 8px 24px color-mix(in srgb, var(--color-brown-dark) 25%, transparent)'
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
                                  onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--color-pink-medium)' }}
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
                      {fieldErrors[q.id] && (
                        <p className="text-base text-[var(--color-error)] mt-1.5" style={{ fontFamily: 'var(--font-kollektif)' }}>{fieldErrors[q.id]}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {formData.schoolStatus === 'high-school' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-base md:text-lg font-semibold text-[var(--color-brown-dark)] mb-2" style={{ fontFamily: 'var(--font-leiko)' }}>
                      {content.form.highSchoolNameLabel}<span className="text-[var(--color-error)] ml-0.5">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.schoolName}
                      onChange={(e) => handleFieldChange('schoolName', e.target.value)}
                      onBlur={() => handleFieldBlur('schoolName')}
                      placeholder={content.form.highSchoolNamePlaceholder}
                      className="w-full px-5 py-4 rounded-xl border-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-brown-dark)]/20 transition-all text-[var(--color-brown-dark)] text-base md:text-lg"
                      style={{ fontFamily: 'var(--font-kollektif)', borderColor: fieldErrors.schoolName ? 'var(--color-error)' : inputBorder, background: 'var(--color-pink-light)' }}
                    />
                    {fieldErrors.schoolName && (
                      <p className="text-base text-[var(--color-error)] mt-1.5" style={{ fontFamily: 'var(--font-kollektif)' }}>{fieldErrors.schoolName}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-base md:text-lg font-semibold text-[var(--color-brown-dark)] mb-2" style={{ fontFamily: 'var(--font-leiko)' }}>
                      {content.form.highSchoolGradeLabel}<span className="text-[var(--color-error)] ml-0.5">*</span>
                    </label>
                    {fieldErrors.year && (
                      <p className="text-base text-[var(--color-error)] mb-2" style={{ fontFamily: 'var(--font-kollektif)' }}>{fieldErrors.year}</p>
                    )}
                    <div className={`relative w-full ${openSelectId === 'year' ? 'z-[100]' : ''}`} ref={(el) => { selectDropdownRefs.current.year = el }}>
                      <button
                        type="button"
                        onClick={() => setOpenSelectId((prev) => (prev === 'year' ? null : 'year'))}
                        className="w-full flex items-center justify-between pl-5 pr-12 py-4 rounded-xl border-2 text-left transition-colors cursor-pointer"
                        style={{
                          fontFamily: 'var(--font-kollektif)',
                          borderColor: fieldErrors.year ? 'var(--color-error)' : inputBorder,
                          background: 'var(--color-pink-light)',
                          color: formData.year ? 'var(--color-brown-dark)' : 'var(--color-pink-dark)',
                          fontSize: '1rem'
                        }}
                      >
                        <span className="text-base md:text-lg">
                          {content.form.highSchoolGradeOptions.find((o) => o.value === formData.year)?.label ?? 'Select...'}
                        </span>
                        <svg
                          className={`w-5 h-5 flex-shrink-0 absolute right-5 top-1/2 -translate-y-1/2 transition-transform ${openSelectId === 'year' ? 'rotate-180' : ''}`}
                          style={{ color: 'var(--color-brown-dark)' }}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      {openSelectId === 'year' && (
                        <div
                          className="absolute top-full left-0 right-0 mt-2 rounded-xl overflow-y-auto overflow-x-hidden z-[9999] py-2 max-h-48 border-2"
                          style={{
                            background: 'var(--color-cream)',
                            borderColor: 'var(--color-brown-dark)',
                            boxShadow: '0 8px 24px color-mix(in srgb, var(--color-brown-dark) 25%, transparent)'
                          }}
                        >
                          {content.form.highSchoolGradeOptions.map((opt) => (
                            <button
                              key={opt.value || 'empty'}
                              type="button"
                              className="block w-full text-left px-5 py-3.5 text-base md:text-lg transition-colors border-0"
                              style={{
                                fontFamily: 'var(--font-kollektif)',
                                color: 'var(--color-brown-dark)',
                                background: formData.year === opt.value ? 'var(--color-pink-medium)' : 'transparent'
                              }}
                              onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--color-pink-medium)' }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.background =
                                  formData.year === opt.value ? 'var(--color-pink-medium)' : 'transparent'
                              }}
                              onClick={() => {
                                handleFieldChange('year', opt.value)
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
                          color: formData.schoolSituation ? 'var(--color-brown-dark)' : 'var(--color-pink-dark)',
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
                          className="absolute top-full left-0 right-0 mt-2 rounded-xl overflow-y-auto overflow-x-hidden z-[9999] py-2 max-h-72 border-2"
                          style={{
                            background: 'var(--color-cream)',
                            borderColor: 'var(--color-brown-dark)',
                            boxShadow: '0 8px 24px color-mix(in srgb, var(--color-brown-dark) 25%, transparent)'
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
                                background: formData.schoolSituation === opt.value ? 'var(--color-pink-medium)' : 'transparent'
                              }}
                              onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--color-pink-medium)' }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.background =
                                  formData.schoolSituation === opt.value ? 'var(--color-pink-medium)' : 'transparent'
                              }}
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
            )}

            {isTeamApp && (
              <>
                <div className="md:col-span-2">
                  <label className="block text-base md:text-lg font-semibold text-[var(--color-brown-dark)] mb-2" style={{ fontFamily: 'var(--font-leiko)' }}>
                    {content.teamForm.whyJoinLabel}<span className="text-[var(--color-error)] ml-0.5">*</span>
                  </label>
                  <textarea
                    value={formData.whyJoin}
                    onChange={(e) => handleFieldChange('whyJoin', e.target.value)}
                    onBlur={() => handleFieldBlur('whyJoin')}
                    placeholder={content.teamForm.whyJoinPlaceholder}
                    rows={5}
                    className="w-full px-5 py-4 rounded-xl border-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-brown-dark)]/20 transition-all resize-none text-[var(--color-brown-dark)] text-base md:text-lg"
                    style={{ fontFamily: 'var(--font-kollektif)', borderColor: fieldErrors.whyJoin ? 'var(--color-error)' : inputBorder, background: 'var(--color-pink-light)' }}
                  />
                  {fieldErrors.whyJoin && (
                    <p className="text-base text-[var(--color-error)] mt-1.5" style={{ fontFamily: 'var(--font-kollektif)' }}>{fieldErrors.whyJoin}</p>
                  )}
                </div>
              </>
            )}

            {questions.filter((q) => {
              if (['name', 'email', 'schoolName', 'program', 'year'].includes(q.id)) return false
              if (isTeamApp && q.id === 'whyJoin') return false
              if (!isTeamApp && q.id === 'experience') return false
              return true
            }).map((q) => (
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
                          background: formData.experienceOutline ? 'var(--color-pink-medium)' : 'var(--color-pink-light)',
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
                          background: formData.experienceResume ? 'var(--color-pink-medium)' : 'var(--color-pink-light)',
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
                        color: formData[q.id] ? 'var(--color-brown-dark)' : 'var(--color-pink-dark)',
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
                          boxShadow: '0 8px 24px color-mix(in srgb, var(--color-brown-dark) 25%, transparent)'
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
                            onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--color-pink-medium)' }}
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
          <div className="join-us-form-actions flex justify-between items-center gap-4 flex-wrap mt-10">
              <button
                type="button"
                onClick={resetApplication}
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
