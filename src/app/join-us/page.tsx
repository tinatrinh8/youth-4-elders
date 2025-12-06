'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

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

  const currentQuestion = questions[currentStep]
  const progress = ((currentStep + 1) / questions.length) * 100
  const isLastStep = currentStep === questions.length - 1
  const canProceed = currentQuestion.required 
    ? formData[currentQuestion.id].trim() !== '' 
    : true

  const handleChange = (value: string) => {
    setFormData({
      ...formData,
      [currentQuestion.id]: value
    })

    // Auto-advance for select fields when an option is selected
    if (currentQuestion.autoAdvance && currentQuestion.type === 'select' && value !== '') {
      setTimeout(() => {
        handleNext()
      }, 300)
    }
  }

  const handleNext = () => {
    if (canProceed && currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
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

  if (submitStatus === 'success') {
    return (
      <main className="min-h-screen pt-[120px] flex items-center justify-center" style={{ background: 'var(--color-cream)' }}>
        <div className="max-w-2xl mx-auto px-8 py-16 text-center">
          <div 
            className="rounded-2xl p-12 shadow-lg"
            style={{ 
              background: 'var(--color-cream)', 
              border: '2px solid var(--color-pink-medium)' 
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
              className="text-4xl md:text-5xl font-bold mb-4"
              style={{ fontFamily: 'var(--font-vintage-stylist)', color: 'var(--color-brown-dark)' }}
            >
              Thank You!
            </h2>
            <p 
              className="text-lg md:text-xl mb-4"
              style={{ fontFamily: 'var(--font-kollektif)', color: 'var(--color-brown-medium)' }}
            >
              Thank you for joining Youth 4 Elders! We&apos;ll be in touch with updates and upcoming opportunities.
            </p>
            <p 
              className="text-lg md:text-xl mb-8"
              style={{ fontFamily: 'var(--font-kollektif)', color: 'var(--color-brown-medium)' }}
            >
              For now,{' '}
              <a
                href="https://www.instagram.com/youth4elders/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold underline hover:no-underline transition-all"
                style={{ color: 'var(--color-pink-medium)' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = 'var(--color-pink-light)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'var(--color-pink-medium)'
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
              className="px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 hover:scale-105 shadow-lg"
              style={{
                background: 'var(--color-pink-medium)',
                color: 'white',
                fontFamily: 'var(--font-kollektif)'
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
      <main className="min-h-screen pt-[120px]" style={{ background: 'var(--color-cream)' }}>
        <div className="max-w-4xl mx-auto px-8 py-16">
          <h1 
            className="text-5xl md:text-7xl font-bold mb-4 text-center"
            style={{ fontFamily: 'var(--font-vintage-stylist)', color: 'var(--color-brown-dark)' }}
          >
            Join Us
          </h1>
          <p 
            className="text-lg md:text-xl leading-relaxed mb-12 text-center"
            style={{ fontFamily: 'var(--font-kollektif)', color: 'var(--color-brown-medium)' }}
          >
            Join Youth 4 Elders and become part of our community! Let&apos;s get to know you better.
          </p>
          
          <div 
            className="rounded-2xl p-12 shadow-lg text-center"
            style={{ 
              background: 'var(--color-cream)', 
              border: '2px solid var(--color-pink-medium)' 
            }}
          >
            <p 
              className="text-xl mb-8"
              style={{ fontFamily: 'var(--font-kollektif)', color: 'var(--color-brown-dark)' }}
            >
              Ready to get started? We&apos;ll ask you a few questions to learn more about you.
            </p>
            <button
              onClick={() => setHasStarted(true)}
              className="px-12 py-5 rounded-full font-semibold text-xl transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
              style={{
                background: 'var(--color-pink-medium)',
                color: 'white',
                fontFamily: 'var(--font-kollektif)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'var(--color-pink-light)'
                e.currentTarget.style.color = 'var(--color-brown-dark)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'var(--color-pink-medium)'
                e.currentTarget.style.color = 'white'
              }}
            >
              Let&apos;s Begin →
            </button>
            
            {/* TEST BUTTON - Remove this after testing */}
            <button
              onClick={() => setSubmitStatus('success')}
              className="mt-4 px-6 py-2 rounded-full text-sm font-semibold transition-all duration-300 hover:scale-105"
              style={{
                background: 'transparent',
                color: 'var(--color-brown-medium)',
                fontFamily: 'var(--font-kollektif)',
                border: '1px dashed var(--color-brown-medium)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(244, 142, 184, 0.1)'
                e.currentTarget.style.borderColor = 'var(--color-pink-medium)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent'
                e.currentTarget.style.borderColor = 'var(--color-brown-medium)'
              }}
            >
              🧪 Test Success Message
            </button>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen pt-[120px]" style={{ background: 'var(--color-cream)' }}>
      <div className="max-w-3xl mx-auto px-8 py-16">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span 
              className="text-sm font-semibold"
              style={{ fontFamily: 'var(--font-kollektif)', color: 'var(--color-brown-dark)' }}
            >
              Question {currentStep + 1} of {questions.length}
            </span>
            <span 
              className="text-sm font-semibold"
              style={{ fontFamily: 'var(--font-kollektif)', color: 'var(--color-brown-medium)' }}
            >
              {Math.round(progress)}%
            </span>
          </div>
          <div 
            className="w-full h-3 rounded-full overflow-hidden"
            style={{ background: 'rgba(244, 142, 184, 0.2)' }}
          >
            <div
              className="h-full rounded-full transition-all duration-500 ease-out"
              style={{ 
                width: `${progress}%`,
                background: 'var(--color-pink-medium)'
              }}
            />
          </div>
        </div>

        {/* Question Card */}
        <div 
          className="rounded-2xl p-8 md:p-12 shadow-lg mb-8 min-h-[400px] flex flex-col justify-center"
          style={{ 
            background: 'var(--color-cream)', 
            border: '2px solid var(--color-pink-medium)' 
          }}
        >
          <h2 
            className="text-3xl md:text-4xl font-bold mb-8"
            style={{ fontFamily: 'var(--font-vintage-stylist)', color: 'var(--color-brown-dark)' }}
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
                  borderColor: formData[currentQuestion.id] ? 'var(--color-pink-medium)' : 'var(--color-brown-medium)',
                  fontFamily: 'var(--font-kollektif)',
                  background: 'white'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = 'var(--color-pink-medium)'
                  e.target.style.boxShadow = '0 0 0 3px rgba(244, 142, 184, 0.1)'
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = formData[currentQuestion.id] ? 'var(--color-pink-medium)' : 'var(--color-brown-medium)'
                  e.target.style.boxShadow = 'none'
                }}
              />
            ) : currentQuestion.type === 'select' ? (
              <select
                id={`question-${currentQuestion.id}`}
                value={formData[currentQuestion.id]}
                onChange={(e) => handleChange(e.target.value)}
                className="w-full px-4 py-4 rounded-lg border-2 focus:outline-none focus:ring-2 transition-all duration-200 text-lg"
                style={{ 
                  borderColor: formData[currentQuestion.id] ? 'var(--color-pink-medium)' : 'var(--color-brown-medium)',
                  fontFamily: 'var(--font-kollektif)',
                  background: 'white'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = 'var(--color-pink-medium)'
                  e.target.style.boxShadow = '0 0 0 3px rgba(244, 142, 184, 0.1)'
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = formData[currentQuestion.id] ? 'var(--color-pink-medium)' : 'var(--color-brown-medium)'
                  e.target.style.boxShadow = 'none'
                }}
              >
                {currentQuestion.options?.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            ) : (
              <input
                id={`question-${currentQuestion.id}`}
                type={currentQuestion.type}
                value={formData[currentQuestion.id]}
                onChange={(e) => handleChange(e.target.value)}
                placeholder={currentQuestion.placeholder}
                className="w-full px-4 py-4 rounded-lg border-2 focus:outline-none focus:ring-2 transition-all duration-200 text-lg"
                style={{ 
                  borderColor: formData[currentQuestion.id] ? 'var(--color-pink-medium)' : 'var(--color-brown-medium)',
                  fontFamily: 'var(--font-kollektif)',
                  background: 'white'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = 'var(--color-pink-medium)'
                  e.target.style.boxShadow = '0 0 0 3px rgba(244, 142, 184, 0.1)'
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = formData[currentQuestion.id] ? 'var(--color-pink-medium)' : 'var(--color-brown-medium)'
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

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center gap-4">
            <button
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className="px-6 py-3 rounded-full font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                background: currentStep === 0 ? 'transparent' : 'var(--color-brown-medium)',
                color: currentStep === 0 ? 'var(--color-brown-medium)' : 'white',
                fontFamily: 'var(--font-kollektif)',
                border: `2px solid var(--color-brown-medium)`
              }}
              onMouseEnter={(e) => {
                if (currentStep > 0) {
                  e.currentTarget.style.background = 'var(--color-brown-dark)'
                }
              }}
              onMouseLeave={(e) => {
                if (currentStep > 0) {
                  e.currentTarget.style.background = 'var(--color-brown-medium)'
                }
              }}
            >
              ← Previous
            </button>

            {isLastStep ? (
              <button
                onClick={handleSubmit}
                disabled={!canProceed || isSubmitting}
                className="px-8 py-3 rounded-full font-semibold transition-all duration-300 hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  background: canProceed ? 'var(--color-pink-medium)' : 'var(--color-brown-medium)',
                  color: 'white',
                  fontFamily: 'var(--font-kollektif)'
                }}
                onMouseEnter={(e) => {
                  if (canProceed && !isSubmitting) {
                    e.currentTarget.style.background = 'var(--color-pink-light)'
                    e.currentTarget.style.color = 'var(--color-brown-dark)'
                  }
                }}
                onMouseLeave={(e) => {
                  if (canProceed && !isSubmitting) {
                    e.currentTarget.style.background = 'var(--color-pink-medium)'
                    e.currentTarget.style.color = 'white'
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
                  background: canProceed ? 'var(--color-pink-medium)' : 'var(--color-brown-medium)',
                  color: 'white',
                  fontFamily: 'var(--font-kollektif)'
                }}
                onMouseEnter={(e) => {
                  if (canProceed) {
                    e.currentTarget.style.background = 'var(--color-pink-light)'
                    e.currentTarget.style.color = 'var(--color-brown-dark)'
                  }
                }}
                onMouseLeave={(e) => {
                  if (canProceed) {
                    e.currentTarget.style.background = 'var(--color-pink-medium)'
                    e.currentTarget.style.color = 'white'
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
