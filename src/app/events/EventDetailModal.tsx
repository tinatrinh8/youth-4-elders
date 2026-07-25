'use client'

import type { DisplayEvent } from './shared'
import { formatRange, getEventColor, getEventTint, getTimeFromDescription, getLocationFromDescription } from './shared'

export default function EventDetailModal({
  selectedEvent,
  onClose
}: {
  selectedEvent: DisplayEvent
  onClose: () => void
}) {
  return (
    <div
      className="fixed inset-0 z-[110] flex items-center justify-center p-3 sm:p-4 md:p-4"
      style={{ background: 'rgba(0, 0, 0, 0.6)', backdropFilter: 'blur(4px)' }}
      onClick={onClose}
    >
      <div
        className="flex w-full max-w-[calc(100vw-1.5rem)] md:max-w-3xl max-h-[min(88dvh,100%)] md:max-h-none flex-col rounded-2xl overflow-hidden"
        style={{
          background: 'var(--color-cream)',
          border: '2px solid rgba(175, 121, 120, 0.2)',
          boxShadow: '0 20px 70px rgba(0, 0, 0, 0.35)'
        }}
        onClick={e => e.stopPropagation()}
      >
        <div className="shrink-0 p-4 sm:p-5 md:p-8 border-b" style={{ borderColor: 'rgba(175, 121, 120, 0.15)' }}>
          <div className="flex items-start justify-between gap-3 md:gap-4">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-2 md:mb-3">
                <span
                  className="inline-flex items-center px-2.5 py-1 md:px-3 rounded-full text-[10px] md:text-[11px] font-bold tracking-wider"
                  style={{ background: getEventColor(selectedEvent.type), color: 'var(--color-cream)', fontFamily: 'var(--font-kollektif)' }}
                >
                  {selectedEvent.type.toUpperCase()}
                </span>
                {selectedEvent.endDate && (
                  <span
                    className="inline-flex items-center px-2.5 py-1 md:px-3 rounded-full text-[10px] md:text-[11px] font-bold tracking-wider"
                    style={{ background: 'rgba(175, 121, 120, 0.12)', color: 'var(--color-brown-dark)', fontFamily: 'var(--font-kollektif)' }}
                  >
                    DATE RANGE
                  </span>
                )}
              </div>
              <h3 className="text-2xl md:text-4xl font-bold leading-tight" style={{ fontFamily: 'var(--font-vintage-stylist)', color: 'var(--color-brown-dark)' }}>
                {selectedEvent.title}
              </h3>
              <p className="mt-1.5 md:mt-2 text-sm md:text-base" style={{ fontFamily: 'var(--font-kollektif)', color: 'var(--color-brown-medium)' }}>
                {formatRange(selectedEvent.date, selectedEvent.endDate)}
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="w-9 h-9 md:w-10 md:h-10 shrink-0 rounded-full flex items-center justify-center transition-all hover:scale-110"
              style={{ background: 'rgba(175, 121, 120, 0.10)', color: 'var(--color-brown-dark)' }}
              aria-label="Close"
            >
              <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-5 md:p-8" style={{ background: getEventTint(selectedEvent.type) }}>
          <div className="flex flex-wrap gap-2 md:gap-4 mb-4 md:mb-6">
            {getTimeFromDescription(selectedEvent.description) && (
              <div className="inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-xl" style={{ background: 'rgba(234, 225, 203, 0.7)' }}>
                <svg className="w-4 h-4" style={{ color: 'var(--color-brown-medium)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm md:text-base" style={{ fontFamily: 'var(--font-kollektif)', color: 'var(--color-brown-dark)' }}>
                  {getTimeFromDescription(selectedEvent.description)}
                </span>
              </div>
            )}
            {getLocationFromDescription(selectedEvent.description) && (
              <div className="inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-xl" style={{ background: 'rgba(234, 225, 203, 0.7)' }}>
                <svg className="w-4 h-4" style={{ color: 'var(--color-brown-medium)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="text-sm md:text-base" style={{ fontFamily: 'var(--font-kollektif)', color: 'var(--color-brown-dark)' }}>
                  {getLocationFromDescription(selectedEvent.description)}
                </span>
              </div>
            )}
          </div>
          {selectedEvent.description && (
            <p className="text-sm md:text-base leading-relaxed" style={{ fontFamily: 'var(--font-leiko)', color: 'var(--color-brown-dark)', lineHeight: '1.85' }}>
              {selectedEvent.description}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
