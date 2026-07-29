'use client'

import { useEffect } from 'react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'

/** Legacy `/events/past/[id]` → `/events/past/gallery/[id]`. */
export default function LegacyPastGalleryRedirect() {
  const params = useParams()
  const router = useRouter()
  const searchParams = useSearchParams()
  const id = typeof params.id === 'string' ? params.id : Array.isArray(params.id) ? params.id[0] : ''

  useEffect(() => {
    if (!id) {
      router.replace('/events/past')
      return
    }
    const from = searchParams.get('from')
    const qs = from ? `?from=${encodeURIComponent(from)}` : ''
    router.replace(`/events/past/gallery/${id}${qs}`)
  }, [id, router, searchParams])

  return null
}
