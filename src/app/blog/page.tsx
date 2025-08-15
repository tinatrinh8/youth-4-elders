import Link from 'next/link'
import { getEntries } from '@/lib/contentful'
import type { BlogSkeleton } from '@/types/blog'

export default async function BlogPage() {
  const posts = await getEntries<BlogSkeleton>('blogPost')

  return (
    <main>
      <h1>Youth 4 Elders</h1>
      <ul>
        {posts.map((post) => (
        <li key={post.sys.id}>
            <Link href={`/blog/${post.fields.slug}`}>
            <div>
                <h2>{post.fields.title}</h2>
                <p>{post.fields.description}</p>
            </div>
            </Link>
        </li>
        ))}
      </ul>
    </main>
  )
}
