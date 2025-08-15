import { getEntries, debugContentful } from '@/lib/contentful'
import type { HomepageSkeleton } from '@/types/homepage'

export default async function Home() {
  // Check environment variables first
  console.log('Environment check:')
  console.log('CONTENTFUL_SPACE_ID:', process.env.CONTENTFUL_SPACE_ID ? 'SET' : 'NOT SET')
  console.log('CONTENTFUL_ACCESS_TOKEN:', process.env.CONTENTFUL_ACCESS_TOKEN ? 'SET' : 'NOT SET')
  console.log('CONTENTFUL_ENVIRONMENT:', process.env.CONTENTFUL_ENVIRONMENT || 'NOT SET (will use master)')

  await debugContentful(); // TEMP: prints to terminal

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
