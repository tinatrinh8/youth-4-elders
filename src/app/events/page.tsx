'use client'

import { useEffect, useMemo, useState } from 'react'
import { events, type CalendarEvent } from './events'

type DisplayEvent = CalendarEvent & {
  endDate?: Date
}

const MS_PER_DAY = 24 * 60 * 60 * 1000

function normalizeDay(d: Date) {
  const copy = new Date(d)
  copy.setHours(0, 0, 0, 0)
  return copy
}

function isConsecutiveDay(a: Date, b: Date) {
  return normalizeDay(b).getTime() - normalizeDay(a).getTime() === MS_PER_DAY
}

function formatRange(start: Date, end?: Date) {
  const s = normalizeDay(start)
  const e = end ? normalizeDay(end) : undefined

  if (!e || e.getTime() === s.getTime()) {
    return s.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const sameYear = s.getFullYear() === e.getFullYear()
  const sameMonth = sameYear && s.getMonth() === e.getMonth()

  const startStr = s.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    ...(sameYear ? {} : { year: 'numeric' })
  })

  const endStr = e.toLocaleDateString('en-US', {
    month: sameMonth ? undefined : 'long',
    day: 'numeric',
    year: 'numeric'
  } as Intl.DateTimeFormatOptions)

  return `${startStr} – ${endStr}`
}

function getTimeFromDescription(description?: string) {
  if (!description) return null
  const timeMatch = description.match(/(\d{1,2}:\d{2}\s*(?:AM|PM|am|pm))|(\d{1,2}\s*(?:AM|PM|am|pm))/i)
  return timeMatch ? timeMatch[0] : null
}

function getLocationFromDescription(description?: string) {
  if (!description) return null
  const locationMatch = description.match(/(?:at|located at|in)\s+([^.]+)/i)
  return locationMatch ? locationMatch[1].trim() : null
}

