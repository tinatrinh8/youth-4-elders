'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import PastGalleryView from './PastGalleryView'
import { clearGalleryParents, galleryHref } from './galleryNav'

const SWIPE_MS = 900
const EXIT_MS = 700
const PAST_URL = '/events/past'

type MemorySheetContextValue = {
  openMemory: (eventId: string) => void
  isOpen: boolean
}

const MemorySheetContext = createContext<MemorySheetContextValue | null>(null)

export function useMemorySheet() {
  const ctx = useContext(MemorySheetContext)
  if (!ctx) {
    throw new Error('useMemorySheet must be used within MemorySheetProvider')
  }
  return ctx
}

function parseGalleryId(href: string): string | null {
  const match = href.match(/\/events\/past\/gallery\/([^/?#]+)/)
  return match ? decodeURIComponent(match[1]) : null
}

export function MemorySheetProvider({ children }: { children: ReactNode }) {
  const [sheetId, setSheetId] = useState<string | null>(null)
  const [open, setOpen] = useState(false)
  const [exiting, setExiting] = useState(false)
  const [contentReady, setContentReady] = useState(false)
  const closingRef = useRef(false)
  const sheetIdRef = useRef<string | null>(null)
  sheetIdRef.current = sheetId

  const finishClose = useCallback(() => {
    document.body.classList.remove('past-gallery-sheet-open')
    setSheetId(null)
    setOpen(false)
    setExiting(false)
    setContentReady(false)
    closingRef.current = false
  }, [])

  const beginClose = useCallback(
    (after?: () => void) => {
      if (closingRef.current) return
      closingRef.current = true
      setExiting(true)
      setContentReady(false)
      window.setTimeout(() => {
        finishClose()
        after?.()
      }, EXIT_MS)
    },
    [finishClose]
  )

  const openMemory = useCallback((eventId: string) => {
    clearGalleryParents()
    closingRef.current = false
    document.body.classList.add('past-gallery-sheet-open')
    setExiting(false)
    setContentReady(false)
    setOpen(false)
    setSheetId(eventId)
    window.history.pushState({ memorySheet: eventId }, '', galleryHref(eventId))
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setOpen(true))
    })
  }, [])

  const closeToPast = useCallback(() => {
    beginClose(() => {
      if (window.history.state && (window.history.state as { memorySheet?: string }).memorySheet) {
        window.history.back()
      } else {
        window.history.replaceState(null, '', PAST_URL)
      }
    })
  }, [beginClose])

  // After sheet covers past events, reveal memory content
  useEffect(() => {
    if (!sheetId || !open || exiting) {
      setContentReady(false)
      return
    }
    const timer = window.setTimeout(() => setContentReady(true), SWIPE_MS)
    return () => window.clearTimeout(timer)
  }, [sheetId, open, exiting])

  // Browser back while sheet is open → reverse swipe, keep past page as-is
  useEffect(() => {
    const onPopState = () => {
      if (!sheetIdRef.current) return
      if (closingRef.current) return
      // URL already changed; only animate the sheet away
      closingRef.current = true
      setExiting(true)
      setContentReady(false)
      window.setTimeout(() => {
        finishClose()
      }, EXIT_MS)
    }
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [finishClose])

  const handleNavigate = useCallback(
    (href: string) => {
      if (href === PAST_URL || href.startsWith(`${PAST_URL}?`)) {
        closeToPast()
        return
      }
      const nextId = parseGalleryId(href)
      if (!nextId) {
        beginClose(() => {
          window.location.assign(href)
        })
        return
      }
      // Swap to another memory inside the same sheet (past page stays mounted)
      setContentReady(false)
      setSheetId(nextId)
      window.history.pushState({ memorySheet: nextId }, '', href)
      window.setTimeout(() => setContentReady(true), 80)
    },
    [beginClose, closeToPast]
  )

  const value = useMemo(
    () => ({
      openMemory,
      isOpen: !!sheetId && !exiting,
    }),
    [openMemory, sheetId, exiting]
  )

  return (
    <MemorySheetContext.Provider value={value}>
      {children}
      {sheetId && (
        <div
          className={`past-gallery-sheet${open && !exiting ? ' is-open' : ''}${exiting ? ' is-exiting' : ''}`}
          role="dialog"
          aria-modal="true"
          aria-label="Club memory"
        >
          <PastGalleryView
            key={sheetId}
            presentation="sheet"
            eventId={sheetId}
            contentReady={contentReady}
            onNavigateRequest={handleNavigate}
          />
        </div>
      )}
    </MemorySheetContext.Provider>
  )
}
