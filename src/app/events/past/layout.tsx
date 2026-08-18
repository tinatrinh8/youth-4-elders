import { MemorySheetProvider } from './MemorySheet'

export default function PastEventsLayout({ children }: { children: React.ReactNode }) {
  return <MemorySheetProvider>{children}</MemorySheetProvider>
}
