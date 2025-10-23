import { getFeatureHighlights } from '@/lib/contentful'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const highlights = await getFeatureHighlights()
    return NextResponse.json(highlights)
  } catch (error) {
    console.error('Error fetching feature highlights:', error)
    return NextResponse.json([], { status: 500 })
  }
}
