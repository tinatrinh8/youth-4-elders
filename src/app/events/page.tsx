'use client'

import { useState, useEffect } from 'react'
import { events, type CalendarEvent } from './events'

export default function Events() {
  const clubStartDate = new Date(2025, 7, 1) // August 1, 2025
  const [currentDate, setCurrentDate] = useState(() => {
    const today = new Date()
    if (today < clubStartDate) {
      return new Date(2025, 7, 1)
    }
    return today
  })
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState<'all' | 'holiday' | 'school' | 'club'>('all')
  const [today, setToday] = useState(() => {
    const date = new Date()
    date.setHours(0, 0, 0, 0)
    return date
  })

  // Update today's date daily
  useEffect(() => {
    const updateToday = () => {
      const date = new Date()
      date.setHours(0, 0, 0, 0)
      setToday(date)
    }
    updateToday()
    const now = new Date()
    const msUntilMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1).getTime() - now.getTime()
    const midnightTimeout = setTimeout(() => {
      updateToday()
      const dailyInterval = setInterval(updateToday, 24 * 60 * 60 * 1000)
      return () => clearInterval(dailyInterval)
    }, msUntilMidnight)
    return () => clearTimeout(midnightTimeout)
  }, [])

  // Disable body scroll when modal is open
  useEffect(() => {
    if (selectedEvent) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [selectedEvent])

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]

  // Get events for current month
  const getCurrentMonthEvents = () => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    
    return events.filter(event => {
      const eventDate = new Date(event.date)
      return eventDate.getFullYear() === year && eventDate.getMonth() === month
    })
  }

  // Filter events
  const getFilteredEvents = () => {
    let filtered = getCurrentMonthEvents()

    // Filter by type
    if (filterType !== 'all') {
      filtered = filtered.filter(event => event.type === filterType)
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(event => {
        const titleMatch = event.title.toLowerCase().includes(query)
        const descMatch = event.description?.toLowerCase().includes(query) || false
        return titleMatch || descMatch
      })
    }

    // Sort by date
    return filtered.sort((a, b) => a.date.getTime() - b.date.getTime())
  }

  // Separate upcoming and past events
  const getUpcomingEvents = () => {
    return getFilteredEvents().filter(event => {
      const eventDate = new Date(event.date)
      eventDate.setHours(0, 0, 0, 0)
      return eventDate >= today
    })
  }

  const getPastEvents = () => {
    return getFilteredEvents().filter(event => {
      const eventDate = new Date(event.date)
      eventDate.setHours(0, 0, 0, 0)
      return eventDate < today
    })
  }

  const getEventColor = (type: 'holiday' | 'school' | 'club') => {
    switch (type) {
      case 'holiday':
        return 'var(--color-pink-medium)'
      case 'school':
      case 'club':
        return 'var(--color-brown-medium)'
      default:
        return 'var(--color-brown-medium)'
    }
  }

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev)
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1)
        if (newDate < clubStartDate) {
          return new Date(2025, 7, 1)
        }
      } else {
        newDate.setMonth(prev.getMonth() + 1)
      }
      return newDate
    })
  }

  const goToToday = () => {
    const today = new Date()
    if (today < clubStartDate) {
      setCurrentDate(new Date(2025, 7, 1))
    } else {
      setCurrentDate(today)
    }
  }

  const canGoPrevMonth = () => {
    const prevMonth = new Date(currentDate)
    prevMonth.setMonth(currentDate.getMonth() - 1)
    return prevMonth >= clubStartDate
  }

  const upcomingEvents = getUpcomingEvents()
  const pastEvents = getPastEvents()

  return (
    <main className="min-h-screen pt-[100px] pb-20" style={{ 
      background: 'var(--color-cream)'
    }}>
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12 py-12">
        {/* Professional Header Section */}
        <div className="mb-16">
          <div className="mb-8">
            <div className="mb-3">
              <span
                className="text-sm font-semibold tracking-wider uppercase"
                style={{
                  fontFamily: 'var(--font-kollektif)',
                  color: 'var(--color-brown-medium)',
                  letterSpacing: '0.15em'
                }}
              >
                Calendar
              </span>
            </div>
            <h1 
              className="text-5xl md:text-6xl lg:text-7xl font-bold mb-4"
              style={{ 
                fontFamily: 'var(--font-vintage-stylist)', 
                color: 'var(--color-brown-dark)',
                letterSpacing: '0.01em',
                lineHeight: '1.1'
              }}
            >
              Events
            </h1>
            <p 
              className="text-lg max-w-2xl"
              style={{
                fontFamily: 'var(--font-kollektif)',
                color: 'var(--color-brown-medium)',
                lineHeight: '1.6'
              }}
            >
              Stay up to date with our upcoming events, workshops, and important dates.
            </p>
          </div>

          {/* Professional Month Navigation */}
          <div className="flex items-center justify-between mb-10 flex-wrap gap-6">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigateMonth('prev')}
                disabled={!canGoPrevMonth()}
                className="p-3 rounded-lg transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-opacity-90"
                style={{ 
                  background: 'var(--color-brown-medium)',
                  color: 'var(--color-cream)',
                  boxShadow: '0 2px 8px rgba(188, 87, 39, 0.2)'
                }}
                aria-label="Previous month"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div 
                className="px-8 py-3 rounded-lg font-semibold text-lg min-w-[220px] text-center"
                style={{ 
                  fontFamily: 'var(--font-kollektif)',
                  background: 'var(--color-pink-medium)',
                  color: 'var(--color-cream)',
                  letterSpacing: '0.05em',
                  boxShadow: '0 4px 12px rgba(209, 142, 151, 0.25)'
                }}
              >
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </div>
              <button
                onClick={() => navigateMonth('next')}
                className="p-3 rounded-lg transition-all duration-200 hover:bg-opacity-90"
                style={{ 
                  background: 'var(--color-brown-medium)',
                  color: 'var(--color-cream)',
                  boxShadow: '0 2px 8px rgba(188, 87, 39, 0.2)'
                }}
                aria-label="Next month"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                </svg>
              </button>
              <button
                onClick={goToToday}
                className="px-5 py-3 rounded-lg transition-all duration-200 font-semibold text-sm hover:bg-opacity-90"
                style={{ 
                  fontFamily: 'var(--font-kollektif)',
                  color: 'var(--color-cream)',
                  background: 'var(--color-brown-medium)',
                  letterSpacing: '0.05em',
                  boxShadow: '0 2px 8px rgba(188, 87, 39, 0.2)'
                }}
              >
                Today
              </button>
            </div>
          </div>

          {/* Professional Search and Filters */}
          <div className="flex flex-col lg:flex-row gap-4 mb-12">
            <div className="flex-1 relative">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search events by title or description..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-6 py-4 pl-14 pr-12 rounded-lg border-2 focus:outline-none focus:ring-2 transition-all"
                  style={{ 
                    fontFamily: 'var(--font-kollektif)',
                    background: 'var(--color-cream)',
                    borderColor: searchQuery ? 'var(--color-pink-medium)' : 'rgba(188, 87, 39, 0.2)',
                    color: 'var(--color-brown-dark)',
                    fontSize: '15px',
                    boxShadow: searchQuery ? '0 4px 12px rgba(209, 142, 151, 0.15)' : 'none'
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = 'var(--color-pink-medium)'
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(209, 142, 151, 0.15)'
                  }}
                  onBlur={(e) => {
                    if (!searchQuery) {
                      e.currentTarget.style.borderColor = 'rgba(188, 87, 39, 0.2)'
                      e.currentTarget.style.boxShadow = 'none'
                    }
                  }}
                />
                <svg 
                  className="absolute left-5 top-1/2 transform -translate-y-1/2 w-5 h-5 pointer-events-none"
                  style={{ color: 'var(--color-pink-medium)' }}
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 p-1 rounded-full hover:bg-opacity-10 transition-all"
                    style={{ 
                      color: 'var(--color-brown-medium)',
                      background: 'rgba(188, 87, 39, 0.1)'
                    }}
                    aria-label="Clear search"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
            <div className="flex gap-2 flex-wrap">
              {(['all', 'holiday', 'school', 'club'] as const).map(type => (
                <button
                  key={type}
                  onClick={() => setFilterType(type)}
                  className="px-5 py-3 rounded-lg font-semibold text-sm transition-all duration-200"
                  style={{
                    fontFamily: 'var(--font-kollektif)',
                    background: filterType === type 
                      ? getEventColor(type === 'all' ? 'club' : type) 
                      : 'transparent',
                    color: filterType === type 
                      ? 'var(--color-cream)' 
                      : 'var(--color-brown-medium)',
                    border: `2px solid ${filterType === type 
                      ? getEventColor(type === 'all' ? 'club' : type) 
                      : 'rgba(188, 87, 39, 0.3)'}`,
                    boxShadow: filterType === type 
                      ? '0 2px 8px rgba(188, 87, 39, 0.2)' 
                      : 'none',
                    letterSpacing: '0.03em'
                  }}
                >
                  {type === 'all' ? 'All Events' : type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Upcoming Events Section */}
        {upcomingEvents.length > 0 && (
          <section className="mb-20">
            <div className="flex items-center gap-4 mb-10">
              <div className="h-px flex-1" style={{ background: 'rgba(188, 87, 39, 0.2)' }} />
              <h2 
                className="text-3xl md:text-4xl font-bold whitespace-nowrap"
                style={{ 
                  fontFamily: 'var(--font-vintage-stylist)', 
                  color: 'var(--color-brown-dark)',
                  letterSpacing: '0.02em'
                }}
              >
                Upcoming Events
              </h2>
              <div className="h-px flex-1" style={{ background: 'rgba(188, 87, 39, 0.2)' }} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingEvents.map(event => {
                const eventDate = new Date(event.date)
                eventDate.setHours(0, 0, 0, 0)
                const isToday = eventDate.getTime() === today.getTime()
                const locationMatch = event.description?.match(/(?:at|located at|in)\s+([^.]+)/i)
                const timeMatch = event.description?.match(/(\d{1,2}:\d{2}\s*(?:AM|PM|am|pm))|(\d{1,2}\s*(?:AM|PM|am|pm))/i)

                return (
                  <article
                    key={event.id}
                    onClick={() => setSelectedEvent(event)}
                    className="group p-6 rounded-xl border-2 cursor-pointer transition-all duration-300 hover:shadow-lg"
                    style={{
                      background: 'var(--color-cream)',
                      borderColor: isToday ? 'var(--color-pink-medium)' : 'rgba(188, 87, 39, 0.2)',
                      boxShadow: isToday 
                        ? '0 8px 24px rgba(209, 142, 151, 0.2)' 
                        : '0 2px 8px rgba(188, 87, 39, 0.1)'
                    }}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div 
                        className="px-3 py-1.5 rounded-md text-xs font-bold tracking-wide"
                        style={{
                          background: getEventColor(event.type),
                          color: 'var(--color-cream)',
                          fontFamily: 'var(--font-kollektif)',
                          letterSpacing: '0.1em'
                        }}
                      >
                        {event.type.toUpperCase()}
                      </div>
                      {isToday && (
                        <span 
                          className="px-3 py-1 rounded-full text-xs font-bold"
                          style={{ 
                            fontFamily: 'var(--font-kollektif)',
                            color: 'var(--color-cream)',
                            background: 'var(--color-pink-medium)',
                            letterSpacing: '0.05em',
                            boxShadow: '0 2px 6px rgba(209, 142, 151, 0.3)'
                          }}
                        >
                          TODAY
                        </span>
                      )}
                    </div>
                    <h3
                      className="text-xl font-bold mb-3 group-hover:opacity-80 transition-opacity"
                      style={{
                        fontFamily: 'var(--font-vintage-stylist)',
                        color: 'var(--color-brown-dark)',
                        lineHeight: '1.3'
                      }}
                    >
                      {event.title}
                    </h3>
                    <div className="space-y-2 mb-4">
                      <p 
                        className="text-sm font-medium"
                        style={{ 
                          fontFamily: 'var(--font-kollektif)', 
                          color: 'var(--color-brown-medium)'
                        }}
                      >
                        {eventDate.toLocaleDateString('en-US', { 
                          weekday: 'long', 
                          month: 'long', 
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </p>
                      {timeMatch && (
                        <div className="flex items-center gap-2">
                          <svg className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--color-brown-medium)', opacity: 0.7 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="text-sm" style={{ fontFamily: 'var(--font-kollektif)', color: 'var(--color-brown-dark)' }}>
                            {timeMatch[0]}
                          </span>
                        </div>
                      )}
                      {locationMatch && (
                        <div className="flex items-center gap-2">
                          <svg className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--color-brown-medium)', opacity: 0.7 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <span className="text-sm" style={{ fontFamily: 'var(--font-kollektif)', color: 'var(--color-brown-dark)' }}>
                            {locationMatch[1].trim()}
                          </span>
                        </div>
                      )}
                    </div>
                    {event.description && (
                      <p 
                        className="text-sm line-clamp-2 leading-relaxed"
                        style={{ 
                          fontFamily: 'var(--font-kollektif)', 
                          color: 'var(--color-brown-medium)',
                          lineHeight: '1.6'
                        }}
                      >
                        {event.description.split('||END_DATE:')[0]}
                      </p>
                    )}
                    <div className="mt-4 pt-4 border-t" style={{ borderColor: 'rgba(188, 87, 39, 0.1)' }}>
                      <span
                        className="text-xs font-semibold inline-flex items-center gap-1"
                        style={{
                          fontFamily: 'var(--font-kollektif)',
                          color: getEventColor(event.type),
                          letterSpacing: '0.05em'
                        }}
                      >
                        View Details
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                        </svg>
                      </span>
                    </div>
                  </article>
                )
              })}
            </div>
          </section>
        )}

        {/* Past Events Section */}
        {pastEvents.length > 0 && (
          <section>
            <div className="flex items-center gap-4 mb-10">
              <div className="h-px flex-1" style={{ background: 'rgba(188, 87, 39, 0.2)' }} />
              <h2 
                className="text-3xl md:text-4xl font-bold whitespace-nowrap"
                style={{ 
                  fontFamily: 'var(--font-vintage-stylist)', 
                  color: 'var(--color-brown-dark)',
                  letterSpacing: '0.02em'
                }}
              >
                Past Events
              </h2>
              <div className="h-px flex-1" style={{ background: 'rgba(188, 87, 39, 0.2)' }} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pastEvents.map(event => {
                const eventDate = new Date(event.date)
                const locationMatch = event.description?.match(/(?:at|located at|in)\s+([^.]+)/i)

                return (
                  <article
                    key={event.id}
                    onClick={() => setSelectedEvent(event)}
                    className="group p-6 rounded-xl border-2 cursor-pointer transition-all duration-300 hover:shadow-md opacity-70 hover:opacity-90"
                    style={{
                      background: 'var(--color-cream)',
                      borderColor: 'rgba(188, 87, 39, 0.15)',
                      boxShadow: '0 1px 4px rgba(188, 87, 39, 0.08)'
                    }}
                  >
                    <div 
                      className="px-3 py-1.5 rounded-md text-xs font-bold tracking-wide mb-4 inline-block"
                      style={{
                        background: getEventColor(event.type),
                        color: 'var(--color-cream)',
                        fontFamily: 'var(--font-kollektif)',
                        letterSpacing: '0.1em',
                        opacity: 0.8
                      }}
                    >
                      {event.type.toUpperCase()}
                    </div>
                    <h3
                      className="text-xl font-bold mb-3"
                      style={{
                        fontFamily: 'var(--font-vintage-stylist)',
                        color: 'var(--color-brown-dark)',
                        lineHeight: '1.3'
                      }}
                    >
                      {event.title}
                    </h3>
                    <p 
                      className="text-sm font-medium mb-3"
                      style={{ 
                        fontFamily: 'var(--font-kollektif)', 
                        color: 'var(--color-brown-medium)'
                      }}
                    >
                      {eventDate.toLocaleDateString('en-US', { 
                        month: 'long', 
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </p>
                    {locationMatch && (
                      <p className="text-sm mb-3" style={{ fontFamily: 'var(--font-kollektif)', color: 'var(--color-brown-medium)' }}>
                        {locationMatch[1].trim()}
                      </p>
                    )}
                  </article>
                )
              })}
            </div>
          </section>
        )}

        {/* No Results */}
        {upcomingEvents.length === 0 && pastEvents.length === 0 && (
          <div className="text-center py-20">
            <div className="mb-4">
              <svg className="w-16 h-16 mx-auto opacity-30" style={{ color: 'var(--color-brown-medium)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <p 
              className="text-lg font-medium mb-2"
              style={{
                fontFamily: 'var(--font-vintage-stylist)',
                color: 'var(--color-brown-dark)'
              }}
            >
              No events found
            </p>
            <p 
              className="text-sm"
              style={{
                fontFamily: 'var(--font-kollektif)',
                color: 'var(--color-brown-medium)',
                opacity: 0.8
              }}
            >
              Try adjusting your search or filters, or navigate to a different month.
            </p>
          </div>
        )}

        {/* Professional Event Modal */}
        {selectedEvent && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fadeIn"
            style={{ background: 'rgba(0, 0, 0, 0.6)', backdropFilter: 'blur(4px)' }}
            onClick={() => setSelectedEvent(null)}
          >
            <div 
              className="rounded-2xl p-8 md:p-10 max-w-3xl w-full max-h-[90vh] overflow-y-auto animate-popup"
              style={{ 
                background: 'var(--color-cream)',
                border: '2px solid var(--color-brown-medium)',
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between mb-6 pb-6 border-b" style={{ borderColor: 'rgba(188, 87, 39, 0.2)' }}>
                <div className="flex-1 pr-4">
                  <div 
                    className="inline-block px-4 py-2 rounded-lg mb-4"
                    style={{
                      background: getEventColor(selectedEvent.type),
                      color: 'var(--color-cream)',
                      fontFamily: 'var(--font-kollektif)',
                      fontSize: '12px',
                      fontWeight: 'bold',
                      letterSpacing: '0.1em'
                    }}
                  >
                    {selectedEvent.type.toUpperCase()}
                  </div>
                  <h2 
                    className="text-3xl md:text-4xl font-bold mb-3"
                    style={{ 
                      fontFamily: 'var(--font-vintage-stylist)', 
                      color: 'var(--color-brown-dark)',
                      lineHeight: '1.2'
                    }}
                  >
                    {selectedEvent.title}
                  </h2>
                  <p 
                    className="text-base font-medium"
                    style={{ 
                      fontFamily: 'var(--font-kollektif)', 
                      color: 'var(--color-brown-medium)'
                    }}
                  >
                    {selectedEvent.date.toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedEvent(null)}
                  className="w-10 h-10 flex items-center justify-center rounded-full transition-all hover:scale-110 flex-shrink-0"
                  style={{ 
                    color: 'var(--color-brown-dark)',
                    background: 'rgba(188, 87, 39, 0.1)'
                  }}
                  aria-label="Close"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              {selectedEvent.description && (
                <div className="prose max-w-none">
                  <p 
                    className="text-base leading-relaxed"
                    style={{ 
                      fontFamily: 'var(--font-leiko)', 
                      color: 'var(--color-brown-dark)',
                      lineHeight: '1.8'
                    }}
                  >
                    {selectedEvent.description.split('||END_DATE:')[0]}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
