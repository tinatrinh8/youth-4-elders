import type { EntrySkeletonType, Asset, Entry } from 'contentful'
import type { Document } from '@contentful/rich-text-types'
import type { FeatureHighlightSkeleton } from './featureHighlights'

export interface HomepageFields {
  title: string
  slug: string

  // Hero Section
  heroBackgroundImage?: Asset | null         // Background image for hero section
  heroMarketingText?: string | null          // "... is now live !" text
  heroMainHeading?: string | null            // "Youth 4 Elders" heading

  // Mission Section
  missionHeadline?: string | null            // "Nothing great is built alone."
  missionDescription?: Document | string | null // Description text
  roleTags?: string[] | null                // Array of role tags (VOLUNTEER, WORKSHOPS, etc.)

  // Get Involved Section
  getInvolvedHeading?: string | null        // "Want to Get Involved?"
  getInvolvedDescription?: Document | string | null
  getInvolvedButtonLabel?: string | null    // "LEARN MORE"
  getInvolvedButtonURL?: string | null      // "/join-us"

  // Testimonials Section
  testimonialsHeading?: string | null       // "What People Say"
  testimonials?: Array<{
    quote: string
    author: string
  }> | null

  // Events Section
  eventsSectionHeading?: string | null    // "Our Events" (background text)
  featuredEvents?: Array<{
    image: Asset
    title: string
    date: string                           // e.g., "Started Sept 16, 2025 • Weekly"
    description: string
  }> | null
  eventTypesText?: string | null           // "Workshops / Community / Volunteering / Social"
  eventsViewMoreURL?: string | null        // "/events"

  // Countdown Timer Section
  countdownEventName?: string | null       // "SPIKEBALL EVENT"
  countdownEventDate?: string | null       // ISO date string (e.g., "2026-01-16T00:00:00")
  countdownLabelText?: string | null       // "DAYS LEFT UNTIL"
  countdownTodayMessage?: string | null    // "Today is the"
  countdownTodayEventName?: string | null  // "Spikeball Event" (for when countdown reaches 0)

  // Social Links
  instagramURL?: string | null              // Instagram profile URL
  contactEmail?: string | null              // Contact email address

  // Legacy fields (kept for backwards compatibility)
  featureHighlights?: Entry<FeatureHighlightSkeleton>[] | null
  datePublished?: string | null             // ISO date string
}

// Export the skeleton type for Contentful entries
export type HomepageSkeleton = EntrySkeletonType<HomepageFields>