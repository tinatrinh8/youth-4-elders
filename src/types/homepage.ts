import type { EntrySkeletonType, Asset, Entry } from 'contentful'
import type { Document } from '@contentful/rich-text-types'
import type { FeatureHighlightSkeleton } from './featureHighlights'

export interface HomepageFields {
  title: string
  slug: string

  heroHeading: string
  heroSubtext?: Document | string | null     // Rich text or plain text
  heroButtonLabel?: Document | string | null // Rich text or plain text
  heroButtonURL?: string | null              // URL for the button

  coverImage?: Asset | null                  // Contentful Asset type
  body?: Document | string | null            // Rich text or plain text

  featureHighlights?: Entry<FeatureHighlightSkeleton>[] | null // Array of linked entries

  blogSectionHeading: string
  blogSectionText?: Document | string | null // Rich text or plain text
  blogButtonLabel?: string | null            // Button label text
  blogButtonURL?: string | null              // URL for the blog button

  datePublished?: string | null              // ISO date string
  instagramURL?: string | null               // Instagram profile URL
  contactEmail?: string | null               // Contact email address
}

// Export the skeleton type for Contentful entries
export type HomepageSkeleton = EntrySkeletonType<HomepageFields>