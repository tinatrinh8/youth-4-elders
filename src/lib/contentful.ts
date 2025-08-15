import { FeatureHighlightSkeleton } from '@/types/featureHighlights'
import { createClient, Entry, EntrySkeletonType } from 'contentful'

const client = createClient({
  space: process.env.CONTENTFUL_SPACE_ID!,
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN!,
})

export async function getEntries<T extends EntrySkeletonType>(
  contentType: string
): Promise<Entry<T, undefined, string>[]> {
  const entries = await client.getEntries<T>({ content_type: contentType })
  return entries.items
}

export async function getFeatureHighlights(): Promise<
  Entry<FeatureHighlightSkeleton>[]
> {
  return getEntries<FeatureHighlightSkeleton>('featureHighlights') 
}

