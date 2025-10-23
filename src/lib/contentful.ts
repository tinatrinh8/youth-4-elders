// src/lib/contentful.ts
import { createClient, type Entry, type EntrySkeletonType } from 'contentful'
import type { FeatureHighlightSkeleton } from '@/types/featureHighlights'

// Check if environment variables are available
const hasContentfulConfig = process.env.CONTENTFUL_SPACE_ID && process.env.CONTENTFUL_ACCESS_TOKEN

const client = hasContentfulConfig ? createClient({
  space: process.env.CONTENTFUL_SPACE_ID!,
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN!,
  environment: process.env.CONTENTFUL_ENVIRONMENT || 'master',
}) : null


export async function getEntries<T extends EntrySkeletonType>(
  contentTypeId: string
): Promise<Entry<T>[]> {
  if (!client) {
    console.warn('Contentful client not configured. Returning empty array.')
    return []
  }
  const { items } = await client.getEntries<T>({ content_type: contentTypeId })
  return items as Entry<T>[]
}

/** Fetch a single entry by slug (typed, no `any`). */
export async function getEntryBySlug<T extends EntrySkeletonType>(
  contentTypeId: string,
  slug: string
): Promise<Entry<T> | null> {
  if (!client) {
    console.warn('Contentful client not configured. Returning null.')
    return null
  }
  // infer the exact param type the SDK expects
  type GetEntriesParams = Parameters<typeof client.getEntries<T>>[0]

  const q: Record<string, unknown> = {
    content_type: contentTypeId,
    limit: 1,
    'fields.slug': slug,
  }

  const { items } = await client.getEntries<T>(q as unknown as GetEntriesParams)
  return (items[0] as Entry<T> | undefined) ?? null
}

export async function getFeatureHighlights(): Promise<Entry<FeatureHighlightSkeleton>[]> {
  return getEntries<FeatureHighlightSkeleton>('featureHighlights')
}

export async function listContentTypeIds(): Promise<string[]> {
  if (!client) {
    console.warn('Contentful client not configured. Returning empty array.')
    return []
  }
  const { items } = await client.getContentTypes()
  return items.map(t => t.sys.id)
}

export async function debugContentful(): Promise<void> {
  console.log(
    'CF space:', process.env.CONTENTFUL_SPACE_ID,
    'env:', process.env.CONTENTFUL_ENVIRONMENT ?? '(default master)'
  );

  if (!client) {
    console.warn('Contentful client not configured. Cannot debug.');
    return;
  }

  const { items } = await client.getContentTypes();
  const ids = items.map(t => t.sys.id);
  console.log('CF content type IDs:', ids);

  const sample = await client.getEntries({ limit: 1 });
  const firstType = sample.items[0]?.sys?.contentType?.sys?.id;
  console.log('Sample entry type:', firstType ?? '(no entries)');
}
