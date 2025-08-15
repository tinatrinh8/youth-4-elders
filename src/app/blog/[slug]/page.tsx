import type { BlogSkeleton } from '@/types/blog'
import { getEntryBySlug } from '@/lib/contentful'
import { documentToReactComponents } from '@contentful/rich-text-react-renderer'
import { looksLikeRichText, asRichTextDocument, toText } from '@/utils/richTextGuards'

type Params = { slug: string }

export default async function BlogPostPage({ params }: { params: Params }) {
  const { slug } = params

  const post = await getEntryBySlug<BlogSkeleton>('blogPost', slug)

  if (!post) {
    return (
      <main className="p-8">
        <h1 className="text-2xl font-semibold">Post not found</h1>
        <p className="mt-2 text-gray-600">No blog post for slug: {toText(slug)}</p>
      </main>
    )
  }

  const { title, description, body, datePublished, authorName } = post.fields

  return (
    <main className="p-8 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold">{toText(title)}</h1>

      {(authorName || datePublished) && (
        <p className="mt-2 text-gray-500">
          {toText(authorName)}
          {authorName && datePublished ? ' · ' : ''}
          {toText(datePublished)}
        </p>
      )}

      {description && (
        <div className="mt-6 text-lg text-gray-700">
          {looksLikeRichText(description)
            ? documentToReactComponents(asRichTextDocument(description))
            : toText(description)}
        </div>
      )}

      {body && (
        <article className="prose mt-8">
          {looksLikeRichText(body)
            ? documentToReactComponents(asRichTextDocument(body))
            : <p>{toText(body)}</p>}
        </article>
      )}
    </main>
  )
}
