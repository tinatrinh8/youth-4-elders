/** Photo galleries for past club events — files live under /assets/events/past/gallery. */
const SHARED = '/assets/events/past/gallery/_shared'
const GALLERY = '/assets/events/past/gallery'

const CLUB_INFO = [
  `${SHARED}/carousel.JPG`,
  `${SHARED}/carousel1.JPG`,
  `${SHARED}/carousel2.JPG`,
  `${SHARED}/carousel3.JPG`,
  `${SHARED}/carousel4.JPG`,
  `${SHARED}/carousel5.JPG`,
  `${SHARED}/team.JPG`,
  `${SHARED}/table.JPG`,
  `${SHARED}/signing.jpg`,
  `${SHARED}/signing3.jpg`,
  `${SHARED}/founders.JPG`,
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
  `${GALLERY}/technology-workshop/cover-session-1.jpg`,
  `${GALLERY}/technology-workshop/workshop-series.jpg`,
  `${GALLERY}/technology-workshop/abbott.JPG`,
  `${GALLERY}/technology-workshop/carousel2.JPG`,
  `${GALLERY}/technology-workshop/carousel3.JPG`,
  `${GALLERY}/technology-workshop/carousel4.JPG`,
  `${GALLERY}/technology-workshop/founders.JPG`,
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
  'spco-grant-signing-2025': [
    17, 29, 4, 23, 11, 32, 6, 26, 14, 1, 21, 9, 30, 3, 19, 13,
    27, 7, 31, 15, 2, 25, 10, 5, 28, 12, 20, 16,
  ].map(n => `${GALLERY}/spco-grant-signing-2025/photo-${String(n).padStart(2, '0')}.png`),
  'sips-samples': [
    8, 3, 11, 1, 6, 4, 10, 2, 9, 5, 7,
  ].map(n => `${GALLERY}/sips-samples/photo-${String(n).padStart(2, '0')}.jpg`),
  spikeball: [
    1, 7, 12, 3, 10, 16, 5, 14, 18, 2, 9, 15, 6, 11, 17, 4, 8, 13, 20,
  ].map(n => `${GALLERY}/spikeball/photo-${String(n).padStart(2, '0')}.jpg`),
  'build-a-bouquet-2026': [
    1, 14, 27, 8, 21, 35, 3, 18, 30, 11, 24, 39, 5, 16, 28, 9, 22, 33,
    2, 15, 26, 12, 25, 40, 6, 19, 31, 10, 23, 36, 4, 17, 29, 13, 20, 34,
    7, 32, 37, 38, 41, 42,
  ].map(n => `${GALLERY}/build-a-bouquet-2026/photo-${String(n).padStart(2, '0')}.jpg`),
  'bingo-night-2026': withFill([
    `${GALLERY}/bingo-night-2026/carousel.JPG`,
    `${GALLERY}/bingo-night-2026/carousel1.JPG`,
    `${GALLERY}/bingo-night-2026/carousel2.JPG`,
    `${GALLERY}/bingo-night-2026/kreme.JPG`,
  ]),
  'technology-workshop-session-1': Array.from({ length: 26 }, (_, i) =>
    `${GALLERY}/technology-workshop/session-1/photo-${String(i + 2).padStart(2, '0')}.jpg`
  ),
  /** Session 2 photos coming later — keep empty so we don't show filler. */
  'technology-workshop-session-2': [],
}

/** Club items that only get a list recap — no photo gallery page. */
const CLUB_RECAP_ONLY = new Set(['club-fair', 'krispy-kreme-2026', 'bingo-night-2026'])

/** List-card cover photos (kept under /assets/events/past for clarity). */
const CLUB_CARD_COVERS: Record<string, string> = {
  'club-fair': '/assets/events/past/club-fair.png',
  'krispy-kreme-2026': '/assets/events/past/krispy kreme.png',
  'spco-grant-signing-2025': '/assets/events/past/spco-grant-signing.JPG',
  'build-a-bouquet-2026': '/assets/events/past/build-a-bouquet-2026.jpg',
  spikeball: '/assets/events/past/spikeball.jpg',
  'bingo-night-2026': '/assets/events/past/bingo-night-2026.jpg',
  'sips-samples': '/assets/events/past/sips-samples.jpg',
  'technology-workshop-session-1': '/assets/events/past/technology-workshop-session-1.jpg',
}

export function isClubRecapOnly(eventId: string): boolean {
  return CLUB_RECAP_ONLY.has(eventId)
}

/** Featured video recap(s) shown above the photo gallery. */
const CLUB_GALLERY_RECAP_VIDEOS: Record<string, string[]> = {
  'build-a-bouquet-2026': [`${GALLERY}/build-a-bouquet-2026/vlog.MP4`],
}

/** Short clips woven into the masonry gallery (muted, looping). */
const CLUB_GALLERY_CLIPS: Record<string, string[]> = {
  'build-a-bouquet-2026': [1, 2, 3, 4, 5, 6].map(
    n => `${GALLERY}/build-a-bouquet-2026/video-${String(n).padStart(2, '0')}.mp4`
  ),
  spikeball: [`${GALLERY}/spikeball/video-01.mp4`],
  'technology-workshop-session-1': [1, 2, 3, 4, 5].map(
    n => `${GALLERY}/technology-workshop/session-1/video-${String(n).padStart(2, '0')}.mp4`
  ),
}

