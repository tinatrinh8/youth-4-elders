'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { events } from '../../events'
import {
  type DisplayEvent,
  formatRange,
  getTimeFromDescription,
  mergeConsecutiveEvents,
  normalizeDay,
} from '../../shared'
import { getClubGallery, collapseWorkshopSeries, isWorkshopEventId, resolveWorkshopPageId } from '../../pastGalleries'
import { galleryHref, getGalleryParent, setGalleryParent } from '../galleryNav'

function cleanLocation(description?: string): string | null {
  if (!description) return null
  const meet = description.match(/Meet us in\s+([^!.]+)/i)
  if (meet) return meet[1].trim()
  const located = description.match(/Located at\s+([^!.]+)/i)
  if (located) return located[1].trim()
  const at = description.match(/\bat\s+([A-Z][^!.]{3,60})/)
  if (at && !/^us\b/i.test(at[1])) return at[1].trim()
  return null
}

const TEXT_ANIM_MS = 700
const GALLERY_LABEL_DELAY_MS = 400
/** Wait for recap + gallery label to finish before photo reveals can start. */
const GALLERY_REVEAL_START_MS = GALLERY_LABEL_DELAY_MS + TEXT_ANIM_MS + 100

function photoFilename(eventTitle: string, src: string, index: number) {
  const ext = src.split('.').pop()?.split('?')[0] || 'jpg'
  const slug = eventTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'memory'
  return `${slug}-photo-${index + 1}.${ext}`
}

async function saveGalleryImage(src: string, filename: string) {
  try {
    const response = await fetch(src)
    const blob = await response.blob()
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  } catch {
    window.open(src, '_blank', 'noopener,noreferrer')
  }
}

