import { debugContentful, listContentTypeIds, getEntries } from '@/lib/contentful'
import type { Entry, EntrySkeletonType } from 'contentful'

export default async function TestContentful() {
  // Debug Contentful connection
  await debugContentful()
  
  // List all content types
  const contentTypeIds = await listContentTypeIds()
  
  // Try to fetch some entries
  let sampleEntries: Entry<EntrySkeletonType>[] = []
  if (contentTypeIds.length > 0) {
    try {
      sampleEntries = await getEntries<EntrySkeletonType>(contentTypeIds[0])
    } catch (e) {
      console.error('Error fetching entries:', e)
    }
  }

  return (
    <main className="min-h-screen p-8" style={{ background: 'var(--color-cream)' }}>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8" style={{ fontFamily: 'var(--font-playfair)', color: 'var(--color-brown-dark)' }}>
          Contentful Connection Test
        </h1>
        
        <div className="space-y-6">
          <div className="p-6 rounded-lg" style={{ background: 'white', border: '2px solid var(--color-brown-medium)' }}>
            <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: 'var(--font-playfair)', color: 'var(--color-brown-dark)' }}>
              Content Types Found:
            </h2>
            {contentTypeIds.length > 0 ? (
              <ul className="list-disc list-inside space-y-2" style={{ fontFamily: 'var(--font-lato)', color: 'var(--color-brown-medium)' }}>
                {contentTypeIds.map((id) => (
                  <li key={id}>{id}</li>
                ))}
              </ul>
            ) : (
              <p style={{ fontFamily: 'var(--font-lato)', color: 'var(--color-brown-medium)' }}>
                No content types found. Make sure your Contentful space has content types set up.
              </p>
            )}
          </div>

          <div className="p-6 rounded-lg" style={{ background: 'white', border: '2px solid var(--color-brown-medium)' }}>
            <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: 'var(--font-playfair)', color: 'var(--color-brown-dark)' }}>
              Sample Entries:
            </h2>
            {sampleEntries.length > 0 ? (
              <pre className="p-4 rounded bg-gray-100 overflow-auto text-sm">
                {JSON.stringify(sampleEntries[0], null, 2)}
              </pre>
            ) : (
              <p style={{ fontFamily: 'var(--font-lato)', color: 'var(--color-brown-medium)' }}>
                No entries found. Check your Contentful space for content.
              </p>
            )}
          </div>

          <div className="p-6 rounded-lg" style={{ background: 'white', border: '2px solid var(--color-brown-medium)' }}>
            <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: 'var(--font-playfair)', color: 'var(--color-brown-dark)' }}>
              Connection Status:
            </h2>
            <p style={{ fontFamily: 'var(--font-lato)', color: 'var(--color-brown-medium)' }}>
              Check your terminal/console for detailed connection logs.
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}

