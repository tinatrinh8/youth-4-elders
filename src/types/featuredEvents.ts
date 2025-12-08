import type { EntrySkeletonType, Asset } from 'contentful'
import type { Document } from '@contentful/rich-text-types'

export interface FeaturedEventFields {
  title: string
  date?: string | null                     // e.g., "Started Sept 16, 2025 • Weekly" or "Sept 3rd, 2025"
  description?: Document | string | null   // Description can be rich text or plain string
  image?: Asset | null                     // Image is optional (for flexibility)
  order?: number | null                    // Optional ordering field
}

// Export the skeleton type for Contentful entries
export type FeaturedEventSkeleton = EntrySkeletonType<FeaturedEventFields>

