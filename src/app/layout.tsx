// src/app/layout.tsx
import type { Metadata } from 'next'
import { Playfair_Display, Raleway } from 'next/font/google'
import '@/styles/globals.css'
import NavigationBar from '@/components/NavigationBar'

const playfair = Playfair_Display({ 
  weight: ['400', '500', '600', '700', '800', '900'],
  subsets: ['latin'], 
  display: 'swap', 
  variable: '--font-playfair' 
})

const raleway = Raleway({ 
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'], 
  display: 'swap', 
  variable: '--font-raleway',
  fallback: ['system-ui', 'arial']
})

export const metadata: Metadata = {
  title: 'Youth 4 Elders | UOttawa',
  description: 'Student-led club dedicated to bridging the gap between youth and elders.',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/favicon.ico',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className={`${playfair.variable} ${raleway.variable} font-sans antialiased flex flex-col min-h-screen`} style={{ 
        fontFamily: 'var(--font-raleway), Georgia, serif' 
      }}>
        <NavigationBar />
        <main className="flex-1">
          {children}
        </main>
        
        {/* Global Footer */}
        <footer className="mt-auto px-8 py-12 bg-transparent">
          <div className="max-w-7xl mx-auto">
            {/* Sponsors Section */}
            <div className="mb-12">
              <h3 className="text-2xl font-bold text-center mb-8" style={{ fontFamily: 'var(--font-playfair)', color: '#6B5D4F' }}>
                Thanks to Our Sponsors
              </h3>
              <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
                {/* Sponsor Placeholders */}
                <div className="px-6 py-4 rounded-lg" style={{ background: '#F8F5ED', border: '2px solid #F8B4CB' }}>
                  <p className="text-lg font-semibold" style={{ color: '#8B6F5E' }}>uOttawa</p>
                </div>
                <div className="px-6 py-4 rounded-lg" style={{ background: '#F8F5ED', border: '2px solid #F0C8B9' }}>
                  <p className="text-lg font-semibold" style={{ color: '#9D7A6B' }}>Community Foundation</p>
                </div>
                <div className="px-6 py-4 rounded-lg" style={{ background: '#F8F5ED', border: '2px solid #F7D78B' }}>
                  <p className="text-lg font-semibold" style={{ color: '#7A5C5C' }}>Local Partners</p>
                </div>
                <div className="px-6 py-4 rounded-lg" style={{ background: '#F8F5ED', border: '2px solid #F8B4CB' }}>
                  <p className="text-lg font-semibold" style={{ color: '#A68B7D' }}>Student Union</p>
                </div>
              </div>
            </div>

            {/* Footer Bottom */}
            <div className="pt-8 border-t-2" style={{ borderColor: '#F8B4CB' }}>
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="text-lg font-medium" style={{ fontFamily: 'Inter, sans-serif', color: '#9D7A6B' }}>
                  ©Youth4Elders 2025. All rights reserved.
                </div>
                <div className="flex items-center gap-6">
                  <a
                    href="https://www.instagram.com/youth4elders/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="footer-social-link"
                    aria-label="Instagram"
                  >
                    <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                  </a>
                  <a
                    href="mailto:youth4elders@gmail.com"
                    className="footer-social-link"
                    aria-label="Email"
                  >
                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
}
