// types/homepage.ts
import type { EntrySkeletonType, Asset, Entry } from 'contentful'
import type { Document } from '@contentful/rich-text-types'
import type { FeatureHighlightSkeleton } from './featureHighlights'

export interface HomepageFields {
  title: string
  slug: string

  heroHeading: string
  heroSubtext?: Document | string            // ⬅ optional + allow Text
  heroButtonLabel?: Document | string        // ⬅ same
  heroButtonURL?: string

  coverImage?: Asset
  body?: Document | string                   // ⬅ many people use a Text field here

  featureHighlights?: Entry<FeatureHighlightSkeleton>[]   // ⬅ optional

  blogSectionHeading: string
  blogSectionText?: Document | string        // ⬅ optional + union
  blogButtonLabel?: string                   // ⬅ often a Symbol/Text
  blogButtonURL?: string

  datePublished?: string                     // or Date | string
  instagramURL?: string
  contactEmail?: string
}

// Keep your existing style — this is fine once fields are permissive
export type HomepageSkeleton = EntrySkeletonType<HomepageFields>
