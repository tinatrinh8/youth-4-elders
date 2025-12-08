import type { EntrySkeletonType } from 'contentful'

export interface ClubUpdateFields {
  title: string
  description: string
  icon?: string | null                    // Emoji or icon identifier 
  type?: 'highlight' | 'standard' | null // 'highlight' uses pink styling, 'standard' uses brown
  order?: number | null                   // Optional ordering field
}

// Export the skeleton type for Contentful entries
export type ClubUpdateSkeleton = EntrySkeletonType<ClubUpdateFields>

