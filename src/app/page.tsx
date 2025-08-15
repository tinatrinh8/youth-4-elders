import { getEntries } from '@/lib/contentful'
import type { HomepageSkeleton } from '@/types/homepage'
import type { FeatureHighlightSkeleton } from '@/types/featureHighlights'
import type { Entry } from 'contentful'
import { documentToReactComponents } from '@contentful/rich-text-react-renderer'
import {
  looksLikeRichText,
  toText,
  asRichTextDocument,
} from '@/utils/richTextGuards'

export default async function Home() {
  // 👇 Using contactPage content type instead of homepage
  const pages = await getEntries<HomepageSkeleton>('contactPage')
  const page = pages[0]

  console.log('=== MAIN PAGE DEBUG ===')
  console.log('Number of pages found:', pages.length)
  if (page) {
    console.log('Page fields:', Object.keys(page.fields))
    console.log('heroHeading:', page.fields.heroHeading)
    console.log('blogSectionHeading:', page.fields.blogSectionHeading)
    console.log('blogButtonLabel:', page.fields.blogButtonLabel)
  }

  const featureHighlights =
    (page.fields.featureHighlights as Entry<FeatureHighlightSkeleton>[] | undefined) ?? []

  return (
    <main className="p-8 bg-white text-black min-h-screen">
      {/* Debug info */}
      <div className="mb-8 p-4 bg-yellow-100 border border-yellow-400 rounded">
        <h2 className="text-lg font-bold text-yellow-800">Debug Info</h2>
        <p>Pages found: {pages.length}</p>
        {page && (
          <div>
            <p>Page ID: {page.sys.id}</p>
            <p>Available fields: {Object.keys(page.fields).join(', ')}</p>
          </div>
        )}
      </div>

      {/* Hero Section */}
      <section className="text-center mb-8">
        <h1 className="text-3xl font-bold text-black">
          {page?.fields.heroHeading ? toText(page.fields.heroHeading) : 'Welcome to Youth 4 Elders'}
        </h1>

        {page?.fields.heroSubtext && (
          <div className="mt-4 text-lg text-gray-700">
            {looksLikeRichText(page.fields.heroSubtext)
              ? documentToReactComponents(asRichTextDocument(page.fields.heroSubtext))
              : toText(page.fields.heroSubtext)}
          </div>
        )}

        {page?.fields.heroButtonLabel && (
          <a
            className="inline-block mt-6 px-4 py-2 bg-black text-white rounded"
            href={toText(page.fields.heroButtonURL)}
          >
            {looksLikeRichText(page.fields.heroButtonLabel)
              ? documentToReactComponents(asRichTextDocument(page.fields.heroButtonLabel))
              : toText(page.fields.heroButtonLabel)}
          </a>
        )}
      </section>

      {/* Blog Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4 text-black">
          {page?.fields.blogSectionHeading ? toText(page.fields.blogSectionHeading) : 'Latest Blog Posts'}
        </h2>

        {page?.fields.blogSectionText && (
          <div className="text-gray-700">
            {looksLikeRichText(page.fields.blogSectionText)
              ? documentToReactComponents(asRichTextDocument(page.fields.blogSectionText))
              : toText(page.fields.blogSectionText)}
          </div>
        )}

        <a
          className="inline-block mt-4 px-4 py-2 bg-gray-800 text-white rounded"
          href={page?.fields.blogButtonURL ? toText(page.fields.blogButtonURL) : '/blog'}
        >
          {page?.fields.blogButtonLabel ? toText(page.fields.blogButtonLabel) : 'Read More'}
        </a>
      </section>

      {/* Feature Highlights */}
      {featureHighlights.length > 0 && (
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-black">Highlights</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {featureHighlights.map((h) => {
              const title = toText(h.fields.title)
              const description = h.fields.description

              return (
                <div key={h.sys.id} className="p-4 border rounded bg-white">
                  <h3 className="text-xl font-bold text-black">{title || 'Untitled'}</h3>
                  <div className="mt-2 text-gray-700">
                    {description == null
                      ? <em className="text-gray-400">No description available.</em>
                      : looksLikeRichText(description)
                        ? documentToReactComponents(asRichTextDocument(description))
                        : toText(description)}
                  </div>
                </div>
              )
            })}
          </div>
        </section>
      )}

      {/* Fallback content if no data */}
      {!page && (
        <div className="text-center py-12">
          <h1 className="text-4xl font-bold text-black mb-4">Youth 4 Elders</h1>
          <p className="text-lg text-gray-700 mb-8">
            Welcome to our website! Content is being loaded from Contentful.
          </p>
          <div className="space-y-4">
            <p className="text-gray-600">Available content types:</p>
            <ul className="text-sm text-gray-500">
              <li>• contactPage</li>
              <li>• teamMember</li>
              <li>• blogEntry</li>
              <li>• featureHighlights</li>
              <li>• blogPost</li>
              <li>• workshops</li>
              <li>• clubInfo</li>
            </ul>
          </div>
        </div>
      )}
    </main>
  )
}
