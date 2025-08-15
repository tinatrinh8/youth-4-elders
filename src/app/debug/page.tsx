import { debugContentful, listContentTypeIds } from '@/lib/contentful'

export default async function DebugPage() {
  try {
    console.log('=== DEBUG PAGE START ===')
    
    // Check environment variables
    console.log('Environment Variables:')
    console.log('CONTENTFUL_SPACE_ID:', process.env.CONTENTFUL_SPACE_ID ? 'SET' : 'NOT SET')
    console.log('CONTENTFUL_ACCESS_TOKEN:', process.env.CONTENTFUL_ACCESS_TOKEN ? 'SET' : 'NOT SET')
    console.log('CONTENTFUL_ENVIRONMENT:', process.env.CONTENTFUL_ENVIRONMENT || 'NOT SET (will use master)')
    
    // Run debug function
    await debugContentful()
    
    // List all content type IDs
    const contentTypeIds = await listContentTypeIds()
    console.log('All available content type IDs:', contentTypeIds)
    
    console.log('=== DEBUG PAGE END ===')
    
    return (
      <main className="p-8">
        <h1 className="text-2xl font-bold mb-4">Contentful Debug Info</h1>
        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold">Environment Variables:</h2>
            <p>CONTENTFUL_SPACE_ID: {process.env.CONTENTFUL_SPACE_ID ? 'SET' : 'NOT SET'}</p>
            <p>CONTENTFUL_ACCESS_TOKEN: {process.env.CONTENTFUL_ACCESS_TOKEN ? 'SET' : 'NOT SET'}</p>
            <p>CONTENTFUL_ENVIRONMENT: {process.env.CONTENTFUL_ENVIRONMENT || 'NOT SET (will use master)'}</p>
          </div>
          <div>
            <h2 className="text-lg font-semibold">Available Content Types:</h2>
            <ul className="list-disc pl-5">
              {contentTypeIds.map((id) => (
                <li key={id} className="font-mono">{id}</li>
              ))}
            </ul>
          </div>
          <div className="mt-8 p-4 bg-green-100 rounded">
            <p className="text-green-800">
              ✅ Debug information logged to console. Check your terminal for detailed output.
            </p>
          </div>
        </div>
      </main>
    )
  } catch (error) {
    console.error('Debug page error:', error)
    return (
      <main className="p-8">
        <h1 className="text-2xl font-bold mb-4 text-red-600">Contentful Debug Error</h1>
        <div className="p-4 bg-red-100 rounded">
          <p className="text-red-800">Error: {error instanceof Error ? error.message : String(error)}</p>
        </div>
      </main>
    )
  }
}