export type ClubGalleryItem = { kind: 'image' | 'video'; src: string }

export function getClubGalleryVideos(eventId: string): string[] {
  return (CLUB_GALLERY_RECAP_VIDEOS[eventId] ?? []).map(src => encodeURI(src))
}

/** @deprecated Prefer getClubGalleryVideos */
export function getClubGalleryVideo(eventId: string): string | undefined {
  return getClubGalleryVideos(eventId)[0]
}

export function getClubGallery(eventId: string): string[] {
  if (isClubRecapOnly(eventId)) return []

  // Dedicated entry (including empty arrays) wins — no silent filler for unfinished sessions
  if (Object.prototype.hasOwnProperty.call(CLUB_EVENT_GALLERIES, eventId)) {
    return CLUB_EVENT_GALLERIES[eventId].map(src => encodeURI(src))
  }

  const raw = isWorkshopEventId(eventId)
    ? TECHNOLOGY_WORKSHOP_GALLERY
    : withFill(CLUB_INFO.slice(0, 4))

  return raw.map(src => encodeURI(src))
}

/** True when this memory page has no photos/clips yet. */
export function isGalleryComingSoon(eventId: string): boolean {
  if (isClubRecapOnly(eventId)) return false
  return getClubGalleryItems(eventId).length === 0
}

/** Photos + short clips for the masonry gallery. */
export function getClubGalleryItems(eventId: string): ClubGalleryItem[] {
  const images = getClubGallery(eventId).map(src => ({ kind: 'image' as const, src }))
  const clips = (CLUB_GALLERY_CLIPS[eventId] ?? []).map(src => ({
    kind: 'video' as const,
    src: encodeURI(src),
  }))
  if (clips.length === 0) return images

  const items: ClubGalleryItem[] = []
  const stride = Math.max(4, Math.ceil(images.length / (clips.length + 1)))
  let clipIdx = 0
  images.forEach((img, i) => {
    items.push(img)
    if (clipIdx < clips.length && (i + 1) % stride === 0) {
      items.push(clips[clipIdx++])
    }
  })
  while (clipIdx < clips.length) items.push(clips[clipIdx++])
  return items
}

/** Cover image for past-events list cards. */
export function getClubCardCover(eventId: string): string | undefined {
  const dedicated = CLUB_CARD_COVERS[eventId]
  if (dedicated) return encodeURI(dedicated)
  if (isClubRecapOnly(eventId)) return undefined
  return getClubGallery(eventId)[0]
}

/** @deprecated Prefer getClubCardCover — kept for recap-only call sites. */
export function getClubRecapCover(eventId: string): string | undefined {
  return getClubCardCover(eventId)
}

/** Short past-tense blurbs for club memory cards (not the upcoming promo copy). */
const CLUB_MEMORY_BLURBS: Record<string, string> = {
  'spco-grant-signing-2025':
    'Contract signing with the Social Planning Council of Ottawa — a grant partnership for Y4E.',
  'sips-samples': 'A miscellaneous afternoon at Abbotsford — local treats and good company.',
  spikeball: 'Our first Spikeball Social tournament — packed house, winners crowned, Domino’s Pizza on the table.',
  'build-a-bouquet-2026': 'Our Valentine’s Day Build-a-Bouquet — flowers made together for Abbotsford.',
  'bingo-night-2026': 'Trivia, three bingo rounds, and $30 FNS gift cards at the RGN Student Lounge.',
  'technology-workshop-session-1':
    'Fall tech literacy Fridays at Abbotsford — phones, apps, and lots of hands-on examples.',
  'technology-workshop-session-2':
    'Our next tech literacy stretch — photos and Friday notes are still on the way. Check back soon.',
}

export function getClubMemoryBlurb(eventId: string): string | undefined {
  return CLUB_MEMORY_BLURBS[eventId]
}

