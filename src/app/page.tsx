// src/app/page.tsx
import { getEntries /*, listContentTypeIds*/ } from '@/lib/contentful'
import type { HomepageSkeleton } from '@/types/homepage'
import type { FeatureHighlightSkeleton } from '@/types/featureHighlights'
import type { Entry } from 'contentful'
import { documentToReactComponents } from '@contentful/rich-text-react-renderer'
import { looksLikeRichText, toText, asRichTextDocument } from '@/utils/richTextGuards'

export default async function Home() {

  const pages = await getEntries<HomepageSkeleton>('blogPost');
  const page = pages[0]

  if (!page) {
    return (
      <main className="p-8 bg-white text-black min-h-screen">
        <h1 className="text-4xl font-bold">Youth 4 Elders</h1>
        <p className="mt-4 text-gray-700">
          No Homepage entry found in this environment. Make sure you’ve published one
          and that the API ID you pass to <code>getEntries</code> matches your model’s API ID.
        </p>
      </main>
    )
  }

  const featureHighlights =
    (page.fields.featureHighlights as Entry<FeatureHighlightSkeleton>[] | undefined) ?? []

  return (
    <main className="p-8 bg-white text-black min-h-screen">
      {/* Hero Section */}
      <section className="text-center mb-8">
        <h1 className="text-3xl font-bold text-black">
          {toText(page.fields.heroHeading)}
        </h1>

        {page.fields.heroSubtext && (
          <div className="mt-4 text-lg text-gray-700">
            {looksLikeRichText(page.fields.heroSubtext)
              ? documentToReactComponents(asRichTextDocument(page.fields.heroSubtext))
              : toText(page.fields.heroSubtext)}
          </div>
        )}

        {page.fields.heroButtonLabel && (
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
          {toText(page.fields.blogSectionHeading)}
        </h2>

        {page.fields.blogSectionText && (
          <div className="text-gray-700">
            {looksLikeRichText(page.fields.blogSectionText)
              ? documentToReactComponents(asRichTextDocument(page.fields.blogSectionText))
              : toText(page.fields.blogSectionText)}
          </div>
        )}

        {(page.fields.blogButtonURL || page.fields.blogButtonLabel) && (
          <a
            className="inline-block mt-4 px-4 py-2 bg-gray-800 text-white rounded"
            href={toText(page.fields.blogButtonURL) || '/blog'}
          >
            {toText(page.fields.blogButtonLabel) || 'Read More'}
          </a>
        )}
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
                    {description == null ? (
                      <em className="text-gray-400">No description available.</em>
                    ) : looksLikeRichText(description) ? (
                      documentToReactComponents(asRichTextDocument(description))
                    ) : (
                      toText(description)
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </section>
      )}
    </main>
  )
}
