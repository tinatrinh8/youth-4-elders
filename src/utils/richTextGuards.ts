import type { Document as RichTextDocument } from '@contentful/rich-text-types'

type JSONLike = Record<string, unknown>
const isObject = (v: unknown): v is JSONLike => typeof v === 'object' && v !== null

export function looksLikeRichText(v: unknown): v is { nodeType: string; content: unknown[] } {
  return isObject(v) && typeof v.nodeType === 'string' && Array.isArray((v as JSONLike).content)
}

export function asRichTextDocument(v: { nodeType: string; content: unknown[] }): RichTextDocument {
  return v as unknown as RichTextDocument
}

export function toText(v: unknown): string {
  if (v == null) return ''
  return typeof v === 'string' ? v : String(v)
}
