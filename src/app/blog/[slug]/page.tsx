import { notFound } from 'next/navigation'
import { getEntries } from '@/lib/contentful'
import type { BlogSkeleton } from '@/types/blog'

type Props = {
  params: {
    slug: string
  }
}

export default async function BlogPostPage({ params }: Props) {
  const posts = await getEntries<BlogSkeleton>('blogPost')
  const post = posts.find((p) => p.fields.slug === params.slug)

  if (!post) return notFound()

  return (
    <main>
      <h1>{post.fields.title}</h1>
      <p>{post.fields.description}</p>
    </main>
  )
}
