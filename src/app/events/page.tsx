'use client'

import { useState, useEffect } from 'react'
import { events, type CalendarEvent } from './events'

export default function Events() {
  // Club started in August 2025, so calendar starts from then
  const clubStartDate = new Date(2025, 7, 1) // August 1, 2025
  const [currentDate, setCurrentDate] = useState(() => {
    const today = new Date()
    // If today is before club start, show August 2025, otherwise show current month
    if (today < clubStartDate) {
      return new Date(2025, 7, 1)
    }
    return today
  })
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null)
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

    // Update immediately
    updateToday()

    // Update at midnight
    const now = new Date()
    const msUntilMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1).getTime() - now.getTime()
    
    const midnightTimeout = setTimeout(() => {
      updateToday()
      // Then update every 24 hours
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

  // Events are imported from @/data/events

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]

  const weekDaysShort = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat']
  
  // Newsletter-style content for past club events
  const getNewsletterContent = (event: CalendarEvent): { title: string; content: string[]; highlights?: string[] } | null => {
    const eventDate = new Date(event.date)
    eventDate.setHours(0, 0, 0, 0)
    const todayDate = new Date(today)
    todayDate.setHours(0, 0, 0, 0)
    
    // Only show newsletter for past club events
    if (event.type !== 'club' || eventDate >= todayDate) {
      return null
    }
    
    const content: Record<string, { title: string; content: string[]; highlights?: string[] }> = {
      'club-fair': {
        title: 'Club Fair 2025: A Successful Start!',
        content: [
          'We had an amazing time at the Club Fair this September! Our table was buzzing with energy as we welcomed new members and shared our mission with the community.',
          'The event was a huge success, with many students stopping by Table 16 in UCU to learn about Youth 4 Elders. Our executive team was thrilled to meet so many passionate individuals interested in making a difference in the lives of elders.',
          'We connected with over 50 potential new members and had engaging conversations about our upcoming events and volunteer opportunities. The enthusiasm was contagious, and we left feeling inspired and excited for the year ahead!'
        ],
        highlights: [
          '50+ new connections made',
          'Engaging conversations about our mission',
          'Strong interest in upcoming events'
        ]
      },
      'workshop-1': {
        title: 'Technology Workshop Series: Empowering Elders',
        content: [
          'Our Technology Workshop series kicked off with great success! Each Friday session at Glebe Centre Abbotsford has been filled with learning, laughter, and meaningful connections.',
          'We&apos;ve been helping elders navigate the digital world, from basic smartphone usage to video calling with family members. The workshops have created a supportive environment where questions are welcomed and everyone learns at their own pace.',
          'The impact has been incredible - participants have gained confidence in using technology, and we&apos;ve built lasting relationships with the community at Glebe Centre Abbotsford.'
        ],
        highlights: [
          'Weekly sessions every Friday',
          'Hands-on technology assistance',
          'Building confidence and connections'
        ]
      },
      'sips-samples': {
        title: 'Sips, Samples, Social: A Delicious Success!',
        content: [
          'Our Sips, Samples, Social event was a delightful evening of community connection! We gathered at Abbotsford Seniors Centre to enjoy delicious treats from our favourite local vendors.',
          'The event brought together members of our club and the elder community for an evening of conversation, laughter, and of course, amazing food. It was wonderful to see everyone enjoying the samples and sharing stories.',
          'This event perfectly embodied our mission of bridging generations through shared experiences. We&apos;re grateful to all the local vendors who participated and made the evening so special!'
        ],
        highlights: [
          'Delicious samples from local vendors',
          'Great community turnout',
          'Meaningful intergenerational connections'
        ]
      }
    }
    
    // Check for workshop events
    if (event.title === 'Technology Workshop' && event.id.startsWith('workshop-')) {
      return content['workshop-1']
    }
    
    return content[event.id] || null
  }
  
  // Get current date info
  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  // Get all days in the current month
  const getCurrentMonthDays = (): Date[] => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const days: Date[] = []
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i))
    }
    return days
  }

  const currentMonthDays = getCurrentMonthDays()

  // Filter events for weekly view - group date ranges and only show start/end for long-term events
  const getEventsForDate = (date: Date | number) => {
    if (typeof date === 'number') {
      // Legacy support for day number
      return events.filter(event => {
        const eventDate = event.date
        return eventDate.getDate() === date &&
               eventDate.getMonth() === month &&
               eventDate.getFullYear() === year
      })
    } else {
      // For weekly view, filter events for this date
      const dayEvents = events.filter(event => {
        const eventDate = event.date
        return eventDate.getDate() === date.getDate() &&
               eventDate.getMonth() === date.getMonth() &&
               eventDate.getFullYear() === date.getFullYear()
      })
      
      // Filter out long-term events that aren't start/end dates
      // Long-term events: Fall Term, Winter Term, Spring/Summer Term
      const longTermEventPatterns = ['Fall Term', 'Winter Term', 'Spring/Summer Term']
      const isLongTermEvent = (title: string) => {
        return longTermEventPatterns.some(pattern => title.includes(pattern))
      }
      
      return dayEvents.filter(event => {
        // If it's a long-term event, only show if it's a start or end event
        if (isLongTermEvent(event.title)) {
          return event.title.includes('Starts') || event.title.includes('Ends')
        }
        // For date range events (Reading Week, Exam Period), show them
        // They'll be grouped in the display
        return true
      })
    }
  }
  
  // Get grouped events for a date (for date ranges like Reading Week)
  const getGroupedEventsForDate = (date: Date) => {
    const dayEvents = getEventsForDate(date)
    const grouped: CalendarEvent[] = []
    const processed = new Set<string>()
    
    // Events that should be grouped (short date ranges)
    const dateRangeTitles = ['Reading Week', 'Exam Period', 'Exam Period (Session A)', 'Exam Period (Session B)', 'Exam Period (Session C)', 'Easter Break']
    
    dayEvents.forEach(event => {
      if (processed.has(event.id)) return
      
      if (dateRangeTitles.includes(event.title)) {
        // Find all events with the same title in the current month
        const sameTitleEvents = currentMonthDays
          .flatMap(d => getEventsForDate(d))
          .filter(e => e.title === event.title && !processed.has(e.id))
          .sort((a, b) => a.date.getTime() - b.date.getTime())
        
        if (sameTitleEvents.length > 1) {
          // Check if this date is the start of the range
          const startDate = sameTitleEvents[0].date
          if (date.getTime() === startDate.getTime()) {
            const endDate = sameTitleEvents[sameTitleEvents.length - 1].date
            const groupedEvent: CalendarEvent = {
              id: `${event.title.toLowerCase().replace(/\s+/g, '-')}-grouped-${startDate.getTime()}`,
              title: event.title,
              date: startDate,
              type: event.type,
              description: `${event.description}||END_DATE:${endDate.getTime()}`
            }
            grouped.push(groupedEvent)
            sameTitleEvents.forEach(e => processed.add(e.id))
          }
        } else {
          grouped.push(event)
          processed.add(event.id)
        }
      } else {
        grouped.push(event)
        processed.add(event.id)
      }
    })
    
    return grouped
  }

  // Get all events for the current month being displayed
  const getEventsForCurrentMonth = () => {
    return events.filter(event => {
      const eventDate = event.date
      return eventDate.getMonth() === month &&
             eventDate.getFullYear() === year
    })
  }

  const currentMonthEvents = getEventsForCurrentMonth()

  // Categorize events
  const getEventCategory = (event: CalendarEvent): string => {
    if (event.title.toLowerCase().includes('workshop')) {
      return 'Workshops'
    }
    if (event.type === 'holiday') {
      return 'Holidays'
    }
    if (event.type === 'school') {
      return 'School Events'
    }
    return 'Events'
  }

  // Separate into upcoming and past events, then group by category
  const upcomingMonthEvents = currentMonthEvents
    .filter(event => {
      const eventDate = new Date(event.date)
      eventDate.setHours(0, 0, 0, 0)
      const todayDate = new Date(today)
      return eventDate >= todayDate
    })
    .sort((a, b) => a.date.getTime() - b.date.getTime())

  const pastMonthEvents = currentMonthEvents
    .filter(event => {
      const eventDate = new Date(event.date)
      eventDate.setHours(0, 0, 0, 0)
      const todayDate = new Date(today)
      return eventDate < todayDate
    })
    .sort((a, b) => b.date.getTime() - a.date.getTime())

  // Group consecutive date range events together (Reading Week, Exam Period)
  // Keep Technology Workshop and other unique events separate
  const groupDateRangeEvents = (eventsList: CalendarEvent[]) => {
    const grouped: CalendarEvent[] = []
    const processed = new Set<string>()
    
    // Events that should be grouped (date ranges)
    const dateRangeTitles = ['Reading Week', 'Exam Period', 'Exam Period (Session A)', 'Exam Period (Session B)', 'Exam Period (Session C)', 'Easter Break']
    
    eventsList.forEach(event => {
      // Skip if already processed as part of a group
      if (processed.has(event.id)) return
      
      // Check if this is a date range event that should be grouped
      if (dateRangeTitles.includes(event.title)) {
        // Find all events with the same title, sorted by date
        const sameTitleEvents = eventsList.filter(e => 
          e.title === event.title && !processed.has(e.id)
        ).sort((a, b) => a.date.getTime() - b.date.getTime())
        
        if (sameTitleEvents.length > 1) {
          // Group consecutive events only (events that are within 2 days of each other)
          const consecutiveGroups: CalendarEvent[][] = []
          let currentGroup: CalendarEvent[] = [sameTitleEvents[0]]
          
          for (let i = 1; i < sameTitleEvents.length; i++) {
            const prevDate = sameTitleEvents[i - 1].date
            const currDate = sameTitleEvents[i].date
            const daysDiff = Math.floor((currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24))
            
            // If events are consecutive (within 2 days), add to current group
            if (daysDiff <= 2) {
              currentGroup.push(sameTitleEvents[i])
            } else {
              // Start a new group
              consecutiveGroups.push(currentGroup)
              currentGroup = [sameTitleEvents[i]]
            }
          }
          consecutiveGroups.push(currentGroup)
          
          // Create grouped events for each consecutive group
          consecutiveGroups.forEach(group => {
            if (group.length > 1) {
              const startDate = group[0].date
              const endDate = group[group.length - 1].date
              // Store end date in description for reference (we'll parse it when displaying)
              const groupedEvent: CalendarEvent = {
                id: `${event.title.toLowerCase().replace(/\s+/g, '-')}-grouped-${startDate.getTime()}`,
                title: event.title,
                date: startDate,
                type: event.type,
                description: `${group[0].description}||END_DATE:${endDate.getTime()}` // Store end date timestamp
              }
              grouped.push(groupedEvent)
              
              // Mark all events in this group as processed
              group.forEach(e => processed.add(e.id))
            } else {
              // Single event, don't group
              grouped.push(group[0])
              processed.add(group[0].id)
            }
          })
        } else {
          grouped.push(event)
          processed.add(event.id)
        }
      } else {
        // Keep Technology Workshop and other unique events separate
        grouped.push(event)
        processed.add(event.id)
      }
    })
    
    return grouped
  }

  // Group date range events across ALL events first (not just current month)
  // This ensures multi-day events like Exam Period get the correct end date
  const allGroupedEvents = groupDateRangeEvents(events)
  
  // Then filter grouped events for current month
  const getGroupedEventsForCurrentMonth = () => {
    return allGroupedEvents.filter(event => {
      const eventDate = event.date
      return eventDate.getMonth() === month &&
             eventDate.getFullYear() === year
    })
  }

  const groupedCurrentMonthEvents = getGroupedEventsForCurrentMonth()

  // Get all upcoming club events (from today onwards, across all months)
  const getAllUpcomingClubEvents = () => {
    const todayDate = new Date(today)
    todayDate.setHours(0, 0, 0, 0)
    
    return allGroupedEvents
      .filter(event => {
        // Only show club events
        if (event.type !== 'club') return false
        
        const eventDate = new Date(event.date)
        eventDate.setHours(0, 0, 0, 0)
        
        return eventDate >= todayDate
      })
      .sort((a, b) => a.date.getTime() - b.date.getTime())
      .slice(0, 5) // Show top 5 upcoming club events
  }

  // Get suggested past club events (excluding the current event)
  const getSuggestedPastClubEvents = (currentEventId: string, limit: number = 3) => {
    const todayDate = new Date(today)
    todayDate.setHours(0, 0, 0, 0)
    
    return allGroupedEvents
      .filter(event => {
        // Only show past club events
        if (event.type !== 'club') return false
        if (event.id === currentEventId) return false // Exclude current event
        
        const eventDate = new Date(event.date)
        eventDate.setHours(0, 0, 0, 0)
        
        return eventDate < todayDate
      })
      .sort((a, b) => b.date.getTime() - a.date.getTime()) // Most recent first
      .slice(0, limit)
  }

  const highlightedUpcomingEvents = getAllUpcomingClubEvents()

  // Group events by category
  const groupEventsByCategory = (eventsList: CalendarEvent[]) => {
    // Then group by category
    const grouped: Record<string, CalendarEvent[]> = {}
    eventsList.forEach(event => {
      const category = getEventCategory(event)
      if (!grouped[category]) {
        grouped[category] = []
      }
      grouped[category].push(event)
    })
    return grouped
  }

  // Separate grouped events into upcoming and past
  const upcomingGroupedEvents = groupedCurrentMonthEvents
    .filter(event => {
      const eventDate = new Date(event.date)
      eventDate.setHours(0, 0, 0, 0)
      const todayDate = new Date(today)
      return eventDate >= todayDate
    })
    .sort((a, b) => a.date.getTime() - b.date.getTime())

  const pastGroupedEvents = groupedCurrentMonthEvents
    .filter(event => {
      const eventDate = new Date(event.date)
      eventDate.setHours(0, 0, 0, 0)
      const todayDate = new Date(today)
      return eventDate < todayDate
    })
    .sort((a, b) => a.date.getTime() - b.date.getTime())

  const upcomingByCategory = groupEventsByCategory(upcomingGroupedEvents)
  const pastByCategory = groupEventsByCategory(pastGroupedEvents)

  const getEventColor = (type: 'holiday' | 'school' | 'club') => {
    switch (type) {
      case 'holiday':
        return 'var(--color-pink-medium)' // Pink for holidays
      case 'school':
        return 'var(--color-brown-medium)' // Orange for school events
      case 'club':
        return 'var(--color-brown-medium)' // Orange for club events
      default:
        return 'var(--color-brown-medium)'
    }
  }

  // Helper function to get event color with opacity (returns rgba string)
  const getEventColorWithOpacity = (type: 'holiday' | 'school' | 'club', opacity: number) => {
    // Convert hex to rgb for the new color palette
    // #D18E97 = rgb(209, 142, 151) - muted rose (holiday)
    // #BC5727 = rgb(188, 87, 39) - burnt orange (school)
    // #D2A432 = rgb(210, 164, 50) - gold (club)
    const colors: Record<'holiday' | 'school' | 'club', string> = {
      'holiday': '209, 142, 151', // #D18E97
      'school': '188, 87, 39',    // #BC5727
      'club': '188, 87, 39'       // #BC5727 (orange)
    }
    return `rgba(${colors[type]}, ${opacity})`
  }

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev)
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1)
        // Don't allow going before August 2025
        if (newDate < clubStartDate) {
          return new Date(2025, 7, 1) // Return to August 2025
        }
      } else {
        newDate.setMonth(prev.getMonth() + 1)
      }
      return newDate
    })
  }

  const goToToday = () => {
    const today = new Date()
    // If today is before club start, go to August 2025 instead
    if (today < clubStartDate) {
      setCurrentDate(new Date(2025, 7, 1))
    } else {
      setCurrentDate(today)
    }
  }


  // Check if we can navigate to previous month
  const canGoPrevMonth = () => {
    const prevMonth = new Date(currentDate)
    prevMonth.setMonth(currentDate.getMonth() - 1)
    return prevMonth >= clubStartDate
  }

  // Render modal based on event type
  const renderModal = () => {
    if (!selectedEvent) return null
    
    const newsletterContent = getNewsletterContent(selectedEvent)
    const isClubEvent = selectedEvent.type === 'club'
    const isPastEvent = new Date(selectedEvent.date) < today
    
    // Newsletter-style modal for club events (especially past ones)
    if (isClubEvent && (newsletterContent || isPastEvent)) {
      const locationMatch = selectedEvent.description?.match(/(?:at|located at|in)\s+([^.]+)/i)
      
  return (
        <div 
          className="fixed inset-0 z-50 overflow-y-auto"
          style={{ background: 'rgba(0, 0, 0, 0.6)' }}
          onClick={() => setSelectedEvent(null)}
        >
          <div className="min-h-full flex items-start justify-center p-4 py-8">
            <div 
              className="rounded-3xl p-8 md:p-12 max-w-4xl w-full my-8 animate-popup relative"
              style={{ 
                background: 'var(--color-cream)',
                border: '3px solid var(--color-pink-medium)',
                boxShadow: '0 20px 60px rgba(244, 142, 184, 0.4)'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedEvent(null)}
                className="absolute top-6 right-6 text-3xl w-10 h-10 flex items-center justify-center rounded-full transition-all hover:scale-110 z-10"
                style={{ 
                  color: 'var(--color-brown-dark)',
                  background: 'rgba(152, 90, 64, 0.1)'
                }}
                aria-label="Close"
              >
                ×
              </button>

              {/* Newsletter Header */}
              <div className="mb-8 text-center">
                <div 
                  className="inline-block px-6 py-2 rounded-full mb-4"
                  style={{
                    background: getEventColor(selectedEvent.type),
                    color: 'var(--color-cream)',
                    fontFamily: 'var(--font-kollektif)',
                    fontSize: '14px',
                    letterSpacing: '0.1em'
                  }}
                >
                  EVENT RECAP
                </div>
                <h2 
                  className="text-4xl md:text-5xl font-bold mb-4"
                  style={{ 
                    fontFamily: 'var(--font-vintage-stylist)', 
                    color: 'var(--color-brown-dark)',
                    letterSpacing: '0.02em'
                  }}
                >
                  {newsletterContent?.title || selectedEvent.title.toUpperCase()}
                </h2>
                <p 
                  className="text-lg"
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

              {/* Newsletter Content */}
              {newsletterContent ? (
                <div className="space-y-6">
                  {newsletterContent.highlights && (
                    <div 
                      className="p-6 rounded-xl mb-6"
                      style={{
                        background: 'rgba(244, 142, 184, 0.1)',
                        border: '2px solid var(--color-pink-medium)'
                      }}
                    >
                      <h3 
                        className="text-xl font-bold mb-3"
                        style={{
                          fontFamily: 'var(--font-vintage-stylist)',
                          color: 'var(--color-brown-dark)'
                        }}
                      >
                        Event Highlights
                      </h3>
                      <ul className="space-y-2">
                        {newsletterContent.highlights.map((highlight, idx) => (
                          <li 
                            key={idx}
                            className="flex items-start gap-3"
                            style={{
                              fontFamily: 'var(--font-leiko)',
                              color: 'var(--color-brown-dark)'
                            }}
                          >
                            <span className="text-xl mt-1" style={{ color: 'var(--color-pink-medium)' }}>•</span>
                            <span>{highlight}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  <div className="space-y-4">
                    {newsletterContent.content.map((paragraph, idx) => (
                      <p 
                        key={idx}
                        className="text-lg leading-relaxed"
                        style={{ 
                          fontFamily: 'var(--font-leiko)', 
                          color: 'var(--color-brown-dark)'
                        }}
                      >
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {selectedEvent.description && (
                    <p 
                      className="text-lg leading-relaxed"
                      style={{ 
                        fontFamily: 'var(--font-leiko)', 
                        color: 'var(--color-brown-dark)'
                      }}
                    >
                      {selectedEvent.description.split('||END_DATE:')[0]}
                    </p>
                  )}
                </div>
              )}

              {/* Location if available */}
              {locationMatch && locationMatch[1] && (
                <div 
                  className="mt-8 pt-6 border-t"
                  style={{ borderColor: 'rgba(152, 90, 64, 0.2)' }}
                >
                  <div className="flex items-center gap-3">
                    <svg className="w-6 h-6" style={{ color: 'var(--color-brown-medium)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span
                      className="text-lg"
                      style={{
                        fontFamily: 'var(--font-leiko)',
                        color: 'var(--color-brown-medium)'
                      }}
                    >
                      {locationMatch[1].trim()}
                    </span>
                  </div>
                </div>
              )}

              {/* Suggested Past Event Reads */}
              {(() => {
                if (!selectedEvent?.id) return null
                const suggestedEvents = getSuggestedPastClubEvents(selectedEvent.id, 3)
                if (suggestedEvents.length === 0) return null
                
                return (
                  <div 
                    className="mt-12 pt-8 border-t"
                    style={{ borderColor: 'rgba(152, 90, 64, 0.2)' }}
                  >
                    <h3 
                      className="text-2xl font-bold mb-6"
                      style={{
                        fontFamily: 'var(--font-vintage-stylist)',
                        color: 'var(--color-brown-dark)',
                        letterSpacing: '0.02em'
                      }}
                    >
                      Suggested Past Event Reads
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {suggestedEvents.map(event => {
                        const eventDate = new Date(event.date)
                        const locationMatch = event.description?.match(/(?:at|located at|in)\s+([^.]+)/i)
                        
                        return (
                          <div
                            key={event.id}
                            className="p-4 rounded-xl cursor-pointer transition-all duration-200 hover:scale-[1.02]"
                            style={{
                              background: 'rgba(244, 142, 184, 0.1)',
                              border: '2px solid var(--color-pink-medium)'
                            }}
                            onClick={() => {
                              setSelectedEvent(null)
                              setTimeout(() => setSelectedEvent(event), 100)
                            }}
                          >
                            <div 
                              className="text-xs font-semibold mb-2"
                              style={{
                                fontFamily: 'var(--font-kollektif)',
                                color: 'var(--color-brown-medium)',
                                letterSpacing: '0.05em'
                              }}
                            >
                              {eventDate.toLocaleDateString('en-US', { 
                                month: 'short', 
                                day: 'numeric',
                                year: 'numeric'
                              })}
                            </div>
                            <h4 
                              className="text-base font-bold mb-2"
                              style={{
                                fontFamily: 'var(--font-vintage-stylist)',
                                color: 'var(--color-brown-dark)',
                                letterSpacing: '0.01em'
                              }}
                            >
                              {event.title.toUpperCase()}
                            </h4>
                            {locationMatch && (
                              <p 
                                className="text-sm line-clamp-1"
                                style={{
                                  fontFamily: 'var(--font-leiko)',
                                  color: 'var(--color-brown-medium)'
                                }}
                              >
                                {locationMatch[1].trim()}
                              </p>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )
              })()}
            </div>
          </div>
        </div>
      )
    }
    
    // Simple popup for school/holiday events
    return (
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ background: 'rgba(0, 0, 0, 0.5)' }}
        onClick={() => setSelectedEvent(null)}
      >
        <div 
          className="rounded-2xl p-8 md:p-10 max-w-lg w-full animate-popup"
          style={{ 
            background: 'var(--color-cream)',
            border: '3px solid var(--color-brown-medium)',
            boxShadow: '0 12px 40px rgba(100, 50, 27, 0.3)'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-start justify-between mb-6">
            <h3 
              className="text-3xl md:text-4xl font-bold pr-4"
              style={{ 
                fontFamily: 'var(--font-vintage-stylist)', 
                color: 'var(--color-brown-dark)'
              }}
            >
              {selectedEvent.title}
            </h3>
            <button
              onClick={() => setSelectedEvent(null)}
              className="text-3xl w-10 h-10 flex items-center justify-center rounded-full transition-all hover:scale-110"
              style={{ 
                color: 'var(--color-brown-dark)',
                background: 'rgba(152, 90, 64, 0.1)'
              }}
              aria-label="Close"
            >
              ×
            </button>
          </div>
          <p 
            className="text-lg mb-6"
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
          {selectedEvent.description && (
            <p 
              className="text-base leading-relaxed mb-6"
              style={{ 
                fontFamily: 'var(--font-leiko)', 
                color: 'var(--color-brown-dark)'
              }}
            >
              {selectedEvent.description.split('||END_DATE:')[0]}
            </p>
          )}
          <div 
            className="inline-block px-5 py-2 rounded-lg text-sm font-semibold"
            style={{
              background: getEventColor(selectedEvent.type),
              color: 'var(--color-cream)',
              fontFamily: 'var(--font-kollektif)',
              letterSpacing: '0.05em'
            }}
          >
            {selectedEvent.type.charAt(0).toUpperCase() + selectedEvent.type.slice(1).toUpperCase()} EVENT
          </div>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen pt-[100px] pb-16" style={{ 
      background: 'var(--color-cream)'
    }}>
      <div className="max-w-5xl mx-auto px-4 md:px-8 py-8">
        {/* Upcoming Events Section - Feature Highlight */}
        {highlightedUpcomingEvents.length > 0 && (
          <div className="mb-16 relative">
            {/* Decorative background element */}
            <div 
              className="absolute -top-4 -left-4 w-32 h-32 rounded-full opacity-10"
              style={{ background: 'var(--color-pink-medium)' }}
            />
            
            {/* Header with decorative elements */}
            <div className="relative mb-10">
              <div className="flex items-center gap-4 mb-4">
                <div 
                  className="h-1 flex-1 rounded-full"
                  style={{ background: 'var(--color-olive)', opacity: 0.2 }}
                />
                <div 
                  className="px-6 py-2 rounded-full"
                  style={{
                    background: 'var(--color-pink-medium)',
                    color: 'var(--color-cream)',
                    fontFamily: 'var(--font-kollektif)',
                    fontSize: '12px',
                    letterSpacing: '0.15em',
                    fontWeight: 'bold'
                  }}
                >
                  FEATURED
                </div>
                <div 
                  className="h-1 flex-1 rounded-full"
                  style={{ background: 'var(--color-olive)', opacity: 0.2 }}
                />
              </div>
              <h2
                className="text-4xl md:text-5xl font-bold text-center"
                style={{
                  fontFamily: 'var(--font-vintage-stylist)',
                  color: 'var(--color-brown-dark)',
                  letterSpacing: '0.08em',
                  textShadow: '0 2px 8px rgba(244, 142, 184, 0.2)'
                }}
              >
                UPCOMING CLUB EVENTS
        </h2>
              <p 
                className="text-center mt-3"
                style={{
                  fontFamily: 'var(--font-leiko)',
                  color: 'var(--color-brown-medium)',
                  fontSize: '16px'
                }}
              >
                Don&apos;t miss out on these exciting opportunities to connect and make a difference
              </p>
            </div>

            {/* Events Grid - Redesigned Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {highlightedUpcomingEvents.map((event: CalendarEvent) => {
                const eventDate = new Date(event.date)
                const dayOfWeek = eventDate.getDay()
                const dayName = weekDaysShort[dayOfWeek].toUpperCase()
                const dayNumber = eventDate.getDate().toString().padStart(2, '0')
                const monthName = monthNames[eventDate.getMonth()].substring(0, 3).toUpperCase()
                
                const dateRangeTitles = ['Reading Week', 'Exam Period', 'Exam Period (Session A)', 'Exam Period (Session B)', 'Exam Period (Session C)', 'Easter Break']
                const isDateRange = dateRangeTitles.includes(event.title) || event.title.startsWith('Exam Period')
                const endDateMatch = event.description?.match(/\|\|END_DATE:(\d+)/)
                
                const locationMatch = event.description?.match(/(?:at|located at|in)\s+([^.]+)/i)
                const location = locationMatch ? locationMatch[1].trim() : null
                
                return (
                  <div
                    key={event.id}
                    className="group relative cursor-pointer transition-all duration-300 hover:scale-[1.03]"
                    onClick={() => setSelectedEvent(event)}
                  >
                    {/* Card with solid background */}
                    <div
                      className="rounded-3xl p-8 relative overflow-hidden h-full"
                      style={{
                        background: 'var(--color-cream)',
                        border: '3px solid var(--color-pink-medium)',
                        boxShadow: '0 8px 32px rgba(244, 142, 184, 0.25), 0 4px 16px rgba(100, 50, 27, 0.1)'
                      }}
                    >
                      {/* Decorative corner accent */}
                      <div 
                        className="absolute top-0 right-0 w-24 h-24 rounded-bl-full opacity-20"
                        style={{ background: 'var(--color-pink-medium)' }}
                      />
                      
                      {/* Date Badge - Redesigned */}
                      <div className="flex items-start justify-between mb-6 relative z-10">
                        <div 
                          className="px-5 py-3 rounded-2xl"
                          style={{
                            background: 'var(--color-pink-medium)',
                            boxShadow: '0 4px 12px rgba(244, 142, 184, 0.4)'
                          }}
                        >
                          <div className="text-center">
                            <div
                              className="text-xs font-bold mb-1"
                              style={{
                                fontFamily: 'var(--font-kollektif)',
                                color: 'var(--color-cream)',
                                letterSpacing: '0.15em'
                              }}
                            >
                              {dayName}
                            </div>
                            <div
                              className="text-3xl font-bold leading-none"
                              style={{
                                fontFamily: 'var(--font-kollektif)',
                                color: 'var(--color-cream)'
                              }}
                            >
                              {dayNumber}
                            </div>
                            <div
                              className="text-xs font-bold mt-1"
                              style={{
                                fontFamily: 'var(--font-kollektif)',
                                color: 'var(--color-cream)',
                                letterSpacing: '0.1em'
                              }}
                            >
                              {monthName}
                            </div>
                          </div>
                        </div>
                        
                        {/* Event Type Icon - Larger and more prominent */}
                        <div 
                          className="w-20 h-20 rounded-2xl flex items-center justify-center flex-shrink-0"
                          style={{
                            background: 'var(--color-pink-medium)',
                            boxShadow: '0 6px 20px rgba(244, 142, 184, 0.4)'
                          }}
                        >
                          {event.type === 'holiday' ? (
                            <svg className="w-10 h-10" style={{ color: 'var(--color-cream)' }} fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                            </svg>
                          ) : event.type === 'school' ? (
                            <svg className="w-10 h-10" style={{ color: 'var(--color-cream)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                          ) : (
                            <svg className="w-10 h-10" style={{ color: 'var(--color-cream)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                          )}
                        </div>
                      </div>
                      
                      {/* Event Title - More prominent */}
                      <h3
                        className="text-2xl md:text-3xl font-bold mb-4 relative z-10"
                        style={{
                          fontFamily: 'var(--font-vintage-stylist)',
                          color: 'var(--color-brown-dark)',
                          letterSpacing: '0.03em',
                          lineHeight: '1.2'
                        }}
                      >
                        {event.title.toUpperCase()}
                        {isDateRange && endDateMatch && (
                          <span className="text-base font-normal ml-2 block mt-2" style={{ color: 'var(--color-brown-medium)' }}>
                            ({event.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {new Date(parseInt(endDateMatch[1])).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })})
                          </span>
                        )}
                      </h3>
                      
                      {/* Location - Enhanced */}
                      {location && (
                        <div className="flex items-center gap-3 mb-4 relative z-10">
                          <div 
                            className="p-2 rounded-lg"
                            style={{
                              background: 'rgba(152, 90, 64, 0.1)'
                            }}
                          >
                            <svg className="w-5 h-5" style={{ color: 'var(--color-brown-medium)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                          </div>
                          <span
                            className="text-base font-medium"
                            style={{
                              fontFamily: 'var(--font-leiko)',
                              color: 'var(--color-brown-dark)'
                            }}
                          >
                            {location}
                          </span>
                        </div>
                      )}
                      
                      {/* Description - Better styled */}
                      {event.description && (
                        <p
                          className="text-base mb-5 line-clamp-3 relative z-10 leading-relaxed"
                          style={{
                            fontFamily: 'var(--font-leiko)',
                            color: 'var(--color-brown-medium)'
                          }}
                        >
                          {event.description.split('||END_DATE:')[0]}
                        </p>
                      )}
                      
                      {/* Category Tag - Enhanced */}
                      <div className="flex items-center justify-between relative z-10">
                        <span
                          className="px-4 py-2 rounded-xl text-sm font-bold"
                          style={{
                            fontFamily: 'var(--font-kollektif)',
                            background: 'var(--color-pink-medium)',
                            color: 'var(--color-cream)',
                            letterSpacing: '0.08em',
                            boxShadow: '0 4px 12px rgba(244, 142, 184, 0.3)'
                          }}
                        >
                          {event.type.toUpperCase()}
                        </span>
                        {/* Arrow indicator */}
                        <div className="flex items-center gap-2">
                          <span
                            className="text-sm font-semibold"
                            style={{
                              fontFamily: 'var(--font-kollektif)',
                              color: 'var(--color-brown-medium)',
                              letterSpacing: '0.05em'
                            }}
                          >
                            VIEW DETAILS
                          </span>
                          <svg 
                            className="w-5 h-5 transform group-hover:translate-x-1 transition-transform"
                            style={{ color: 'var(--color-pink-medium)' }}
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Header - Redesigned */}
        <div className="mb-12 relative">
          {/* Decorative background elements */}
          <div 
            className="absolute -top-8 -left-8 w-40 h-40 rounded-full opacity-5"
            style={{ background: 'var(--color-pink-medium)' }}
          />
          <div 
            className="absolute -top-4 -right-4 w-32 h-32 rounded-full opacity-5"
            style={{ background: 'var(--color-brown-medium)' }}
          />
          
          <div className="relative">
            {/* Header with decorative line */}
            <div className="flex items-center gap-4 mb-6">
              <div 
                className="h-1 flex-1 rounded-full"
                style={{ background: 'var(--color-pink-medium)', opacity: 0.3 }}
              />
              <div 
                className="px-6 py-2 rounded-full"
                style={{
                  background: 'var(--color-pink-medium)',
                  color: 'var(--color-cream)',
                  fontFamily: 'var(--font-kollektif)',
                  fontSize: '11px',
                  letterSpacing: '0.2em',
                  fontWeight: 'bold',
                  boxShadow: '0 4px 12px rgba(244, 142, 184, 0.3)'
                }}
              >
                EXPLORE
              </div>
              <div 
                className="h-1 flex-1 rounded-full"
                style={{ background: 'var(--color-pink-medium)', opacity: 0.3 }}
              />
            </div>
            
            <div className="flex items-start justify-between mb-8 flex-wrap gap-6">
              <div className="flex-1 min-w-[280px]">
                <h1 
                  className="text-5xl md:text-6xl font-bold mb-4"
                  style={{ 
                    fontFamily: 'var(--font-vintage-stylist)', 
                    color: 'var(--color-brown-dark)',
                    letterSpacing: '0.03em',
                    textShadow: '0 2px 8px rgba(244, 142, 184, 0.15)',
                    lineHeight: '1.1'
                  }}
                >
                  ALL EVENTS
                </h1>
                <p 
                  className="text-lg md:text-xl"
                  style={{ 
                    fontFamily: 'var(--font-leiko)', 
                    color: 'var(--color-brown-medium)',
                    lineHeight: '1.6'
                  }}
                >
                  Discover upcoming opportunities, school schedules, and special occasions
                </p>
              </div>
              
              {/* Enhanced Navigation Controls */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => navigateMonth('prev')}
                  disabled={!canGoPrevMonth()}
                  className="p-3 rounded-xl transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed hover:scale-110"
                  style={{ 
                    fontFamily: 'var(--font-kollektif)',
                    color: 'var(--color-cream)',
                    background: 'var(--color-brown-medium)',
                    border: '2px solid var(--color-brown-medium)',
                    boxShadow: '0 4px 12px rgba(188, 87, 39, 0.3)'
                  }}
                  aria-label="Previous month"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <div 
                  className="px-6 py-3 rounded-xl font-bold text-base min-w-[160px] text-center"
                  style={{ 
                    fontFamily: 'var(--font-kollektif)',
                    background: 'var(--color-pink-medium)',
                    color: 'var(--color-cream)',
                    letterSpacing: '0.05em',
                    boxShadow: '0 6px 20px rgba(209, 142, 151, 0.3)'
                  }}
                >
                  {monthNames[currentDate.getMonth()].toUpperCase()} {currentDate.getFullYear()}
                </div>
                <button
                  onClick={() => navigateMonth('next')}
                  className="p-3 rounded-xl transition-all duration-200 hover:scale-110"
                  style={{ 
                    fontFamily: 'var(--font-kollektif)',
                    color: 'var(--color-cream)',
                    background: 'var(--color-brown-medium)',
                    border: '2px solid var(--color-brown-medium)',
                    boxShadow: '0 4px 12px rgba(188, 87, 39, 0.3)'
                  }}
                  aria-label="Next month"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
                <button
                  onClick={goToToday}
                  className="px-5 py-3 rounded-xl transition-all duration-200 font-bold text-sm hover:scale-105"
                  style={{ 
                    fontFamily: 'var(--font-kollektif)',
                    color: 'var(--color-cream)',
                    background: 'var(--color-brown-medium)',
                    letterSpacing: '0.08em',
                    boxShadow: '0 6px 20px rgba(188, 87, 39, 0.4)'
                  }}
                  aria-label="Go to today"
                >
                  TODAY
                </button>
              </div>
            </div>

            {/* Enhanced Search Bar */}
            <div className="relative">
              <div 
                className="absolute inset-0 rounded-2xl opacity-20 blur-xl"
                style={{ background: 'var(--color-pink-medium)' }}
              />
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search for events, locations, or keywords..."
                  className="w-full px-6 py-4 pl-14 rounded-2xl border-2 focus:outline-none transition-all duration-200 focus:scale-[1.01]"
                  style={{ 
                    fontFamily: 'var(--font-kollektif)',
                    background: 'var(--color-cream)',
                    borderColor: 'var(--color-pink-medium)',
                    color: 'var(--color-brown-dark)',
                    fontSize: '16px',
                    letterSpacing: '0.03em',
                    boxShadow: '0 8px 24px rgba(209, 142, 151, 0.15)'
                  }}
                />
                <div 
                  className="absolute left-5 top-1/2 transform -translate-y-1/2 p-2 rounded-lg"
                  style={{
                    background: 'rgba(209, 142, 151, 0.1)'
                  }}
                >
                  <svg 
                    className="w-6 h-6"
                    style={{ color: 'var(--color-pink-medium)' }}
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Events List - Redesigned */}
        <div className="space-y-6">
          {currentMonthDays
            .filter((date: Date) => {
              const dayEvents = getGroupedEventsForDate(date)
              return dayEvents.length > 0
            })
            .flatMap((date: Date) => {
              const dayEvents = getGroupedEventsForDate(date)
              const dayOfWeek = date.getDay()
              const isWeekend = dayOfWeek === 0 || dayOfWeek === 6
              const dayName = weekDaysShort[dayOfWeek].toUpperCase()
              const dayNumber = date.getDate().toString().padStart(2, '0')
              const monthName = monthNames[date.getMonth()].substring(0, 3).toUpperCase()

              return dayEvents.map((event, eventIndex) => {
                const dateRangeTitles = ['Reading Week', 'Exam Period', 'Exam Period (Session A)', 'Exam Period (Session B)', 'Exam Period (Session C)', 'Easter Break']
                const isDateRange = dateRangeTitles.includes(event.title) || event.title.startsWith('Exam Period')
                const endDateMatch = event.description?.match(/\|\|END_DATE:(\d+)/)
                
                // Extract location from description if available
                const locationMatch = event.description?.match(/(?:at|located at|in)\s+([^.]+)/i)
                const location = locationMatch ? locationMatch[1].trim() : null
                
                return (
                  <div
                    key={`${date.getTime()}-${event.id}-${eventIndex}`}
                    className="group relative cursor-pointer transition-all duration-300 hover:scale-[1.01]"
                    onClick={() => setSelectedEvent(event)}
                  >
                    {/* Card with solid background and shadow */}
                    <div
                      className="rounded-3xl p-8 relative overflow-hidden"
            style={{ 
              background: 'var(--color-cream)',
                        border: '3px solid var(--color-pink-medium)',
                        boxShadow: '0 8px 32px rgba(244, 142, 184, 0.2), 0 4px 16px rgba(100, 50, 27, 0.08)'
                      }}
                    >
                      {/* Decorative corner accent */}
                      <div 
                        className="absolute top-0 right-0 w-32 h-32 rounded-bl-full opacity-10 group-hover:opacity-20 transition-opacity"
                        style={{ background: 'var(--color-pink-medium)' }}
                      />
                      
                      <div className="flex items-start gap-8 relative z-10">
                        {/* Date Badge - Redesigned */}
                        <div className="flex-shrink-0">
                          <div 
                            className="px-6 py-4 rounded-2xl text-center"
                            style={{
                              background: isWeekend 
                                ? 'var(--color-pink-medium)'
                                : 'var(--color-brown-medium)',
                              boxShadow: '0 6px 20px rgba(244, 142, 184, 0.3)',
                              minWidth: '90px'
                            }}
                          >
                            <div
                              className="text-xs font-bold mb-1"
                              style={{
                                fontFamily: 'var(--font-kollektif)',
                                color: 'var(--color-cream)',
                                letterSpacing: '0.15em'
                              }}
                            >
                              {dayName}
                            </div>
                            <div
                              className="text-4xl font-bold leading-none"
                              style={{
                                fontFamily: 'var(--font-kollektif)',
                                color: 'var(--color-cream)'
                              }}
                            >
                              {dayNumber}
                            </div>
                            <div
                              className="text-xs font-bold mt-1"
                              style={{
                                fontFamily: 'var(--font-kollektif)',
                                color: 'var(--color-cream)',
                                letterSpacing: '0.1em'
                              }}
                            >
                              {monthName}
                            </div>
                          </div>
                        </div>

                        {/* Event Type Icon - Enhanced */}
                        <div 
                          className="flex-shrink-0 w-44 h-44 rounded-2xl flex items-center justify-center"
                          style={{
                            background: getEventColorWithOpacity(event.type, 0.2),
                            border: `4px solid ${getEventColor(event.type)}`,
                            boxShadow: `0 8px 24px ${getEventColorWithOpacity(event.type, 0.3)}`
                          }}
                        >
                          {event.type === 'holiday' ? (
                            <svg className="w-24 h-24" style={{ color: getEventColor(event.type) }} fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                            </svg>
                          ) : event.type === 'school' ? (
                            <svg className="w-24 h-24" style={{ color: getEventColor(event.type) }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                          ) : (
                            <svg className="w-24 h-24" style={{ color: getEventColor(event.type) }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                          )}
                        </div>

                        {/* Event Details - Enhanced */}
                        <div className="flex-1 min-w-0">
                          <h3
                            className="text-3xl md:text-4xl font-bold mb-4"
                            style={{
                              fontFamily: 'var(--font-vintage-stylist)',
                              color: 'var(--color-brown-dark)',
                              letterSpacing: '0.02em',
                              lineHeight: '1.2'
                            }}
                          >
                            {event.title.toUpperCase()}
                            {isDateRange && endDateMatch && (
                              <span className="text-lg font-normal ml-3 block mt-2" style={{ color: 'var(--color-brown-medium)' }}>
                                {event.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {new Date(parseInt(endDateMatch[1])).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                              </span>
                            )}
                          </h3>
                          
                          {location && (
                            <div className="flex items-center gap-3 mb-4">
                              <div 
                                className="p-2 rounded-lg"
                                style={{
                                  background: 'rgba(152, 90, 64, 0.12)'
                                }}
                              >
                                <svg className="w-6 h-6" style={{ color: 'var(--color-brown-medium)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                              </div>
                              <span
                                className="text-lg font-medium"
                                style={{
                                  fontFamily: 'var(--font-leiko)',
                                  color: 'var(--color-brown-dark)'
                                }}
                              >
                                {location}
                              </span>
                            </div>
                          )}

                          {event.description && (
                            <p
                              className="text-lg mb-5 leading-relaxed"
                              style={{
                                fontFamily: 'var(--font-leiko)',
                                color: 'var(--color-brown-medium)',
                                lineHeight: '1.7'
                              }}
                            >
                              {event.description.split('||END_DATE:')[0]}
                            </p>
                          )}

                          {/* Category Tags - Enhanced */}
                          <div className="flex flex-wrap gap-3 items-center">
                            <span
                              className="px-5 py-2.5 text-sm rounded-xl font-bold"
                              style={{
                                fontFamily: 'var(--font-kollektif)',
                                background: getEventColor(event.type),
                                color: 'var(--color-cream)',
                                letterSpacing: '0.08em',
                                boxShadow: `0 4px 12px ${getEventColorWithOpacity(event.type, 0.4)}`
                              }}
                            >
                              {event.type.toUpperCase()}
                            </span>
                            {getEventCategory(event) !== 'Events' && (
                              <span
                                className="px-5 py-2.5 text-sm rounded-xl font-bold"
                                style={{
                                  fontFamily: 'var(--font-kollektif)',
                                  background: 'rgba(152, 90, 64, 0.2)',
                                  color: 'var(--color-brown-dark)',
                                  letterSpacing: '0.05em'
                                }}
                              >
                                {getEventCategory(event).toUpperCase()}
                              </span>
                            )}
                            <div className="ml-auto flex items-center gap-2">
                              <span
                                className="text-sm font-semibold"
                                style={{
                                  fontFamily: 'var(--font-kollektif)',
                                  color: 'var(--color-brown-medium)',
                                  letterSpacing: '0.05em'
                                }}
                              >
                                VIEW DETAILS
                              </span>
                              <svg 
                                className="w-6 h-6 transform group-hover:translate-x-2 transition-transform"
                                style={{ color: 'var(--color-pink-medium)' }}
                                fill="none" 
                                stroke="currentColor" 
                                viewBox="0 0 24 24"
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                              </svg>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })
            })}
        </div>

        {/* Legend - Redesigned */}
        <div className="mt-16 pt-12 relative">
          {/* Decorative line */}
          <div className="flex items-center gap-4 mb-8">
            <div 
              className="h-1 flex-1 rounded-full"
              style={{ background: 'var(--color-olive)', opacity: 0.2 }}
            />
            <div 
              className="px-6 py-2 rounded-full"
              style={{
                background: 'var(--color-pink-medium)',
                color: 'var(--color-cream)',
                fontFamily: 'var(--font-kollektif)',
                fontSize: '11px',
                letterSpacing: '0.2em',
                fontWeight: 'bold'
              }}
            >
              LEGEND
            </div>
            <div 
              className="h-1 flex-1 rounded-full"
              style={{ background: 'var(--color-olive)', opacity: 0.2 }}
            />
          </div>
          
          <div className="flex flex-wrap items-center justify-center gap-10">
            <div 
              className="flex items-center gap-4 px-6 py-4 rounded-2xl"
              style={{
                background: 'rgba(209, 142, 151, 0.15)',
                border: '2px solid var(--color-pink-medium)'
              }}
            >
              <div 
                className="w-16 h-16 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{
                  background: 'var(--color-pink-medium)',
                  boxShadow: '0 4px 12px rgba(244, 142, 184, 0.4)'
                }}
              >
                <svg className="w-8 h-8" style={{ color: 'var(--color-cream)' }} fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
              </div>
              <span style={{ 
                fontFamily: 'var(--font-kollektif)', 
                color: 'var(--color-brown-dark)',
                fontSize: '16px',
                letterSpacing: '0.08em',
                fontWeight: 'bold'
              }}>
                HOLIDAY
              </span>
            </div>
            <div 
              className="flex items-center gap-4 px-6 py-4 rounded-2xl"
              style={{
                background: 'rgba(188, 87, 39, 0.15)',
              border: '2px solid var(--color-brown-medium)'
            }}
          >
              <div 
                className="w-16 h-16 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{
                  background: 'var(--color-brown-medium)',
                  boxShadow: '0 4px 12px rgba(152, 90, 64, 0.4)'
                }}
              >
                <svg className="w-8 h-8" style={{ color: 'var(--color-cream)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <span style={{ 
                fontFamily: 'var(--font-kollektif)', 
                color: 'var(--color-brown-dark)',
                fontSize: '16px',
                letterSpacing: '0.08em',
                fontWeight: 'bold'
              }}>
                SCHOOL EVENT
              </span>
            </div>
            <div 
              className="flex items-center gap-4 px-6 py-4 rounded-2xl"
              style={{
                background: 'rgba(188, 87, 39, 0.15)',
                border: '2px solid var(--color-brown-medium)'
              }}
            >
              <div 
                className="w-16 h-16 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{
                  background: 'var(--color-brown-medium)',
                  boxShadow: '0 4px 12px rgba(188, 87, 39, 0.4)'
                }}
              >
                <svg className="w-8 h-8" style={{ color: 'var(--color-cream)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <span style={{ 
                fontFamily: 'var(--font-kollektif)', 
                color: 'var(--color-brown-dark)',
                fontSize: '16px',
                letterSpacing: '0.08em',
                fontWeight: 'bold'
              }}>
                CLUB EVENT
              </span>
            </div>
          </div>
        </div>

        {/* Monthly Events Detail Section */}
        {currentMonthEvents.length > 0 && (
          <div className="mt-16 md:mt-20">
            <h2 
              className="text-4xl md:text-5xl font-bold mb-12"
              style={{ 
                fontFamily: 'var(--font-vintage-stylist)', 
                color: 'var(--color-brown-dark)',
                letterSpacing: '0.02em'
              }}
            >
              {monthNames[month]} {year} Events
            </h2>

            {/* Upcoming Events */}
            {upcomingMonthEvents.length > 0 && (
              <div className="mb-16">
                <h3 
                  className="text-2xl md:text-3xl font-bold mb-8"
                  style={{ 
                    fontFamily: 'var(--font-vintage-stylist)', 
                    color: 'var(--color-brown-dark)',
                    letterSpacing: '0.05em'
                  }}
                >
                  Upcoming
            </h3>
                {Object.entries(upcomingByCategory).map(([category, categoryEvents]) => (
                  <div key={category} className="mb-12">
                    <h4 
                      className="text-xl md:text-2xl font-bold mb-6"
                      style={{ 
                        fontFamily: 'var(--font-vintage-stylist)', 
                        color: 'var(--color-brown-medium)',
                        letterSpacing: '0.03em'
                      }}
                    >
                      {category}
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {categoryEvents.map(event => {
                        const eventDate = new Date(event.date)
                        eventDate.setHours(0, 0, 0, 0)
                        const todayDate = new Date(today)
                        todayDate.setHours(0, 0, 0, 0)
                        
                        // Check if today falls within a date range event
                        let isToday = false
                        const dateRangeTitles = ['Reading Week', 'Exam Period', 'Exam Period (Session A)', 'Exam Period (Session B)', 'Exam Period (Session C)', 'Easter Break']
                        if (dateRangeTitles.includes(event.title) || event.title.startsWith('Exam Period')) {
                          // Parse end date from description
                          const endDateMatch = event.description?.match(/\|\|END_DATE:(\d+)/)
                          if (endDateMatch) {
                            const endDate = new Date(parseInt(endDateMatch[1]))
                            endDate.setHours(0, 0, 0, 0)
                            isToday = todayDate >= eventDate && todayDate <= endDate
                          } else {
                            // Fallback: check if event date matches today
                            isToday = eventDate.getTime() === todayDate.getTime()
                          }
                        } else {
                          // For single-day events, check if date matches today
                          isToday = eventDate.getTime() === todayDate.getTime()
                        }

                        return (
                          <div
                            key={event.id}
                            className="group relative p-8 rounded-3xl transition-all duration-300 hover:scale-[1.02] cursor-pointer overflow-hidden"
                            style={{ 
                              background: 'var(--color-cream)',
                              border: `3px solid ${getEventColor(event.type)}`,
                              boxShadow: isToday 
                                ? '0 12px 40px rgba(244, 142, 184, 0.4), 0 6px 20px rgba(244, 142, 184, 0.2)' 
                                : '0 8px 32px rgba(244, 142, 184, 0.2), 0 4px 16px rgba(100, 50, 27, 0.1)'
                            }}
                            onClick={() => setSelectedEvent(event)}
                          >
                            {/* Decorative corner accent */}
                            <div 
                              className="absolute top-0 right-0 w-24 h-24 rounded-bl-full opacity-10 group-hover:opacity-20 transition-opacity"
                              style={{ background: getEventColor(event.type) }}
                            />
                            
                            <div className="relative z-10">
                              <div className="flex items-start justify-between mb-5">
                                <div 
                                  className="px-5 py-2.5 rounded-xl text-sm font-bold"
                                  style={{
                                    background: getEventColor(event.type),
                                    color: 'var(--color-cream)',
                                    fontFamily: 'var(--font-kollektif)',
                                    letterSpacing: '0.08em',
                                    boxShadow: `0 4px 12px ${getEventColorWithOpacity(event.type, 0.4)}`
                                  }}
                                >
                                  {event.type.charAt(0).toUpperCase() + event.type.slice(1).toUpperCase()}
                                </div>
                                {isToday && (
                                  <span 
                                    className="text-sm font-bold px-4 py-2 rounded-xl"
                                    style={{ 
                                      fontFamily: 'var(--font-kollektif)',
                                      color: 'var(--color-cream)',
                                      background: 'var(--color-pink-medium)',
                                      letterSpacing: '0.08em',
                                      boxShadow: '0 4px 12px rgba(244, 142, 184, 0.4)'
                                    }}
                                  >
                                    TODAY
                                  </span>
                                )}
                              </div>
                              <h4 
                                className="text-2xl md:text-3xl font-bold mb-4"
                                style={{ 
                                  fontFamily: 'var(--font-vintage-stylist)', 
                                  color: 'var(--color-brown-dark)',
                                  letterSpacing: '0.02em',
                                  lineHeight: '1.2'
                                }}
                              >
                                {event.title.toUpperCase()}
                              </h4>
                        <p 
                          className="text-sm mb-3"
                          style={{ 
                            fontFamily: 'var(--font-kollektif)', 
                            color: 'var(--color-brown-medium)'
                          }}
                        >
                          {event.title === 'Reading Week' || event.title === 'Exam Period' || event.title.startsWith('Exam Period') || event.title === 'Easter Break'
                            ? (() => {
                                // Parse end date from description if available
                                const endDateMatch = event.description?.match(/\|\|END_DATE:(\d+)/)
                                const endDate = endDateMatch 
                                  ? new Date(parseInt(endDateMatch[1]))
                                  : new Date(eventDate.getTime() + (event.title === 'Reading Week' ? 6 : 13) * 24 * 60 * 60 * 1000)
                                return `${eventDate.toLocaleDateString('en-US', { 
                                  month: 'long', 
                                  day: 'numeric'
                                })} - ${endDate.toLocaleDateString('en-US', { 
                                  month: 'long', 
                                  day: 'numeric',
                                  year: 'numeric'
                                })}`
                              })()
                            : eventDate.toLocaleDateString('en-US', { 
                                weekday: 'long', 
                                month: 'long', 
                                day: 'numeric',
                                year: 'numeric'
                              })
                          }
                        </p>
                            {event.description && (
                              <p 
                                className="text-base leading-relaxed line-clamp-3 mb-4"
                                style={{ 
                                  fontFamily: 'var(--font-leiko)', 
                                  color: 'var(--color-brown-dark)'
                                }}
                              >
                                {event.description.split('||END_DATE:')[0]}
                              </p>
                            )}
          </div>
        </div>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Past Events in Current Month */}
            {pastMonthEvents.length > 0 && (
              <div>
                <h3 
                  className="text-xl md:text-2xl font-bold mb-6"
                  style={{ 
                    fontFamily: 'var(--font-freshwost)', 
                    color: 'var(--color-brown-dark)'
                  }}
                >
                  This Month
                </h3>
                {Object.entries(pastByCategory).map(([category, categoryEvents]) => (
                  <div key={category} className="mb-8">
                    <h4 
                      className="text-lg md:text-xl font-bold mb-4"
                      style={{ 
                        fontFamily: 'var(--font-freshwost)', 
                        color: 'var(--color-brown-medium)'
                      }}
                    >
                      {category}
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {categoryEvents.map(event => {
                        const eventDate = new Date(event.date)
                        eventDate.setHours(0, 0, 0, 0)
                        const todayDate = new Date(today)
                        todayDate.setHours(0, 0, 0, 0)
                        
                        // Check if today falls within a date range event
                        let isToday = false
                        const dateRangeTitles = ['Reading Week', 'Exam Period', 'Exam Period (Session A)', 'Exam Period (Session B)', 'Exam Period (Session C)', 'Easter Break']
                        if (dateRangeTitles.includes(event.title) || event.title.startsWith('Exam Period')) {
                          // Parse end date from description
                          const endDateMatch = event.description?.match(/\|\|END_DATE:(\d+)/)
                          if (endDateMatch) {
                            const endDate = new Date(parseInt(endDateMatch[1]))
                            endDate.setHours(0, 0, 0, 0)
                            isToday = todayDate >= eventDate && todayDate <= endDate
                          } else {
                            // Fallback: check if event date matches today
                            isToday = eventDate.getTime() === todayDate.getTime()
                          }
                        } else {
                          // For single-day events, check if date matches today
                          isToday = eventDate.getTime() === todayDate.getTime()
                        }

                        return (
                        <div
                          key={event.id}
                          className="p-6 rounded-xl transition-all duration-200 hover:scale-[1.02] cursor-pointer opacity-75"
                          style={{ 
                            background: 'var(--color-cream)',
                            border: '2px solid var(--color-brown-medium)',
                            boxShadow: '0 2px 8px rgba(100, 50, 27, 0.1)'
                          }}
                          onClick={() => setSelectedEvent(event)}
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div 
                              className="px-3 py-1 rounded-lg text-xs font-semibold"
                              style={{
                                background: getEventColor(event.type),
                                color: 'var(--color-cream)',
                                fontFamily: 'var(--font-kollektif)'
                              }}
                            >
                              {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                            </div>
                            {isToday && (
                              <span 
                                className="text-xs font-semibold"
                                style={{ 
                                  fontFamily: 'var(--font-kollektif)',
                                  color: 'var(--color-pink-medium)'
                                }}
                              >
                                Today
                              </span>
                            )}
                          </div>
                          <h4 
                            className="text-lg md:text-xl font-bold mb-2"
                            style={{ 
                              fontFamily: 'var(--font-vintage-stylist)', 
                              color: 'var(--color-brown-dark)'
                            }}
                          >
                            {event.title}
                          </h4>
                      <p 
                        className="text-sm mb-4"
                        style={{ 
                          fontFamily: 'var(--font-kollektif)', 
                          color: 'var(--color-brown-medium)'
                        }}
                      >
                        {event.title === 'Reading Week' || event.title === 'Exam Period' || event.title.startsWith('Exam Period') || event.title === 'Easter Break'
                          ? (() => {
                              // Parse end date from description if available
                              const endDateMatch = event.description?.match(/\|\|END_DATE:(\d+)/)
                              const endDate = endDateMatch 
                                ? new Date(parseInt(endDateMatch[1]))
                                : new Date(event.date.getTime() + (event.title === 'Reading Week' ? 6 : 13) * 24 * 60 * 60 * 1000)
                              return `${event.date.toLocaleDateString('en-US', { 
                                month: 'long', 
                                day: 'numeric'
                              })} - ${endDate.toLocaleDateString('en-US', { 
                                month: 'long', 
                                day: 'numeric',
                                year: 'numeric'
                              })}`
                            })()
                          : event.date.toLocaleDateString('en-US', { 
                              weekday: 'long', 
                              month: 'long', 
                              day: 'numeric',
                              year: 'numeric'
                            })
                        }
                      </p>
                      {event.description && (
                        <p 
                          className="text-base leading-relaxed line-clamp-3 mb-4"
                          style={{ 
                            fontFamily: 'var(--font-leiko)', 
                            color: 'var(--color-brown-dark)'
                          }}
                        >
                          {event.description.split('||END_DATE:')[0]}
                        </p>
                      )}
                        </div>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Event Detail Modal */}
        {renderModal()}

      </div>
    </main>
  )
}
