// src/utils/richTextGuards.ts
import type { Document as RichTextDocument } from '@contentful/rich-text-types'

type JSONLike = Record<string, unknown>

function isObject(v: unknown): v is JSONLike {
  return typeof v === 'object' && v !== null
}

/** Minimal structural check for a Contentful Rich Text Document */
export function looksLikeRichText(v: unknown): v is { nodeType: string; content: unknown[] } {
  if (!isObject(v)) return false
  const nodeType = v.nodeType
  const content = (v as JSONLike).content
  return typeof nodeType === 'string' && Array.isArray(content)
}

/** Narrow unknown → string for JSX text slots */
export function toText(v: unknown): string {
  if (v == null) return ''
  return typeof v === 'string' ? v : String(v)
}

/**
 * Convert a value that passed looksLikeRichText() into the stricter
 * @contentful/rich-text-types Document type without using `any`.
 */
export function asRichTextDocument(v: { nodeType: string; content: unknown[] }): RichTextDocument {
  // TS can’t prove this equals the full Document interface; the runtime guard above protects us.
  return v as unknown as RichTextDocument
}