export default function Events() {
  const clubStartDate = new Date(2025, 7, 1) // August 1, 2025

  const [currentDate, setCurrentDate] = useState(() => {
    const now = new Date()
    return now < clubStartDate ? new Date(2025, 7, 1) : now
  })

  const [selectedEvent, setSelectedEvent] = useState<DisplayEvent | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState<'all' | 'holiday' | 'school' | 'club'>('all')
  const [today, setToday] = useState(() => normalizeDay(new Date()))

  // Update today daily
  useEffect(() => {
    const update = () => setToday(normalizeDay(new Date()))
    update()

    const now = new Date()
    const msUntilMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1).getTime() - now.getTime()
    const midnightTimeout = setTimeout(() => {
      update()
      const dailyInterval = setInterval(update, MS_PER_DAY)
      return () => clearInterval(dailyInterval)
    }, msUntilMidnight)

    return () => clearTimeout(midnightTimeout)
  }, [])

  // Disable body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = selectedEvent ? 'hidden' : 'unset'
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [selectedEvent])

  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ]

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

  const getEventColor = (type: CalendarEvent['type']) => {
    switch (type) {
      case 'holiday':
        return 'var(--color-pink-medium)'
      case 'school':
      case 'club':
      default:
        return 'var(--color-brown-medium)'
    }
  }

  const getEventTint = (type: CalendarEvent['type']) => {
    switch (type) {
      case 'holiday':
        return 'rgba(209, 142, 151, 0.12)'
      case 'school':
        return 'rgba(188, 87, 39, 0.10)'
      case 'club':
        return 'rgba(188, 87, 39, 0.06)'
      default:
        return 'rgba(188, 87, 39, 0.08)'
    }
  }

  const monthEvents = useMemo(() => {
    const y = currentDate.getFullYear()
    const m = currentDate.getMonth()
    return events.filter(e => {
      const d = e.date
      return d.getFullYear() === y && d.getMonth() === m
    })
  }, [currentDate])

  const filteredBase = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()

    let list = monthEvents

    if (filterType !== 'all') {
      list = list.filter(e => e.type === filterType)
    }

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

  const displayEvents = useMemo<DisplayEvent[]>(() => {
    // Merge consecutive duplicates (same title/type/description) into ranges
    const merged: DisplayEvent[] = []
    let i = 0

    while (i < filteredBase.length) {
      const current = filteredBase[i]
      const keyTitle = current.title
      const keyType = current.type
      const keyDesc = current.description ?? ''

      let endDate: Date | undefined
      let j = i

      while (j + 1 < filteredBase.length) {
        const next = filteredBase[j + 1]
        const nextDesc = next.description ?? ''

        const sameKey = next.title === keyTitle && next.type === keyType && nextDesc === keyDesc
        if (!sameKey) break
        if (!isConsecutiveDay(filteredBase[j].date, next.date)) break

        endDate = next.date
        j++
      }

      merged.push(endDate ? { ...current, endDate } : current)
      i = j + 1
    }

    return merged
  }, [filteredBase])

  const { upcoming, past } = useMemo(() => {
    const up: DisplayEvent[] = []
    const pa: DisplayEvent[] = []

    for (const e of displayEvents) {
      const end = normalizeDay(e.endDate ?? e.date)
      if (end < today) pa.push(e)
      else up.push(e)
    }

    return { upcoming: up, past: pa }
  }, [displayEvents, today])

  const stats = useMemo(() => {
    const total = displayEvents.length
    const club = displayEvents.filter(e => e.type === 'club').length
    const school = displayEvents.filter(e => e.type === 'school').length
    const holiday = displayEvents.filter(e => e.type === 'holiday').length
    const upcomingCount = upcoming.length
    return { total, club, school, holiday, upcomingCount }
  }, [displayEvents, upcoming.length])

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

  const renderEventCard = (event: DisplayEvent) => {
    const start = normalizeDay(event.date)
    const end = normalizeDay(event.endDate ?? event.date)
    const isActiveToday = today.getTime() >= start.getTime() && today.getTime() <= end.getTime()

    const time = getTimeFromDescription(event.description)
    const location = getLocationFromDescription(event.description)

    return (
      <button
        key={event.id}
        type="button"
        onClick={() => setSelectedEvent(event)}
        className="group w-full text-left rounded-2xl border transition-all duration-300 hover:-translate-y-[2px]"
        style={{
          background: 'var(--color-cream)',
          borderColor: isActiveToday ? 'var(--color-pink-medium)' : 'rgba(188, 87, 39, 0.18)',
          boxShadow: isActiveToday ? '0 12px 34px rgba(209, 142, 151, 0.18)' : '0 10px 30px rgba(188, 87, 39, 0.08)'
        }}
      >
        <div className="p-6 md:p-7">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <span
                  className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold tracking-wider"
                  style={{
                    background: getEventColor(event.type),
                    color: 'var(--color-cream)',
                    fontFamily: 'var(--font-kollektif)'
                  }}
                >
                  {event.type.toUpperCase()}
                </span>
                {event.endDate && (
                  <span
                    className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold tracking-wider"
                    style={{
                      background: 'rgba(188, 87, 39, 0.12)',
                      color: 'var(--color-brown-dark)',
                      fontFamily: 'var(--font-kollektif)'
                    }}
                  >
                    MULTI-DAY
                  </span>
                )}
                {isActiveToday && (
                  <span
                    className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold tracking-wider"
                    style={{
                      background: 'var(--color-pink-medium)',
                      color: 'var(--color-cream)',
                      fontFamily: 'var(--font-kollektif)',
                      boxShadow: '0 6px 18px rgba(209, 142, 151, 0.25)'
                    }}
                  >
                    TODAY
                  </span>
                )}
              </div>
              <h3
                className="text-xl md:text-2xl font-bold leading-tight"
                style={{
                  fontFamily: 'var(--font-vintage-stylist)',
                  color: 'var(--color-brown-dark)'
                }}
              >
                {event.title}
              </h3>
            </div>

            <div className="flex-shrink-0 text-right">
              <div
                className="text-sm font-semibold"
                style={{ fontFamily: 'var(--font-kollektif)', color: 'var(--color-brown-medium)' }}
              >
                {formatRange(event.date, event.endDate)}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 mb-4">
            {time && (
              <span
                className="inline-flex items-center gap-2 text-sm"
                style={{ fontFamily: 'var(--font-kollektif)', color: 'var(--color-brown-dark)' }}
              >
                <svg className="w-4 h-4" style={{ color: 'var(--color-brown-medium)', opacity: 0.8 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {time}
              </span>
            )}
            {location && (
              <span
                className="inline-flex items-center gap-2 text-sm"
                style={{ fontFamily: 'var(--font-kollektif)', color: 'var(--color-brown-dark)' }}
              >
                <svg className="w-4 h-4" style={{ color: 'var(--color-brown-medium)', opacity: 0.8 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {location}
              </span>
            )}
          </div>

          {event.description && (
            <p
              className="text-sm leading-relaxed line-clamp-2"
              style={{
                fontFamily: 'var(--font-kollektif)',
                color: 'var(--color-brown-medium)',
                lineHeight: '1.7'
              }}
            >
              {event.description}
            </p>
          )}

          <div className="mt-5 pt-5 border-t" style={{ borderColor: 'rgba(188, 87, 39, 0.12)' }}>
            <span
              className="inline-flex items-center gap-2 text-xs font-semibold"
              style={{ fontFamily: 'var(--font-kollektif)', color: getEventColor(event.type), letterSpacing: '0.06em' }}
            >
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
    <main className="min-h-screen pt-[60px] pb-20" style={{ background: 'var(--color-cream)' }}>
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12 py-12">
        {/* Header */}
        <div className="mb-10">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
            <div className="max-w-2xl">
              <div className="mb-3">
                <span
                  className="text-sm font-semibold tracking-wider uppercase"
                  style={{ fontFamily: 'var(--font-kollektif)', color: 'var(--color-brown-medium)', letterSpacing: '0.15em' }}
                >
                  Events
                </span>
              </div>
              <h1
                className="text-5xl md:text-6xl font-bold mb-3"
                style={{ fontFamily: 'var(--font-vintage-stylist)', color: 'var(--color-brown-dark)', lineHeight: '1.1' }}
              >
                {monthLabel}
              </h1>
              <p
                className="text-base md:text-lg"
                style={{ fontFamily: 'var(--font-kollektif)', color: 'var(--color-brown-medium)', lineHeight: '1.7' }}
              >
                Browse what’s happening this month. Use search + filters to find club events, school dates, or holidays.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => navigateMonth('prev')}
                disabled={!canGoPrevMonth()}
                className="h-11 px-4 rounded-lg font-semibold transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                style={{
                  fontFamily: 'var(--font-kollektif)',
                  background: 'var(--color-brown-medium)',
                  color: 'var(--color-cream)',
                  boxShadow: '0 2px 8px rgba(188, 87, 39, 0.18)'
                }}
              >
                Prev
              </button>
              <button
                type="button"
                onClick={goToToday}
                className="h-11 px-4 rounded-lg font-semibold transition-all"
                style={{
                  fontFamily: 'var(--font-kollektif)',
                  background: 'rgba(188, 87, 39, 0.10)',
                  color: 'var(--color-brown-dark)',
                  border: '1px solid rgba(188, 87, 39, 0.20)'
                }}
              >
                Today
              </button>
              <button
                type="button"
                onClick={() => navigateMonth('next')}
                className="h-11 px-4 rounded-lg font-semibold transition-all"
                style={{
                  fontFamily: 'var(--font-kollektif)',
                  background: 'var(--color-brown-medium)',
                  color: 'var(--color-cream)',
                  boxShadow: '0 2px 8px rgba(188, 87, 39, 0.18)'
                }}
              >
                Next
              </button>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-10">
          <div className="lg:col-span-7">
            <div className="relative">
              <input
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search title, description, or location…"
                className="w-full h-12 pl-12 pr-12 rounded-xl border-2 focus:outline-none"
                style={{
                  fontFamily: 'var(--font-kollektif)',
                  background: 'var(--color-cream)',
                  borderColor: searchQuery ? 'var(--color-pink-medium)' : 'rgba(188, 87, 39, 0.20)',
                  color: 'var(--color-brown-dark)',
                  boxShadow: searchQuery ? '0 10px 24px rgba(209, 142, 151, 0.12)' : 'none'
                }}
              />
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: 'var(--color-pink-medium)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-lg transition-all"
                  style={{ background: 'rgba(188, 87, 39, 0.10)', color: 'var(--color-brown-medium)' }}
                  aria-label="Clear search"
                >
                  <svg className="w-5 h-5 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>

          <div className="lg:col-span-5 flex flex-wrap gap-2 lg:justify-end">
            {(['all', 'club', 'school', 'holiday'] as const).map(t => (
              <button
                key={t}
                type="button"
                onClick={() => setFilterType(t)}
                className="h-12 px-4 rounded-xl font-semibold transition-all"
                style={{
                  fontFamily: 'var(--font-kollektif)',
                  background: filterType === t ? getEventColor(t === 'all' ? 'club' : t) : 'transparent',
                  color: filterType === t ? 'var(--color-cream)' : 'var(--color-brown-medium)',
                  border: `2px solid ${filterType === t ? getEventColor(t === 'all' ? 'club' : t) : 'rgba(188, 87, 39, 0.25)'}`
                }}
              >
                {t === 'all' ? 'All' : t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {[
            { label: 'Upcoming', value: stats.upcomingCount, tint: 'rgba(209, 142, 151, 0.10)', accent: 'var(--color-pink-medium)' },
            { label: 'Club', value: stats.club, tint: getEventTint('club'), accent: 'var(--color-brown-medium)' },
            { label: 'School', value: stats.school, tint: getEventTint('school'), accent: 'var(--color-brown-medium)' },
            { label: 'Holidays', value: stats.holiday, tint: getEventTint('holiday'), accent: 'var(--color-pink-medium)' }
          ].map(item => (
            <div
              key={item.label}
              className="rounded-2xl border p-5"
              style={{
                background: item.tint,
                borderColor: 'rgba(188, 87, 39, 0.15)'
              }}
            >
              <div className="text-3xl font-bold" style={{ fontFamily: 'var(--font-vintage-stylist)', color: 'var(--color-brown-dark)' }}>
                {item.value}
              </div>
              <div className="text-xs font-semibold tracking-wider uppercase mt-1" style={{ fontFamily: 'var(--font-kollektif)', color: item.accent, letterSpacing: '0.14em' }}>
                {item.label}
              </div>
            </div>
          ))}
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Sidebar */}
          <aside className="lg:col-span-4">
            <div className="rounded-2xl border p-6" style={{ background: 'var(--color-cream)', borderColor: 'rgba(188, 87, 39, 0.15)', boxShadow: '0 10px 30px rgba(188, 87, 39, 0.06)' }}>
              <h2 className="text-xl font-bold mb-4" style={{ fontFamily: 'var(--font-vintage-stylist)', color: 'var(--color-brown-dark)' }}>
                Legend
              </h2>
              <div className="space-y-3">
                {(
                  [
                    { label: 'Club', type: 'club' as const, desc: 'Workshops & Y4E events' },
                    { label: 'School', type: 'school' as const, desc: 'Term dates & exams' },
                    { label: 'Holiday', type: 'holiday' as const, desc: 'Statutory & special days' }
                  ]
                ).map(row => (
                  <div key={row.type} className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: getEventTint(row.type), border: `1px solid ${getEventColor(row.type)}` }}>
                      <div className="w-3 h-3 rounded-full" style={{ background: getEventColor(row.type) }} />
                    </div>
                    <div>
                      <div className="text-sm font-semibold" style={{ fontFamily: 'var(--font-kollektif)', color: 'var(--color-brown-dark)' }}>
                        {row.label}
                      </div>
                      <div className="text-xs" style={{ fontFamily: 'var(--font-kollektif)', color: 'var(--color-brown-medium)', opacity: 0.85 }}>
                        {row.desc}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t" style={{ borderColor: 'rgba(188, 87, 39, 0.12)' }}>
                <div className="text-xs font-semibold tracking-wider uppercase mb-2" style={{ fontFamily: 'var(--font-kollektif)', color: 'var(--color-brown-medium)', letterSpacing: '0.15em' }}>
                  Tip
                </div>
                <p className="text-sm" style={{ fontFamily: 'var(--font-kollektif)', color: 'var(--color-brown-medium)', lineHeight: '1.6' }}>
                  Exam periods and reading weeks are shown as a single date-range event (not repeated daily).
                </p>
              </div>
            </div>
          </aside>

          {/* Timeline */}
          <section className="lg:col-span-8">
            {groupedUpcoming.length > 0 && (
              <div className="mb-12">
                <div className="flex items-center gap-4 mb-6">
                  <div className="h-px flex-1" style={{ background: 'rgba(188, 87, 39, 0.18)' }} />
                  <h2 className="text-2xl md:text-3xl font-bold whitespace-nowrap" style={{ fontFamily: 'var(--font-vintage-stylist)', color: 'var(--color-brown-dark)' }}>
                    Upcoming
                  </h2>
                  <div className="h-px flex-1" style={{ background: 'rgba(188, 87, 39, 0.18)' }} />
                </div>

                <div className="space-y-6">
                  {groupedUpcoming.map(group => (
                    <div key={group.startKey} className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6">
                      <div className="md:col-span-3">
                        <div className="sticky top-[92px]">
                          <div className="rounded-2xl border p-4" style={{ background: 'rgba(188, 87, 39, 0.05)', borderColor: 'rgba(188, 87, 39, 0.15)' }}>
                            <div className="text-sm font-semibold" style={{ fontFamily: 'var(--font-kollektif)', color: 'var(--color-brown-dark)' }}>
                              {group.date.toLocaleDateString('en-US', { weekday: 'long' })}
                            </div>
                            <div className="text-2xl font-bold" style={{ fontFamily: 'var(--font-vintage-stylist)', color: 'var(--color-brown-dark)' }}>
                              {group.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="md:col-span-9 space-y-4">
                        {group.events.map(renderEventCard)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {groupedPast.length > 0 && (
              <div>
                <div className="flex items-center gap-4 mb-6">
                  <div className="h-px flex-1" style={{ background: 'rgba(188, 87, 39, 0.18)' }} />
                  <h2 className="text-2xl md:text-3xl font-bold whitespace-nowrap" style={{ fontFamily: 'var(--font-vintage-stylist)', color: 'var(--color-brown-dark)' }}>
                    Past
                  </h2>
                  <div className="h-px flex-1" style={{ background: 'rgba(188, 87, 39, 0.18)' }} />
                </div>

                <div className="space-y-6">
                  {groupedPast.map(group => (
                    <div key={group.startKey} className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6 opacity-90">
                      <div className="md:col-span-3">
                        <div className="sticky top-[92px]">
                          <div className="rounded-2xl border p-4" style={{ background: 'rgba(188, 87, 39, 0.03)', borderColor: 'rgba(188, 87, 39, 0.12)' }}>
                            <div className="text-sm font-semibold" style={{ fontFamily: 'var(--font-kollektif)', color: 'var(--color-brown-dark)' }}>
                              {group.date.toLocaleDateString('en-US', { weekday: 'long' })}
                            </div>
                            <div className="text-2xl font-bold" style={{ fontFamily: 'var(--font-vintage-stylist)', color: 'var(--color-brown-dark)' }}>
                              {group.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="md:col-span-9 space-y-4">
                        {group.events.map(renderEventCard)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {groupedUpcoming.length === 0 && groupedPast.length === 0 && (
              <div className="text-center py-20">
                <div className="mb-4">
                  <svg className="w-16 h-16 mx-auto opacity-30" style={{ color: 'var(--color-brown-medium)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <p className="text-lg font-medium mb-2" style={{ fontFamily: 'var(--font-vintage-stylist)', color: 'var(--color-brown-dark)' }}>
                  No events found
                </p>
                <p className="text-sm" style={{ fontFamily: 'var(--font-kollektif)', color: 'var(--color-brown-medium)', opacity: 0.85 }}>
                  Try a different month, clear search, or adjust filters.
                </p>
              </div>
            )}
          </section>
        </div>

        {/* Modal */}
        {selectedEvent && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(0, 0, 0, 0.6)', backdropFilter: 'blur(4px)' }}
            onClick={() => setSelectedEvent(null)}
          >
            <div
              className="w-full max-w-3xl rounded-2xl overflow-hidden"
              style={{
                background: 'var(--color-cream)',
                border: '2px solid rgba(188, 87, 39, 0.2)',
                boxShadow: '0 20px 70px rgba(0, 0, 0, 0.35)'
              }}
              onClick={e => e.stopPropagation()}
            >
              <div className="p-6 md:p-8 border-b" style={{ borderColor: 'rgba(188, 87, 39, 0.15)' }}>
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-3">
                      <span
                        className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold tracking-wider"
                        style={{ background: getEventColor(selectedEvent.type), color: 'var(--color-cream)', fontFamily: 'var(--font-kollektif)' }}
                      >
                        {selectedEvent.type.toUpperCase()}
                      </span>
                      {selectedEvent.endDate && (
                        <span
                          className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold tracking-wider"
                          style={{ background: 'rgba(188, 87, 39, 0.12)', color: 'var(--color-brown-dark)', fontFamily: 'var(--font-kollektif)' }}
                        >
                          DATE RANGE
                        </span>
                      )}
                    </div>
                    <h3 className="text-3xl md:text-4xl font-bold" style={{ fontFamily: 'var(--font-vintage-stylist)', color: 'var(--color-brown-dark)' }}>
                      {selectedEvent.title}
                    </h3>
                    <p className="mt-2 text-base" style={{ fontFamily: 'var(--font-kollektif)', color: 'var(--color-brown-medium)' }}>
                      {formatRange(selectedEvent.date, selectedEvent.endDate)}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setSelectedEvent(null)}
                    className="w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110"
                    style={{ background: 'rgba(188, 87, 39, 0.10)', color: 'var(--color-brown-dark)' }}
                    aria-label="Close"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="p-6 md:p-8" style={{ background: getEventTint(selectedEvent.type) }}>
                <div className="flex flex-wrap gap-4 mb-6">
                  {getTimeFromDescription(selectedEvent.description) && (
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl" style={{ background: 'rgba(234, 225, 203, 0.7)' }}>
                      <svg className="w-4 h-4" style={{ color: 'var(--color-brown-medium)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span style={{ fontFamily: 'var(--font-kollektif)', color: 'var(--color-brown-dark)' }}>
                        {getTimeFromDescription(selectedEvent.description)}
                      </span>
                    </div>
                  )}

                  {getLocationFromDescription(selectedEvent.description) && (
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl" style={{ background: 'rgba(234, 225, 203, 0.7)' }}>
                      <svg className="w-4 h-4" style={{ color: 'var(--color-brown-medium)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span style={{ fontFamily: 'var(--font-kollektif)', color: 'var(--color-brown-dark)' }}>
                        {getLocationFromDescription(selectedEvent.description)}
                      </span>
                    </div>
                  )}
                </div>

                {selectedEvent.description && (
                  <p className="text-base leading-relaxed" style={{ fontFamily: 'var(--font-leiko)', color: 'var(--color-brown-dark)', lineHeight: '1.85' }}>
                    {selectedEvent.description}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
