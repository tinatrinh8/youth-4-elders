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
      className="fixed inset-0 z-[110] flex items-center justify-center p-4"
      style={{ background: 'rgba(0, 0, 0, 0.6)', backdropFilter: 'blur(4px)' }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-3xl rounded-2xl overflow-hidden"
        style={{
          background: 'var(--color-cream)',
          border: '2px solid rgba(175, 121, 120, 0.2)',
          boxShadow: '0 20px 70px rgba(0, 0, 0, 0.35)'
        }}
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6 md:p-8 border-b" style={{ borderColor: 'rgba(175, 121, 120, 0.15)' }}>
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
                    style={{ background: 'rgba(175, 121, 120, 0.12)', color: 'var(--color-brown-dark)', fontFamily: 'var(--font-kollektif)' }}
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
              onClick={onClose}
              className="w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110"
              style={{ background: 'rgba(175, 121, 120, 0.10)', color: 'var(--color-brown-dark)' }}
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
  )
}
