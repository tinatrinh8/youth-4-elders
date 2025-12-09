// src/lib/contentful.ts
import { createClient, type Entry, type EntrySkeletonType } from 'contentful'
import type { FeatureHighlightSkeleton } from '@/types/featureHighlights'
import type { PartnerSkeleton, SponsorSkeleton } from '@/types/partner'

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

export async function getPartners(): Promise<Entry<PartnerSkeleton>[]> {
  if (!client) {
    console.warn('Contentful client not configured. Returning empty array.')
    return []
  }
  try {
    const { items } = await client.getEntries<PartnerSkeleton>({ 
      content_type: 'partner'
    })
    // Sort by order field manually
    const sorted = items.sort((a, b) => {
      const orderA = a.fields.order ?? 999
      const orderB = b.fields.order ?? 999
      return orderA - orderB
    })
    return sorted as Entry<PartnerSkeleton>[]
  } catch (error: unknown) {
    // Handle case where content type doesn't exist yet
    if (error && typeof error === 'object' && 'message' in error) {
      const errorMessage = String(error.message)
      if (errorMessage.includes('unknownContentType') || errorMessage.includes('content type')) {
        console.warn('Contentful content type "partner" does not exist yet. Please create it in Contentful. Returning empty array.')
        return []
      }
    }
    console.error('Error fetching partners from Contentful:', error)
    return []
  }
}

export async function getSponsors(): Promise<Entry<SponsorSkeleton>[]> {
  if (!client) {
    console.warn('Contentful client not configured. Returning empty array.')
    return []
  }
  try {
    const { items } = await client.getEntries<SponsorSkeleton>({ 
      content_type: 'sponsor'
    })
    // Sort by order field manually
    const sorted = items.sort((a, b) => {
      const orderA = a.fields.order ?? 999
      const orderB = b.fields.order ?? 999
      return orderA - orderB
    })
    return sorted as Entry<SponsorSkeleton>[]
  } catch (error: unknown) {
    // Handle case where content type doesn't exist yet
    if (error && typeof error === 'object' && 'message' in error) {
      const errorMessage = String(error.message)
      if (errorMessage.includes('unknownContentType') || errorMessage.includes('content type')) {
        console.warn('Contentful content type "sponsor" does not exist yet. Please create it in Contentful. Returning empty array.')
        return []
      }
    }
    console.error('Error fetching sponsors from Contentful:', error)
    return []
  }
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
