'use client'

import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { events } from '../events'
import {
  type DisplayEvent,
  normalizeDay,
  getLocationFromDescription,
  mergeConsecutiveEvents
} from '../shared'
import { getClubMemoryBlurb, getClubCardCover, collapseWorkshopSeries, isClubRecapOnly } from './pastGalleries'
import { clearGalleryParents, galleryHref } from './galleryNav'

const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

const clubStartDate = normalizeDay(new Date(2025, 7, 1))

const EVENT_TYPE_STICKERS = {
  club: '/assets/events/club.png',
  school: '/assets/events/school.png',
  holiday: '/assets/events/holiday.png',
} as const

function MobileMonthCarousel({
  events: monthEvents,
  renderCard,
  showTopBadge,
}: {
  events: DisplayEvent[]
  renderCard: (event: DisplayEvent) => ReactNode
  showTopBadge: boolean
}) {
  const scrollerRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)

  const scrollByCard = (direction: -1 | 1) => {
    const el = scrollerRef.current
    if (!el) return
    const card = el.querySelector<HTMLElement>('[data-mobile-event-card]')
    const amount = card ? card.offsetWidth + 12 : el.clientWidth * 0.8
    el.scrollBy({ left: direction * amount, behavior: 'smooth' })
  }

  const scrollToIndex = (index: number) => {
    const el = scrollerRef.current
    if (!el) return
    const cards = el.querySelectorAll<HTMLElement>('[data-mobile-event-card]')
    cards[index]?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' })
  }

  useEffect(() => {
    const el = scrollerRef.current
    if (!el) return
    const updateActive = () => {
      const cards = Array.from(el.querySelectorAll<HTMLElement>('[data-mobile-event-card]'))
      if (!cards.length) return
      const mid = el.getBoundingClientRect().left + el.clientWidth / 2
      let closest = 0
      let closestDist = Infinity
      cards.forEach((card, i) => {
        const rect = card.getBoundingClientRect()
        const dist = Math.abs(rect.left + rect.width / 2 - mid)
        if (dist < closestDist) {
          closestDist = dist
          closest = i
        }
      })
      setActiveIndex(closest)
    }
    el.addEventListener('scroll', updateActive, { passive: true })
    updateActive()
    return () => el.removeEventListener('scroll', updateActive)
  }, [monthEvents.length])

  if (monthEvents.length === 0) return null

  return (
    <div className="md:hidden relative">
      {monthEvents.length > 1 && (
        <div className="mb-3 flex items-center justify-center gap-2.5 px-1" aria-hidden={false}>
          <button
            type="button"
            onClick={() => scrollByCard(-1)}
            className="flex h-6 w-6 items-center justify-center opacity-45"
            style={{ color: 'var(--color-brown-dark)' }}
            aria-label="Previous event"
          >
            <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.25} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div className="flex items-center gap-1.5" role="tablist" aria-label="Swipe events">
            {monthEvents.map((event, index) => (
              <button
                key={event.id}
                type="button"
                role="tab"
                aria-label={`Event ${index + 1} of ${monthEvents.length}`}
                aria-current={index === activeIndex ? 'true' : undefined}
                onClick={() => scrollToIndex(index)}
                className="h-1.5 rounded-full transition-all duration-200"
                style={{
                  width: index === activeIndex ? '1.1rem' : '0.375rem',
                  background: index === activeIndex ? 'var(--color-brown-dark)' : 'rgba(98, 32, 47, 0.28)',
                }}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={() => scrollByCard(1)}
            className="flex h-6 w-6 items-center justify-center opacity-45"
            style={{ color: 'var(--color-brown-dark)' }}
            aria-label="Next event"
          >
            <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.25} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      )}

      <div className="w-full max-w-full overflow-hidden">
        <div
          ref={scrollerRef}
          className="flex w-full max-w-full items-start gap-3 overflow-x-auto overscroll-x-contain pb-1 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            WebkitOverflowScrolling: 'touch',
            touchAction: 'pan-x',
            overscrollBehaviorX: 'contain',
            scrollPaddingInline: 'max(0.75rem, calc(50% - min(42.5vw, 10rem)))',
            paddingInline: 'max(0.75rem, calc(50% - min(42.5vw, 10rem)))',
          }}
        >
          {monthEvents.map((event, eventIndex) => (
            <div
              key={event.id}
              data-mobile-event-card
              className="relative w-[min(85vw,20rem)] max-w-[85vw] shrink-0 snap-center"
            >
              {showTopBadge && eventIndex === 0 && (
                <div
                  className="pointer-events-none absolute -top-2 right-1 z-10 rounded-md px-2 py-0.5 text-[9px] font-bold uppercase"
                  style={{
                    background: 'var(--color-pink-medium)',
                    color: 'var(--color-cream)',
                    fontFamily: 'var(--font-kollektif)',
                    border: '1.5px solid var(--color-cream)',
                  }}
                >
                  Top
                </div>
              )}
              {renderCard(event)}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function PastEventsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState<'all' | 'holiday' | 'school' | 'club'>('all')
  const [today, setToday] = useState(() => normalizeDay(new Date()))
  const [heroCardVisible, setHeroCardVisible] = useState(false)
  const [heroTextVisible, setHeroTextVisible] = useState(false)
  const [tocOpen, setTocOpen] = useState(false)
  const [tocYear, setTocYear] = useState<number | null>(null)
  const [activeMonthKey, setActiveMonthKey] = useState<number | null>(null)

  useEffect(() => {
    const update = () => setToday(normalizeDay(new Date()))
    update()
    const now = new Date()
    const msUntilMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1).getTime() - now.getTime()
    const t = setTimeout(update, msUntilMidnight)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    const rafId = requestAnimationFrame(() => {
      document.body.style.transition = 'background 0.8s ease-in-out'
      document.documentElement.style.transition = 'background 0.8s ease-in-out'
      requestAnimationFrame(() => {
        document.body.style.background = 'var(--color-olive-light)'
        document.documentElement.style.background = 'var(--color-olive-light)'
      })
    })
    return () => cancelAnimationFrame(rafId)
  }, [])

  useEffect(() => {
    const cardTimer = setTimeout(() => setHeroCardVisible(true), 900)
    const textTimer = setTimeout(() => setHeroTextVisible(true), 1200)
    return () => {
      clearTimeout(cardTimer)
      clearTimeout(textTimer)
    }
  }, [])

  useEffect(() => {
    const prev = document.documentElement.style.scrollBehavior
    document.documentElement.style.scrollBehavior = 'smooth'
    return () => {
      document.documentElement.style.scrollBehavior = prev
    }
  }, [])

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)')
    const apply = () => {
      if (mq.matches) {
        document.documentElement.style.overflowX = 'hidden'
        document.body.style.overflowX = 'hidden'
        document.body.style.touchAction = 'pan-y'
      } else {
        document.documentElement.style.overflowX = ''
        document.body.style.overflowX = ''
        document.body.style.touchAction = ''
      }
    }
    apply()
    mq.addEventListener('change', apply)
    return () => {
      mq.removeEventListener('change', apply)
      document.documentElement.style.overflowX = ''
      document.body.style.overflowX = ''
      document.body.style.touchAction = ''
    }
  }, [])

  useEffect(() => {
    if (!tocOpen) return
    const isMobile = window.matchMedia('(max-width: 767px)').matches
    if (!isMobile) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [tocOpen])

  const allMergedEvents = useMemo(
    () => mergeConsecutiveEvents([...events].sort((a, b) => a.date.getTime() - b.date.getTime())),
    []
  )

  const pastBase = useMemo(() => {
    const filtered = allMergedEvents.filter(e => {
      const end = normalizeDay(e.endDate ?? e.date)
      const start = normalizeDay(e.date)
      return end < today && start >= clubStartDate
    })
    return collapseWorkshopSeries(filtered)
  }, [allMergedEvents, today])

  const filteredBase = useMemo(() => {
    let list = filterType === 'all' ? pastBase : pastBase.filter(e => e.type === filterType)
    const q = searchQuery.trim().toLowerCase()
    if (q) {
      list = list.filter(e => {
        const title = e.title.toLowerCase()
        const desc = (e.description ?? '').toLowerCase()
        const loc = (getLocationFromDescription(e.description) ?? '').toLowerCase()
        return title.includes(q) || desc.includes(q) || (loc && loc.includes(q))
      })
    }
    // Ascending for grouping; months + days are reversed for look-back below
    return [...list].sort((a, b) => a.date.getTime() - b.date.getTime())
  }, [filterType, pastBase, searchQuery])

  const displayEvents = filteredBase

  const groupedByMonth = useMemo(() => {
    const dateGroups = new Map<number, DisplayEvent[]>()
    for (const e of displayEvents) {
      const key = normalizeDay(e.date).getTime()
      const arr = dateGroups.get(key) ?? []
      arr.push(e)
      dateGroups.set(key, arr)
    }

    // Chronological days within each month (reversed after month order flip)
    const sortedDates = [...dateGroups.entries()]
      .sort((a, b) => a[0] - b[0])
      .map(([k, v]) => ({ startKey: k, date: new Date(k), events: v }))

    const months: {
      monthKey: number
      label: string
      dateGroups: { startKey: number; date: Date; events: DisplayEvent[] }[]
    }[] = []

    for (const group of sortedDates) {
      const monthKey = new Date(group.date.getFullYear(), group.date.getMonth(), 1).getTime()
      const label = `${MONTH_NAMES[group.date.getMonth()]} ${group.date.getFullYear()}`
      const last = months[months.length - 1]
      if (last?.monthKey === monthKey) {
        last.dateGroups.push(group)
      } else {
        months.push({ monthKey, label, dateGroups: [group] })
      }
    }

    // Newest months/years at top; within each month, newest days first (e.g. 30 → 12 → 4)
    return months.reverse().map(month => ({
      ...month,
      dateGroups: [...month.dateGroups].reverse(),
    }))
  }, [displayEvents])

  const tocByYear = useMemo(() => {
    const years: { year: number; months: typeof groupedByMonth }[] = []
    for (const month of groupedByMonth) {
      const year = new Date(month.monthKey).getFullYear()
      const last = years[years.length - 1]
      if (last?.year === year) {
        last.months.push(month)
      } else {
        years.push({ year, months: [month] })
      }
    }
    return years
  }, [groupedByMonth])

  useEffect(() => {
    if (tocByYear.length === 0) {
      setTocYear(null)
      return
    }
    setTocYear(prev => (prev != null && tocByYear.some(y => y.year === prev) ? prev : tocByYear[0].year))
  }, [tocByYear])

  useEffect(() => {
    const sections = groupedByMonth
      .map(m => document.getElementById(`month-${m.monthKey}`))
      .filter((el): el is HTMLElement => !!el)

    if (sections.length === 0) {
      setActiveMonthKey(null)
      return
    }

    const visible = new Map<number, number>()

    const observer = new IntersectionObserver(
      entries => {
        for (const entry of entries) {
          const key = Number(entry.target.id.replace('month-', ''))
          if (entry.isIntersecting) {
            visible.set(key, entry.intersectionRatio)
          } else {
            visible.delete(key)
          }
        }

        if (visible.size === 0) return

        const topMost = [...visible.entries()].sort((a, b) => {
          const aEl = document.getElementById(`month-${a[0]}`)
          const bEl = document.getElementById(`month-${b[0]}`)
          const aTop = aEl?.getBoundingClientRect().top ?? 0
          const bTop = bEl?.getBoundingClientRect().top ?? 0
          const target = window.innerHeight * 0.28
          return Math.abs(aTop - target) - Math.abs(bTop - target)
        })[0]

        if (topMost) setActiveMonthKey(topMost[0])
      },
      {
        root: null,
        rootMargin: '-15% 0px -45% 0px',
        threshold: [0, 0.15, 0.35, 0.55, 0.75],
      }
    )

    sections.forEach(section => observer.observe(section))
    setActiveMonthKey(groupedByMonth[0]?.monthKey ?? null)

    return () => observer.disconnect()
  }, [groupedByMonth])

  useEffect(() => {
    if (!tocOpen || activeMonthKey == null) return
    const year = new Date(activeMonthKey).getFullYear()
    if (tocByYear.some(y => y.year === year)) setTocYear(year)
  }, [tocOpen, activeMonthKey, tocByYear])

  const activeTocYear = tocByYear.find(y => y.year === tocYear) ?? tocByYear[0]

  const pastClubEvents = useMemo(
    () =>
      pastBase
        .filter(e => e.type === 'club' && !isClubRecapOnly(e.id))
        .sort((a, b) => b.date.getTime() - a.date.getTime()),
    [pastBase]
  )

  const highlight = useMemo(() => {
    const bouquet = pastClubEvents.find(e => e.id === 'build-a-bouquet-2026')
    if (bouquet) {
      return { event: bouquet, label: 'Voted favourite this year' as const }
    }

    const thisMonthClub = pastClubEvents.find(
      e => e.date.getFullYear() === today.getFullYear() && e.date.getMonth() === today.getMonth()
    )
    if (thisMonthClub) {
      return { event: thisMonthClub, label: "This month's memory" as const }
    }

    const prevMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1)
    const lastMonthClub = pastClubEvents.find(
      e => e.date.getFullYear() === prevMonth.getFullYear() && e.date.getMonth() === prevMonth.getMonth()
    )
    if (lastMonthClub) {
      return { event: lastMonthClub, label: "Last month's memory" as const }
    }

    if (pastClubEvents[0]) {
      return { event: pastClubEvents[0], label: 'A recent memory' as const }
    }

    return null
  }, [pastClubEvents, today])

  const heroMonthGrid = useMemo(() => {
    const year = today.getFullYear()
    const month = today.getMonth()
    const startPad = new Date(year, month, 1).getDay()
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const cells: (number | null)[] = Array.from({ length: startPad }, () => null)
    for (let d = 1; d <= daysInMonth; d++) cells.push(d)
    while (cells.length % 7 !== 0) cells.push(null)
    return cells
  }, [today])

  const heroEventDays = useMemo(() => {
    const days = new Set<number>()
    const y = today.getFullYear()
    const m = today.getMonth()
    const todayDate = today.getDate()

    for (const e of pastBase) {
      if (e.type !== 'club') continue
      if (e.date.getFullYear() !== y || e.date.getMonth() !== m) continue

      const startDay = e.date.getDate()
      const endDay = e.endDate && e.endDate.getFullYear() === y && e.endDate.getMonth() === m
        ? e.endDate.getDate()
        : startDay

      for (let d = startDay; d <= endDay; d++) {
        // Only days that have already happened this month
        if (d < todayDate) days.add(d)
      }
    }
    return days
  }, [pastBase, today])

  const renderClubDesktopCard = (event: DisplayEvent) => {
    const isRecap = isClubRecapOnly(event.id)
    const cover = getClubCardCover(event.id)
    const blurb = isRecap
      ? event.description
      : (getClubMemoryBlurb(event.id) ?? event.description)
    const shortDate = event.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    const endShort = event.endDate
      ? event.endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      : null

    const body = (
      <div className="relative flex flex-col sm:flex-row gap-4 sm:gap-5 md:gap-6 p-5 pt-7 sm:p-6 sm:pt-8 md:p-7 md:pt-9 pb-6 md:pb-8">
        {cover && (
          <div
            className="relative shrink-0 self-start w-[5.5rem] h-[5.5rem] md:w-[7rem] md:h-[7rem] overflow-hidden rounded-xl border-2"
            style={{ borderColor: 'var(--color-brown-dark)', background: 'rgba(98, 32, 47, 0.08)' }}
          >
            <Image
              src={cover}
              alt=""
              fill
              className="object-cover"
              sizes="112px"
            />
          </div>
        )}

        <div className="flex-1 min-w-0 flex flex-col">
          <div className="flex flex-wrap items-center gap-2 mb-2.5 md:mb-3">
            <span
              className="inline-flex items-center px-2.5 py-1 text-[10px] md:text-[11px] font-bold uppercase tracking-[0.14em]"
              style={{
                fontFamily: 'var(--font-kollektif)',
                background: 'var(--color-cream)',
                color: 'var(--color-brown-dark)',
                borderRadius: '9999px',
              }}
            >
              Club memory
            </span>
            {event.endDate && (
              <span
                className="inline-flex items-center px-2.5 py-1 text-[10px] md:text-[11px] font-bold uppercase tracking-[0.12em]"
                style={{
                  fontFamily: 'var(--font-kollektif)',
                  color: 'var(--color-brown-dark)',
                  border: '1.5px solid rgba(98, 32, 47, 0.25)',
                  borderRadius: '9999px',
                }}
              >
                Multi-day
              </span>
            )}
          </div>

          <h3
            className="text-xl sm:text-2xl md:text-3xl lg:text-[2.05rem] font-bold leading-tight mb-2"
            style={{ fontFamily: 'var(--font-vintage-stylist)', color: 'var(--color-brown-dark)' }}
          >
            {event.title}
          </h3>

          <p
            className="text-sm md:text-base font-semibold tabular-nums mb-2.5"
            style={{ fontFamily: 'var(--font-kollektif)', color: 'var(--color-olive)' }}
          >
            {shortDate}
            {endShort ? ` – ${endShort}` : ''}
          </p>

          {blurb && (
            <p
              className={`text-sm md:text-base leading-relaxed ${isRecap ? '' : 'mb-4 line-clamp-2'}`}
              style={{ fontFamily: 'var(--font-leiko)', color: 'var(--color-brown-medium)', lineHeight: 1.65 }}
            >
              {blurb}
            </p>
          )}

          {!isRecap && (
            <span
              className="open-memory-btn mt-auto inline-flex w-fit items-center gap-2 rounded-full border-2 px-4 py-2 text-xs md:text-sm font-bold uppercase tracking-[0.1em]"
              style={{
                fontFamily: 'var(--font-kollektif)',
                background: 'var(--color-brown-dark)',
                borderColor: 'var(--color-brown-dark)',
                color: 'var(--color-cream)',
              }}
            >
              Open memory
              <svg className="open-memory-btn-arrow w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
            </span>
          )}
        </div>
      </div>
    )

    const cardStyle = {
      background: 'var(--color-pink-medium)',
      borderColor: 'var(--color-brown-dark)',
      boxShadow:
        'inset 0 6px 0 0 var(--color-brown-dark), 0 10px 28px rgba(196, 114, 124, 0.16), 0 1px 0 rgba(251, 247, 232, 0.85) inset',
    } as const

    if (isRecap) {
    return (
        <article
          className="relative scrapbook-paper w-full overflow-hidden rounded-[1.1rem] md:rounded-[1.5rem] border-2 text-left"
          style={cardStyle}
        >
          {body}
        </article>
      )
    }

    return (
      <Link
        href={galleryHref(event.id)}
        onClick={() => clearGalleryParents()}
        className="relative scrapbook-paper w-full overflow-hidden rounded-[1.1rem] md:rounded-[1.5rem] border-2 text-left block"
        style={cardStyle}
      >
        {body}
      </Link>
    )
  }

  const renderPaperCard = (event: DisplayEvent) => {
    const shortDate = event.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    const endShort = event.endDate
      ? event.endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      : null

    const typeAccent =
      event.type === 'school'
        ? { bg: 'var(--color-olive)', text: 'var(--color-cream)', label: 'School' }
        : { bg: 'rgba(98, 32, 47, 0.12)', text: 'var(--color-brown-dark)', label: 'Holiday' }

    return (
      <article
        className="relative scrapbook-paper w-full overflow-hidden rounded-[1.1rem] md:rounded-[1.5rem] border-2 transition-transform duration-300 md:hover:-translate-y-0.5"
        style={{
          background: 'var(--color-cream)',
          borderColor: 'var(--color-brown-dark)',
          boxShadow: '0 10px 28px rgba(98, 32, 47, 0.1), 0 1px 0 rgba(251, 247, 232, 0.85) inset',
        }}
      >
        <div
          className="absolute inset-x-0 top-0 z-[1] h-1.5 md:h-2"
          style={{ background: typeAccent.bg }}
          aria-hidden
        />

        <div className="relative flex flex-col sm:flex-row gap-4 sm:gap-5 md:gap-6 p-4 pt-5 sm:p-5 sm:pt-6 md:p-7 md:pt-8">
          <div
            className="scrapbook-stamp shrink-0 self-start relative w-[4.25rem] h-[4.25rem] md:w-[5.25rem] md:h-[5.25rem] -rotate-6"
            aria-hidden
          >
            <Image
              src={EVENT_TYPE_STICKERS[event.type]}
              alt=""
              width={96}
              height={96}
              className="object-contain w-full h-full drop-shadow-[0_4px_10px_rgba(61,57,10,0.22)]"
            />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-2.5 md:mb-3">
              <span
                className="inline-flex items-center px-2.5 py-1 text-[10px] md:text-[11px] font-bold uppercase tracking-[0.14em]"
                style={{
                  fontFamily: 'var(--font-kollektif)',
                  background: typeAccent.bg,
                  color: typeAccent.text,
                  borderRadius: '9999px',
                }}
              >
                {typeAccent.label}
              </span>
              {event.endDate && (
                <span
                  className="inline-flex items-center px-2.5 py-1 text-[10px] md:text-[11px] font-bold uppercase tracking-[0.12em]"
                  style={{
                    fontFamily: 'var(--font-kollektif)',
                    color: 'var(--color-brown-dark)',
                    border: '1.5px solid rgba(98, 32, 47, 0.25)',
                    borderRadius: '9999px',
                  }}
                >
                  Multi-day
                </span>
              )}
            </div>

            <h3
              className="text-xl sm:text-2xl md:text-3xl lg:text-[2.1rem] font-bold leading-tight mb-2"
              style={{ fontFamily: 'var(--font-vintage-stylist)', color: 'var(--color-brown-dark)' }}
            >
              {event.title}
            </h3>

            <p
              className="text-sm md:text-base font-semibold tabular-nums mb-2.5 md:mb-3"
              style={{ fontFamily: 'var(--font-kollektif)', color: 'var(--color-olive)' }}
            >
              {shortDate}
              {endShort ? ` – ${endShort}` : ''}
            </p>

            {event.description && (
              <p
                className="text-[0.95rem] sm:text-base md:text-lg leading-relaxed"
                style={{ fontFamily: 'var(--font-leiko)', color: 'var(--color-brown-medium)', lineHeight: 1.75 }}
              >
                {event.description}
              </p>
            )}
          </div>
            </div>
      </article>
    )
  }

  const renderCard = (event: DisplayEvent) =>
    event.type === 'club' ? renderClubDesktopCard(event) : renderPaperCard(event)

  const renderMobileClubCard = (event: DisplayEvent) => {
    const isRecap = isClubRecapOnly(event.id)
    const cover = getClubCardCover(event.id)
    const blurb = isRecap
      ? event.description
      : (getClubMemoryBlurb(event.id) ?? event.description)
    const shortDate = event.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    const endShort = event.endDate
      ? event.endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      : null

    const body = (
      <div className="relative flex gap-3 p-3.5 pt-5 pb-4">
        {cover && (
          <div
            className="relative shrink-0 w-[4.25rem] h-[4.25rem] overflow-hidden rounded-lg border-2"
            style={{ borderColor: 'var(--color-brown-dark)', background: 'rgba(98, 32, 47, 0.08)' }}
          >
            <Image
              src={cover}
              alt=""
              fill
              className="object-cover"
              sizes="68px"
            />
          </div>
        )}
        <div className="min-w-0 flex-1">
          <div className="mb-2 flex flex-wrap items-center gap-1.5">
            <span
              className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.12em]"
              style={{
                fontFamily: 'var(--font-kollektif)',
                background: 'var(--color-cream)',
                color: 'var(--color-brown-dark)',
              }}
            >
              Club memory
            </span>
          </div>
          <h3
            className="mb-1.5 text-lg font-bold leading-snug"
            style={{ fontFamily: 'var(--font-vintage-stylist)', color: 'var(--color-brown-dark)' }}
          >
            {event.title}
          </h3>
          <p
            className="mb-2 text-[11px] font-bold tabular-nums leading-none"
            style={{ fontFamily: 'var(--font-kollektif)', color: 'var(--color-olive)' }}
          >
            {shortDate}
            {endShort ? ` – ${endShort}` : ''}
          </p>
          {blurb && (
            <p
              className={`text-[11px] leading-relaxed ${isRecap ? '' : 'mb-3 line-clamp-2'}`}
              style={{ fontFamily: 'var(--font-leiko)', color: 'var(--color-brown-medium)', lineHeight: 1.55 }}
            >
              {blurb}
            </p>
          )}
          {!isRecap && (
            <span
              className="open-memory-btn inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.12em]"
              style={{
                fontFamily: 'var(--font-kollektif)',
                background: 'var(--color-brown-dark)',
                border: '2px solid var(--color-brown-dark)',
                color: 'var(--color-cream)',
              }}
            >
              Open memory
              <svg className="open-memory-btn-arrow h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
            </span>
          )}
          </div>
        </div>
    )

    const cardStyle = {
      background: 'var(--color-pink-medium)',
      borderColor: 'var(--color-brown-dark)',
      boxShadow:
        'inset 0 5px 0 0 var(--color-brown-dark), 0 6px 16px rgba(196, 114, 124, 0.14)',
    } as const

    if (isRecap) {
      return (
        <article className="relative w-full overflow-hidden rounded-xl border-2 text-left" style={cardStyle}>
          {body}
        </article>
    )
  }

  return (
      <Link
        href={galleryHref(event.id)}
        onClick={() => clearGalleryParents()}
        className="relative w-full overflow-hidden rounded-xl border-2 text-left block"
        style={cardStyle}
      >
        {body}
      </Link>
    )
  }

  const renderMobilePaperCard = (event: DisplayEvent) => {
    const shortDate = event.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    const endShort = event.endDate
      ? event.endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      : null
    const typeAccent =
      event.type === 'school'
        ? { bg: 'var(--color-olive)', text: 'var(--color-cream)', label: 'School' }
        : { bg: 'rgba(98, 32, 47, 0.12)', text: 'var(--color-brown-dark)', label: 'Holiday' }

    return (
      <article
        className="relative w-full overflow-hidden rounded-xl border-2"
        style={{
          background: 'var(--color-cream)',
          borderColor: 'var(--color-brown-dark)',
          boxShadow: '0 6px 16px rgba(98, 32, 47, 0.08)',
        }}
      >
        <div className="absolute inset-x-0 top-0 z-[1] h-1.5" style={{ background: typeAccent.bg }} aria-hidden />
        <div
          className="pointer-events-none absolute top-3 right-2.5 z-10 w-[3.35rem] h-[3.35rem] rotate-[8deg]"
          aria-hidden
        >
          <Image
            src={EVENT_TYPE_STICKERS[event.type]}
            alt=""
            width={56}
            height={56}
            className="object-contain w-full h-full drop-shadow-[0_3px_8px_rgba(61,57,10,0.28)]"
          />
        </div>
        <div className="relative p-3.5 pt-5 pr-[4.25rem]">
          <div className="mb-2">
            <span
              className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.12em]"
              style={{
                fontFamily: 'var(--font-kollektif)',
                background: typeAccent.bg,
                color: typeAccent.text,
              }}
            >
              {typeAccent.label}
            </span>
          </div>
          <h3
            className="mb-1.5 text-lg font-bold leading-snug"
            style={{ fontFamily: 'var(--font-vintage-stylist)', color: 'var(--color-brown-dark)' }}
          >
            {event.title}
          </h3>
          <p
            className="mb-2.5 text-[11px] font-bold tabular-nums leading-none"
            style={{ fontFamily: 'var(--font-kollektif)', color: 'var(--color-olive)' }}
          >
            {shortDate}
            {endShort ? ` – ${endShort}` : ''}
          </p>
          {event.description && (
            <p
              className="text-sm leading-relaxed"
              style={{ fontFamily: 'var(--font-leiko)', color: 'var(--color-brown-medium)', lineHeight: 1.65 }}
            >
              {event.description}
            </p>
          )}
        </div>
      </article>
    )
  }

  const renderMobileCard = (event: DisplayEvent) =>
    event.type === 'club' ? renderMobileClubCard(event) : renderMobilePaperCard(event)

  const highlightShortDate = highlight
    ? highlight.event.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : ''
  const highlightBlurb = highlight
    ? (getClubMemoryBlurb(highlight.event.id) ?? highlight.event.description)
    : undefined

  return (
    <main
      className="min-h-screen pt-[60px] pb-20 overflow-x-hidden md:overflow-x-visible max-w-[100vw] md:max-w-none"
      style={{ background: 'transparent', touchAction: 'pan-y' }}
    >
      {/* Hero — memory scrapbook (distinct from upcoming planner) */}
      <section className="mx-3 sm:mx-4 md:mx-24 mb-8 md:mb-14">
        <div
          className={`relative scrapbook-paper rounded-[1.1rem] md:rounded-[1.35rem] overflow-visible border-2 transition-all duration-700 ease-out ${heroCardVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
          style={{
            background: 'var(--color-cream)',
            borderColor: 'var(--color-brown-dark)',
            boxShadow: '0 18px 48px rgba(98, 32, 47, 0.14), 0 1px 0 rgba(251, 247, 232, 0.8) inset',
          }}
        >
          {/* Distinct tapes vs upcoming: merlot stripe + cream dash + tall side strip */}
          <div className="washi-tape washi-tape-merlot washi-tape-wide -top-3 left-1/2 -translate-x-1/2 rotate-[-3deg]" aria-hidden />
          <div className="hidden sm:block washi-tape washi-tape-cream-dash top-8 -left-3 -rotate-90 origin-center" aria-hidden />
          <div className="hidden md:block washi-tape washi-tape-olive washi-tape-tall -right-2 top-1/3 rotate-[8deg]" aria-hidden />
          <div className="washi-tape washi-tape-cream-dash -bottom-2 right-10 sm:right-20 rotate-[4deg]" aria-hidden />
          <div className="scrapbook-corner scrapbook-corner-left hidden sm:block" aria-hidden />

          <div className="overflow-hidden rounded-[1rem] md:rounded-[1.25rem]">
            {/* Soft pink memory header (upcoming uses brown binding) */}
            <div
              className="relative px-4 sm:px-6 md:px-10 py-3 md:py-4 flex items-center justify-center gap-3"
              style={{ background: 'var(--color-pink-medium)' }}
            >
              <div className="text-center min-w-0 px-1">
                <p
                  className="text-[9px] sm:text-[10px] md:text-xs font-bold uppercase tracking-[0.22em] sm:tracking-[0.3em] mb-0.5"
                  style={{ fontFamily: 'var(--font-freshwost)', color: 'var(--color-brown-dark)' }}
                >
                  Memory scrapbook
                </p>
                <p
                  className="text-xs sm:text-sm md:text-base font-bold uppercase tracking-[0.12em] sm:tracking-[0.18em]"
                  style={{ fontFamily: 'var(--font-kollektif)', color: 'var(--color-cream)' }}
                >
                  {today.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </p>
              </div>
            </div>

            {/* Swapped layout vs upcoming: calendar first, copy second */}
            <div className="grid grid-cols-1 lg:grid-cols-2 min-h-0 md:min-h-[400px]">
              <div
                className={`relative order-1 px-4 sm:px-5 md:px-8 lg:px-10 py-6 sm:py-8 md:py-10 flex flex-col justify-center border-b-2 lg:border-b-0 lg:border-r-2 transition-all duration-700 ease-out ${heroTextVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}
                style={{
                  borderColor: 'rgba(196, 114, 124, 0.35)',
                  background: 'rgba(248, 218, 212, 0.22)',
                  transitionDelay: heroTextVisible ? '160ms' : '0ms',
                }}
              >
                <div className="grid grid-cols-7 gap-1 sm:gap-1.5 md:gap-2 mb-2">
                  {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((label, i) => (
                    <div
                      key={`${label}-${i}`}
                      className="text-center text-[9px] sm:text-[10px] md:text-xs font-bold uppercase tracking-wider py-1"
                      style={{ fontFamily: 'var(--font-freshwost)', color: 'var(--color-brown-dark)' }}
                    >
                      {label}
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-1 sm:gap-1.5 md:gap-2">
                  {heroMonthGrid.map((day, i) => {
                    const isToday = day === today.getDate()
                    const hasClubMemory = day != null && heroEventDays.has(day)
                    const isFuture = day != null && day > today.getDate()
                    return (
                      <div
                        key={i}
                        className="relative aspect-square rounded-md sm:rounded-lg flex flex-col items-center justify-center gap-0.5 text-[11px] sm:text-sm md:text-base font-bold tabular-nums"
                        style={{
                          fontFamily: 'var(--font-kollektif)',
                          background: day == null
                            ? 'transparent'
                            : isToday
                              ? 'var(--color-brown-dark)'
                              : isFuture
                                ? 'rgba(251, 247, 232, 0.5)'
                                : 'rgba(251, 247, 232, 0.85)',
                          color: day == null
                            ? 'transparent'
                            : isToday
                              ? 'var(--color-cream)'
                              : isFuture
                                ? 'rgba(98, 32, 47, 0.22)'
                                : 'var(--color-brown-dark)',
                          boxShadow: isToday ? '0 4px 12px rgba(98, 32, 47, 0.28)' : undefined,
                          transform: isToday ? 'rotate(-2deg) scale(1.05)' : undefined,
                          zIndex: isToday ? 2 : 1,
                        }}
                      >
                        <span className="leading-none">{day ?? ''}</span>
                        {hasClubMemory && (
                          <span className="memory-grid-dot" aria-hidden />
                        )}
                      </div>
                    )
                  })}
                </div>
                <p
                  className="mt-3 sm:mt-4 text-[10px] sm:text-[11px] md:text-xs font-semibold uppercase tracking-widest"
                  style={{ fontFamily: 'var(--font-kollektif)', color: 'var(--color-olive)' }}
                >
                  ● Dots = club events already held this month
                </p>
              </div>

              <div
                className={`relative order-2 flex flex-col justify-center px-5 sm:px-6 md:px-10 lg:px-14 py-8 sm:py-10 md:py-14 scrapbook-lines transition-all duration-700 ease-out ${heroTextVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                style={{ transitionDelay: heroTextVisible ? '80ms' : '0ms' }}
              >
                <div
                  className={`mb-4 md:mb-5 w-fit px-3 py-2 rounded-sm border-2 transition-all duration-700 ease-out ${heroTextVisible ? 'opacity-100 translate-y-0 rotate-[3deg]' : 'opacity-0 translate-y-3'}`}
                  style={{
                    background: 'var(--color-olive-light)',
                    borderColor: 'var(--color-brown-dark)',
                    boxShadow: '2px 3px 0 rgba(98, 32, 47, 0.12)',
                    fontFamily: 'var(--font-kollektif)',
                    color: 'var(--color-brown-dark)',
                  }}
                >
                  <span className="text-[10px] font-bold uppercase tracking-widest block">Since Aug 2025</span>
                  <span className="text-sm font-bold">
                    {today.toLocaleDateString('en-US', { weekday: 'short' })} · {today.getDate()}
                  </span>
                </div>

                <h1
                  className={`text-[1.75rem] leading-[1.12] sm:text-3xl md:text-4xl lg:text-5xl font-bold uppercase tracking-tight mb-3 md:mb-4 transition-all duration-700 ease-out ${heroTextVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                  style={{ fontFamily: 'var(--font-vintage-stylist)', color: 'var(--color-brown-dark)', transitionDelay: heroTextVisible ? '120ms' : '0ms' }}
                >
                  Past events
              </h1>
                <p
                  className={`text-[0.95rem] sm:text-base md:text-lg max-w-md mb-6 md:mb-8 transition-all duration-700 ease-out ${heroTextVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}
                  style={{ fontFamily: 'var(--font-leiko)', color: 'var(--color-olive)', lineHeight: '1.6', transitionDelay: heroTextVisible ? '220ms' : '0ms' }}
                >
                  Flip through our memory scrapbook — workshops, meetups, and moments we&apos;ve already shared.
                </p>
                <p
                  className={`inline-block w-fit max-w-full text-xs md:text-base italic px-2 py-0.5 md:px-2.5 md:py-1 transition-all duration-700 ease-out ${heroTextVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
                  style={{
                    fontFamily: 'var(--font-leiko)',
                    color: 'var(--color-brown-dark)',
                    background: 'linear-gradient(transparent 55%, var(--color-olive-light) 55%)',
                    boxDecorationBreak: 'clone',
                    WebkitBoxDecorationBreak: 'clone',
                    transitionDelay: heroTextVisible ? '320ms' : '0ms',
                  }}
                >
                  Scroll down to look back
              </p>
            </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured memory — award banner (not a CTA) */}
      {highlight && (
        <section className="mx-3 sm:mx-4 md:mx-24 mb-10 md:mb-16" aria-label="Featured club memory">
          {/* Mobile: slim banner */}
          <div
            className="md:hidden relative flex items-center gap-3 overflow-hidden rounded-2xl border-2 px-4 py-3"
            style={{
              background: 'var(--color-pink-medium)',
              borderColor: 'var(--color-olive)',
              boxShadow: '0 8px 20px rgba(196, 114, 124, 0.14)',
            }}
          >
            <div className="min-w-0 flex-1">
              <p
                className="mb-0.5 text-[9px] font-bold uppercase tracking-[0.18em] italic"
                style={{ fontFamily: 'var(--font-freshwost)', color: 'var(--color-olive)' }}
              >
                {highlight.label}
              </p>
              <h2
                className="text-lg font-bold leading-tight"
                style={{ fontFamily: 'var(--font-vintage-stylist)', color: 'var(--color-olive)' }}
              >
                {highlight.event.title}
              </h2>
              <p
                className="mt-0.5 text-[11px] font-semibold tabular-nums"
                style={{ fontFamily: 'var(--font-kollektif)', color: 'var(--color-olive)', opacity: 0.85 }}
              >
                {highlightShortDate}
              </p>
            </div>
            <div
              className="pointer-events-none relative flex h-12 w-12 shrink-0 rotate-[-10deg] items-center justify-center rounded-full"
              aria-hidden
              style={{
                border: '2px dashed rgba(111, 101, 9, 0.55)',
                background: 'rgba(251, 247, 232, 0.45)',
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" style={{ color: 'var(--color-olive)' }}>
                <path d="M12 2.5l2.6 5.9 6.4.6-4.9 4.2 1.5 6.2L12 16.2l-5.6 3.2 1.5-6.2-4.9-4.2 6.4-.6L12 2.5z" />
              </svg>
            </div>
          </div>

          {/* Desktop: full award banner */}
          <div
            className="relative hidden overflow-hidden rounded-[1.75rem] border-2 px-10 py-9 md:block"
            style={{
              background: 'var(--color-pink-medium)',
              borderColor: 'var(--color-olive)',
              boxShadow: '0 12px 32px rgba(196, 114, 124, 0.16)',
            }}
          >
            <div
              className="pointer-events-none absolute inset-0 opacity-40"
              style={{
                background:
                  'radial-gradient(ellipse 55% 80% at 88% 50%, rgba(251, 247, 232, 0.55), transparent 70%)',
              }}
              aria-hidden
            />

            <div className="relative z-[2] flex flex-row items-center justify-between gap-12">
              <div className="min-w-0 max-w-2xl">
                <div className="mb-2.5 flex items-center gap-2.5">
                  <p
                    className="text-xs font-bold uppercase tracking-[0.22em] italic"
                    style={{ fontFamily: 'var(--font-freshwost)', color: 'var(--color-olive)' }}
                  >
                    {highlight.label}
                  </p>
                  <span
                    className="h-px w-12"
                    style={{ background: 'var(--color-olive)', opacity: 0.35 }}
                    aria-hidden
                  />
                </div>
                <h2
                  className="mb-2.5 text-4xl font-bold leading-tight"
                  style={{ fontFamily: 'var(--font-vintage-stylist)', color: 'var(--color-olive)' }}
                >
                  {highlight.event.title}
                </h2>
                <p
                  className="text-base leading-relaxed"
                  style={{ fontFamily: 'var(--font-leiko)', color: 'var(--color-olive)', lineHeight: 1.65, opacity: 0.9 }}
                >
                  {highlightShortDate}
                  {highlightBlurb ? ` · ${highlightBlurb}` : ''}
                </p>
              </div>

              <div
                className="pointer-events-none relative flex h-[7.25rem] w-[7.25rem] shrink-0 rotate-[-14deg] items-center justify-center rounded-full"
                aria-hidden
                style={{
                  border: '2.5px dashed rgba(111, 101, 9, 0.55)',
                  boxShadow: 'inset 0 0 0 6px rgba(251, 247, 232, 0.4), 0 6px 18px rgba(111, 101, 9, 0.08)',
                  background: 'rgba(251, 247, 232, 0.35)',
                }}
              >
                <div
                  className="absolute inset-[8px] rounded-full"
                  style={{ border: '1.5px solid rgba(111, 101, 9, 0.32)' }}
                />
                <div className="relative flex flex-col items-center gap-0.5 px-2 text-center">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="mb-0.5"
                    style={{ color: 'var(--color-olive)', opacity: 0.9 }}
                  >
                    <path d="M12 2.5l2.6 5.9 6.4.6-4.9 4.2 1.5 6.2L12 16.2l-5.6 3.2 1.5-6.2-4.9-4.2 6.4-.6L12 2.5z" />
                  </svg>
                  <span
                    className="text-[9px] font-bold uppercase leading-tight tracking-[0.16em]"
                    style={{ fontFamily: 'var(--font-kollektif)', color: 'var(--color-olive)' }}
                  >
                    Standout
                  </span>
                  <span
                    className="text-[8px] font-bold uppercase leading-tight tracking-[0.14em]"
                    style={{ fontFamily: 'var(--font-kollektif)', color: 'var(--color-olive)', opacity: 0.72 }}
                  >
                    of ’26
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12 py-8 md:py-14 w-full max-w-[100vw] md:max-w-7xl overflow-x-hidden md:overflow-x-visible box-border">
        <div className="mb-10 md:mb-28 lg:mb-32">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 md:gap-3 mb-20 md:mb-40 lg:mb-48">
            <div className="relative w-full sm:flex-1 sm:max-w-xl md:max-w-2xl lg:max-w-3xl">
              <input
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search past events..."
                className="w-full h-10 md:h-12 pl-9 md:pl-11 pr-9 md:pr-11 rounded-lg md:rounded-xl border-2 focus:outline-none text-sm md:text-base"
                style={{
                  fontFamily: 'var(--font-kollektif)',
                  background: 'var(--color-cream)',
                  borderColor: searchQuery ? 'var(--color-brown-dark)' : 'rgba(98, 32, 47, 0.2)',
                  color: 'var(--color-brown-dark)',
                }}
              />
              <svg className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5" style={{ color: 'var(--color-olive)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 md:right-3 top-1/2 -translate-y-1/2 w-7 h-7 md:w-9 md:h-9 rounded-lg transition-all"
                  style={{ background: 'rgba(98, 32, 47, 0.1)', color: 'var(--color-brown-dark)' }}
                  aria-label="Clear search"
                >
                  <svg className="w-4 h-4 md:w-5 md:h-5 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
            <div className="flex flex-wrap gap-1.5 md:gap-2 justify-center sm:justify-end shrink-0">
            {(['all', 'club', 'school', 'holiday'] as const).map(t => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setFilterType(t)}
                  className="h-8 md:h-10 px-2.5 md:px-4 rounded-lg font-semibold text-xs md:text-sm transition-all"
                  style={{
                    fontFamily: 'var(--font-kollektif)',
                    background: filterType === t ? 'var(--color-brown-dark)' : 'var(--color-cream)',
                    color: filterType === t ? 'var(--color-cream)' : 'var(--color-brown-dark)',
                    border: `2px solid ${filterType === t ? 'var(--color-brown-dark)' : 'rgba(98, 32, 47, 0.2)'}`,
                  }}
                >
                  {t === 'all' ? 'All types' : t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>
        </div>

          <div className="flex flex-col items-center gap-3 md:gap-5 px-1">
            <h2
              className="text-[2.35rem] sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold uppercase tracking-tight text-center leading-[1.05]"
              style={{ fontFamily: 'var(--font-vintage-stylist)', color: 'var(--color-brown-dark)' }}
            >
              Past events
            </h2>
            <span
              className="relative flex items-center justify-center flex-shrink-0 w-20 h-20 md:w-28 md:h-28"
              style={{
                background: 'var(--color-brown-dark)',
                borderRadius: '9999px',
              }}
            >
              <Image
                src="/images/Y4E_LOGO_TEXT_PINK.png"
                alt="Youth 4 Elders Logo"
                width={96}
                height={96}
                priority
                className="object-contain"
                style={{ width: '68%', height: '68%' }}
              />
            </span>
          </div>
          </div>

        <section id="events-grid" className="scroll-mt-28 md:pr-0">
          {groupedByMonth.length > 0 ? (
            <>
              <div
                aria-hidden={!tocOpen}
                onClick={() => setTocOpen(false)}
                className="fixed inset-0 z-30 transition-opacity duration-300 ease-out"
                style={{
                  background: 'rgba(98, 32, 47, 0.22)',
                  backdropFilter: 'blur(6px)',
                  WebkitBackdropFilter: 'blur(6px)',
                  opacity: tocOpen ? 1 : 0,
                  pointerEvents: tocOpen ? 'auto' : 'none',
                }}
              />

              {/* Mobile TOC */}
              <div className="md:hidden">
                <div
                  className="pointer-events-none fixed inset-x-0 bottom-0 z-50 flex justify-end"
                  style={{
                    paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom, 0px))',
                    paddingRight: 'max(0.75rem, env(safe-area-inset-right, 0px))',
                    paddingLeft: 'max(0.75rem, env(safe-area-inset-left, 0px))',
                  }}
                >
                  <div className="pointer-events-auto flex max-w-full flex-col items-end gap-2">
                    <button
                      type="button"
                      onClick={() => setTocOpen(open => !open)}
                      aria-expanded={tocOpen}
                      aria-controls="month-toc-panel-mobile"
                      aria-label={tocOpen ? 'Close contents' : 'Open month contents'}
                      className="flex items-center gap-1.5 rounded-full border-2 px-3 py-2 shadow-lg"
                      style={{
                        fontFamily: 'var(--font-kollektif)',
                        background: 'var(--color-cream)',
                        borderColor: 'var(--color-brown-dark)',
                        color: 'var(--color-brown-dark)',
                      }}
                    >
                      <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h10M4 18h14" />
                      </svg>
                      <span className="text-[10px] font-bold uppercase tracking-[0.12em]">Scroll to</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                      className="flex h-9 w-9 items-center justify-center rounded-full border-2 shadow-lg"
                      style={{
                        background: 'var(--color-cream)',
                        borderColor: 'var(--color-brown-dark)',
                        color: 'var(--color-brown-dark)',
                      }}
                      aria-label="Scroll to top"
                    >
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                      </svg>
                    </button>
                    </div>
                    </div>

                <div
                  id="month-toc-panel-mobile"
                  role="dialog"
                  aria-label="Scroll to month"
                  aria-hidden={!tocOpen}
                  className="fixed inset-x-0 bottom-0 z-[60] w-full max-w-[100vw] transition-transform duration-300 ease-out"
                  style={{
                    transform: tocOpen ? 'translateY(0)' : 'translateY(110%)',
                    pointerEvents: tocOpen ? 'auto' : 'none',
                  }}
                >
                  <div
                    className="box-border w-full max-w-[100vw] rounded-t-[1.5rem] border-2 border-b-0 px-4 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-3"
                    style={{
                      background: 'var(--color-cream)',
                      borderColor: 'var(--color-brown-dark)',
                      boxShadow: '0 -12px 40px rgba(98, 32, 47, 0.18)',
                      maxHeight: 'min(70vh, 28rem)',
                    }}
                  >
                    <div className="mx-auto mb-3 h-1 w-10 rounded-full" style={{ background: 'rgba(98, 32, 47, 0.2)' }} aria-hidden />
                    <div className="mb-3 flex items-center justify-between gap-3">
                      <p
                        className="min-w-0 text-sm font-bold uppercase tracking-[0.16em]"
                        style={{ fontFamily: 'var(--font-kollektif)', color: 'var(--color-brown-dark)' }}
                      >
                        Jump to month
                      </p>
                      <button
                        type="button"
                        onClick={() => setTocOpen(false)}
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full"
                        style={{ background: 'rgba(98, 32, 47, 0.1)', color: 'var(--color-brown-dark)' }}
                        aria-label="Close"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                  </div>

                    <div
                      className="mb-3 grid w-full gap-2"
                      style={{ gridTemplateColumns: `repeat(${Math.min(tocByYear.length || 1, 3)}, minmax(0, 1fr))` }}
                      role="tablist"
                      aria-label="Year"
                    >
                      {tocByYear.map(({ year }) => {
                        const isActive = activeTocYear?.year === year
                        return (
                          <button
                            key={year}
                            type="button"
                            role="tab"
                            aria-selected={isActive}
                            onClick={() => setTocYear(year)}
                            className="min-w-0 rounded-full border-2 px-3 py-2 text-sm font-bold tabular-nums transition-colors"
                            style={{
                              fontFamily: 'var(--font-kollektif)',
                              background: isActive ? 'var(--color-olive-light)' : 'transparent',
                              borderColor: 'var(--color-brown-dark)',
                              color: 'var(--color-brown-dark)',
                            }}
                          >
                            {year}
                          </button>
                        )
                      })}
                    </div>

                    <ul
                      key={activeTocYear?.year}
                      className="grid w-full grid-cols-3 gap-2 overflow-y-auto overscroll-contain pb-2"
                      style={{ maxHeight: 'min(42vh, 16rem)' }}
                    >
                      {(activeTocYear?.months ?? []).map(month => {
                        const monthName = MONTH_NAMES[new Date(month.monthKey).getMonth()].slice(0, 3)
                        const isCurrent = activeMonthKey === month.monthKey
                        return (
                          <li key={month.monthKey} className="min-w-0">
                            <a
                              href={`#month-${month.monthKey}`}
                              onClick={() => setTocOpen(false)}
                              aria-current={isCurrent ? 'true' : undefined}
                              className="flex min-h-[3rem] w-full items-center justify-center rounded-xl border-2 px-1.5 py-3 text-center text-sm font-bold tracking-tight transition-colors"
                              style={{
                                fontFamily: 'var(--font-kollektif)',
                                color: 'var(--color-brown-dark)',
                                background: isCurrent ? 'rgba(98, 32, 47, 0.1)' : 'var(--color-cream)',
                                borderColor: isCurrent ? 'var(--color-brown-dark)' : 'rgba(98, 32, 47, 0.18)',
                              }}
                            >
                              {monthName}
                            </a>
                          </li>
                        )
                      })}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Desktop TOC — peek tab; click to open/close (stays open until tab is clicked) */}
              <div
                className="hidden md:flex fixed right-0 top-1/2 z-40 -translate-y-1/2 items-stretch pl-5"
              >
                <button
                  type="button"
                  onClick={() => setTocOpen(open => !open)}
                  aria-expanded={tocOpen}
                  aria-controls="month-toc-panel"
                  aria-label={tocOpen ? 'Close contents' : 'Open contents'}
                  className={`relative z-10 flex items-center gap-1.5 self-center rounded-l-[1.75rem] border-2 border-r-0 px-2.5 py-6 ${tocOpen ? '' : 'animate-month-tab-peek'}`}
                  style={{
                    fontFamily: 'var(--font-kollektif)',
                    background: 'var(--color-cream)',
                    borderColor: 'var(--color-brown-dark)',
                    color: 'var(--color-brown-dark)',
                  }}
                >
                  <svg
                    className={`w-4 h-4 shrink-0 transition-transform duration-300 ${tocOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                  </svg>
                  <span
                    className="text-[10px] font-bold uppercase tracking-[0.2em]"
                    style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
                  >
                    Scroll to
                  </span>
                </button>

                <nav
                  id="month-toc-panel"
                  aria-label="Scroll to month"
                  className="overflow-hidden transition-all duration-300 ease-out"
                  style={{
                    width: tocOpen ? '13.5rem' : '0',
                    opacity: tocOpen ? 1 : 0,
                    pointerEvents: tocOpen ? 'auto' : 'none',
                  }}
                >
                  <div
                    className="w-[13.5rem] max-h-[75vh] flex flex-col"
                    style={{
                      filter: 'drop-shadow(-8px 4px 20px rgba(98, 32, 47, 0.18))',
                    }}
                  >
                    <div className="relative z-[3] flex items-stretch -mb-[2px]" role="tablist" aria-label="Year">
                      {tocByYear.map(({ year }, index) => {
                        const isActive = activeTocYear?.year === year
                        return (
                          <button
                            key={year}
                            type="button"
                            role="tab"
                            aria-selected={isActive}
                            onClick={() => setTocYear(year)}
                            className={`year-folder-tab relative flex-1 min-w-0 px-2 text-xs font-bold tabular-nums ${
                              isActive ? 'is-front' : 'is-back'
                            }`}
                            style={{
                              fontFamily: 'var(--font-kollektif)',
                              color: 'var(--color-brown-dark)',
                              zIndex: isActive ? 5 : index + 1,
                              marginLeft: index === 0 ? 0 : '-2px',
                            }}
                          >
                            {year}
                          </button>
                        )
                      })}
                    </div>

                    <div
                      role="tabpanel"
                      className="relative z-[2] overflow-y-auto border-2 px-3 py-3.5"
                      style={{
                        background: 'var(--color-cream)',
                        borderColor: 'var(--color-brown-dark)',
                        borderRadius: '0 0 12px 12px',
                        maxHeight: 'min(62vh, 26rem)',
                      }}
                    >
                      <ul
                        key={activeTocYear?.year}
                        className="flex flex-col gap-1 year-folder-panel-in"
                      >
                        {(activeTocYear?.months ?? []).map(month => {
                          const monthName = MONTH_NAMES[new Date(month.monthKey).getMonth()].slice(0, 3)
                          const isCurrent = activeMonthKey === month.monthKey
                          return (
                            <li key={month.monthKey}>
                              <a
                                href={`#month-${month.monthKey}`}
                                onClick={() => setTocOpen(false)}
                                aria-current={isCurrent ? 'true' : undefined}
                                className={`block rounded-xl px-3 py-2 tracking-tight transition-all duration-200 hover:bg-[rgba(98,32,47,0.1)] hover:translate-x-0.5 ${
                                  isCurrent
                                    ? 'text-xl font-extrabold bg-[rgba(98,32,47,0.08)]'
                                    : 'text-lg font-semibold opacity-80 hover:opacity-100'
                                }`}
                                style={{ fontFamily: 'var(--font-kollektif)', color: 'var(--color-brown-dark)' }}
                              >
                                {monthName}
                              </a>
                            </li>
                          )
                        })}
                      </ul>
                    </div>
                  </div>
                </nav>
              </div>

              <div className="space-y-12 md:space-y-28">
                {tocByYear.map(({ year, months }, yearIndex) => {
                  const yearEventCount = months.reduce(
                    (n, m) => n + m.dateGroups.reduce((c, g) => c + g.events.length, 0),
                    0
                  )
                  return (
                    <div key={year} className={yearIndex > 0 ? 'pt-4 md:pt-12' : ''}>
                      <div
                        className="flex items-baseline gap-3 md:gap-6 mb-7 md:mb-14"
                        style={{ borderBottom: '2px solid rgba(98, 32, 47, 0.18)' }}
                      >
                        <h2
                          className="text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tight leading-none pb-2 md:pb-4"
                          style={{ fontFamily: 'var(--font-kollektif)', color: 'var(--color-brown-dark)' }}
                        >
                          {year}
                        </h2>
                        <span
                          className="text-xs sm:text-sm md:text-base font-semibold tabular-nums pb-2 md:pb-4"
                          style={{ fontFamily: 'var(--font-kollektif)', color: 'var(--color-olive)' }}
                        >
                          {yearEventCount} event{yearEventCount === 1 ? '' : 's'}
                        </span>
                      </div>

                      <div className="space-y-10 md:space-y-20">
                        {months.map((month, monthIndexInYear) => {
                          const eventCount = month.dateGroups.reduce((n, g) => n + g.events.length, 0)
                          const monthName = MONTH_NAMES[new Date(month.monthKey).getMonth()]
                          const isFirstMonthOverall = yearIndex === 0 && monthIndexInYear === 0
                          return (
                            <section
                              key={month.monthKey}
                              id={`month-${month.monthKey}`}
                              className="scroll-mt-28"
                            >
                              <div className="flex items-end justify-between gap-3 md:gap-4 mb-5 md:mb-10">
                                <h3
                                  className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold uppercase tracking-tight leading-[1.05]"
                                  style={{ fontFamily: 'var(--font-kollektif)', color: 'var(--color-brown-dark)' }}
                                >
                                  {monthName}
                                </h3>
                                <span
                                  className="text-xs sm:text-sm md:text-base font-semibold tabular-nums shrink-0 pb-1"
                                  style={{ fontFamily: 'var(--font-kollektif)', color: 'var(--color-olive)' }}
                                >
                                  {eventCount} event{eventCount === 1 ? '' : 's'}
                                </span>
                              </div>

                              <MobileMonthCarousel
                                events={month.dateGroups.flatMap(group => group.events)}
                                renderCard={renderMobileCard}
                                showTopBadge={isFirstMonthOverall}
                              />

                              <div className="hidden md:block space-y-14 lg:space-y-16">
                                {month.dateGroups.map((group, groupIndex) => (
                                  <div key={group.startKey} className="grid grid-cols-12 gap-6 lg:gap-8">
                                    <div className="col-span-3">
                                      <div className="sticky top-[92px]">
                                        <div
                                          className="w-full rounded-xl border-2 px-5 py-2.5"
                                          style={{
                                            background: 'var(--color-olive)',
                                            borderColor: 'var(--color-brown-dark)',
                                            boxShadow: '0 4px 14px rgba(73, 47, 30, 0.1)',
                                          }}
                                        >
                                          <div className="text-sm font-semibold leading-none mb-1 tracking-tight" style={{ fontFamily: 'var(--font-kollektif)', color: 'var(--color-cream)' }}>
                                            {group.date.toLocaleDateString('en-US', { weekday: 'short' })}
                                          </div>
                                          <div className="text-3xl lg:text-4xl font-bold uppercase tracking-tight leading-none" style={{ fontFamily: 'var(--font-kollektif)', color: 'var(--color-cream)' }}>
                                            {group.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="col-span-9">
                                      <div className="flex flex-col gap-6">
                                        {group.events.map((event, eventIndex) => (
                                          <div key={event.id} className="relative">
                                            {isFirstMonthOverall && groupIndex === 0 && eventIndex === 0 && (
                                              <div
                                                className="pointer-events-none absolute -top-2 right-3 z-10 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] sm:text-xs font-bold uppercase"
                                                style={{
                                                  background: 'var(--color-pink-medium)',
                                                  color: 'var(--color-cream)',
                                                  fontFamily: 'var(--font-kollektif)',
                                                  boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
                                                  border: '2px solid var(--color-cream)',
                                                }}
                                              >
                                                Recent
                                              </div>
                                            )}
                                            {renderCard(event)}
                                          </div>
                                        ))}
                                      </div>
                  </div>
                </div>
              ))}
            </div>
                            </section>
                          )
                        })}
                      </div>
                    </div>
                  )
                })}
              </div>

              <div className="mt-10 md:mt-24 flex flex-col items-center text-center gap-1.5 md:gap-3 px-3">
                <p
                  className="text-xs md:text-lg leading-snug md:leading-normal max-w-[18rem] md:max-w-none md:whitespace-nowrap"
                  style={{ fontFamily: 'var(--font-leiko)', color: 'var(--color-olive)' }}
                >
                  Looking ahead? See what&apos;s coming up next.
                </p>
                <Link
                  href="/events/upcoming"
                  className="past-events-link group inline-flex items-center gap-1 md:gap-1.5 text-[11px] md:text-base font-semibold"
                  style={{ fontFamily: 'var(--font-kollektif)', color: 'var(--color-brown-dark)' }}
                >
                  <span className="past-events-link-text">Check Upcoming Events</span>
                  <svg
                    className="past-events-link-arrow w-3 h-3 md:w-4 md:h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.25} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center text-center py-24 md:py-32 max-w-md mx-auto">
              <svg
                className="w-14 h-14 mb-8"
                style={{ color: 'var(--color-olive)' }}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden
              >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              <h3
                className="text-2xl md:text-3xl font-normal mb-3"
                style={{ fontFamily: 'var(--font-leiko)', color: 'var(--color-brown-dark)' }}
              >
                No past events found
              </h3>
              <p
                className="text-base mb-10 leading-relaxed"
                style={{ fontFamily: 'var(--font-leiko)', color: 'var(--color-olive)' }}
              >
                Try another filter or see what&apos;s coming up.
              </p>
              <Link
                href="/events/upcoming"
                className="inline-block px-6 py-3 rounded-xl font-semibold transition-opacity hover:opacity-90"
                style={{
                  fontFamily: 'var(--font-kollektif)',
                  background: 'var(--color-brown-dark)',
                  color: 'var(--color-cream)',
                }}
              >
                Upcoming Events
              </Link>
            </div>
          )}
        </section>
      </div>
    </main>
  )
}




