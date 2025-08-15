// src/components/FeatureHighlights/index.tsx
import React from 'react'
import { Entry } from 'contentful'
import { documentToReactComponents } from '@contentful/rich-text-react-renderer'
import type { FeatureHighlightSkeleton } from '@/types/featureHighlights'
import type { Document as RichTextDocument } from '@contentful/rich-text-types'

type JSONLike = Record<string, unknown>
const isObject = (v: unknown): v is JSONLike => typeof v === 'object' && v !== null

function looksLikeRichText(v: unknown): v is { nodeType: string; content: unknown[] } {
  return isObject(v) && typeof v.nodeType === 'string' && Array.isArray((v as JSONLike).content)
}

function asRichTextDocument(v: { nodeType: string; content: unknown[] }): RichTextDocument {
  // safe because we only call this after looksLikeRichText()
  return v as unknown as RichTextDocument
}

function toText(v: unknown): string {
  if (v == null) return ''
  return typeof v === 'string' ? v : String(v)
}

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
          const description: unknown = h.fields.description

          return (
            <div key={h.sys.id} className="p-4 border rounded">
              <h3 className="text-xl font-bold">{title || 'Untitled'}</h3>

              <div className="mt-2 text-gray-700">
                {description == null ? (
                  <em className="text-gray-400">No description available.</em>
                ) : looksLikeRichText(description) ? (
                  documentToReactComponents(asRichTextDocument(description))
                ) : (
                  toText(description)
                )}
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
