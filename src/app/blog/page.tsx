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
  return <main className="p-8">ok</main>
}
