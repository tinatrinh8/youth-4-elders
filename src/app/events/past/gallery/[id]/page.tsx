'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { events } from '../../../events'
import {
  type DisplayEvent,
  formatRange,
  getTimeFromDescription,
  mergeConsecutiveEvents,
  normalizeDay,
} from '../../../shared'
import { getClubGalleryBlurb, getClubGalleryItems, getClubGalleryVideos, getWorkshopFridayExamples, collapseWorkshopSeries, isWorkshopEventId, resolveWorkshopPageId, isClubRecapOnly, isGalleryComingSoon } from '../../pastGalleries'
import { galleryHref, getGalleryParent, setGalleryParent } from '../../galleryNav'

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

function formatVideoTime(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) return '0:00'
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}

function GalleryVideoPlayer({
  src,
  title,
  compact = false,
}: {
  src: string
  title: string
  compact?: boolean
}) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [playing, setPlaying] = useState(false)
  const [current, setCurrent] = useState(0)
  const [duration, setDuration] = useState(0)
  const [muted, setMuted] = useState(false)
  const [showChrome, setShowChrome] = useState(true)
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const progress = duration > 0 ? Math.min(1, current / duration) : 0

  const revealChrome = () => {
    setShowChrome(true)
    if (hideTimer.current) clearTimeout(hideTimer.current)
    if (playing) {
      hideTimer.current = setTimeout(() => setShowChrome(false), 2200)
    }
  }

  useEffect(() => {
    return () => {
      if (hideTimer.current) clearTimeout(hideTimer.current)
    }
  }, [])

  useEffect(() => {
    if (!playing) {
      setShowChrome(true)
      if (hideTimer.current) clearTimeout(hideTimer.current)
      return
    }
    hideTimer.current = setTimeout(() => setShowChrome(false), 2200)
    return () => {
      if (hideTimer.current) clearTimeout(hideTimer.current)
    }
  }, [playing])

  const togglePlay = () => {
    const el = videoRef.current
    if (!el) return
    if (el.paused) {
      void el.play()
    } else {
      el.pause()
    }
    revealChrome()
  }

  const seek = (ratio: number) => {
    const el = videoRef.current
    if (!el || !duration) return
    el.currentTime = Math.max(0, Math.min(duration, ratio * duration))
  }

  return (
    <div
      className="relative w-full overflow-hidden rounded-xl sm:rounded-2xl group"
      style={{
        background: 'rgba(53, 18, 25, 0.35)',
        boxShadow: '0 8px 28px rgba(0, 0, 0, 0.22), inset 0 0 0 1px rgba(251, 247, 232, 0.14)',
      }}
      onMouseMove={revealChrome}
      onMouseLeave={() => {
        if (playing) setShowChrome(false)
      }}
    >
      <video
        ref={videoRef}
        playsInline
        preload="metadata"
        muted={muted}
        className={`block w-full h-auto cursor-pointer ${compact ? 'max-h-[min(58vh,28rem)]' : 'max-h-[min(85vh,52rem)]'}`}
        aria-label={`${title} video recap`}
        onClick={togglePlay}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onTimeUpdate={() => setCurrent(videoRef.current?.currentTime ?? 0)}
        onLoadedMetadata={() => setDuration(videoRef.current?.duration ?? 0)}
        onEnded={() => {
          setPlaying(false)
          setShowChrome(true)
        }}
      >
        <source src={src} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      <div
        className={`pointer-events-none absolute inset-x-0 top-0 h-24 transition-opacity duration-500 ${showChrome || !playing ? 'opacity-100' : 'opacity-0'}`}
        style={{ background: 'linear-gradient(to bottom, rgba(53, 18, 25, 0.45), transparent)' }}
        aria-hidden
      />

      {!playing && (
        <button
          type="button"
          onClick={togglePlay}
          className={`absolute left-1/2 top-1/2 z-10 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 transition-transform duration-300 hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-cream)] ${compact ? 'h-11 w-11 sm:h-12 sm:w-12' : 'h-14 w-14 sm:h-16 sm:w-16'}`}
          style={{
            borderColor: 'var(--color-cream)',
            background: 'rgba(53, 18, 25, 0.72)',
            color: 'var(--color-cream)',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.28)',
          }}
          aria-label="Play video"
        >
          <svg width={compact ? 16 : 22} height={compact ? 16 : 22} viewBox="0 0 24 24" fill="currentColor" aria-hidden className="ml-0.5">
            <path d="M8 5.14v13.72L19 12 8 5.14z" />
          </svg>
        </button>
      )}

      <div
        className={`absolute inset-x-0 bottom-0 z-10 px-3 sm:px-3.5 pt-8 pb-2.5 sm:pb-3 transition-opacity duration-500 ${showChrome || !playing ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        style={{ background: 'linear-gradient(to top, rgba(53, 18, 25, 0.88) 0%, rgba(53, 18, 25, 0.45) 55%, transparent 100%)' }}
      >
        <div
          className="mb-2 h-[3px] w-full cursor-pointer rounded-full overflow-hidden"
          style={{ background: 'rgba(251, 247, 232, 0.22)' }}
          onClick={e => {
            const rect = e.currentTarget.getBoundingClientRect()
            seek((e.clientX - rect.left) / rect.width)
            revealChrome()
          }}
          role="slider"
          aria-label="Seek"
          aria-valuemin={0}
          aria-valuemax={Math.round(duration)}
          aria-valuenow={Math.round(current)}
          tabIndex={0}
          onKeyDown={e => {
            if (e.key === 'ArrowRight') seek(Math.min(1, progress + 0.05))
            if (e.key === 'ArrowLeft') seek(Math.max(0, progress - 0.05))
          }}
        >
          <div
            className="h-full rounded-full transition-[width] duration-100 ease-linear"
            style={{
              width: `${progress * 100}%`,
              background: 'linear-gradient(90deg, var(--color-olive-light), var(--color-pink-medium))',
            }}
          />
        </div>

        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              type="button"
              onClick={togglePlay}
              className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full border transition-colors hover:bg-[var(--color-cream)] hover:text-[var(--color-brown-dark)]"
              style={{
                borderColor: 'rgba(251, 247, 232, 0.45)',
                color: 'var(--color-cream)',
                background: 'transparent',
              }}
              aria-label={playing ? 'Pause' : 'Play'}
            >
              {playing ? (
                <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                  <path d="M6 5h4v14H6V5zm8 0h4v14h-4V5z" />
                </svg>
              ) : (
                <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" aria-hidden className="ml-0.5">
                  <path d="M8 5.14v13.72L19 12 8 5.14z" />
                </svg>
              )}
            </button>
            <span
              className="text-[10px] sm:text-[11px] tabular-nums tracking-wide"
              style={{ fontFamily: 'var(--font-kollektif)', color: 'var(--color-cream)', opacity: 0.85 }}
            >
              {formatVideoTime(current)}
              <span style={{ opacity: 0.45 }}> · </span>
              {formatVideoTime(duration)}
            </span>
          </div>

          <button
            type="button"
            onClick={() => {
              setMuted(m => !m)
              revealChrome()
            }}
            className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full border transition-colors hover:bg-[var(--color-cream)] hover:text-[var(--color-brown-dark)]"
            style={{
              borderColor: 'rgba(251, 247, 232, 0.45)',
              color: 'var(--color-cream)',
              background: 'transparent',
            }}
            aria-label={muted ? 'Unmute' : 'Mute'}
          >
            {muted ? (
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
              </svg>
            ) : (
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

function FridaySlideCarousel({ slides, title }: { slides: string[]; title: string }) {
  const [index, setIndex] = useState(0)
  const count = slides.length

  useEffect(() => {
    if (count <= 1) return
    const id = window.setInterval(() => {
      setIndex(i => (i + 1) % count)
    }, 5000)
    return () => window.clearInterval(id)
  }, [count])

  if (count === 0) return null

  return (
    <div
      className="relative overflow-hidden rounded-md border-2"
      style={{ background: 'var(--color-cream)', borderColor: 'var(--color-olive)' }}
    >
      <div className="relative aspect-[16/9] w-full overflow-hidden" style={{ background: 'rgba(111, 101, 9, 0.08)' }}>
        {slides.map((src, i) => {
          const isActive = i === index
          const fromLeft = i % 2 === 0
          return (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={src}
              src={encodeURI(src)}
              alt={`${title} — slide ${i + 1}`}
              className={`friday-carousel-slide absolute inset-0 h-full w-full object-contain ${isActive ? 'is-active' : ''} ${fromLeft ? 'from-left' : 'from-right'}`}
              style={{ zIndex: isActive ? 2 : 0, pointerEvents: 'none' }}
              loading={i === 0 ? 'eager' : 'lazy'}
            />
          )
        })}
      </div>

      <div
        className="absolute bottom-2 left-0 right-0 z-10 flex items-center justify-center gap-1.5"
        aria-hidden
      >
        {slides.map((_, i) => (
          <span
            key={i}
            className="h-1.5 rounded-full transition-all"
            style={{
              width: i === index ? '1.1rem' : '0.4rem',
              background: i === index ? 'var(--color-olive)' : 'rgba(111, 101, 9, 0.35)',
            }}
          />
        ))}
      </div>
    </div>
  )
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
  const [fridayHeaderIn, setFridayHeaderIn] = useState(false)
  const [visibleLessons, setVisibleLessons] = useState<Set<number>>(() => new Set())
  const [fridayProgress, setFridayProgress] = useState(0)
  const [lessonSlideProgress, setLessonSlideProgress] = useState<Record<number, number>>({})
  const [offscreenTravel, setOffscreenTravel] = useState(520)
  const galleryRef = useRef<HTMLDivElement>(null)
  const fridaySectionRef = useRef<HTMLElement>(null)
  const fridayHeaderRef = useRef<HTMLDivElement>(null)
  const fridayLessonRefs = useRef<(HTMLElement | null)[]>([])

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
    if (isClubRecapOnly(id)) return null
    if (isWorkshopEventId(id)) {
      const resolved = resolveWorkshopPageId(id, allClubPast.filter(e => isWorkshopEventId(e.id)))
      return allClubPast.find(e => e.id === resolved) ?? null
    }
    return allClubPast.find(e => e.id === id) ?? null
  }, [allClubPast, id])

  const media = useMemo(() => (event ? getClubGalleryItems(event.id) : []), [event])
  const videos = useMemo(() => (event ? getClubGalleryVideos(event.id) : []), [event])
  const fridayExamples = useMemo(() => (event ? getWorkshopFridayExamples(event.id) : []), [event])
  const photoCount = useMemo(() => media.filter(m => m.kind === 'image').length, [media])
  const clipCount = useMemo(() => media.filter(m => m.kind === 'video').length, [media])
  const galleryComingSoon = useMemo(
    () => (event ? isGalleryComingSoon(event.id) : false),
    [event]
  )

  const suggestions = useMemo(() => {
    if (!event) return []
    const others = allClubPast.filter(e => e.id !== event.id && !isClubRecapOnly(e.id))
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
    setFridayHeaderIn(false)
    setVisibleLessons(new Set())
    setFridayProgress(0)
    setLessonSlideProgress({})
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
  }, [id, media, galleryRevealReady])

  useEffect(() => {
    if (fridayExamples.length === 0) return

    const headerEl = fridayHeaderRef.current
    const lessonEls = fridayLessonRefs.current.filter(Boolean) as HTMLElement[]
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return
          const target = entry.target as HTMLElement
          if (target.dataset.fridayHeader === 'true') {
            setFridayHeaderIn(true)
            observer.unobserve(target)
            return
          }
          const idx = Number(target.dataset.fridayLesson)
          if (Number.isNaN(idx)) return
          setVisibleLessons(prev => {
            if (prev.has(idx)) return prev
            const next = new Set(prev)
            next.add(idx)
            return next
          })
          observer.unobserve(target)
        })
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.18 }
    )

    if (headerEl) observer.observe(headerEl)
    lessonEls.forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [id, fridayExamples])

  useEffect(() => {
    if (fridayExamples.length === 0) return
    const section = fridaySectionRef.current
    if (!section) return

    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const targets: Record<number, number> = {}
    const current: Record<number, number> = {}
    let raf = 0
    let running = true
    const lerp = prefersReduced ? 1 : 0.075

    const readTargets = () => {
      setOffscreenTravel(Math.max(window.innerWidth * 0.95, 480))

      const rect = section.getBoundingClientRect()
      const viewport = window.innerHeight || 1
      const total = rect.height + viewport * 0.35
      const traveled = viewport * 0.65 - rect.top
      setFridayProgress(Math.min(1, Math.max(0, traveled / total)))

      fridayLessonRefs.current.forEach((el, idx) => {
        if (!el) return
        const lessonRect = el.getBoundingClientRect()
        const start = viewport * 1.25
        const end = viewport * 0.22
        const raw = (start - lessonRect.top) / (start - end)
        const clamped = Math.min(1, Math.max(0, raw))
        // Smooth cubic ease-out target
        targets[idx] = 1 - Math.pow(1 - clamped, 3)
        if (current[idx] == null) current[idx] = prefersReduced ? targets[idx] : 0
      })
    }

    const tick = () => {
      if (!running) return
      readTargets()

      const next: Record<number, number> = {}
      let needsMore = false
      for (let i = 0; i < fridayExamples.length; i++) {
        const target = targets[i] ?? 0
        const prev = current[i] ?? 0
        const blended = prev + (target - prev) * lerp
        const settled = Math.abs(target - blended) < 0.0015
        current[i] = settled ? target : blended
        next[i] = current[i]
        if (!settled) needsMore = true
      }
      setLessonSlideProgress(next)

      if (needsMore) {
        raf = requestAnimationFrame(tick)
      } else {
        raf = 0
      }
    }

    const kick = () => {
      if (raf) return
      raf = requestAnimationFrame(tick)
    }

    readTargets()
    kick()
    window.addEventListener('scroll', kick, { passive: true })
    window.addEventListener('resize', kick)
    return () => {
      running = false
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', kick)
      window.removeEventListener('resize', kick)
    }
  }, [id, fridayExamples])

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
  const blurb = getClubGalleryBlurb(event.id) ?? event.description

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
      <div className="px-6 sm:px-8 md:px-12 lg:px-16 pt-12 sm:pt-14 md:pt-16 pb-12 md:pb-16">
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
      <header className="mx-auto w-full max-w-4xl md:max-w-5xl px-5 sm:px-10 md:px-14 lg:px-16 text-center pb-10 sm:pb-16 md:pb-24">
        <p
          className={`text-[9px] sm:text-[11px] md:text-xs font-bold uppercase tracking-[0.22em] sm:tracking-[0.28em] mb-2.5 sm:mb-4 italic transition-all duration-700 ease-out ${entered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
          style={{ fontFamily: 'var(--font-freshwost)', color: 'var(--color-olive-light)', transitionDelay: entered ? '80ms' : '0ms' }}
        >
          Club recap
        </p>
        <h1
          className={`text-2xl sm:text-5xl md:text-6xl font-bold leading-[1.1] sm:leading-[1.05] mb-2.5 sm:mb-4 transition-all duration-700 ease-out ${entered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}
          style={{ fontFamily: 'var(--font-vintage-stylist)', color: 'var(--color-pink-medium)', transitionDelay: entered ? '160ms' : '0ms' }}
        >
          {event.title}
        </h1>
        <p
          className={`text-xs sm:text-base font-semibold mb-3.5 sm:mb-5 transition-all duration-700 ease-out ${entered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}
          style={{ fontFamily: 'var(--font-kollektif)', color: 'var(--color-cream)', opacity: entered ? 0.85 : 0, transitionDelay: entered ? '240ms' : '0ms' }}
        >
          {formatRange(event.date, event.endDate)}
          {time ? ` · ${time}` : ''}
          {location ? ` · ${location}` : ''}
        </p>
        {blurb && (
          <div
            className={`mx-auto w-full max-w-3xl md:max-w-4xl space-y-3 sm:space-y-4 transition-all duration-700 ease-out ${entered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}
            style={{ opacity: entered ? 0.95 : 0, transitionDelay: entered ? '320ms' : '0ms' }}
          >
            {blurb.split(/\n\n+/).map((paragraph, i) => (
              <p
                key={i}
                className="text-sm sm:text-base md:text-lg leading-relaxed"
                style={{ fontFamily: 'var(--font-leiko)', color: 'var(--color-pink-medium)', lineHeight: 1.65 }}
              >
                {paragraph}
              </p>
            ))}
          </div>
        )}
      </header>

      {/* Video recap — original featured clip */}
      {videos.length > 0 && (
        <section
          className={`mx-auto w-full px-5 sm:px-10 md:px-14 lg:px-16 pb-12 sm:pb-16 md:pb-20 transition-all duration-700 ease-out ${entered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
          style={{ transitionDelay: entered ? '380ms' : '0ms' }}
        >
          <div className="mx-auto flex w-full max-w-[min(100%,28rem)] sm:max-w-[min(100%,34rem)] md:max-w-[min(100%,38rem)] flex-col items-center">
            <div className="flex w-full items-center gap-3 sm:gap-4 mb-4 sm:mb-5">
              <span
                className="h-px flex-1"
                style={{ background: 'var(--color-olive-light)', opacity: 0.45 }}
                aria-hidden
              />
              <p
                className="text-[9px] sm:text-[10px] md:text-xs font-bold uppercase tracking-[0.22em] sm:tracking-[0.28em] italic shrink-0"
                style={{ fontFamily: 'var(--font-freshwost)', color: 'var(--color-olive-light)' }}
              >
                Video recap
              </p>
              <span
                className="h-px flex-1"
                style={{ background: 'var(--color-olive-light)', opacity: 0.45 }}
                aria-hidden
              />
            </div>
            <GalleryVideoPlayer src={videos[0]} title={event.title} />
            <p
              className="mt-3 sm:mt-3.5 text-center text-[11px] sm:text-xs leading-relaxed italic"
              style={{ fontFamily: 'var(--font-leiko)', color: 'var(--color-cream)', opacity: 0.75 }}
            >
              Flowers, friends, and a little Valentine magic
            </p>
          </div>
        </section>
      )}

      {/* Classroom lessons — wider than the centered recap */}
      {fridayExamples.length > 0 && (
        <section
          ref={fridaySectionRef}
          className="friday-lessons-section w-full mb-24 md:mb-32 lg:mb-40"
          style={{ ['--friday-progress' as string]: String(fridayProgress) }}
        >
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 md:px-8 lg:px-10">
            <div className="friday-lessons-progress" aria-hidden>
              <div className="friday-lessons-progress-bar" />
            </div>

            <div
              ref={fridayHeaderRef}
              data-friday-header="true"
              className={`friday-lessons-header mb-16 sm:mb-24 md:mb-28 ${fridayHeaderIn ? 'is-in' : ''}`}
            >
              <div className="relative overflow-hidden rounded-2xl border-2 px-5 py-7 sm:px-8 sm:py-9 md:px-10 md:py-11"
                style={{
                  borderColor: 'rgba(251, 247, 232, 0.28)',
                  background:
                    'linear-gradient(135deg, rgba(111, 101, 9, 0.55) 0%, rgba(98, 32, 47, 0.35) 55%, rgba(61, 57, 10, 0.5) 100%)',
                }}
              >
                <p
                  className="pointer-events-none absolute -right-2 -top-4 select-none text-[7rem] sm:text-[9rem] md:text-[11rem] font-bold leading-none"
                  style={{
                    fontFamily: 'var(--font-vintage-stylist)',
                    color: 'var(--color-cream)',
                    opacity: 0.07,
                  }}
                  aria-hidden
                >
                  {String(fridayExamples.length).padStart(2, '0')}
                </p>

                <div className="relative grid gap-6 md:grid-cols-[auto_1fr] md:items-end md:gap-10">
                  <div className="flex flex-col gap-2">
                    <span
                      className="inline-flex w-fit items-center gap-2 rounded-full border px-3 py-1 text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.2em]"
                      style={{
                        fontFamily: 'var(--font-kollektif)',
                        color: 'var(--color-cream)',
                        borderColor: 'rgba(251, 247, 232, 0.4)',
                        background: 'rgba(53, 18, 25, 0.35)',
                      }}
                    >
                      <span
                        className="h-1.5 w-1.5 rounded-full"
                        style={{ background: 'var(--color-olive-light)' }}
                        aria-hidden
                      />
                      Friday classroom
                    </span>
                    <p
                      className="text-[11px] sm:text-xs italic"
                      style={{ fontFamily: 'var(--font-freshwost)', color: 'var(--color-olive-light)' }}
                    >
                      {fridayExamples.length} week{fridayExamples.length === 1 ? '' : 's'} on the syllabus
                    </p>
                  </div>

                  <div className="md:text-right">
                    <h2
                      className="text-4xl sm:text-5xl md:text-6xl font-bold leading-[0.92]"
                      style={{ fontFamily: 'var(--font-vintage-stylist)', color: 'var(--color-cream)' }}
                    >
                      <span className="block opacity-70 text-[0.55em] tracking-wide font-normal mb-1"
                        style={{ fontFamily: 'var(--font-freshwost)', fontStyle: 'italic' }}
                      >
                        What We
                      </span>
                      Taught
                    </h2>
                  </div>
                </div>

                <div
                  className="relative mt-6 sm:mt-7 flex flex-col gap-3 border-t pt-5 sm:flex-row sm:items-end sm:justify-between sm:gap-8"
                  style={{ borderColor: 'rgba(251, 247, 232, 0.2)' }}
                >
                  <p
                    className="max-w-md text-sm sm:text-base leading-relaxed"
                    style={{ fontFamily: 'var(--font-leiko)', color: 'var(--color-cream)', opacity: 0.9, lineHeight: 1.65 }}
                  >
                    Peek at each Friday on the board—what we practiced, and the slides we projected.
                  </p>
                  <p
                    className="shrink-0 text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.18em]"
                    style={{ fontFamily: 'var(--font-kollektif)', color: 'var(--color-olive-light)' }}
                  >
                    Scroll the lessons ↓
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-28 sm:space-y-36 md:space-y-44 lg:space-y-52">
              {fridayExamples.map((example, weekIndex) => {
                const hasSlides = (example.slides?.length ?? 0) > 0
                const lessonIn = visibleLessons.has(weekIndex)
                const slidesFromLeft = weekIndex % 2 === 0
                const slideProgress = lessonSlideProgress[weekIndex] ?? 0
                const cardTravel = (1 - slideProgress) * (slidesFromLeft ? -offscreenTravel : offscreenTravel)
                return (
                  <article
                    key={`${example.week}-${example.slideTitle}`}
                    ref={el => {
                      fridayLessonRefs.current[weekIndex] = el
                    }}
                    data-friday-lesson={weekIndex}
                    className={`friday-lesson-card friday-lesson-card-scroll rounded-xl border-2 p-5 sm:p-7 md:p-8 lg:p-10 ${lessonIn ? 'is-in' : ''} ${slidesFromLeft ? 'slides-from-left' : 'slides-from-right'}`}
                    style={{
                      background: 'var(--color-cream)',
                      borderColor: 'var(--color-olive)',
                      opacity: Math.min(1, 0.12 + slideProgress * 0.95),
                      transform: `translate3d(${cardTravel}px, 0, 0)`,
                      boxShadow:
                        slideProgress > 0.92
                          ? '0 18px 40px rgba(0, 0, 0, 0.18)'
                          : slideProgress > 0.5
                            ? '0 10px 28px rgba(0, 0, 0, 0.1)'
                            : 'none',
                      willChange: 'transform, opacity',
                    }}
                  >
                    <div className={`grid gap-6 lg:gap-10 xl:gap-14 ${hasSlides ? 'lg:grid-cols-2 lg:items-start' : ''}`}>
                      <div className={`friday-lesson-copy ${hasSlides && slidesFromLeft ? 'lg:order-2' : ''}`}>
                        <div className="flex items-start gap-3 sm:gap-4 mb-4">
                          <span
                            className="text-3xl sm:text-4xl font-bold leading-none tabular-nums"
                            style={{ fontFamily: 'var(--font-vintage-stylist)', color: 'var(--color-olive)' }}
                          >
                            {String(weekIndex + 1).padStart(2, '0')}
                          </span>
                          <div className="pt-1">
                            <p
                              className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.18em]"
                              style={{ fontFamily: 'var(--font-kollektif)', color: 'var(--color-olive)' }}
                            >
                              On the syllabus
                            </p>
                            <p
                              className="text-[10px] sm:text-xs italic mt-0.5"
                              style={{ fontFamily: 'var(--font-freshwost)', color: 'var(--color-brown-dark)', opacity: 0.65 }}
                            >
                              {example.week}
                            </p>
                          </div>
                        </div>
                        <h3
                          className="text-2xl sm:text-3xl font-bold leading-snug mb-3"
                          style={{ fontFamily: 'var(--font-vintage-stylist)', color: 'var(--color-olive)' }}
                        >
                          {example.slideTitle}
                        </h3>
                        <p
                          className="text-sm sm:text-base leading-relaxed mb-5"
                          style={{ fontFamily: 'var(--font-leiko)', color: 'var(--color-brown-dark)', opacity: 0.88, lineHeight: 1.65 }}
                        >
                          {example.summary}
                        </p>
                        <p
                          className="mb-2.5 text-[10px] font-bold uppercase tracking-[0.2em]"
                          style={{ fontFamily: 'var(--font-kollektif)', color: 'var(--color-olive)' }}
                        >
                          On the board
                        </p>
                        <ol className="space-y-2">
                          {example.discuss.map((item, i) => (
                            <li
                              key={item}
                              className="friday-board-item flex gap-3 text-sm sm:text-base leading-snug"
                              style={{ fontFamily: 'var(--font-leiko)', color: 'var(--color-brown-dark)' }}
                            >
                              <span
                                className="shrink-0 tabular-nums text-[11px] font-bold pt-0.5"
                                style={{ fontFamily: 'var(--font-kollektif)', color: 'var(--color-olive)' }}
                              >
                                {String(i + 1).padStart(2, '0')}
                              </span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ol>
                      </div>
                      {hasSlides && example.slides && (
                        <div className={`friday-lesson-slides ${slidesFromLeft ? 'lg:order-1' : ''}`}>
                          <p
                            className="mb-2.5 text-[10px] font-bold uppercase tracking-[0.2em]"
                            style={{ fontFamily: 'var(--font-kollektif)', color: 'var(--color-olive)' }}
                          >
                            From the projector
                          </p>
                          <FridaySlideCarousel slides={example.slides} title={example.slideTitle} />
                        </div>
                      )}
                    </div>
                  </article>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* Gallery — or a soft “coming soon” note when nothing’s ready yet */}
      {galleryComingSoon ? (
        <section
          className={`mx-auto w-full max-w-xl px-5 sm:px-10 md:px-14 lg:px-16 pb-16 md:pb-24 lg:pb-28 text-center transition-all duration-700 ease-out ${entered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
          style={{ transitionDelay: entered ? '400ms' : '0ms' }}
        >
          <div
            className="rounded-2xl border-2 px-6 py-10 sm:px-8 sm:py-12"
            style={{
              borderColor: 'var(--color-cream)',
              background: 'var(--color-olive-light)',
            }}
          >
            <p
              className="text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.22em] mb-3 italic"
              style={{ fontFamily: 'var(--font-freshwost)', color: 'var(--color-olive)' }}
            >
              Under construction
            </p>
            <h2
              className="text-xl sm:text-2xl font-bold mb-3"
              style={{ fontFamily: 'var(--font-vintage-stylist)', color: 'var(--color-cream)' }}
            >
              Still developing this memory
            </h2>
            <p
              className="text-sm sm:text-base leading-relaxed"
              style={{ fontFamily: 'var(--font-leiko)', color: 'var(--color-olive)', lineHeight: 1.65 }}
            >
              Photos, clips, and Friday notes are getting their glow-up. Pop back later — we&apos;ll have something sweet to share.
            </p>
          </div>
        </section>
      ) : (
      <section className="w-full pb-16 md:pb-24 lg:pb-28">
        <p
          className={`text-[9px] sm:text-[10px] md:text-xs font-bold uppercase tracking-[0.18em] sm:tracking-[0.22em] mb-4 sm:mb-5 md:mb-6 transition-all duration-700 ease-out ${entered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
          style={{
            fontFamily: 'var(--font-kollektif)',
            color: 'var(--color-cream)',
            opacity: entered ? 0.65 : 0,
            transitionDelay: entered ? '400ms' : '0ms',
            paddingLeft: 'var(--gallery-gap)',
            paddingRight: 'var(--gallery-gap)',
          }}
        >
          Gallery · {photoCount} photos{clipCount > 0 ? ` · ${clipCount} clips` : ''}
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
          {media.map((item, i) => {
            const isVideo = item.kind === 'video'
            const label = isVideo ? 'Clip' : 'Photo'
            return (
              <figure
                key={`${item.src}-${i}`}
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
                  aria-label={`${label} ${i + 1} of ${media.length}`}
                  aria-expanded={selectedPhotoIndex === i}
                >
                  {isVideo ? (
                    <video
                      src={item.src}
                      muted
                      loop
                      autoPlay
                      playsInline
                      preload="metadata"
                      className="block w-full h-auto pointer-events-none"
                      aria-label={`${event.title} — clip`}
                    />
                  ) : (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={item.src}
                      alt={`${event.title} — photo ${i + 1}`}
                      className="block w-full h-auto"
                      loading={i < 4 ? 'eager' : 'lazy'}
                    />
                  )}
                </button>

                {selectedPhotoIndex === i && (
                  <div
                    className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-1.5 sm:gap-3 rounded-lg p-2 sm:p-4 animate-fadeIn overflow-hidden"
                    style={{ background: 'rgba(53, 18, 25, 0.9)' }}
                    role="dialog"
                    aria-label={`Save ${label.toLowerCase()} ${i + 1}`}
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
                      {label} {i + 1} of {media.length}
                    </p>
                    <button
                      type="button"
                      onClick={() => saveGalleryImage(item.src, photoFilename(event.title, item.src, i))}
                      className="inline-flex items-center justify-center gap-1 sm:gap-2 rounded-full border-2 h-9 w-9 sm:h-auto sm:w-auto sm:px-4 sm:py-2 text-[10px] sm:text-sm font-bold transition-all duration-200 hover:-translate-y-0.5 bg-[var(--color-cream)] text-[var(--color-brown-dark)] hover:bg-[var(--color-pink-medium)] shrink-0"
                      style={{ fontFamily: 'var(--font-kollektif)', borderColor: 'var(--color-cream)' }}
                      aria-label={isVideo ? 'Save video' : 'Save image'}
                    >
                      <svg className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5m0 0l5-5m-5 5V4" />
                      </svg>
                      <span className="hidden sm:inline whitespace-nowrap">{isVideo ? 'Save video' : 'Save image'}</span>
                    </button>
                  </div>
                )}
              </figure>
            )
          })}
        </div>
      </section>
      )}

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
                  className="text-xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-2 sm:mb-3 md:mb-4"
                  style={{ fontFamily: 'var(--font-vintage-stylist)', color: 'var(--color-cream)' }}
                >
                  Keep looking back
                </h2>
                <p
                  className="text-xs sm:text-sm md:text-base italic"
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