export default function PastEventGalleryPage() {
  const params = useParams()
  const router = useRouter()
  const searchParams = useSearchParams()
  const fromId = searchParams.get('from')
  const id = typeof params.id === 'string' ? params.id : Array.isArray(params.id) ? params.id[0] : ''

  const [entered, setEntered] = useState(false)
  const [galleryRevealReady, setGalleryRevealReady] = useState(false)
  const [visiblePhotos, setVisiblePhotos] = useState<Set<number>>(() => new Set())
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null)
  const galleryRef = useRef<HTMLDivElement>(null)

  const allClubPast = useMemo(() => {
    const today = normalizeDay(new Date())
    const clubStart = normalizeDay(new Date(2025, 7, 1))
    const filtered = mergeConsecutiveEvents([...events].sort((a, b) => a.date.getTime() - b.date.getTime())).filter(e => {
      if (e.type !== 'club') return false
      const end = normalizeDay(e.endDate ?? e.date)
      const start = normalizeDay(e.date)
      return end < today && start >= clubStart
    })
    return collapseWorkshopSeries(filtered)
  }, [])

  const event = useMemo((): DisplayEvent | null => {
    if (isWorkshopEventId(id)) {
      const resolved = resolveWorkshopPageId(id, allClubPast.filter(e => isWorkshopEventId(e.id)))
      return allClubPast.find(e => e.id === resolved) ?? null
    }
    return allClubPast.find(e => e.id === id) ?? null
  }, [allClubPast, id])

  const photos = useMemo(() => (event ? getClubGallery(event.id) : []), [event])

  const suggestions = useMemo(() => {
    if (!event) return []
    const others = allClubPast.filter(e => e.id !== event.id)
    if (others.length === 0) return []
    const t = event.date.getTime()
    return [...others]
      .sort((a, b) => Math.abs(a.date.getTime() - t) - Math.abs(b.date.getTime() - t))
      .slice(0, 3)
  }, [allClubPast, event])

  useEffect(() => {
    if (!id) return
    if (isWorkshopEventId(id)) {
      const resolved = resolveWorkshopPageId(id, allClubPast.filter(e => isWorkshopEventId(e.id)))
      if (resolved && resolved !== id) {
        router.replace(galleryHref(resolved, fromId))
        return
      }
    }
    if (!event) {
      router.replace('/events/past')
    }
  }, [allClubPast, event, fromId, id, router])

  useEffect(() => {
    setEntered(false)
    setGalleryRevealReady(false)
    setVisiblePhotos(new Set())
    setSelectedPhotoIndex(null)
    const rafId = requestAnimationFrame(() => {
      requestAnimationFrame(() => setEntered(true))
    })
    return () => cancelAnimationFrame(rafId)
  }, [id])

  useEffect(() => {
    if (!entered) {
      setGalleryRevealReady(false)
      return
    }
    const timer = window.setTimeout(() => setGalleryRevealReady(true), GALLERY_REVEAL_START_MS)
    return () => window.clearTimeout(timer)
  }, [entered, id])

  useEffect(() => {
    if (!galleryRevealReady) return

    setVisiblePhotos(new Set())
    const container = galleryRef.current
    if (!container) return

    const figures = container.querySelectorAll<HTMLElement>('[data-gallery-photo]')
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return
          const idx = Number((entry.target as HTMLElement).dataset.galleryPhoto)
          if (Number.isNaN(idx)) return
          setVisiblePhotos(prev => {
            if (prev.has(idx)) return prev
            const next = new Set(prev)
            next.add(idx)
            return next
          })
          observer.unobserve(entry.target)
        })
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.1 }
    )

    figures.forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [id, photos, galleryRevealReady])

  useEffect(() => {
    if (selectedPhotoIndex === null) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedPhotoIndex(null)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [selectedPhotoIndex])

  useEffect(() => {
    const rafId = requestAnimationFrame(() => {
      document.body.style.transition = 'background 0.8s ease-in-out'
      document.documentElement.style.transition = 'background 0.8s ease-in-out'
      requestAnimationFrame(() => {
        document.body.style.background = 'var(--color-brown-dark)'
        document.documentElement.style.background = 'var(--color-brown-dark)'
      })
    })
    return () => cancelAnimationFrame(rafId)
  }, [])

  if (!event) {
    return (
      <main className="min-h-screen flex items-center justify-center" style={{ background: 'transparent' }}>
        <p style={{ fontFamily: 'var(--font-kollektif)', color: 'var(--color-cream)' }}>Loading memory…</p>
      </main>
    )
  }

  const time = getTimeFromDescription(event.description)
  const location = cleanLocation(event.description)

  const handleBack = () => {
    if (fromId) {
      const parentOfPrev = getGalleryParent(fromId)
      router.push(galleryHref(fromId, parentOfPrev))
      return
    }
    router.push('/events/past')
  }

  return (
    <main
      className="min-h-screen flex flex-col"
      style={{ background: 'transparent', ['--gallery-gap' as string]: '0.75rem' }}
    >
      {/* Back button */}
      <div className="px-6 sm:px-8 md:px-12 lg:px-16 pt-16 sm:pt-20 md:pt-24 pb-12 md:pb-16">
        <button
          type="button"
          onClick={handleBack}
          className={`inline-flex items-center gap-2 rounded-full border-2 pl-3 pr-4 sm:pl-3.5 sm:pr-5 py-2 sm:py-2.5 text-sm sm:text-base font-bold transition-all duration-700 ease-out hover:-translate-y-0.5 bg-transparent text-[var(--color-cream)] hover:bg-[var(--color-cream)] hover:text-[var(--color-brown-dark)] ${entered ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}
          style={{
            fontFamily: 'var(--font-kollektif)',
            borderColor: 'var(--color-cream)',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.22)',
          }}
        >
          <svg className="h-4 w-4 sm:h-5 sm:w-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
          </svg>
          Take me back
        </button>
      </div>

      {/* Centered recap — no box */}
      <header className="mx-auto max-w-2xl px-6 sm:px-8 text-center pb-16 md:pb-24">
        <p
          className={`text-[11px] sm:text-xs font-bold uppercase tracking-[0.28em] mb-4 italic transition-all duration-700 ease-out ${entered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
          style={{ fontFamily: 'var(--font-freshwost)', color: 'var(--color-olive-light)', transitionDelay: entered ? '80ms' : '0ms' }}
        >
          Club recap
        </p>
        <h1
          className={`text-4xl sm:text-5xl md:text-6xl font-bold leading-[1.05] mb-4 transition-all duration-700 ease-out ${entered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}
          style={{ fontFamily: 'var(--font-vintage-stylist)', color: 'var(--color-pink-medium)', transitionDelay: entered ? '160ms' : '0ms' }}
        >
          {event.title}
        </h1>
        <p
          className={`text-sm sm:text-base font-semibold mb-5 transition-all duration-700 ease-out ${entered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}
          style={{ fontFamily: 'var(--font-kollektif)', color: 'var(--color-cream)', opacity: entered ? 0.85 : 0, transitionDelay: entered ? '240ms' : '0ms' }}
        >
          {formatRange(event.date, event.endDate)}
          {time ? ` · ${time}` : ''}
          {location ? ` · ${location}` : ''}
        </p>
        {event.description && (
          <p
            className={`text-base md:text-lg leading-relaxed mx-auto max-w-xl transition-all duration-700 ease-out ${entered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}
            style={{ fontFamily: 'var(--font-leiko)', color: 'var(--color-pink-medium)', lineHeight: 1.75, opacity: entered ? 0.95 : 0, transitionDelay: entered ? '320ms' : '0ms' }}
          >
            {event.description}
          </p>
        )}
      </header>

      {/* Gallery */}
      <section className="w-full pb-16 md:pb-24 lg:pb-28">
        <p
          className={`text-[10px] sm:text-xs font-bold uppercase tracking-[0.22em] mb-5 md:mb-6 transition-all duration-700 ease-out ${entered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
          style={{
            fontFamily: 'var(--font-kollektif)',
            color: 'var(--color-cream)',
            opacity: entered ? 0.65 : 0,
            transitionDelay: entered ? '400ms' : '0ms',
            paddingLeft: 'var(--gallery-gap)',
            paddingRight: 'var(--gallery-gap)',
          }}
        >
          Gallery · {photos.length} photos
        </p>
        <div
          ref={galleryRef}
          className="columns-2 md:columns-3 xl:columns-4"
          style={{
            columnGap: 'var(--gallery-gap)',
            paddingLeft: 'var(--gallery-gap)',
            paddingRight: 'var(--gallery-gap)',
          }}
        >
          {photos.map((src, i) => (
            <figure
              key={`${src}-${i}`}
              data-gallery-photo={i}
              className={`relative break-inside-avoid overflow-hidden rounded-lg transition-all duration-700 ease-out ${visiblePhotos.has(i) ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-6 scale-[0.97]'}`}
              style={{
                background: 'rgba(251, 247, 232, 0.08)',
                marginBottom: 'var(--gallery-gap)',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.18)',
              }}
            >
              <button
                type="button"
                onClick={() => setSelectedPhotoIndex(selectedPhotoIndex === i ? null : i)}
                className="block w-full cursor-pointer transition-transform duration-300 hover:scale-[1.02] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-cream)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-brown-dark)]"
                aria-label={`Photo ${i + 1} of ${photos.length}`}
                aria-expanded={selectedPhotoIndex === i}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={src}
                  alt={`${event.title} — photo ${i + 1}`}
                  className="block w-full h-auto"
                  loading={i < 4 ? 'eager' : 'lazy'}
                />
              </button>

              {selectedPhotoIndex === i && (
                <div
                  className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-1.5 sm:gap-3 rounded-lg p-2 sm:p-4 animate-fadeIn overflow-hidden"
                  style={{ background: 'rgba(53, 18, 25, 0.9)' }}
                  role="dialog"
                  aria-label={`Save photo ${i + 1}`}
                >
                  <button
                    type="button"
                    onClick={() => setSelectedPhotoIndex(null)}
                    className="absolute top-1 right-1 sm:top-2 sm:right-2 inline-flex h-6 w-6 sm:h-8 sm:w-8 items-center justify-center rounded-full border-2 transition-all duration-200 bg-transparent text-[var(--color-cream)] hover:bg-[var(--color-cream)] hover:text-[var(--color-brown-dark)]"
                    style={{ borderColor: 'var(--color-cream)' }}
                    aria-label="Close"
                  >
                    <svg className="h-3 w-3 sm:h-4 sm:w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                  <p
                    className="absolute top-1.5 left-1.5 sm:static text-[8px] sm:text-[10px] md:text-xs font-bold uppercase tracking-[0.1em] sm:tracking-[0.18em] text-left sm:text-center max-w-[calc(100%-2rem)] sm:max-w-none leading-tight"
                    style={{ fontFamily: 'var(--font-kollektif)', color: 'var(--color-cream)', opacity: 0.8 }}
                  >
                    Photo {i + 1} of {photos.length}
                  </p>
                  <button
                    type="button"
                    onClick={() => saveGalleryImage(src, photoFilename(event.title, src, i))}
                    className="inline-flex items-center justify-center gap-1 sm:gap-2 rounded-full border-2 h-9 w-9 sm:h-auto sm:w-auto sm:px-4 sm:py-2 text-[10px] sm:text-sm font-bold transition-all duration-200 hover:-translate-y-0.5 bg-[var(--color-cream)] text-[var(--color-brown-dark)] hover:bg-[var(--color-pink-medium)] shrink-0"
                    style={{ fontFamily: 'var(--font-kollektif)', borderColor: 'var(--color-cream)' }}
                    aria-label="Save image"
                  >
                    <svg className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5m0 0l5-5m-5 5V4" />
                    </svg>
                    <span className="hidden sm:inline whitespace-nowrap">Save image</span>
                  </button>
                </div>
              )}
            </figure>
          ))}
        </div>
      </section>

      {/* Keep looking back — footer-style suggestions */}
      {suggestions.length > 0 && (
        <footer
          className={`mt-auto border-t transition-all duration-700 ease-out ${entered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
          style={{
            background: 'var(--color-olive)',
            borderColor: 'rgba(251, 247, 232, 0.25)',
            transitionDelay: entered ? '560ms' : '0ms',
          }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 pt-10 pb-8 md:py-16 lg:py-20">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 lg:gap-16 mb-8 md:mb-12">
              <div
                className={`lg:col-span-4 text-center lg:text-left transition-all duration-700 ease-out ${entered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}
                style={{ transitionDelay: entered ? '640ms' : '0ms' }}
              >
                <h2
                  className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-3 md:mb-4"
                  style={{ fontFamily: 'var(--font-vintage-stylist)', color: 'var(--color-cream)' }}
                >
                  Keep looking back
                </h2>
                <p
                  className="text-sm md:text-base italic"
                  style={{ fontFamily: 'var(--font-leiko)', color: 'var(--color-olive-light)', opacity: 0.95 }}
                >
                  More club memories from around this time
                </p>
              </div>

              <div className="lg:col-span-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
                  {suggestions.map((s, i) => (
                    <Link
                      key={s.id}
                      href={galleryHref(s.id, event.id)}
                      onClick={() => setGalleryParent(s.id, event.id)}
                      className={`group block rounded-xl border-2 px-4 py-3.5 sm:px-5 sm:py-4 transition-all duration-700 ease-out hover:-translate-y-0.5 ${entered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}
                      style={{
                        background: 'var(--color-cream)',
                        borderColor: 'rgba(251, 247, 232, 0.35)',
                        boxShadow: '0 4px 14px rgba(0, 0, 0, 0.12)',
                        transitionDelay: entered ? `${720 + i * 90}ms` : '0ms',
                      }}
                    >
                      <p
                        className="text-sm sm:text-base font-bold leading-snug mb-1.5 transition-colors duration-200 group-hover:text-[var(--color-brown-dark)]"
                        style={{ fontFamily: 'var(--font-vintage-stylist)', color: 'var(--color-brown-dark)' }}
                      >
                        {s.title}
                      </p>
                      <p
                        className="text-xs sm:text-sm font-semibold tabular-nums"
                        style={{ fontFamily: 'var(--font-kollektif)', color: 'var(--color-brown-dark)', opacity: 0.7 }}
                      >
                        {s.endDate
                          ? `${s.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} – ${s.endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`
                          : s.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            <div
              className={`pt-6 md:pt-8 border-t flex flex-col sm:flex-row items-center justify-between gap-4 transition-all duration-700 ease-out ${entered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
              style={{ borderColor: 'rgba(251, 247, 232, 0.25)', transitionDelay: entered ? '960ms' : '0ms' }}
            >
              <Link
                href="/events/past"
                className="text-sm md:text-base italic transition-all duration-300 hover:translate-x-1 hover:opacity-100"
                style={{ fontFamily: 'var(--font-leiko)', color: 'var(--color-cream)', opacity: 0.9 }}
                onMouseEnter={e => { e.currentTarget.style.color = '#351219' }}
                onMouseLeave={e => { e.currentTarget.style.color = 'var(--color-cream)' }}
              >
                View all past events →
              </Link>
              <Image
                src="/images/Y4E_LOGO_TEXT_CREAM.png"
                alt="Youth 4 Elders Logo"
                width={60}
                height={60}
                className="object-contain w-14 h-14 md:w-16 md:h-16 opacity-90"
              />
            </div>
          </div>
        </footer>
      )}
    </main>
  )
}
