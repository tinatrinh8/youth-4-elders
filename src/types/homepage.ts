import type { EntrySkeletonType, Asset, Entry } from 'contentful'
import type { Document } from '@contentful/rich-text-types'
import type { ClubUpdateSkeleton } from './clubUpdates'
import type { FeaturedEventSkeleton } from './featuredEvents'

export interface HomepageFields {
  title: string
  slug: string

  // Launch Signup Modal Section
  modalHeading?: string | null              // "Help Us Grow Our Club"
  modalBodyText?: Document | string | null  // Modal description text
  modalDismissText?: string | null          // "Maybe Another Time :)"
  modalSuccessHeading?: string | null       // "Thanks for Signing Up!"
  modalSuccessMessage?: Document | string | null // Success message text
  modalShowDelay?: number | null            // Delay in milliseconds before showing modal (e.g., 6000)

  // Hero Section
  heroBackgroundImage?: Asset | null         // Background image for hero section
  heroMarketingText?: string | null          // "... is now live !" text
  heroMainHeading?: string | null            // "Youth 4 Elders" heading

  // Mission Section
  missionHeadline?: string | null            // "Nothing great is built alone."
  missionDescription?: Document | string | null // Description text
  roleTags?: string[] | null                // Array of role tags (VOLUNTEER, WORKSHOPS, EVENTS, COMMUNITY, CONNECTIONS)

  // Get Involved Section
  getInvolvedHeading?: string | null        // "Want to Get Involved?"
  getInvolvedDescription?: Document | string | null
  getInvolvedButtonLabel?: string | null    // "LEARN MORE"
  getInvolvedButtonURL?: string | null      // "/join-us"

  // Events Section
  eventsSectionHeading?: string | null    // "Our Events" (background text)
  featuredEvents?: Entry<FeaturedEventSkeleton>[] | null  // Array of featured event entries from Contentful
  eventTypesLabel?: string | null         // "Event Types" (label above event types text)
  eventTypesText?: string | null           // "Workshops / Community / Volunteering / Social"
  eventsViewMoreLabel?: string | null     // "VIEW MORE" (link text)
  eventsViewMoreURL?: string | null        // "/events"

  // Countdown Timer Section
  countdownEventName?: string | null       // "SPIKEBALL EVENT"
  countdownEventDate?: string | null       // ISO date string (e.g., "2026-01-16T00:00:00")
  countdownLabelText?: string | null       // "DAYS LEFT UNTIL"
  countdownTodayMessage?: string | null    // "Today is the"
  countdownTodayEventName?: string | null  // "Spikeball Event" (for when countdown reaches 0)

  // Current Club Updates Section
  clubUpdatesHeading?: string | null       // "Current Club Updates"
  clubUpdates?: Entry<ClubUpdateSkeleton>[] | null  // Array of club update entries from Contentful

  // Social Links
  instagramURL?: string | null              // Instagram profile URL
  linkedInURL?: string | null               // LinkedIn profile/company URL
  contactEmail?: string | null              // Contact email address

  // Legacy fields (kept for backwards compatibility)
  datePublished?: string | null             // ISO date string
}

// Export the skeleton type for Contentful entries
export type HomepageSkeleton = EntrySkeletonType<HomepageFields>