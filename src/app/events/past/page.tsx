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

const clubStartDate = new Date(2025, 7, 1)

export default function PastEventsPage() {
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

  const past = useMemo(() => {
    return displayEvents.filter(e => normalizeDay(e.endDate ?? e.date) < today)
  }, [displayEvents, today])

  const groupedPast = useMemo(() => {
    const groups = new Map<number, DisplayEvent[]>()
    for (const e of past) {
      const key = normalizeDay(e.date).getTime()
      const arr = groups.get(key) ?? []
      arr.push(e)
      groups.set(key, arr)
    }
    return [...groups.entries()]
      .sort((a, b) => b[0] - a[0])
      .map(([k, v]) => ({ startKey: k, date: new Date(k), events: v }))
  }, [past])

  const renderCard = (event: DisplayEvent) => {
    const time = getTimeFromDescription(event.description)
    const location = getLocationFromDescription(event.description)

    return (
      <button
        key={event.id}
        type="button"
        onClick={() => setSelectedEvent(event)}
        className="group w-full text-left rounded-2xl border transition-all duration-300 hover:-translate-y-[2px]"
        style={{ background: 'var(--color-cream)', borderColor: 'var(--color-pink-dark)', boxShadow: '0 8px 24px rgba(196, 114, 124, 0.15)' }}
      >
        <div className="p-6 md:p-7">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold tracking-wider" style={{ background: getEventColor(event.type), color: 'var(--color-cream)', fontFamily: 'var(--font-kollektif)' }}>
                  {event.type.toUpperCase()}
                </span>
                {event.endDate && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold tracking-wider" style={{ background: 'rgba(175, 121, 120, 0.12)', color: 'var(--color-brown-dark)', fontFamily: 'var(--font-kollektif)' }}>
                    MULTI-DAY
                  </span>
                )}
              </div>
              <h3 className="text-xl md:text-2xl font-bold leading-tight mb-2" style={{ fontFamily: 'var(--font-vintage-stylist)', color: 'var(--color-brown-dark)' }}>
                {event.title}
              </h3>
              {(time || location) && (
                <div className="flex flex-wrap items-center gap-4 text-sm" style={{ fontFamily: 'var(--font-kollektif)', color: 'var(--color-brown-medium)' }}>
                  {time && <span className="inline-flex items-center gap-2">{time}</span>}
                  {location && <span className="inline-flex items-center gap-2">{location}</span>}
                </div>
              )}
            </div>
            <div className="flex-shrink-0 text-right">
              <div className="text-sm font-semibold whitespace-nowrap" style={{ fontFamily: 'var(--font-kollektif)', color: 'var(--color-brown-medium)' }}>
                {formatRange(event.date, event.endDate)}
              </div>
            </div>
          </div>
          {event.description && (
            <p className="text-sm leading-relaxed line-clamp-2 mb-4" style={{ fontFamily: 'var(--font-kollektif)', color: 'var(--color-brown-medium)', lineHeight: '1.7' }}>
              {event.description}
            </p>
          )}
          <div className="pt-4 border-t" style={{ borderColor: 'rgba(175, 121, 120, 0.12)' }}>
            <span className="inline-flex items-center gap-2 text-xs font-semibold" style={{ fontFamily: 'var(--font-kollektif)', color: getEventColor(event.type), letterSpacing: '0.06em' }}>
              View details
              <svg className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
            </span>
          </div>
        </div>
      </button>
    )
  }

  return (
    <main className="min-h-screen pt-[60px] pb-20" style={{ background: 'var(--color-pink-light)' }}>
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12 py-12">
        <div className="mb-12">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <div>
              <h1 className="text-5xl md:text-6xl font-bold mb-3" style={{ fontFamily: 'var(--font-vintage-stylist)', color: 'var(--color-brown-dark)', lineHeight: '1.1' }}>
                Past Events
              </h1>
              <p className="text-base md:text-lg" style={{ fontFamily: 'var(--font-kollektif)', color: 'var(--color-pink-dark)', lineHeight: '1.7' }}>
                {monthLabel} — look back at what we did. Search and filter below.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <button type="button" onClick={() => navigateMonth('prev')} disabled={!canGoPrevMonth()} className="h-11 px-4 rounded-lg font-semibold transition-all disabled:opacity-30 disabled:cursor-not-allowed" style={{ fontFamily: 'var(--font-kollektif)', background: 'var(--color-brown-dark)', color: 'var(--color-cream)' }}>
                Prev
              </button>
              <button type="button" onClick={goToToday} className="h-11 px-4 rounded-lg font-semibold transition-all" style={{ fontFamily: 'var(--font-kollektif)', background: 'var(--color-cream)', color: 'var(--color-brown-dark)', border: '2px solid var(--color-brown-dark)' }}>
                Today
              </button>
              <button type="button" onClick={() => navigateMonth('next')} className="h-11 px-4 rounded-lg font-semibold transition-all" style={{ fontFamily: 'var(--font-kollektif)', background: 'var(--color-brown-dark)', color: 'var(--color-cream)' }}>
                Next
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-12">
          <div className="lg:col-span-7">
            <div className="relative">
              <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search past events..." className="w-full h-12 pl-12 pr-12 rounded-xl border-2 focus:outline-none" style={{ fontFamily: 'var(--font-kollektif)', background: 'var(--color-cream)', borderColor: searchQuery ? 'var(--color-brown-dark)' : 'var(--color-pink-dark)', color: 'var(--color-brown-dark)' }} />
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: 'var(--color-pink-dark)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              {searchQuery && (
                <button type="button" onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-lg transition-all" style={{ background: 'var(--color-pink-medium)', color: 'var(--color-brown-dark)' }} aria-label="Clear search">
                  <svg className="w-5 h-5 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>
          <div className="lg:col-span-5 flex flex-wrap gap-2 lg:justify-end">
            {(['all', 'club', 'school', 'holiday'] as const).map(t => (
              <button key={t} type="button" onClick={() => setFilterType(t)} className="h-12 px-4 rounded-xl font-semibold transition-all" style={{ fontFamily: 'var(--font-kollektif)', background: filterType === t ? 'var(--color-brown-dark)' : 'var(--color-cream)', color: filterType === t ? 'var(--color-cream)' : 'var(--color-brown-dark)', border: `2px solid ${filterType === t ? 'var(--color-brown-dark)' : 'var(--color-pink-dark)'}` }}>
                {t === 'all' ? 'All' : t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <section>
          <div className="flex items-center justify-between gap-4 mb-8">
            <h2 className="text-2xl md:text-3xl font-bold" style={{ fontFamily: 'var(--font-vintage-stylist)', color: 'var(--color-brown-dark)' }}>
              This month
            </h2>
            <Link href="/events/upcoming" className="text-sm font-semibold" style={{ fontFamily: 'var(--font-kollektif)', color: 'var(--color-brown-dark)' }}>
              Upcoming events →
            </Link>
          </div>

          {groupedPast.length > 0 ? (
            <div className="space-y-8">
              {groupedPast.map(group => (
                <div key={group.startKey} className="grid grid-cols-1 md:grid-cols-12 gap-6">
                  <div className="md:col-span-3">
                    <div className="sticky top-[92px]">
                      <div className="rounded-2xl border-2 border-[var(--color-pink-dark)] p-5" style={{ background: 'var(--color-cream)' }}>
                        <div className="text-sm font-semibold mb-1" style={{ fontFamily: 'var(--font-kollektif)', color: 'var(--color-brown-dark)' }}>
                          {group.date.toLocaleDateString('en-US', { weekday: 'long' })}
                        </div>
                        <div className="text-2xl font-bold" style={{ fontFamily: 'var(--font-vintage-stylist)', color: 'var(--color-brown-dark)' }}>
                          {group.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="md:col-span-9 space-y-4">
                    {group.events.map(renderCard)}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="mb-4">
                <svg className="w-16 h-16 mx-auto opacity-40" style={{ color: 'var(--color-pink-dark)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="text-lg font-medium mb-2" style={{ fontFamily: 'var(--font-vintage-stylist)', color: 'var(--color-brown-dark)' }}>
                No past events in this month
              </p>
              <p className="text-sm mb-6" style={{ fontFamily: 'var(--font-kollektif)', color: 'var(--color-pink-dark)' }}>
                Try another month or see what&apos;s coming up.
              </p>
              <Link href="/events/upcoming" className="inline-block px-6 py-3 rounded-xl font-semibold" style={{ background: 'var(--color-brown-dark)', color: 'var(--color-cream)', fontFamily: 'var(--font-kollektif)' }}>
                Upcoming events
              </Link>
            </div>
          )}
        </section>

        {selectedEvent && <EventDetailModal selectedEvent={selectedEvent} onClose={() => setSelectedEvent(null)} />}
      </div>
    </main>
  )
}
