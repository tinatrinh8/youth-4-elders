// src/app/layout.tsx
import type { Metadata } from 'next'
import localFont from 'next/font/local'
import '@/styles/globals.css'
import NavigationBar from '@/components/NavigationBar'
import Footer from '@/components/Footer'

// Font 1: Vintage Stylist - Elegant display/serif font
const vintageStylist = localFont({
  src: [
    {
      path: '../../public/fonts/Vintage Stylist.ttf',
      weight: '400',
      style: 'normal',
    },
  ],
  variable: '--font-vintage-stylist',
  fallback: ['Georgia', 'serif'],
  display: 'swap',
})

// Font 2: Vintage Stylist Ligatures - For special text with ligatures
const vintageStylistLigatures = localFont({
  src: [
    {
      path: '../../public/fonts/Vintage Stylist Ligatures.ttf',
      weight: '400',
      style: 'normal',
    },
  ],
  variable: '--font-vintage-ligatures',
  fallback: ['Georgia', 'serif'],
  display: 'swap',
})

// Font 3: Kollektif - Clean sans-serif for body text
const kollektif = localFont({
  src: [
    {
      path: '../../public/fonts/Kollektif.ttf',
      weight: '400',
      style: 'normal',
    },
  ],
  variable: '--font-kollektif',
  fallback: ['system-ui', 'Arial', 'sans-serif'],
  display: 'swap',
})

// Font 4: Leiko - Modern sans-serif alternative
const leiko = localFont({
  src: [
    {
      path: '../../public/fonts/Leiko-Regular.otf',
      weight: '400',
      style: 'normal',
    },
  ],
  variable: '--font-leiko',
  fallback: ['system-ui', 'Arial', 'sans-serif'],
  display: 'swap',
})

// Map Vintage Stylist as the main display font (for large headings)
// This ensures all existing code using --font-playfair will use Vintage Stylist
const playfair = vintageStylist
const lato = kollektif

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
      <body className={`${vintageStylist.variable} ${vintageStylistLigatures.variable} ${kollektif.variable} ${leiko.variable} ${playfair.variable} ${lato.variable} font-sans antialiased flex flex-col min-h-screen`} style={{ 
        fontFamily: 'var(--font-kollektif), var(--font-leiko), system-ui, Arial, sans-serif' 
      }}>
        <NavigationBar />
        <main className="flex-1">
          {children}
        </main>
        
        {/* Global Footer */}
        <Footer />
      </body>
    </html>
  )
}
