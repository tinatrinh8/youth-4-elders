const PARENT_KEY = 'y4e-past-gallery-parent'

function readParentMap(): Record<string, string> {
  if (typeof sessionStorage === 'undefined') return {}
  try {
    const raw = sessionStorage.getItem(PARENT_KEY)
    return raw ? (JSON.parse(raw) as Record<string, string>) : {}
  } catch {
    return {}
  }
}

function writeParentMap(map: Record<string, string>) {
  if (typeof sessionStorage === 'undefined') return
  sessionStorage.setItem(PARENT_KEY, JSON.stringify(map))
}

/** Remember which gallery page the user came from when opening a suggestion. */
export function setGalleryParent(childId: string, parentId: string) {
  const map = readParentMap()
  map[childId] = parentId
  writeParentMap(map)
}

export function getGalleryParent(eventId: string): string | null {
  return readParentMap()[eventId] ?? null
}

/** Reset when opening a gallery from the past events list. */
export function clearGalleryParents() {
  if (typeof sessionStorage === 'undefined') return
  sessionStorage.removeItem(PARENT_KEY)
}

export function galleryHref(eventId: string, fromId?: string | null) {
  return fromId ? `/events/past/${eventId}?from=${encodeURIComponent(fromId)}` : `/events/past/${eventId}`
}