/** Longer copy for gallery pages (may include details left off list previews). */
const CLUB_GALLERY_BLURBS: Record<string, string> = {
  'spco-grant-signing-2025':
    'We signed our contract with the Social Planning Council of Ottawa and received a $5,000 grant to support Youth 4 Elders and our work with seniors in the community. SPCO is helping us invest in growing our club—programs, outreach, and the connections we build across generations—and we are deeply grateful for their partnership and belief in our mission.',
  spikeball:
    'Y4E hosted our very first Spikeball Social—a tournament night for anyone who wanted to jump in and play—and it did not disappoint. With an amazing turnout, great energy, and even better people, the night was a massive hit. Shoutout to our winners, and a huge thank you to Domino’s Pizza for sponsoring the event. Thanks to everyone who came out and made it such a great night—stay tuned for more Y4E events coming soon.',
  'sips-samples':
    'A miscellaneous Y4E gathering, Sips, Samples, Social brought a small group together at Abbotsford Seniors Centre on November 10 from 5–6 PM to sample delicious goodies from our favourite local vendors. For $10 a participant (max 15), it was an intimate afternoon of tasting, chatting, and connecting across generations—sweet bites, warm company, and a cosy hour well spent.',
  'build-a-bouquet-2026':
    'This Valentine’s Day, Build-a-Bouquet brought everyone together for an afternoon of making little bouquets—with friends, partners, or just for someone special. For a $5 entry, you could choose from premium flowers and greenery—roses, lilies, tulips, carnations, baby’s breath, and more—and build your bouquet however you wanted: keep it, gift it, wrap it up, or send a little love out into the world.\n\nWhat an incredible turnout—thank you to everyone who came out and made it such a huge success. Dozens of our bouquets headed to Abbotsford to brighten someone’s day. The flowers were beautiful, but the smiles we received back meant even more—a small bunch of blooms, a few warm conversations, and a whole lot of love. Sometimes the simplest gestures are the sweetest.',
  'technology-workshop-session-1':
    'Our first fall series was a Technology Literacy Workshop at Glebe Centre Abbotsford—Friday mornings (and afternoons of patience) helping elders feel more at home with phones, apps, and everyday tech. We come prepared with lots of examples of lessons, activities, and real-life scenarios, so everyone can learn at their own pace and leave with something useful.',
}

export function getClubGalleryBlurb(eventId: string): string | undefined {
  if (isWorkshopEventId(eventId)) {
    return CLUB_GALLERY_BLURBS[eventId]
  }
  return CLUB_GALLERY_BLURBS[eventId] ?? CLUB_MEMORY_BLURBS[eventId]
}

/** Example Friday PowerPoints / discussion topics for workshop gallery pages. */
export type WorkshopFridayExample = {
  week: string
  slideTitle: string
  summary: string
  discuss: string[]
  /** Optional slide images shown in an auto-playing carousel */
  slides?: string[]
}

const WORKSHOP_FRIDAY_EXAMPLES: Record<string, WorkshopFridayExample[]> = {
  'technology-workshop-session-1': [
    {
      week: 'Week 1 · Sept 19',
      slideTitle: 'Tech 101',
      summary:
        'Building blocks first—internet, Wi‑Fi, Bluetooth, and the cloud—then iPhone vs Android, phone basics, downloading apps, and spotting scams.',
      discuss: [
        'Internet, Wi‑Fi, Bluetooth & the cloud',
        'iPhone / iOS vs Android',
        'Phone basics (power, unlock, apps)',
        'Downloading apps',
        'Scam red flags',
      ],
      slides: [1, 2, 3, 4, 5].map(
        n =>
          `${GALLERY}/technology-workshop/session-1/slides/tech-101/slide-${String(n).padStart(2, '0')}.jpg`
      ),
    },
    {
      week: 'Oct 4',
      slideTitle: 'Staying Safe from Scams',
      summary:
        'A focused Friday on real scam patterns—phone, text, email, marketplace, and fake tech support—plus simple habits to pause, verify, and ask for help.',
      discuss: [
        'Phone scam red flags',
        'Text message scams',
        'Email & marketplace scams',
        'Tech support scams',
        'General safety tips',
      ],
      slides: [1, 2, 3, 4, 5].map(
        n =>
          `${GALLERY}/technology-workshop/session-1/slides/staying-safe-scams/slide-${String(n).padStart(2, '0')}.jpg`
      ),
    },
    {
      week: 'Oct 24',
      slideTitle: 'Rideshare',
      summary:
        'How Uber works end to end—download the app, request a ride, check driver details, and use safety settings with confidence.',
      discuss: [
        'What rideshare is',
        'Download the Uber app',
        'Order a ride',
        'Driver info & tracking',
        'Settings & safety features',
      ],
      slides: [1, 2, 3, 4, 5].map(
        n =>
          `${GALLERY}/technology-workshop/session-1/slides/rideshare/slide-${String(n).padStart(2, '0')}.jpg`
      ),
    },
  ],
}

export function getWorkshopFridayExamples(eventId: string): WorkshopFridayExample[] {
  return WORKSHOP_FRIDAY_EXAMPLES[eventId] ?? []
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
    const isLiteracy = sessionNumber === 1

    return {
      ...first,
      id: workshopSessionId(sessionNumber),
      title: isLiteracy
        ? `Technology Literacy Workshop · Session ${sessionNumber}`
        : `Technology Workshop · Session ${sessionNumber}`,
      date: first.date,
      endDate: lastEnd.getTime() > first.date.getTime() ? lastEnd : first.endDate,
      description: isLiteracy
        ? `Our fall Technology Literacy Workshop at Glebe Centre Abbotsford—a ${weekCount}-week stretch of Fridays helping elders build confidence with phones, apps, and everyday tech. We bring lots of examples of lessons, activities, and real-life scenarios so everyone can learn at their own pace.`
        : `A ${weekCount}-week stretch of Friday tech help at Glebe Centre Abbotsford.`,
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
