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

  return (
    <main className="min-h-screen" style={{ background: 'var(--color-cream)' }}>
      <div className="max-w-6xl mx-auto px-8 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-bold mb-8" style={{ fontFamily: 'var(--font-playfair)', color: '#6B5D4F' }}>
            Our Stories
          </h1>
          <p className="text-2xl max-w-4xl mx-auto leading-relaxed" style={{ fontFamily: 'var(--font-lato)', color: '#9D7A6B' }}>
            Discover the heartwarming stories, community reflections, and behind-the-scenes moments from our Youth 4 Elders journey.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Coming Soon Cards */}
          <div className="rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden" style={{ background: 'var(--color-cream)', border: '2px solid #F8B4CB' }}>
            <div className="aspect-video flex items-center justify-center" style={{ background: 'linear-gradient(to bottom right, #F8B4CB, #F0C8B9)' }}>
              <div className="text-center">
                <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md" style={{ background: 'var(--color-cream)' }}>
                  <svg className="w-8 h-8" style={{ color: '#8B6F5E' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <p className="font-medium" style={{ color: '#9D7A6B' }}>Coming Soon</p>
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold mb-3" style={{ fontFamily: 'var(--font-playfair)', color: '#8B6F5E' }}>
                Workshop Stories
              </h3>
              <p className="leading-relaxed" style={{ fontFamily: 'var(--font-lato)', color: '#9D7A6B' }}>
                Heartwarming stories from our intergenerational workshops and the connections we&apos;ve built.
              </p>
            </div>
          </div>
          
          <div className="rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden" style={{ background: 'var(--color-cream)', border: '2px solid #F0C8B9' }}>
            <div className="aspect-video flex items-center justify-center" style={{ background: 'linear-gradient(to bottom right, #F0C8B9, #F7D78B)' }}>
              <div className="text-center">
                <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md" style={{ background: 'var(--color-cream)' }}>
                  <svg className="w-8 h-8" style={{ color: '#8B6F5E' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <p className="font-medium" style={{ color: '#9D7A6B' }}>Coming Soon</p>
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold mb-3" style={{ fontFamily: 'var(--font-playfair)', color: '#8B6F5E' }}>
                Community Reflections
              </h3>
              <p className="leading-relaxed" style={{ fontFamily: 'var(--font-lato)', color: '#9D7A6B' }}>
                Personal reflections from our volunteers and community members about their experiences.
              </p>
            </div>
          </div>
          
          <div className="rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden" style={{ background: 'var(--color-cream)', border: '2px solid #F7D78B' }}>
            <div className="aspect-video flex items-center justify-center" style={{ background: 'linear-gradient(to bottom right, #F7D78B, #F8B4CB)' }}>
              <div className="text-center">
                <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md" style={{ background: 'var(--color-cream)' }}>
                  <svg className="w-8 h-8" style={{ color: '#8B6F5E' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
                <p className="font-medium" style={{ color: '#9D7A6B' }}>Coming Soon</p>
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold mb-3" style={{ fontFamily: 'var(--font-playfair)', color: '#8B6F5E' }}>
                Behind the Scenes
              </h3>
              <p className="leading-relaxed" style={{ fontFamily: 'var(--font-lato)', color: '#9D7A6B' }}>
                Get an inside look at how we plan events and build our community connections.
              </p>
            </div>
          </div>
        </div>
        
        <div className="text-center mt-16">
          <p className="text-lg mb-8" style={{ fontFamily: 'var(--font-lato)', color: '#9D7A6B' }}>
            Stay tuned for our first blog posts coming soon!
          </p>
          <a 
            href="/contact" 
            className="inline-flex items-center px-8 py-4 rounded-3xl transition-all duration-300 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 text-white"
            style={{ background: '#8B6F5E', border: '2px solid #9D7A6B' }}
          >
            <span className="mr-3">Get in Touch</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>
      </div>
    </main>
  )
}
