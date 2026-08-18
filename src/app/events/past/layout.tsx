import type { Viewport } from 'next'
import { MemorySheetProvider } from './MemorySheet'

export const viewport: Viewport = {
  themeColor: '#bbb47b',
}

export default function PastEventsLayout({ children }: { children: React.ReactNode }) {
  return <MemorySheetProvider>{children}</MemorySheetProvider>
}
