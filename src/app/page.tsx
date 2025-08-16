import Image from 'next/image'
import { getEntries } from '@/lib/contentful'
import type { HomepageSkeleton } from '@/types/homepage'
import type { FeatureHighlightSkeleton } from '@/types/featureHighlights'
import type { Entry, Asset } from 'contentful'
import { documentToReactComponents } from '@contentful/rich-text-react-renderer'
import { looksLikeRichText, toText, asRichTextDocument } from '@/utils/richTextGuards'
import '@/styles/globals.css'

// --- helpers for Contentful assets ---
function assetUrl(a?: Asset | null): string | null {
  const url = (a as unknown as { fields?: { file?: { url?: string } } })?.fields?.file?.url
  return url ? (url.startsWith('http') ? url : `https:${url}`) : null
}
function assetAlt(a?: Asset | null): string {
  const title =
    (a as unknown as { fields?: { title?: string } })?.fields?.title ||
    (a as unknown as { fields?: { file?: { fileName?: string } } })?.fields?.file?.fileName
  return title || 'Cover image'
}

export default async function Home() {
  const pages = await getEntries<HomepageSkeleton>('blogPost')
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

  const fields = page.fields
  const featureHighlights =
    (fields.featureHighlights as Entry<FeatureHighlightSkeleton>[] | undefined) ?? []
  const cover = assetUrl(fields.coverImage as Asset | undefined)

  return (
    <main className="p-8 bg-gray-100 text-gray-800 min-h-screen">
      {/* Page Title */}
      <header className="mb-6 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight">
          {toText(fields.title) || 'Youth 4 Elders'}
        </h1>
      </header>

      {/* Cover Image */}
      <section className="mb-8">
        {cover ? (
          <div className="max-w-screen-md mx-auto">
            <Image
              src={cover}
              alt={assetAlt(fields.coverImage as unknown as Asset)}
              width={800}
              height={450}
              priority
              className="w-full h-auto rounded-lg shadow-md"
            />
          </div>
        ) : (
          <div className="aspect-[16/9] w-full rounded-lg border bg-gray-100 grid place-items-center text-gray-500">
            Add a cover image
          </div>
        )}
      </section>

      {/* Hero Section */}
      <section className="text-center mb-12">
        <h2 className="text-3xl font-bold text-black mb-6">
          {toText(fields.heroHeading) || 'Connecting Youth & Elders'}
        </h2>
        {fields.heroSubtext && (
          <div className="mt-4 text-lg text-gray-700">
            {looksLikeRichText(fields.heroSubtext)
              ? documentToReactComponents(asRichTextDocument(fields.heroSubtext))
              : toText(fields.heroSubtext)}
          </div>
        )}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          {fields.heroButtonLabel && (
            <a
              className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800 transition"
              href={toText(fields.heroButtonURL) || '#'}
              aria-label={toText(fields.heroButtonLabel) || 'Learn More'}
            >
              {looksLikeRichText(fields.heroButtonLabel)
                ? documentToReactComponents(asRichTextDocument(fields.heroButtonLabel))
                : toText(fields.heroButtonLabel)}
            </a>
          )}
          {fields.contactEmail && (
            <a
              className="px-4 py-2 rounded border border-gray-300 text-black hover:bg-gray-100 transition"
              href={`mailto:${toText(fields.contactEmail)}`}
            >
              Contact Us
            </a>
          )}
          {fields.instagramURL && (
            <a
              className="px-4 py-2 rounded border border-gray-300 text-black hover:bg-gray-100 transition"
              href={toText(fields.instagramURL)}
              target="_blank"
              rel="noreferrer"
            >
              Instagram
            </a>
          )}
        </div>
      </section>

      {/* Blog Section */}
      <section className="mb-12">
        <h3 className="text-2xl font-semibold mb-4 text-black">
          {toText(fields.blogSectionHeading) || 'Latest Updates'}
        </h3>
        {fields.blogSectionText && (
          <div className="text-gray-700">
            {looksLikeRichText(fields.blogSectionText)
              ? documentToReactComponents(asRichTextDocument(fields.blogSectionText))
              : toText(fields.blogSectionText)}
          </div>
        )}
        {(fields.blogButtonURL || fields.blogButtonLabel) && (
          <a
            className="inline-block mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            href={toText(fields.blogButtonURL) || '/blog'}
          >
            {toText(fields.blogButtonLabel) || 'Read More'}
          </a>
        )}
      </section>

      {/* Feature Highlights */}
      {featureHighlights.length > 0 && (
        <section>
          <h3 className="text-2xl font-semibold mb-4 text-black">Highlights</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {featureHighlights.map((h) => {
              const title = toText(h.fields.title) || 'Untitled'
              const description = h.fields.description

              return (
                <div key={h.sys.id} className="p-4 border rounded bg-white shadow-md">
                  <h4 className="text-xl font-bold text-black mb-2">{title}</h4>
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

      {/* Contact Section */}
      {(fields.contactEmail || fields.instagramURL) && (
        <section className="mt-12 p-6 bg-gray-100 rounded">
          <h3 className="text-2xl font-semibold text-black">
            {toText(fields.blogSectionHeading) || 'Get in Touch'}
          </h3>
          <p className="mt-2 text-gray-700">
            Have questions, want to volunteer, or partner with us?
          </p>
          <div className="mt-4 flex gap-3">
            {fields.contactEmail && (
              <a
                href={`mailto:${toText(fields.contactEmail)}`}
                className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800 transition"
                aria-label="Email Us"
              >
                Email Us
              </a>
            )}
            {fields.instagramURL && (
              <a
                href={toText(fields.instagramURL)}
                className="px-4 py-2 border border-gray-300 text-black rounded hover:bg-gray-100 transition"
                target="_blank"
                rel="noreferrer"
                aria-label="Visit Instagram"
              >
                Instagram
              </a>
            )}
          </div>
        </section>
      )}
    </main>
  )
}