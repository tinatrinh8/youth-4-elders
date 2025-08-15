import type { EntryFieldTypes, EntrySkeletonType } from 'contentful'

export interface FeatureHighlightSkeleton extends EntrySkeletonType {
  contentTypeId: 'featureHighlights'
  fields: {
    title: EntryFieldTypes.Symbol
    description?: EntryFieldTypes.RichText | EntryFieldTypes.Text
  }
}
