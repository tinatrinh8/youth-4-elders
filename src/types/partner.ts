import type { EntrySkeletonType, Asset } from 'contentful'
import type { Document } from '@contentful/rich-text-types'

export interface PartnerFields {
  name: string
  description?: Document | string | null
  logo?: Asset | null
  websiteUrl?: string | null
  order?: number | null // For ordering partners
}

export type PartnerSkeleton = EntrySkeletonType<PartnerFields>

export interface SponsorFields {
  name: string
  logo?: Asset | null
  websiteUrl?: string | null
  order?: number | null // For ordering sponsors
}

export type SponsorSkeleton = EntrySkeletonType<SponsorFields>
