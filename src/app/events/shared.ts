import type { CalendarEvent } from './events'

export type DisplayEvent = CalendarEvent & { endDate?: Date }

export const MS_PER_DAY = 24 * 60 * 60 * 1000

export function normalizeDay(d: Date) {
  const copy = new Date(d)
  copy.setHours(0, 0, 0, 0)
  return copy
}

export function isConsecutiveDay(a: Date, b: Date) {
  return normalizeDay(b).getTime() - normalizeDay(a).getTime() === MS_PER_DAY
}

export function formatRange(start: Date, end?: Date) {
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

export function getTimeFromDescription(description?: string) {
  if (!description) return null
  const timeMatch = description.match(/(\d{1,2}:\d{2}\s*(?:AM|PM|am|pm))|(\d{1,2}\s*(?:AM|PM|am|pm))/i)
  return timeMatch ? timeMatch[0] : null
}

export function getLocationFromDescription(description?: string) {
  if (!description) return null
  const locationMatch = description.match(/(?:at|located at|in)\s+([^.]+)/i)
  return locationMatch ? locationMatch[1].trim() : null
}

export function getEventColor(type: CalendarEvent['type']) {
  switch (type) {
    case 'holiday':
      return 'var(--color-brown-medium)'
    case 'school':
    case 'club':
    default:
      return 'var(--color-brown-medium)'
  }
}

export function getEventTint(type: CalendarEvent['type']) {
  switch (type) {
    case 'holiday':
      return 'rgba(211, 165, 165, 0.12)'
    case 'school':
      return 'rgba(175, 121, 120, 0.10)'
    case 'club':
      return 'rgba(175, 121, 120, 0.06)'
    default:
      return 'rgba(175, 121, 120, 0.08)'
  }
}

export function mergeConsecutiveEvents(
  filteredBase: CalendarEvent[]
): DisplayEvent[] {
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
}
