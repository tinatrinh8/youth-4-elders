import type { EntrySkeletonType, Asset } from 'contentful'
import type { Document } from '@contentful/rich-text-types'

export interface FeatureHighlightFields {
  title: string
  description?: Document | string | null
  image?: Asset | null
  date?: string | null                    // ISO date string or formatted date string
  order?: number | null                   // Optional ordering field
}

// Export the skeleton type for Contentful entries
export type FeatureHighlightSkeleton = EntrySkeletonType<FeatureHighlightFields>
