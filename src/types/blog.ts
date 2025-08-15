import { EntrySkeletonType } from 'contentful'

// Define fields expected from Contentful
export interface BlogFields {
  title: string
  slug: string
  description: string
}

// Tell TypeScript these fields are REQUIRED
export type BlogSkeleton = EntrySkeletonType<
  BlogFields,
  'title' | 'slug' | 'description'
>
