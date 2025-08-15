import type { EntrySkeletonType, Asset } from 'contentful'
import type { Document } from '@contentful/rich-text-types'

export interface BlogFields {
  title: string
  slug: string
  description?: string | Document
  body?: string | Document
  coverImage?: Asset
  datePublished?: string
  authorName?: string
}

export type BlogSkeleton = EntrySkeletonType<BlogFields>
