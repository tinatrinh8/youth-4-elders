// src/app/layout.tsx
import type { Metadata } from 'next'
import { Figtree, Sora, Geist, Lora, Varela_Round } from 'next/font/google'
import '@/styles/globals.css'
import LeftMenu from '@/components/LeftMenu'

const figtree = Figtree({ subsets: ['latin'], display: 'swap', variable: '--font-figtree' })
const sora = Sora({ subsets: ['latin'], display: 'swap', variable: '--font-sora' })
const geist = Geist({ subsets: ['latin'], display: 'swap', variable: '--font-geist' })
const lora = Lora({ subsets: ['latin'], display: 'swap', variable: '--font-lora' })
const varela = Varela_Round({ weight: '400', subsets: ['latin'], display: 'swap', variable: '--font-varela' })

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
    <html lang="en">
      <body className={`${figtree.variable} ${sora.variable} ${geist.variable} ${lora.variable} ${varela.variable} font-sans antialiased bg-white`}>
        <LeftMenu />                                  {/* overlay sidebar */}
        <main className="min-h-screen">               {/* full width content */}
          {children}
        </main>
        
        {/* Global Footer */}
        <footer className="fixed bottom-0 left-0 right-0 z-30 px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="text-gray-600 text-lg font-medium" style={{ fontFamily: 'Inter, sans-serif' }}>
              ©Youth4Elders 2025. All rights reserved.
            </div>
            <div className="flex items-center gap-6">
              <a
                href="https://www.instagram.com/youth4elders/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-pink-600 transition-colors"
                aria-label="Instagram"
              >
                <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a
                href="mailto:youth4elders@gmail.com"
                className="text-gray-600 hover:text-pink-600 transition-colors"
                aria-label="Email"
              >
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </a>
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
}
