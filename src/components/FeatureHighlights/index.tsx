// components/FeatureHighlights.tsx
import React from 'react'
import { Entry } from 'contentful'
import { documentToReactComponents } from '@contentful/rich-text-react-renderer'
import type { FeatureHighlightSkeleton } from '@/types/featureHighlights'

// runtime guard: only treat value as a Rich Text Document if it has the right shape
const looksLikeDoc = (v: unknown): v is { nodeType: string; content: unknown[] } =>
  !!v && typeof v === 'object' &&
  'nodeType' in (v as any) && typeof (v as any).nodeType === 'string' &&
  'content' in (v as any) && Array.isArray((v as any).content)

const toText = (v: unknown) => (v == null ? '' : typeof v === 'string' ? v : String(v))

type Props = {
  highlights?: Entry<FeatureHighlightSkeleton>[] | null
}

export default function FeatureHighlights({ highlights }: Props) {
  if (!highlights?.length) return null

  return (
    <section>
      <h2 className="text-2xl font-semibold mb-4">Highlights</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {highlights.map((h) => {
          const title = toText(h.fields.title)
          const description = h.fields.description as unknown

          return (
            <div key={h.sys.id} className="p-4 border rounded">
              <h3 className="text-xl font-bold">{title || 'Untitled'}</h3>
              <div className="mt-2 text-gray-700">
                {description == null
                  ? <em className="text-gray-400">No description available.</em>
                  : looksLikeDoc(description)
                    ? documentToReactComponents(description as any)
                    : toText(description)}
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
