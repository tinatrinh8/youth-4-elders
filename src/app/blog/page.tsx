import { getEntries} from '@/lib/contentful'
import type { HomepageSkeleton } from '@/types/homepage'

export default async function Home() {

  let pages: import('contentful').Entry<HomepageSkeleton>[] = []
  try {
    // Using blogPost content type instead of homepage
    pages = await getEntries<HomepageSkeleton>('blogPost')
  } catch (e) {
    console.log('Blog fetch error:', e)
    return <main className="p-8">Could not load blog posts. Check terminal logs for Contentful IDs.</main>
  }

  if (!pages.length) {
    return <main className="p-8">No blog posts found in this environment.</main>
  }

  const page = pages[0]
  return (
    <main className="p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Blog</h1>
        <p className="text-lg text-gray-600">Blog posts coming soon...</p>
      </div>
    </main>
  )
}
