/** Photo galleries for past club events (look-back memories). */
const CLUB_INFO = [
  '/assets/club-info/carousel.JPG',
  '/assets/club-info/carousel1.JPG',
  '/assets/club-info/carousel2.JPG',
  '/assets/club-info/carousel3.JPG',
  '/assets/club-info/carousel4.JPG',
  '/assets/club-info/carousel5.JPG',
  '/assets/club-info/team.JPG',
  '/assets/club-info/table.JPG',
  '/assets/club-info/signing.jpg',
  '/assets/club-info/signing3.jpg',
  '/assets/club-info/founders.JPG',
]

const MS_PER_DAY = 24 * 60 * 60 * 1000
const MAX_WEEKS_PER_SESSION = 6
/** If the next Friday is more than this many days away, treat it as a new 6-week session. */
const SESSION_GAP_DAYS = 10

function withFill(lead: string[], count = 12): string[] {
  const out: string[] = []
  const seen = new Set<string>()
  for (const src of [...lead, ...CLUB_INFO]) {
    if (seen.has(src)) continue
    seen.add(src)
    out.push(src)
    if (out.length >= count) break
  }
  return out
}

export const TECHNOLOGY_WORKSHOP_GALLERY = withFill([
  '/assets/workshop series.jpg',
  '/assets/abbott.JPG',
  '/assets/club-info/carousel2.JPG',
  '/assets/club-info/carousel3.JPG',
  '/assets/club-info/carousel4.JPG',
  '/assets/club-info/founders.JPG',
])

export function workshopSessionId(sessionNumber: number) {
  return `technology-workshop-session-${sessionNumber}`
}

export function isWorkshopEventId(id: string) {
  return (
    id === 'technology-workshop' ||
    id.startsWith('workshop-') ||
    id.startsWith('technology-workshop-session-')
  )
}

export const CLUB_EVENT_GALLERIES: Record<string, string[]> = {
  'club-fair': withFill([
    '/assets/club fair.jpg',
    '/assets/club-info/table.JPG',
    '/assets/club-info/signing.jpg',
    '/assets/club-info/carousel.JPG',
    '/assets/club-info/carousel1.JPG',
    '/assets/club-info/team.JPG',
  ]),
  'sips-samples': withFill([
    '/assets/sip.jpg',
    '/assets/kreme.JPG',
    '/assets/club-info/carousel3.JPG',
    '/assets/club-info/table.JPG',
  ]),
  spikeball: withFill([
    '/assets/banner.JPG',
    '/assets/club-info/carousel4.JPG',
    '/assets/club-info/carousel5.JPG',
    '/assets/club-info/team.JPG',
  ]),
  'bingo-night-2026': withFill([
    '/assets/club-info/carousel.JPG',
    '/assets/club-info/carousel1.JPG',
    '/assets/club-info/carousel2.JPG',
    '/assets/kreme.JPG',
  ]),
}

export function getClubGallery(eventId: string): string[] {
  const raw = isWorkshopEventId(eventId)
    ? TECHNOLOGY_WORKSHOP_GALLERY
    : (CLUB_EVENT_GALLERIES[eventId] ?? withFill(CLUB_INFO.slice(0, 4)))

  return raw.map(src => encodeURI(src))
}

type WorkshopLike = {
  id: string
  date: Date
  endDate?: Date
  title: string
  type: string
  description?: string
}

/**
 * Collapse weekly Technology Workshop Fridays into one memory per 6-week session.
 * A new session starts after a long gap or after 6 weeks.
 */
export function collapseWorkshopSeries<T extends WorkshopLike>(list: T[]): T[] {
  const workshops = list
    .filter(e => isWorkshopEventId(e.id) || e.title.toLowerCase().includes('technology workshop'))
    .sort((a, b) => a.date.getTime() - b.date.getTime())
  const others = list.filter(
    e => !(isWorkshopEventId(e.id) || e.title.toLowerCase().includes('technology workshop'))
  )
  if (workshops.length === 0) return list

  const sessions: T[][] = []
  let current: T[] = []

  for (const w of workshops) {
    if (current.length === 0) {
      current = [w]
      continue
    }
    const prev = current[current.length - 1]
    const gapDays = (w.date.getTime() - prev.date.getTime()) / MS_PER_DAY
    if (current.length >= MAX_WEEKS_PER_SESSION || gapDays > SESSION_GAP_DAYS) {
      sessions.push(current)
      current = [w]
    } else {
      current.push(w)
    }
  }
  if (current.length) sessions.push(current)

  const collapsed = sessions.map((session, index) => {
    const first = session[0]
    const last = session[session.length - 1]
    const lastEnd = last.endDate ?? last.date
    const sessionNumber = index + 1
    const weekCount = session.length

    return {
      ...first,
      id: workshopSessionId(sessionNumber),
      title: `Technology Workshop · Session ${sessionNumber}`,
      date: first.date,
      endDate: lastEnd.getTime() > first.date.getTime() ? lastEnd : first.endDate,
      description:
        first.description ??
        `A ${weekCount}-week workshop series teaching and helping with technology at Glebe Centre Abbotsford.`,
    } as T
  })

  return [...others, ...collapsed]
}

/** Resolve legacy workshop URLs to the correct session page. */
export function resolveWorkshopPageId(id: string, sessions: { id: string }[]): string | null {
  if (!isWorkshopEventId(id)) return null
  if (id.startsWith('technology-workshop-session-')) return id
  // legacy single id or weekly ids → first session
  return sessions[0]?.id ?? workshopSessionId(1)
}
