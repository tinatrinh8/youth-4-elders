import type { Viewport } from 'next'

export const viewport: Viewport = {
  themeColor: '#62202F',
}

export default function JoinUsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: 'html,body{background-color:#62202F!important}',
        }}
      />
      {children}
    </>
  )
}
