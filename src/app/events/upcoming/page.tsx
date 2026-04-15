'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { events } from '../events'
import {
  type DisplayEvent,
  normalizeDay,
  getLocationFromDescription,
  getEventColor,
  mergeConsecutiveEvents
} from '../shared'
import EventDetailModal from '../EventDetailModal'

const clubStartDate = new Date(2025, 7, 1)

export default function UpcomingEventsPage() {
  const [currentDate, setCurrentDate] = useState(() => {
    const now = new Date()
    return now < clubStartDate ? new Date(2025, 7, 1) : now
  })
  const [selectedEvent, setSelectedEvent] = useState<DisplayEvent | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState<'all' | 'holiday' | 'school' | 'club'>('all')
  const [today, setToday] = useState(() => normalizeDay(new Date()))
  const [heroCardVisible, setHeroCardVisible] = useState(false)
  const [heroTextVisible, setHeroTextVisible] = useState(false)

  useEffect(() => {
    const update = () => setToday(normalizeDay(new Date()))
    update()
    const now = new Date()
    const msUntilMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1).getTime() - now.getTime()
    const t = setTimeout(update, msUntilMidnight)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    document.body.style.overflow = selectedEvent ? 'hidden' : 'unset'
    return () => { document.body.style.overflow = 'unset' }
  }, [selectedEvent])

  // Match join-us transition pattern: set transition first, then background change.
  useEffect(() => {
    const rafId = requestAnimationFrame(() => {
      document.body.style.transition = 'background 0.8s ease-in-out'
      document.documentElement.style.transition = 'background 0.8s ease-in-out'
      requestAnimationFrame(() => {
        document.body.style.background = 'var(--color-olive)'
        document.documentElement.style.background = 'var(--color-olive)'
      })
    })
    return () => cancelAnimationFrame(rafId)
  }, [])

  // Stage reveal: background first, then hero card, then hero text.
  useEffect(() => {
    const cardTimer = setTimeout(() => setHeroCardVisible(true), 900)
    const textTimer = setTimeout(() => setHeroTextVisible(true), 1200)
    return () => {
      clearTimeout(cardTimer)
      clearTimeout(textTimer)
    }
  }, [])

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
  const monthLabel = `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`

  const canGoPrevMonth = () => {
    const prev = new Date(currentDate)
    prev.setMonth(currentDate.getMonth() - 1)
    return prev >= clubStartDate
  }

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const next = new Date(prev)
      next.setMonth(prev.getMonth() + (direction === 'prev' ? -1 : 1))
      if (direction === 'prev' && next < clubStartDate) return new Date(2025, 7, 1)
      return next
    })
  }

  const goToToday = () => {
    const now = new Date()
    setCurrentDate(now < clubStartDate ? new Date(2025, 7, 1) : now)
  }

  const monthEvents = useMemo(() => {
    const y = currentDate.getFullYear()
    const m = currentDate.getMonth()
    return events.filter(e => e.date.getFullYear() === y && e.date.getMonth() === m)
  }, [currentDate])

  const filteredBase = useMemo(() => {
    let list = filterType === 'all' ? monthEvents : monthEvents.filter(e => e.type === filterType)
    const q = searchQuery.trim().toLowerCase()
    if (q) {
      list = list.filter(e => {
        const title = e.title.toLowerCase()
        const desc = (e.description ?? '').toLowerCase()
        const loc = (getLocationFromDescription(e.description) ?? '').toLowerCase()
        return title.includes(q) || desc.includes(q) || (loc && loc.includes(q))
      })
    }
    return [...list].sort((a, b) => a.date.getTime() - b.date.getTime())
  }, [filterType, monthEvents, searchQuery])

  const displayEvents = useMemo(() => mergeConsecutiveEvents(filteredBase), [filteredBase])

  const upcoming = useMemo(() => {
    return displayEvents.filter(e => normalizeDay(e.endDate ?? e.date) >= today)
  }, [displayEvents, today])

  const groupedUpcoming = useMemo(() => {
    const groups = new Map<number, DisplayEvent[]>()
    for (const e of upcoming) {
      const key = normalizeDay(e.date).getTime()
      const arr = groups.get(key) ?? []
      arr.push(e)
      groups.set(key, arr)
    }
    return [...groups.entries()]
      .sort((a, b) => a[0] - b[0])
      .map(([k, v]) => ({ startKey: k, date: new Date(k), events: v }))
  }, [upcoming])

  const renderCard = (event: DisplayEvent) => {
    const start = normalizeDay(event.date)
    const end = normalizeDay(event.endDate ?? event.date)
    const isActiveToday = today.getTime() >= start.getTime() && today.getTime() <= end.getTime()
    const shortDate = event.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })

    return (
      <button
        type="button"
        onClick={() => setSelectedEvent(event)}
        className="group relative w-full text-left flex flex-row items-stretch overflow-hidden rounded-2xl border-2 transition-all duration-300 hover:shadow-xl bg-white min-h-[120px] md:min-h-[140px]"
        style={{ borderColor: 'var(--color-brown-dark)', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}
      >
        <div
          className="w-24 sm:w-28 md:w-36 shrink-0 flex items-center justify-center p-4 md:p-5"
          style={{ background: getEventColor(event.type) }}
          aria-hidden
        >
          <svg className="w-11 h-11 sm:w-12 sm:h-12 md:w-14 md:h-14 opacity-90" style={{ color: 'var(--color-cream)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <div className="flex-1 min-w-0 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 p-5 md:px-7 md:py-6">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold uppercase tracking-tight mb-2 md:mb-3" style={{ fontFamily: 'var(--font-kollektif)', color: '#171717' }}>
              {event.title}
            </h3>
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-base md:text-lg font-bold tabular-nums" style={{ fontFamily: 'var(--font-kollektif)', color: '#171717' }}>
              <span>
                {shortDate}
                {event.endDate && ` – ${event.endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`}
              </span>
              {isActiveToday && (
                <span className="text-sm font-bold uppercase" style={{ color: 'var(--color-brown-dark)' }}>
                  · Today
                </span>
              )}
            </div>
            {event.description && (
              <p className="mt-3 text-base md:text-lg leading-relaxed line-clamp-3 opacity-85" style={{ fontFamily: 'var(--font-kollektif)', color: '#171717' }}>
                {event.description}
              </p>
            )}
          </div>
          <div className="shrink-0 sm:self-stretch flex sm:items-center">
            <span
              className="inline-flex w-full sm:w-auto justify-center items-center gap-2 py-4 px-6 md:py-5 md:px-8 rounded-xl text-sm md:text-base font-bold uppercase tracking-wide transition-opacity group-hover:opacity-90"
              style={{ background: '#171717', color: 'var(--color-cream)', fontFamily: 'var(--font-kollektif)' }}
            >
              View details
              <span className="font-semibold normal-case tracking-normal opacity-90">— Free</span>
            </span>
          </div>
        </div>
      </button>
    )
  }

  return (
    <main className="min-h-screen pt-[60px] pb-20" style={{ background: 'transparent' }}>
      {/* Hero */}
      <section className="mx-4 md:mx-24 mb-10 md:mb-14">
        <div
          className={`grid grid-cols-1 lg:grid-cols-2 min-h-[380px] md:min-h-[420px] rounded-[2rem] overflow-hidden border-2 transition-all duration-700 ease-out ${heroCardVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
          style={{
            background: 'var(--color-brown-dark)',
            borderColor: 'var(--color-cream)',
            boxShadow: 'none',
            transitionDelay: heroCardVisible ? '0ms' : '0ms'
          }}
        >
          <div className="flex flex-col justify-center px-6 md:px-10 lg:px-14 py-12 md:py-16" style={{ background: 'var(--color-brown-dark)' }}>
            <div
              className={`mb-6 text-5xl md:text-6xl transition-all duration-700 ease-out ${heroTextVisible ? 'opacity-95 translate-y-0' : 'opacity-0 translate-y-3'}`}
              style={{ color: 'var(--color-olive-light)' }}
              aria-hidden
            >
              ✦
            </div>
            <h1
              className={`text-3xl md:text-4xl lg:text-5xl font-bold uppercase tracking-tight mb-4 transition-all duration-700 ease-out ${heroTextVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
              style={{ fontFamily: 'var(--font-kollektif)', color: 'var(--color-cream)', lineHeight: '1.1', transitionDelay: heroTextVisible ? '120ms' : '0ms' }}
            >
              Discover upcoming events
            </h1>
            <p
              className={`text-base md:text-lg max-w-md mb-8 transition-all duration-700 ease-out ${heroTextVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}
              style={{ fontFamily: 'var(--font-kollektif)', color: 'var(--color-olive-light)', lineHeight: '1.6', transitionDelay: heroTextVisible ? '220ms' : '0ms' }}
            >
              Workshops, community meetups, and volunteer opportunities—join what&apos;s next.
            </p>
            <Link
              href="#events-grid"
              className={`inline-block w-fit px-8 py-4 rounded-xl font-bold text-sm uppercase tracking-wide transition-all duration-700 ease-out hover:opacity-90 ${heroTextVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
              style={{ background: 'var(--color-cream)', color: 'var(--color-olive)', fontFamily: 'var(--font-kollektif)', transitionDelay: heroTextVisible ? '320ms' : '0ms' }}
            >
              View all events
            </Link>
          </div>
          <div
            className="min-h-[240px] md:min-h-[320px] flex items-center justify-center px-8 py-12"
            style={{ background: 'var(--color-brown-dark)' }}
          >
            <div className="text-8xl md:text-9xl opacity-95" style={{ color: 'var(--color-olive-light)' }} aria-hidden>📅</div>
          </div>
        </div>
      </section>

      {/* Scrolling keyword banner */}
      <div className="overflow-hidden border-y py-3" style={{ borderColor: 'rgba(234, 225, 203, 0.35)', background: 'rgba(0, 0, 0, 0.12)' }}>
        <div className="flex whitespace-nowrap animate-scroll-text" style={{ width: '200%' }}>
          <span className="inline-block px-6 text-sm font-bold uppercase tracking-widest" style={{ fontFamily: 'var(--font-kollektif)', color: 'var(--color-olive-light)' }}>
            Community · Workshops · Volunteer · Connection · Learning · Events
          </span>
          <span className="inline-block px-6 text-sm font-bold uppercase tracking-widest" style={{ fontFamily: 'var(--font-kollektif)', color: 'var(--color-olive-light)' }}>
            Community · Workshops · Volunteer · Connection · Learning · Events
          </span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12 py-10 md:py-14">
        {/* Compact controls */}
        <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between mb-10">
          <div className="flex flex-wrap items-center gap-3">
            <button type="button" onClick={() => navigateMonth('prev')} disabled={!canGoPrevMonth()} className="h-10 px-4 rounded-lg font-semibold text-sm transition-all disabled:opacity-30 disabled:cursor-not-allowed" style={{ fontFamily: 'var(--font-kollektif)', background: 'var(--color-brown-dark)', color: 'var(--color-cream)' }}>
              Prev
            </button>
            <button type="button" onClick={goToToday} className="h-10 px-4 rounded-lg font-semibold text-sm transition-all" style={{ fontFamily: 'var(--font-kollektif)', background: 'var(--color-cream)', color: 'var(--color-brown-dark)', border: '2px solid var(--color-brown-dark)' }}>
              Today
            </button>
            <button type="button" onClick={() => navigateMonth('next')} className="h-10 px-4 rounded-lg font-semibold text-sm transition-all" style={{ fontFamily: 'var(--font-kollektif)', background: 'var(--color-brown-dark)', color: 'var(--color-cream)' }}>
              Next
            </button>
            <span className="text-sm font-semibold" style={{ fontFamily: 'var(--font-kollektif)', color: 'var(--color-cream)' }}>
              {monthLabel}
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {(['all', 'club', 'school', 'holiday'] as const).map(t => (
              <button key={t} type="button" onClick={() => setFilterType(t)} className="h-10 px-4 rounded-lg font-semibold text-sm transition-all" style={{ fontFamily: 'var(--font-kollektif)', background: filterType === t ? 'var(--color-brown-dark)' : 'var(--color-cream)', color: filterType === t ? 'var(--color-cream)' : 'var(--color-brown-dark)', border: `2px solid ${filterType === t ? 'var(--color-brown-dark)' : 'rgba(234, 225, 203, 0.55)'}` }}>
                {t === 'all' ? 'All' : t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>
        </div>
        <div className="relative mb-10 max-w-xl">
          <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search upcoming events..." className="w-full h-12 pl-11 pr-11 rounded-xl border-2 focus:outline-none" style={{ fontFamily: 'var(--font-kollektif)', background: 'var(--color-cream)', borderColor: searchQuery ? 'var(--color-brown-dark)' : 'rgba(234, 225, 203, 0.55)', color: 'var(--color-brown-dark)' }} />
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: 'var(--color-olive)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          {searchQuery && (
            <button type="button" onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-lg transition-all" style={{ background: 'rgba(0,0,0,0.06)', color: 'var(--color-brown-dark)' }} aria-label="Clear search">
              <svg className="w-5 h-5 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        <section id="events-grid" className="scroll-mt-28">
          {groupedUpcoming.length > 0 ? (
            <>
              <div className="flex items-center justify-between gap-4 mb-8">
                <h2 className="text-3xl md:text-4xl font-bold uppercase tracking-tight" style={{ fontFamily: 'var(--font-kollektif)', color: 'var(--color-cream)' }}>
                  This month
                </h2>
                <Link href="/events/past" className="text-sm font-semibold underline-offset-2 hover:underline" style={{ fontFamily: 'var(--font-kollektif)', color: 'var(--color-olive-light)' }}>
                  Past events →
                </Link>
              </div>
              <div className="space-y-16 md:space-y-24 lg:space-y-28">
                {groupedUpcoming.map((group, groupIndex) => (
                  <div key={group.startKey} className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 lg:gap-14">
                    <div className="md:col-span-4">
                      <div className="sticky top-[92px]">
                        <div
                          className="rounded-3xl border-[3px] p-8 md:p-10 lg:p-12"
                          style={{
                            background: 'var(--color-cream)',
                            borderColor: 'var(--color-olive-dark)',
                            boxShadow: '0 12px 40px rgba(73, 47, 30, 0.12)'
                          }}
                        >
                          <div className="text-lg md:text-xl lg:text-2xl font-semibold mb-2 md:mb-3 tracking-tight" style={{ fontFamily: 'var(--font-kollektif)', color: 'var(--color-olive-dark)' }}>
                            {group.date.toLocaleDateString('en-US', { weekday: 'long' })}
                          </div>
                          <div className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold uppercase tracking-tight leading-[1.05]" style={{ fontFamily: 'var(--font-kollektif)', color: 'var(--color-brown-dark)' }}>
                            {group.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </div>
                          <div className="text-base md:text-lg font-semibold mt-4 md:mt-5 tabular-nums tracking-wide" style={{ fontFamily: 'var(--font-kollektif)', color: 'var(--color-brown-medium)' }}>
                            {group.date.getFullYear()}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="md:col-span-8">
                      <div className="flex flex-col gap-8 md:gap-10 lg:gap-12">
                        {group.events.map((event, eventIndex) => (
                          <div key={event.id} className="relative">
                            {groupIndex === 0 && eventIndex === 0 && (
                              <div className="absolute -top-2 right-3 z-10 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] sm:text-xs font-bold uppercase" style={{ background: 'var(--color-pink-medium)', color: 'var(--color-cream)', fontFamily: 'var(--font-kollektif)', boxShadow: '0 2px 8px rgba(0,0,0,0.12)', border: '2px solid var(--color-cream)' }}>
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                                </svg>
                                Top pick
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
            </>
          ) : (
            <div className="text-center py-20">
              <div className="mb-4">
                <svg className="w-16 h-16 mx-auto opacity-50" style={{ color: 'var(--color-olive-light)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="text-lg font-medium mb-2" style={{ fontFamily: 'var(--font-vintage-stylist)', color: 'var(--color-cream)' }}>
                No upcoming events this month
              </p>
              <p className="text-sm mb-6" style={{ fontFamily: 'var(--font-kollektif)', color: 'var(--color-olive-light)' }}>
                Try another month or check past events.
              </p>
              <Link href="/events/past" className="inline-block px-6 py-3 rounded-xl font-semibold" style={{ background: 'var(--color-brown-dark)', color: 'var(--color-cream)', fontFamily: 'var(--font-kollektif)' }}>
                Past events
              </Link>
            </div>
          )}
        </section>

      {selectedEvent && <EventDetailModal selectedEvent={selectedEvent} onClose={() => setSelectedEvent(null)} />}
      </div>
    </main>
  )
}
