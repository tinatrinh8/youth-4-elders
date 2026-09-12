// src/app/layout.tsx
import type { Metadata, Viewport } from 'next'
import localFont from 'next/font/local'
import { headers } from 'next/headers'
import '@/styles/globals.css'
import NavigationBar from '@/components/NavigationBar'
import Footer from '@/components/Footer'
import GlobalLoading from '@/components/GlobalLoading'
import PageBackgroundSync from '@/components/PageBackgroundSync'

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

// Font 5: Freshwost
const freshwost = localFont({
  src: [
    {
      path: '../../public/fonts/Freshwost-1GJJL.otf',
      weight: '400',
      style: 'normal',
    },
  ],
  variable: '--font-freshwost',
  fallback: ['system-ui', 'Arial', 'sans-serif'],
  display: 'swap',
})

// Map Vintage Stylist as the main display font (for large headings)
// This ensures all existing code using --font-playfair will use Vintage Stylist
const playfair = vintageStylist
const lato = kollektif

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
}

export const metadata: Metadata = {
  metadataBase: new URL('https://www.youth4elders.ca'),
  title: 'Youth 4 Elders | University of Ottawa',
  description:
    'A University of Ottawa student organization bridging the gap between youth and elders. Follow us on Instagram @youth4elders.',
  icons: {
    icon: [{ url: '/images/Y4E_LOGO.png', type: 'image/png' }],
    shortcut: '/images/Y4E_LOGO.png',
    apple: '/images/Y4E_LOGO.png',
  },
  openGraph: {
    title: 'Youth 4 Elders | University of Ottawa',
    description:
      'A University of Ottawa student organization bridging the gap between youth and elders in Ottawa.',
    url: 'https://www.youth4elders.ca',
    siteName: 'Youth 4 Elders',
    type: 'website',
    images: [{ url: '/images/Y4E_LOGO.png' }],
  },
  alternates: {
    canonical: 'https://www.youth4elders.ca',
  },
}

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Youth 4 Elders',
  alternateName: 'Y4E',
  url: 'https://www.youth4elders.ca',
  logo: 'https://www.youth4elders.ca/images/Y4E_LOGO.png',
  description:
    'A University of Ottawa student organization bridging the gap between youth and elders in Ottawa.',
  address: {
    '@type': 'PostalAddress',
    streetAddress: '7-85 University Private',
    addressLocality: 'Ottawa',
    addressRegion: 'ON',
    postalCode: 'K1N 6N5',
    addressCountry: 'CA',
  },
  sameAs: [
    'https://www.instagram.com/youth4elders/',
    'https://www.linkedin.com/company/youth4elders/',
  ],
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const headerList = await headers()
  const lockPage = headerList.get('x-y4e-lock-page') === '1'

  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <body className={`${vintageStylist.variable} ${vintageStylistLigatures.variable} ${kollektif.variable} ${leiko.variable} ${freshwost.variable} ${playfair.variable} ${lato.variable} font-sans antialiased flex flex-col min-h-screen`} style={{ 
        fontFamily: 'var(--font-kollektif), var(--font-leiko), system-ui, Arial, sans-serif' 
      }}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <div id="site-root" className="relative flex min-h-dvh flex-1 flex-col">
          <PageBackgroundSync />
          {!lockPage && <GlobalLoading />}
          {!lockPage && <NavigationBar />}
          <main className="flex-1">
            {children}
          </main>
          
          {!lockPage && <Footer />}
        </div>
      </body>
    </html>
  )
}
