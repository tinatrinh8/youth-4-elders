import type { EntryFieldTypes, EntrySkeletonType, Asset } from 'contentful'

export interface FeatureHighlightSkeleton extends EntrySkeletonType {
  contentTypeId: 'featureHighlights'
  fields: {
    title: EntryFieldTypes.Symbol
    description?: EntryFieldTypes.RichText | EntryFieldTypes.Text
    image?: Asset
    date?: EntryFieldTypes.Date
    order?: EntryFieldTypes.Integer
  }
}
