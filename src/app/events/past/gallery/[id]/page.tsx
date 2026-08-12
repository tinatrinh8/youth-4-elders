'use client'

import PastGalleryView from '../../PastGalleryView'

/** Hard navigation / refresh — full memory page (no past-events underneath). */
export default function PastEventGalleryPage() {
  return <PastGalleryView presentation="page" />
}
