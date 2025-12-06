export default function Events() {
  return (
    <main className="min-h-screen pt-[120px]" style={{ background: 'var(--color-cream)' }}>
      <div className="max-w-6xl mx-auto px-8 py-16">
        <h1 className="text-5xl md:text-7xl font-bold mb-8" style={{ fontFamily: 'var(--font-playfair)', color: '#6B5D4F' }}>
          Upcoming Events
        </h1>
        <p className="text-lg leading-relaxed mb-16" style={{ fontFamily: 'var(--font-lato)', color: '#9D7A6B' }}>
          Calendar of events coming soon...
        </p>

        <h2 className="text-3xl md:text-5xl font-bold mb-8 mt-16" style={{ fontFamily: 'var(--font-playfair)', color: '#6B5D4F' }}>
          Past Events
        </h2>
        <div className="space-y-6">
          <div 
            className="p-6 rounded-lg"
            style={{ 
              background: 'var(--color-cream)',
              border: '2px solid var(--color-brown-medium)'
            }}
          >
            <h3 className="text-xl md:text-2xl font-bold mb-2" style={{ fontFamily: 'var(--font-vintage-stylist)', color: 'var(--color-brown-dark)' }}>
              Club Fair at uOttawa UCU
            </h3>
            <p className="text-base" style={{ fontFamily: 'var(--font-kollektif)', color: 'var(--color-brown-medium)' }}>
              September 3rd
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}

