'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { events } from '../events'
import {
  type DisplayEvent,
  normalizeDay,
  formatRange,
  getTimeFromDescription,
  getLocationFromDescription,
  getEventColor,
  mergeConsecutiveEvents
} from '../shared'
import EventDetailModal from '../EventDetailModal'

const MS_PER_DAY = 24 * 60 * 60 * 1000
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
        className="group w-full text-left flex flex-col overflow-hidden rounded-2xl border-2 transition-all duration-300 hover:shadow-xl bg-white"
        style={{ borderColor: 'var(--color-brown-dark)', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}
      >
        <div className="p-5 pb-4">
          {/* Title: large, bold, black, uppercase */}
          <h3 className="text-xl md:text-2xl font-bold uppercase tracking-tight mb-4" style={{ fontFamily: 'var(--font-kollektif)', color: '#171717' }}>
            {event.title}
          </h3>
          {/* Product-image style: unique colorful block */}
          <div className="w-full aspect-[4/3] rounded-xl mb-4 flex items-center justify-center overflow-hidden" style={{ background: getEventColor(event.type) }}>
            <svg className="w-20 h-20 opacity-80" style={{ color: 'var(--color-cream)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          {/* Quantity-selector style: white bg, black border, date in center */}
          <div className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl mb-4 bg-white border-2" style={{ borderColor: '#171717' }}>
            <span className="text-sm font-bold tabular-nums" style={{ fontFamily: 'var(--font-kollektif)', color: '#171717' }}>
              {shortDate}
              {event.endDate && ` – ${event.endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`}
            </span>
            {isActiveToday && (
              <span className="text-xs font-bold uppercase ml-1" style={{ fontFamily: 'var(--font-kollektif)', color: 'var(--color-brown-dark)' }}>
                · Today
              </span>
            )}
          </div>
        </div>
        {/* Add-to-cart style: black button + label (e.g. price → "Free") */}
        <div className="mt-auto p-5 pt-0">
          <span className="flex w-full justify-center items-center gap-2 py-4 px-4 rounded-xl text-sm font-bold uppercase tracking-wide transition-opacity group-hover:opacity-90" style={{ background: '#171717', color: 'var(--color-cream)', fontFamily: 'var(--font-kollektif)' }}>
            View details
            <span className="font-semibold normal-case tracking-normal opacity-90"> — Free</span>
          </span>
        </div>
      </button>
    )
  }

  // Flatten for hero-style grid (show first 6 or all)
  const displayCards = useMemo(() => {
    const flat: DisplayEvent[] = []
    for (const g of groupedUpcoming) {
      for (const e of g.events) flat.push(e)
    }
    return flat.slice(0, 9)
  }, [groupedUpcoming])

  return (
    <main className="min-h-screen pt-[60px] pb-20" style={{ background: 'var(--color-cream)' }}>
      {/* Hero: split green (left) + pink (right) */}
      <section className="grid grid-cols-1 lg:grid-cols-2 min-h-[380px] md:min-h-[420px]">
        <div className="flex flex-col justify-center px-6 md:px-10 lg:px-14 py-12 md:py-16" style={{ background: 'var(--color-olive-light)' }}>
          <div className="mb-6 text-5xl md:text-6xl opacity-90" style={{ color: 'var(--color-olive-dark)' }} aria-hidden>✦</div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold uppercase tracking-tight mb-4" style={{ fontFamily: 'var(--font-kollektif)', color: 'var(--color-brown-dark)', lineHeight: '1.1' }}>
            Discover upcoming events
          </h1>
          <p className="text-base md:text-lg max-w-md mb-8" style={{ fontFamily: 'var(--font-kollektif)', color: 'var(--color-olive-dark)', lineHeight: '1.6' }}>
            Workshops, community meetups, and volunteer opportunities—join what&apos;s next.
          </p>
          <Link href="#events-grid" className="inline-block w-fit px-8 py-4 rounded-xl font-bold text-sm uppercase tracking-wide transition-opacity hover:opacity-90" style={{ background: 'var(--color-brown-dark)', color: 'var(--color-cream)', fontFamily: 'var(--font-kollektif)' }}>
            View all events
          </Link>
        </div>
        <div className="min-h-[240px] md:min-h-[320px] flex items-center justify-center px-8 py-12" style={{ background: 'var(--color-pink-light)' }}>
          <div className="text-8xl md:text-9xl opacity-80" style={{ color: 'var(--color-pink-dark)' }} aria-hidden>📅</div>
        </div>
      </section>

      {/* Scrolling keyword banner */}
      <div className="overflow-hidden border-y py-3" style={{ borderColor: 'var(--color-olive-dark)', background: 'rgba(201, 218, 168, 0.3)' }}>
        <div className="flex whitespace-nowrap animate-scroll-text" style={{ width: '200%' }}>
          <span className="inline-block px-6 text-sm font-bold uppercase tracking-widest" style={{ fontFamily: 'var(--font-kollektif)', color: 'var(--color-brown-dark)' }}>
            Community · Workshops · Volunteer · Connection · Learning · Events
          </span>
          <span className="inline-block px-6 text-sm font-bold uppercase tracking-widest" style={{ fontFamily: 'var(--font-kollektif)', color: 'var(--color-brown-dark)' }}>
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
            <span className="text-sm font-semibold" style={{ fontFamily: 'var(--font-kollektif)', color: 'var(--color-brown-dark)' }}>
              {monthLabel}
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {(['all', 'club', 'school', 'holiday'] as const).map(t => (
              <button key={t} type="button" onClick={() => setFilterType(t)} className="h-10 px-4 rounded-lg font-semibold text-sm transition-all" style={{ fontFamily: 'var(--font-kollektif)', background: filterType === t ? 'var(--color-brown-dark)' : 'var(--color-cream)', color: filterType === t ? 'var(--color-cream)' : 'var(--color-brown-dark)', border: `2px solid ${filterType === t ? 'var(--color-brown-dark)' : 'var(--color-olive-dark)'}` }}>
                {t === 'all' ? 'All' : t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>
        </div>
        <div className="relative mb-10 max-w-xl">
          <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search upcoming events..." className="w-full h-12 pl-11 pr-11 rounded-xl border-2 focus:outline-none" style={{ fontFamily: 'var(--font-kollektif)', background: 'var(--color-cream)', borderColor: searchQuery ? 'var(--color-brown-dark)' : 'var(--color-olive-dark)', color: 'var(--color-brown-dark)' }} />
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: 'var(--color-olive-dark)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
          {displayCards.length > 0 ? (
            <div className="flex items-center justify-between gap-4 mb-8">
              <h2 className="text-2xl md:text-3xl font-bold uppercase tracking-tight" style={{ fontFamily: 'var(--font-kollektif)', color: 'var(--color-brown-dark)' }}>
                This month
              </h2>
              <Link href="/events/past" className="text-sm font-semibold" style={{ fontFamily: 'var(--font-kollektif)', color: 'var(--color-brown-dark)' }}>
                Past events →
              </Link>
            </div>
          ) : null}
          {groupedUpcoming.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {displayCards.map((event, index) => (
                <div key={event.id} className="relative">
                  {index === 0 && (
                    <div className="absolute -top-1 right-2 z-10 flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold uppercase" style={{ background: 'var(--color-pink-medium)', color: 'var(--color-cream)', fontFamily: 'var(--font-kollektif)', boxShadow: '0 2px 8px rgba(0,0,0,0.12)', border: '2px solid var(--color-cream)' }}>
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
          ) : (
            <div className="text-center py-20">
              <div className="mb-4">
                <svg className="w-16 h-16 mx-auto opacity-40" style={{ color: 'var(--color-olive-dark)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="text-lg font-medium mb-2" style={{ fontFamily: 'var(--font-vintage-stylist)', color: 'var(--color-brown-dark)' }}>
                No upcoming events this month
              </p>
              <p className="text-sm mb-6" style={{ fontFamily: 'var(--font-kollektif)', color: 'var(--color-olive-dark)' }}>
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
